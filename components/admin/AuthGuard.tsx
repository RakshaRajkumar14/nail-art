import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';
import { SparkleEffect } from '@/components/SparkleEffect';
import styles from '@/styles/AuthPage.module.css';

interface AuthGuardProps {
  children: React.ReactNode;
  onTokenReceived?: (token: string) => void;
}

export default function AuthGuard({ children, onTokenReceived }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      onTokenReceived?.(token);
    }
    setLoading(false);
  }, [onTokenReceived]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check against the ADMIN_SECRET from .env.local
      const adminSecret = 'nailart14142026'; // Your admin password

      if (credentials.password === adminSecret) {
        const token = `Bearer ${credentials.password}`;
        localStorage.setItem('adminToken', token);
        setIsAuthenticated(true);
        onTokenReceived?.(token);
        toast.success('Welcome back, Admin!');
      } else {
        toast.error('Invalid admin credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', paddingTop: '8rem' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SparkleEffect />
        
        <div className={styles.page}>
          <button onClick={() => router.push('/')} className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <div className={styles.container}>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                <Shield size={36} />
              </div>
              <h1 className={styles.adminTitle}>Admin Portal</h1>
              <p className={styles.adminSubtitle}>Sign in with your admin credentials</p>
            </div>

            <div className={styles.card}>
              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>EMAIL</label>
                  <input
                    type="email"
                    className={styles.input}
                    placeholder="admin@luxenails.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>PASSWORD</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={styles.input}
                      placeholder="••••••••"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                  ADMIN LOGIN
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
