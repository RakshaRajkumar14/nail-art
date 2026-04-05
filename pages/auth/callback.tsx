import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { SparkleEffect } from '@/components/SparkleEffect';
import styles from '@/styles/AuthPage.module.css';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_failed');
          return;
        }

        if (session) {
          const userSession = {
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split('@')[0] || 'User',
            source: 'supabase' as const,
          };

          localStorage.setItem('shivya:user-session', JSON.stringify(userSession));
          router.push('/services');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Callback error:', error);
        router.push('/login?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <>
      <SparkleEffect />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.brand}>
              Shivya's <span className={styles.brandAccent}>Nail Studio</span>
            </h1>
            <p className={styles.subtitle}>Completing sign in...</p>
          </div>
          <div className={styles.card}>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(215, 160, 149, 0.3)',
                borderTopColor: '#d7a095',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: 'var(--shivya-muted)' }}>
                Please wait...
              </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
