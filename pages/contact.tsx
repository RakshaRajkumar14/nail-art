import Head from 'next/head';
import styles from '@/styles/AuthPage.module.css';
import { SiteChrome } from '@/components/shivya/SiteChrome';
import { SHIVYA_SITE_NAME } from '@/lib/shivyaContent';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>{`Contact | ${SHIVYA_SITE_NAME}`}</title>
      </Head>
      <SiteChrome active="home">
        <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--shivya-serif)' }}>Get in Touch</h1>
            <p style={{ color: 'var(--shivya-muted)', fontSize: '1.1rem', marginTop: '1rem' }}>
              We'd love to hear from you. Find us in Berlin or drop us a message.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '2rem', padding: '3rem 2.5rem', boxShadow: '0 20px 60px rgba(103, 69, 53, 0.12)', border: '1px solid rgba(180, 121, 88, 0.08)' }}>
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin color="var(--shivya-rose-strong)" size={24} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Home Studio</h3>
                  <p style={{ color: 'var(--shivya-muted)', marginTop: '0.4rem', lineHeight: 1.6 }}>Alexanderplatz,<br />10178 Berlin,<br />Germany</p>
                  <a href="https://maps.google.com/?q=Alexanderplatz,10178+Berlin,Germany" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '0.8rem', color: 'var(--shivya-burnished)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline' }}>View on Maps</a>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(180, 121, 88, 0.1)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Phone color="var(--shivya-rose-strong)" size={24} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Call or Text</h3>
                  <p style={{ color: 'var(--shivya-muted)', marginTop: '0.4rem', lineHeight: 1.6 }}>+49 151 12345678</p>
                  <a href="https://wa.me/4915112345678" style={{ display: 'inline-block', marginTop: '0.8rem', color: 'var(--shivya-burnished)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline' }}>Message on WhatsApp</a>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(180, 121, 88, 0.1)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Mail color="var(--shivya-rose-strong)" size={24} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Email</h3>
                  <p style={{ color: 'var(--shivya-muted)', marginTop: '0.4rem', lineHeight: 1.6 }}>hello@shivyasnalstudio.com</p>
                  <a href="mailto:hello@shivyasnalstudio.com" style={{ display: 'inline-block', marginTop: '0.8rem', color: 'var(--shivya-burnished)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline' }}>Send us an email</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteChrome>
    </>
  );
}
