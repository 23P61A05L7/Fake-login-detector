import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { detectFraud, checkRateLimit, addToLog, type FraudCheckResult } from '@/lib/fraud-detection';
import { FraudScoreGauge } from './FraudScoreGauge';
import { CheckResults } from './CheckResults';

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FraudCheckResult | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));

    const rateCheck = checkRateLimit('demo-ip');
    if (!rateCheck.allowed) {
      setRateLimited(true);
      setLoading(false);
      return;
    }
    setRateLimited(false);

    const fraudResult = detectFraud(email, username);
    setResult(fraudResult);

    addToLog({
      email,
      username,
      ip: '192.168.1.' + Math.floor(Math.random() * 255),
      score: fraudResult.score,
      status: fraudResult.status,
    });

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary border-border focus:ring-primary focus:border-primary font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-muted-foreground">
            Username
          </Label>
          <Input
            id="username"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={2}
            maxLength={30}
            className="bg-secondary border-border focus:ring-primary focus:border-primary font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="bg-secondary border-border focus:ring-primary focus:border-primary font-mono text-sm"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-sm font-semibold tracking-wide"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            <Shield className="mr-2" />
          )}
          {loading ? 'Analyzing Registration...' : 'Register & Analyze'}
        </Button>
      </form>

      <AnimatePresence>
        {rateLimited && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border border-danger bg-danger/10 flex items-center gap-3"
          >
            <XCircle className="text-danger shrink-0" size={20} />
            <div>
              <p className="font-semibold text-danger text-sm">Rate Limited</p>
              <p className="text-xs text-muted-foreground">Too many registration attempts. Please wait.</p>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-5"
          >
            {/* Status banner */}
            <div
              className={`p-4 rounded-lg border flex items-center gap-3 ${
                result.status === 'clean'
                  ? 'border-success bg-success/10'
                  : result.status === 'suspicious'
                  ? 'border-warning bg-warning/10'
                  : 'border-danger bg-danger/10'
              }`}
            >
              {result.status === 'clean' ? (
                <CheckCircle className="text-success shrink-0" size={20} />
              ) : result.status === 'suspicious' ? (
                <AlertTriangle className="text-warning shrink-0" size={20} />
              ) : (
                <XCircle className="text-danger shrink-0" size={20} />
              )}
              <div>
                <p
                  className={`font-semibold text-sm ${
                    result.status === 'clean'
                      ? 'text-success'
                      : result.status === 'suspicious'
                      ? 'text-warning'
                      : 'text-danger'
                  }`}
                >
                  {result.status === 'clean'
                    ? 'Registration Approved'
                    : result.status === 'suspicious'
                    ? 'Flagged for Review'
                    : 'Registration Blocked'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fraud score: {result.score}/100
                </p>
              </div>
            </div>

            <FraudScoreGauge score={result.score} />
            <CheckResults checks={result.checks} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
