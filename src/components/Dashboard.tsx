import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, XCircle, Activity, Users, TrendingUp } from 'lucide-react';
import { getActivityLog, getStats, type ActivityLogEntry } from '@/lib/fraud-detection';

export function Dashboard() {
  const [log, setLog] = useState<ActivityLogEntry[]>([]);
  const [stats, setStats] = useState(getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setLog(getActivityLog());
      setStats(getStats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Total', value: stats.total, icon: Users, color: 'text-foreground' },
    { label: 'Clean', value: stats.clean, icon: Shield, color: 'text-success' },
    { label: 'Suspicious', value: stats.suspicious, icon: AlertTriangle, color: 'text-warning' },
    { label: 'Blocked', value: stats.blocked, icon: XCircle, color: 'text-danger' },
    { label: 'Avg Score', value: stats.avgScore.toFixed(1), icon: TrendingUp, color: 'text-muted-foreground' },
    {
      label: 'Block Rate',
      value: stats.total > 0 ? ((stats.blocked / stats.total) * 100).toFixed(0) + '%' : '0%',
      icon: Activity,
      color: 'text-primary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-lg bg-card border border-border"
          >
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={14} className={stat.color} />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            <span className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Activity Log */}
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
          Recent Activity
        </h3>
        {log.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <Shield size={32} className="mx-auto mb-3 opacity-30" />
            <p>No registrations yet. Try the form to see results here.</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
            {log.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
              >
                {entry.status === 'clean' ? (
                  <Shield size={14} className="text-success shrink-0" />
                ) : entry.status === 'suspicious' ? (
                  <AlertTriangle size={14} className="text-warning shrink-0" />
                ) : (
                  <XCircle size={14} className="text-danger shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold truncate">{entry.username}</span>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">
                      {entry.email}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    IP: {entry.ip} · {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`text-sm font-bold font-mono ${
                      entry.score >= 50
                        ? 'text-danger'
                        : entry.score >= 25
                        ? 'text-warning'
                        : 'text-success'
                    }`}
                  >
                    {entry.score}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">score</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
