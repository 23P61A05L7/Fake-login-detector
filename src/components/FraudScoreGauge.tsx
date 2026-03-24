import { motion } from 'framer-motion';

interface FraudScoreGaugeProps {
  score: number;
}

export function FraudScoreGauge({ score }: FraudScoreGaugeProps) {
  const color =
    score >= 50 ? 'hsl(var(--danger))' : score >= 25 ? 'hsl(var(--warning))' : 'hsl(var(--success))';
  const label = score >= 50 ? 'HIGH RISK' : score >= 25 ? 'SUSPICIOUS' : 'LOW RISK';

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="10"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 314} 314`}
            initial={{ strokeDasharray: '0 314' }}
            animate={{ strokeDasharray: `${(score / 100) * 314} 314` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold font-mono"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-wider">
            / 100
          </span>
        </div>
      </div>
      <span
        className="text-xs font-bold tracking-widest mt-2 font-mono"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
}
