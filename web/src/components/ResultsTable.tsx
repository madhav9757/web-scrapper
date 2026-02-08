import type { ScrapedData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileJson, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsTableProps {
  data: ScrapedData[];
  onDownload: (format: 'json' | 'csv') => void;
  isComplete: boolean;
}

const ResultsTable = ({ data, onDownload, isComplete }: ResultsTableProps) => {
  const successfulData = data.filter(d => d.status === 'success');

  return (
    <Card className="border-border/50 hover:border-primary/50 transition-colors shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          📊 Results 
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({successfulData.length} successful)
          </span>
        </CardTitle>
        {isComplete && successfulData.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload('json')}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <FileJson className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDownload('csv')}
              className="border-green-500/20 text-green-500 hover:bg-green-500/10"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-auto">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-muted-foreground opacity-50 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Download className="w-8 h-8 opacity-50" />
              </div>
              <p className="font-medium text-lg">No results yet</p>
              <small className="text-xs bg-muted px-2 py-1 rounded border border-border/50">
                Scraped data will appear here
              </small>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="max-w-[300px]">URL</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[100px] text-center">Links</TableHead>
                  <TableHead className="w-[100px] text-center">H1</TableHead>
                  <TableHead className="w-[100px] text-center">H2</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-muted/5">
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[300px]">
                      <div className="flex items-center gap-2 group">
                        <span className="truncate block" title={item.url}>{item.url}</span>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={item.title}>
                      {item.title || '-'}
                    </TableCell>
                    <TableCell className="text-center font-mono text-primary font-medium">
                      {item.links || '-'}
                    </TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {item.headings?.h1.length || '-'}
                    </TableCell>
                    <TableCell className="text-center font-mono text-muted-foreground">
                      {item.headings?.h2.length || '-'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {item.scraped_at ? new Date(item.scraped_at).toLocaleTimeString() : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: ScrapedData['status'] }) => {
  const styles = {
    pending: 'bg-slate-100 text-slate-500 border-slate-200',
    scraping: 'bg-amber-100 text-amber-600 border-amber-200 animate-pulse',
    success: 'bg-green-100 text-green-600 border-green-200',
    error: 'bg-red-100 text-red-600 border-red-200',
  };

  const labels = {
    pending: 'Pending',
    scraping: 'Scraping',
    success: 'Success',
    error: 'Error',
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border",
      styles[status]
    )}>
      {labels[status]}
    </span>
  );
};

export default ResultsTable;
