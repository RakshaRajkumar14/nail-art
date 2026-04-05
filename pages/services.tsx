import Head from 'next/head';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Check, Plus } from 'lucide-react';
import { formatCurrency, formatStartingPrice } from '@/lib/currency';
import { SiteChrome } from '@/components/shivya/SiteChrome';
import { SparkleEffect } from '@/components/SparkleEffect';
import { readUserSession } from '@/lib/userSession';
import toast from 'react-hot-toast';
import {
  SHIVYA_ENHANCEMENTS,
  SHIVYA_SERVICES,
  SHIVYA_SITE_NAME,
} from '@/lib/shivyaContent';
import {
  readSelectedEnhancements,
  readSelectedServices,
  storeSelectedServices,
  toggleEnhancement,
} from '@/lib/shivyaStorage';
import { formatDurationDisplay } from '@/lib/bookingTimeUtils';
import styles from '@/styles/ShivyaServicesPage.module.css';

export default function ServicesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selectedEnhancementIds, setSelectedEnhancementIds] = useState<string[]>([]);

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      toast.error('Please sign in to view and book services');
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  }, [router]);

  useLayoutEffect(() => {
    setSelectedServiceIds(readSelectedServices().map((s) => s.id));
    setSelectedEnhancementIds(readSelectedEnhancements().map((item) => item.id));
  }, []);

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      const isSelected = prev.includes(serviceId);
      const next = isSelected
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId];

      setTimeout(() => {
        storeSelectedServices(next);
      }, 0);

      return next;
    });
  };

  const handleToggleEnhancement = (serviceId: string) => {
    toggleEnhancement(serviceId);
    setSelectedEnhancementIds(readSelectedEnhancements().map((item) => item.id));
  };

  if (isCheckingAuth) {
    return (
      <>
        <Head>
          <title>{`Services | ${SHIVYA_SITE_NAME}`}</title>
        </Head>
        <SiteChrome active="services">
          <SparkleEffect />
          <main className={styles.page}>
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p>Loading...</p>
            </div>
          </main>
        </SiteChrome>
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{`Services | ${SHIVYA_SITE_NAME}`}</title>
        <meta
          name="description"
          content="Choose one or more services at Shivya's Nail Studio before moving into the date and time step of your booking."
        />
      </Head>

      <SiteChrome active="services">
        <SparkleEffect />
        <main className={styles.page}>
          <section className={styles.intro}>
            <p className={styles.eyebrow}>Nail Art Selection</p>
            <h1 className={styles.title}>
              Artisanal <em>Treatments</em>
            </h1>
            <p className={styles.text}>
              Start your booking here. Select one or more services for your visit,
              then continue to choose the date and time for your appointment.
            </p>
          </section>

          <section className={styles.grid}>
            {SHIVYA_SERVICES.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);

              return (
                <article
                  key={service.id}
                  className={`${styles.card} ${isSelected ? styles.selectedCard : ''}`}
                >
                  <img src={service.image} alt={service.name} className={styles.cardImage} />
                  <div className={styles.cardBody}>
                    <p className={styles.cardEyebrow}>{service.eyebrow}</p>
                    <div className={styles.cardMeta}>
                      <h2 className={styles.cardTitle}>{service.name}</h2>
                      <span className={styles.cardPrice}>{formatStartingPrice(service.price)}</span>
                    </div>
                    <p className={styles.cardText}>{service.description}</p>
                    <div className={styles.cardInfoRow}>
                      <span className={styles.cardDuration}>{formatDurationDisplay(service.duration)} artistry</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.cardButton} ${isSelected ? styles.cardButtonActive : ''
                        }`}
                      onClick={() => handleToggleService(service.id)}
                    >
                      {isSelected ? <Check size={13} /> : <Plus size={13} />}
                      {isSelected ? 'Selected' : 'Select Service'}
                    </button>
                  </div>
                </article>
              );
            })}

            <section className={styles.enhancements}>
              <h2 className={styles.enhancementsTitle}>Treatment Enhancements</h2>
              <div className={styles.enhancementsGrid}>
                {SHIVYA_ENHANCEMENTS.map((enhancement) => {
                  const isActive = selectedEnhancementIds.includes(enhancement.id);

                  return (
                    <article
                      key={enhancement.id}
                      className={`${styles.enhancementCard} ${isActive ? styles.enhancementActive : ''
                        }`}
                    >
                      <h3 className={styles.enhancementName}>{enhancement.name}</h3>
                      <p className={styles.enhancementText}>{enhancement.description}</p>
                      <p className={styles.enhancementPrice}>+{formatCurrency(enhancement.price)}</p>
                      <button
                        type="button"
                        className={styles.enhancementToggle}
                        onClick={() => handleToggleEnhancement(enhancement.id)}
                      >
                        {isActive ? 'Included' : 'Add Enhancement'}
                      </button>
                    </article>
                  );
                })}
              </div>
              <p className={styles.hint}>
                Your selected services and enhancements will carry into the booking step.
              </p>
            </section>
          </section>
        </main>

        {/* Sticky booking footer */}
        <div className={`${styles.bookingFooter} ${selectedServiceIds.length > 0 ? styles.bookingFooterVisible : ''}`}>
          <span className={styles.bookingFooterCount}>
            {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? 's' : ''} selected
          </span>
          <button
            type="button"
            className={styles.bookingFooterButton}
            onClick={() => router.push('/book')}
          >
            Continue to Booking
          </button>
        </div>
      </SiteChrome>
    </>
  );
}
