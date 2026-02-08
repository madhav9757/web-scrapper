import { useEffect, useRef } from 'react';
import type { ScrapedData } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveFeedProps {
    data: ScrapedData[];
    isActive: boolean;
}

const LiveFeed = ({ data, isActive }: LiveFeedProps) => {
    const feedRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [data]);

    return (
        <Card className="h-[500px] flex flex-col shadow-lg border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2">
                    <span className="text-xl font-bold">📡 Live Feed</span>
                    {isActive && (
                        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-green-500 animate-pulse bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute opacity-75"></span>
                            <span className="w-2 h-2 rounded-full bg-green-500 relative"></span>
                            Live
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm bg-muted/10" ref={feedRef}>
                <AnimatePresence initial={false}>
                    {data.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-4"
                        >
                            <Loader2 className="w-12 h-12 text-primary/50 animate-spin-slow" />
                            <p className="font-medium text-lg">Waiting for activity...</p>
                            <small className="text-xs font-mono bg-muted px-2 py-1 rounded-md border border-border/50">Ready to scrape</small>
                        </motion.div>
                    ) : (
                        data.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                layout
                            >
                                <FeedItem item={item} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
};

const FeedItem = ({ item }: { item: ScrapedData }) => {
    const statusStyles = {
        pending: 'border-l-4 border-l-slate-400 bg-slate-500/5',
        scraping: 'border-l-4 border-l-amber-500 bg-amber-500/10 animate-pulse',
        success: 'border-l-4 border-l-green-500 bg-green-500/10',
        error: 'border-l-4 border-l-red-500 bg-red-500/10',
    };

    const StatusIcon = {
        pending: Clock,
        scraping: Loader2,
        success: CheckCircle2,
        error: AlertCircle,
    }[item.status];

    return (
        <div className={cn(
            "p-3 rounded-r-md border border-t border-r border-b border-border/40 shadow-sm transition-all hover:bg-muted/30",
            statusStyles[item.status]
        )}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 overflow-hidden">
                    <StatusIcon className={cn(
                        "w-4 h-4 shrink-0",
                        item.status === 'scraping' && "animate-spin",
                        item.status === 'success' && "text-green-500",
                        item.status === 'error' && "text-red-500",
                        item.status === 'pending' && "text-slate-400",
                    )} />
                    <span className="font-semibold truncate text-primary/90" title={item.url}>{item.url}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap font-mono tabular-nums opacity-70">
                    {item.scraped_at ? new Date(item.scraped_at).toLocaleTimeString() : '--:--:--'}
                </span>
            </div>

            {item.status === 'success' && (
                <div className="ml-6 space-y-1 text-xs text-muted-foreground/80 border-l pl-3 border-border/30">
                    <div className="flex gap-4">
                        <span className="font-medium text-foreground/80">Title: <span className="font-normal text-muted-foreground">{item.title}</span></span>
                    </div>
                    <div className="flex gap-4">
                        <span className="font-medium text-foreground/80">Links: <span className="font-mono text-primary">{item.links}</span></span>
                        <span className="font-medium text-foreground/80 flex gap-2">
                            Headings:
                            <span className="bg-muted px-1.5 rounded text-[10px] font-mono border border-border/50">H1: {item.headings.h1.length}</span>
                            <span className="bg-muted px-1.5 rounded text-[10px] font-mono border border-border/50">H2: {item.headings.h2.length}</span>
                        </span>
                    </div>
                </div>
            )}

            {item.status === 'error' && (
                <div className="ml-6 mt-1 text-xs text-red-400 font-medium bg-red-500/5 p-2 rounded border border-red-500/10 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Error: {item.error}
                </div>
            )}
        </div>
    );
};

export default LiveFeed;
