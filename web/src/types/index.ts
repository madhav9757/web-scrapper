export interface ScrapedData {
  url: string;
  title: string;
  description: string;
  headings: {
    h1: string[];
    h2: string[];
  };
  links: number;
  scraped_at: string;
  status: 'pending' | 'scraping' | 'success' | 'error';
  error?: string;
}

export interface ScraperStats {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}
