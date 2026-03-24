import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, Terminal } from 'lucide-react';
import { RegistrationForm } from '@/components/RegistrationForm';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'register' | 'dashboard'>('register');

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
              <Shield size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Fake Registration Detector</h1>
              <p className="text-[11px] text-muted-foreground font-mono">v1.0 · fraud detection engine</p>
            </div>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border">
            <button
              onClick={() => setActiveTab('register')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Terminal size={12} />
              Register
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BarChart3 size={12} />
              Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'register' ? (
            <div className="max-w-lg mx-auto">
              <div className="mb-6">
                <h2 className="text-lg font-bold">Test Registration</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Submit a registration to test the fraud detection engine. Try disposable emails or
                  bot-like usernames to see it in action.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <RegistrationForm />
              </div>

              {/* Example hints */}
              <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Try these to trigger detection:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-muted-foreground">
                  <div>
                    <span className="text-danger">✗</span> user@mailinator.com
                  </div>
                  <div>
                    <span className="text-danger">✗</span> username: 12345678
                  </div>
                  <div>
                    <span className="text-danger">✗</span> username: qwerty
                  </div>
                  <div>
                    <span className="text-danger">✗</span> username: aaaaaaa
                  </div>
                  <div>
                    <span className="text-success">✓</span> user@gmail.com
                  </div>
                  <div>
                    <span className="text-success">✓</span> username: johndoe
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold">Monitoring Dashboard</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time overview of registration attempts and fraud detection metrics.
                </p>
              </div>
              <Dashboard />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
