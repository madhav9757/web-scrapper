import type { ScraperStats } from '../types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface StatsPanelProps {
  stats: ScraperStats;
}

const StatsPanel = ({ stats }: StatsPanelProps) => {
  const progress = stats.total > 0 
    ? ((stats.completed + stats.failed) / stats.total) * 100 
    : 0;

  return (
    <Card className="h-full border-border/50 hover:border-primary/50 transition-colors shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          📊 Statistics
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Activity}
            label="Total URLs"
            value={stats.total}
            color="border-primary"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completed}
            color="border-success"
            textColor="text-green-500"
          />
          <StatCard
            icon={AlertTriangle}
            label="In Progress"
            value={stats.inProgress}
            color="border-warning"
            textColor="text-yellow-500"
          />
          <StatCard
            icon={AlertCircle}
            label="Failed"
            value={stats.failed}
            color="border-destructive"
            textColor="text-red-500"
          />
        </div>

        {stats.total > 0 && (
          <div className="space-y-2 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
              <span>Overall Progress</span>
              <span className="text-primary font-bold">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const StatCard = ({ icon: Icon, label, value, color, textColor }: any) => (
  <div className={`flex flex-col items-center justify-center p-4 bg-muted/40 rounded-lg border-2 ${color} transition-all hover:bg-muted/70 hover:shadow-sm`}>
    <Icon className={`w-8 h-8 mb-2 ${textColor}`} />
    <span className="text-2xl font-bold text-foreground">{value}</span>
    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{label}</span>
  </div>
);

export default StatsPanel;
