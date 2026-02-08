import { useState, useEffect, useRef } from 'react';
import type{ ScrapedData, ScraperStats } from '../types';
import URLInput from './URLInput';
import LiveFeed from './LiveFeed';
import StatsPanel from './StatsPanel';
import ResultsTable from './ResultsTable';
import { Ghost } from 'lucide-react';

const ScraperDashboard = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const [stats, setStats] = useState<ScraperStats>({
    total: 0,
    completed: 0,
    failed: 0,
    inProgress: 0,
  });

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    const connect = () => {
        const socket = new WebSocket('ws://localhost:8080/api/ws');
        
        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };

        socket.onmessage = (event) => {
            try {
                const data: ScrapedData = JSON.parse(event.data);
                handleUpdate(data);
            } catch (e) {
                console.error('Failed to parse WebSocket message:', e);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket closed. Reconnecting...');
            setTimeout(connect, 3000);
        };

        ws.current = socket;
    };

    connect();

    return () => {
        if (ws.current) {
            ws.current.close();
        }
    };
  }, []);

  const handleUpdate = (update: ScrapedData) => {
      setScrapedData(prev => {
          const index = prev.findIndex(item => item.url === update.url);
          if (index !== -1) {
              const newData = [...prev];
              // Optimistically merge updates. 
              // If status is "scraping", we update status.
              // If success/error, we update full object.
              newData[index] = { ...newData[index], ...update };
              return newData;
          } else {
              // Not found? Maybe add it? For now, ignore unless we are in scraping mode.
              // Actually, if we are in telemetry mode, we should add it.
              return [...prev, update];
          }
      });

      // Update stats based on status changes is tricky with streaming updates.
      // Simpler approach: recalculate stats from scrapedData
      // BUT scrapedData is state, and we are inside setState updater or handleUpdate.
      // Better: derive stats from scrapedData during render or use a useEffect on scrapedData.
  };

  // Recalculate stats whenever scrapedData changes
  useEffect(() => {
      const newStats = scrapedData.reduce((acc, item) => {
          acc.total++;
          if (item.status === 'success') acc.completed++;
          if (item.status === 'error') acc.failed++;
          if (item.status === 'scraping') acc.inProgress++;
          if (item.status === 'pending') acc.inProgress++; // Treat pending as in progress or separate?
          // Pending is not "in progress" usually, but here it means "queued".
          // Let's count pending separately if needed, or include in total but not processed.
          return acc;
      }, { total: 0, completed: 0, failed: 0, inProgress: 0 });
      
      setStats(newStats);

      // Check if scraping is done
      const active = scrapedData.some(item => item.status === 'pending' || item.status === 'scraping');
      setIsScraping(active);

  }, [scrapedData]);

  const startScraping = async (urlList: string[]) => {
    setIsScraping(true);
    
    // Initialize data with pending status
    const initialData: ScrapedData[] = urlList.map(url => ({
      url,
      title: '',
      description: '',
      headings: { h1: [], h2: [] },
      links: 0,
      scraped_at: '',
      status: 'pending',
    }));
    setScrapedData(initialData);

    try {
        const response = await fetch('http://localhost:8080/api/scrape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: urlList }),
        });

        if (!response.ok) {
            throw new Error('Failed to start scraping');
        }
    } catch (error) {
        console.error('Error starting scrape:', error);
        setIsScraping(false);
        // Optionally update UI to show error
        setScrapedData(prev => prev.map(item => ({ ...item, status: 'error', error: 'Failed to start request' })));
    }
  };

  const downloadResults = (format: 'json' | 'csv') => {
    const successfulData = scrapedData.filter(d => d.status === 'success');
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(successfulData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraper-results-${Date.now()}.json`;
      a.click();
    } else {
      // CSV format
      const headers = ['URL', 'Title', 'Description', 'H1 Count', 'H2 Count', 'Links', 'Scraped At'];
      const rows = successfulData.map(d => [
        d.url,
        d.title,
        d.description,
        d.headings.h1.length,
        d.headings.h2.length,
        d.links,
        d.scraped_at,
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scraper-results-${Date.now()}.csv`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 py-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-3xl -z-10" />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl flex items-center justify-center gap-4">
            <Ghost className="w-12 h-12 md:w-16 md:h-16 text-primary animate-bounce-slow" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
              Web Scraper
            </span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            High-performance parallel data extraction powered by Go concurrency
          </p>
        </div>

        {/* Control & Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <URLInput onStartScraping={startScraping} isDisabled={isScraping} />
          <StatsPanel stats={stats} />
        </div>

        {/* Live Feed Section */}
        <LiveFeed data={scrapedData} isActive={isScraping} />
        
        {/* Results Section */}
        <ResultsTable 
          data={scrapedData} 
          onDownload={downloadResults}
          isComplete={!isScraping && scrapedData.length > 0}
        />
      </div>
    </div>
  );
};

export default ScraperDashboard;
