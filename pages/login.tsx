import Head from 'next/head';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { SparkleEffect } from '@/components/SparkleEffect';
import { SHIVYA_SITE_NAME } from '@/lib/shivyaContent';
import { registerUser, signInUser, signInWithGoogle } from '@/lib/userSession';
import styles from '@/styles/AuthPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const nextSession =
        mode === 'signup'
          ? await registerUser(form.name, form.email, form.password)
          : await signInUser(form.email, form.password);

      toast.success(mode === 'signup' ? 'Account created successfully!' : 'Welcome back!');
      router.push('/services');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Unable to continue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setSubmitting(true);
      await signInWithGoogle();
      // Supabase will redirect automatically
    } catch (error) {
      console.error(error);
      toast.error('Google sign-in is not configured yet. Please use email/password.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>{`${mode === 'login' ? 'Sign In' : 'Sign Up'} | ${SHIVYA_SITE_NAME}`}</title>
      </Head>

      <SparkleEffect />
      
      <div className={styles.page}>
        <button onClick={() => router.push('/')} className={styles.backLink}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.brand}>
              Luxe<span className={styles.brandAccent}>Nails</span>
            </h1>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {mode === 'signup' && (
                <div className={styles.field}>
                  <label className={styles.label}>NAME</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.label}>EMAIL</label>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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

              <button type="submit" className={styles.submitButton} disabled={submitting}>
                {submitting ? 'PLEASE WAIT...' : mode === 'login' ? 'SIGN IN' : 'SIGN UP'}
              </button>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className={styles.googleButton}
                disabled={submitting}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </form>

            <p className={styles.switchText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className={styles.switchButton}
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
