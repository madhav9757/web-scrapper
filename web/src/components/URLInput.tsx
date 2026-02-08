import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Rocket, FileText } from 'lucide-react';

interface URLInputProps {
  onStartScraping: (urls: string[]) => void;
  isDisabled: boolean;
}

const URLInput = ({ onStartScraping, isDisabled }: URLInputProps) => {
  const [urlText, setUrlText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urls = urlText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urls.length > 0) {
      onStartScraping(urls);
    }
  };

  const handleLoadSample = () => {
    const sampleUrls = [
      'https://example.com',
      'https://github.com',
      'https://stackoverflow.com',
      'https://dev.to',
      'https://medium.com',
    ].join('\n');
    setUrlText(sampleUrls);
  };

  return (
    <Card className="h-full border-border/50 hover:border-primary/50 transition-colors shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          📝 Input URLs
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLoadSample}
          disabled={isDisabled}
          className="hover:bg-primary/10 hover:text-primary"
        >
          <FileText className="w-4 h-4 mr-2" />
          Load Sample
        </Button>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            className="min-h-[200px] font-mono text-sm bg-muted/30 resize-none focus-visible:ring-primary"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            placeholder="Enter URLs (one per line)&#10;https://example.com&#10;https://github.com&#10;https://stackoverflow.com"
            disabled={isDisabled}
          />
        </form>
      </CardContent>

      <CardFooter className="justify-between border-t pt-4">
        <span className="text-sm text-muted-foreground font-medium">
          {urlText.split('\n').filter(u => u.trim()).length} URLs
        </span>
        <Button 
          onClick={handleSubmit}
          disabled={isDisabled || !urlText.trim()}
          className="bg-primary hover:bg-primary/90 text-white min-w-[140px]"
        >
          {isDisabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Start Scraping
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default URLInput;
