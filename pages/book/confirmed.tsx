import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Check, Phone, Share2 } from 'lucide-react';
import { SiteChrome } from '@/components/shivya/SiteChrome';
import { formatCurrency } from '@/lib/currency';
import { SHIVYA_SITE_NAME } from '@/lib/shivyaContent';
import styles from '@/styles/ShivyaConfirmedPage.module.css';
import { readBookingConfirmation } from '@/lib/shivyaStorage';

interface ConfirmationData {
  bookingId?: string;
  serviceName: string;
  servicePrice: number;
  totalPrice: number;
  totalDuration: number;
  dateLabel: string;
  timeLabel: string;
  phone: string;
  name: string;
  email: string;
  enhancements: string[];
}

const fallbackData: ConfirmationData = {
  bookingId: 'SHV-0248',
  serviceName: 'Signature Gel Hand-Artistry',
  servicePrice: 85,
  totalPrice: 85,
  totalDuration: 120,
  dateLabel: 'October 24th, 2024',
  timeLabel: '2:00 PM',
  phone: '+1 (212) 555-0198',
  name: 'Guest',
  email: 'guest@example.com',
  enhancements: [],
};

export default function BookingConfirmedPage() {
  const [confirmation, setConfirmation] = useState<ConfirmationData>(fallbackData);

  useEffect(() => {
    const stored = readBookingConfirmation<ConfirmationData>();
    if (stored) {
      setConfirmation(stored);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{`Appointment Confirmed | ${SHIVYA_SITE_NAME}`}</title>
        <meta
          name="description"
          content="Your Shivya's Nal Studio appointment is confirmed. Review your details and prepare for your artful experience."
        />
      </Head>

      <SiteChrome active="book">
        <main className={styles.page}>
          <div className={styles.wrap}>
            <div className={styles.badge}>
              <Check size={20} />
            </div>

            <h1 className={styles.title}>
              Thank you, your <em>artful experience</em> is set.
            </h1>
            <p className={styles.text}>
              Your appointment has been confirmed. We are preparing the atelier for your
              arrival to ensure every detail of your visit is perfect.
            </p>

            <section className={styles.grid}>
              <article className={styles.card}>
                <p className={styles.cardLabel}>Appointment Details</p>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailRow}>
                    <div>
                      <p className={styles.cardLabel}>Services</p>
                      <h2 className={styles.detailTitle}>{confirmation.serviceName}</h2>
                    </div>
                    <span className={styles.detailPrice}>{formatCurrency(confirmation.totalPrice)}</span>
                  </div>

                  <div className={styles.detailRow}>
                    <div>
                      <p className={styles.cardLabel}>Date &amp; Time</p>
                      <h3 className={styles.detailTitle}>
                        {confirmation.dateLabel} at {confirmation.timeLabel}
                      </h3>
                    </div>
                  </div>

                  {confirmation.enhancements.length > 0 && (
                    <div>
                      <p className={styles.cardLabel}>Enhancements</p>
                      <div className={styles.enhancementList}>
                        {confirmation.enhancements.map((enhancement) => (
                          <span key={enhancement} className={styles.enhancementPill}>
                            {enhancement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.summaryRow}>
                    <div>
                      <p className={styles.cardLabel}>Estimated Total</p>
                      <div className={styles.summaryAmount}>{formatCurrency(confirmation.totalPrice)}</div>
                    </div>
                    <Link href="/services" className={styles.modifyLink}>
                      Modify
                    </Link>
                  </div>
                </div>
              </article>

              <article className={styles.imageCard}>
                <img
                  src="/images/luxe/gallery-nails.jpg"
                  alt="Artful manicure close-up"
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.imageLabel}>Our Aesthetic</div>
                  <div className={styles.imageTitle}>Crafted with precision, inspired by silence.</div>
                </div>
              </article>

              <article className={styles.studioCard}>
                <p className={styles.studioTitle}>The Studio</p>
                <h2 className={styles.studioAddress}>
                  124 Atelier Row,
                  <br />
                  Suite 400, New York,
                  <br />
                  NY
                </h2>

                <a href="tel:+12125550198" className={styles.studioPhone}>
                  <Phone size={16} />
                  <span>+1 (212) 555-0198</span>
                </a>

                <div className={styles.studioActions}>
                  <Link href="/#contact" className={styles.directionsLink}>
                    Get Directions
                  </Link>
                  <button type="button" className={styles.shareButton} aria-label="Share booking details">
                    <Share2 size={16} />
                  </button>
                </div>
              </article>

              <article className={styles.mapCard}>
                <div className={styles.mapPin} />
              </article>
            </section>

            <section className={styles.socialBlock}>
              <p className={styles.socialLabel}>Stay Inspired</p>
              <div className={styles.socialLinks}>
                {['Instagram', 'Pinterest', 'Journal'].map((link) => (
                  <Link key={link} href="/#journal" className={styles.socialLink}>
                    {link}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </SiteChrome>
    </>
  );
}
