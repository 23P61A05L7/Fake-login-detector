import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { FraudCheck } from '@/lib/fraud-detection';

interface CheckResultsProps {
  checks: FraudCheck[];
}

export function CheckResults({ checks }: CheckResultsProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
        Detection Checks
      </h3>
      <div className="space-y-1.5">
        {checks.map((check, i) => (
          <motion.div
            key={check.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-2.5 p-2.5 rounded-md bg-secondary/50 border border-border/50"
          >
            {check.passed ? (
              <CheckCircle className="text-success shrink-0 mt-0.5" size={14} />
            ) : (
              <XCircle className="text-danger shrink-0 mt-0.5" size={14} />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold">{check.name}</span>
                {check.weight > 0 && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    +{check.weight}pts
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                {check.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
