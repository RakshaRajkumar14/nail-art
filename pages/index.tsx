import Head from 'next/head';
import Link from 'next/link';
import { Gem, Heart, Palette, Sparkles } from 'lucide-react';
import { SiteChrome } from '@/components/shivya/SiteChrome';
import { SparkleEffect } from '@/components/SparkleEffect';
import { formatStartingPrice } from '@/lib/currency';
import {
  SHIVYA_BOOKING_START_ROUTE,
  SHIVYA_BOOKING_STEPS,
  SHIVYA_HOME_FEATURES,
  SHIVYA_SITE_NAME,
  SHIVYA_SERVICES,
} from '@/lib/shivyaContent';
import { formatDurationDisplay } from '@/lib/bookingTimeUtils';
import styles from '@/styles/LuxeHomePage.module.css';

const SERVICE_ICONS = {
  signature: Sparkles,
  extension: Gem,
  acrylic: Heart,
  art: Palette,
  enhancement: Sparkles,
} as const;

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{`${SHIVYA_SITE_NAME} | Luxury Nail Artistry`}</title>
        <meta
          name="description"
          content="Shivya's Nal Studio offers luxury nail artistry, private appointments, and a services-first booking flow for bespoke manicures and custom sets."
        />
      </Head>

      <SiteChrome active="home" contentMode="full">
        <SparkleEffect />
        <main className={styles.page}>
          <section className={styles.hero}>
            <div className={styles.heroBg}>
              <img src="/images/luxe/hero-nails.jpg" alt="Luxury nail collection at Shivya's Nal Studio" />
            </div>
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
              <p className={styles.heroEyebrow}>Premium Nail Art Studio</p>
              <h1 className={styles.heroTitle}>
                Where Beauty
                <br />
                Meets <em>Artistry</em>
              </h1>
              <p className={styles.heroText}>
                Shivya&apos;s Nal Studio pairs quiet luxury with custom nail artistry,
                from polished essentials to statement sets made just for you.
              </p>
              <div className={styles.heroActions}>
                <Link href={SHIVYA_BOOKING_START_ROUTE} className={styles.btnPrimary}>
                  Start Booking
                </Link>
                <Link href="/services" className={styles.btnSecondary}>
                  Our Services
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.section} id="featured">
            <p className={styles.sectionEyebrow}>Nail Art Selection</p>
            <h2 className={styles.sectionTitle}>
              Our <em>Services</em>
            </h2>
            <p className={styles.sectionText}>
              Select the services that fit your mood, then continue into the date and
              time step with every chosen treatment saved for your booking.
            </p>

            <div className={styles.servicesGrid}>
              {SHIVYA_SERVICES.map((service) => {
                const Icon = SERVICE_ICONS[service.category];
                return (
                  <article key={service.id} className={styles.serviceCard}>
                    <div className={styles.serviceCardIcon}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className={styles.serviceCardName}>
                        {service.bookingName || service.name}
                      </h3>
                      <p className={styles.serviceCardDesc}>{service.description}</p>
                      <div className={styles.serviceCardFooter}>
                        <span className={styles.serviceCardPrice}>
                          {formatStartingPrice(service.price)}
                        </span>
                        <span className={styles.serviceCardDuration}>
                          {formatDurationDisplay(service.duration)}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <div className={styles.gallerySection} id="studio">
            <div className={styles.galleryGrid}>
              <article className={styles.galleryCard}>
                <img
                  src="/images/luxe/gallery-nails.jpg"
                  alt="Beautiful nail art designs"
                />
                <div className={styles.galleryOverlay}>
                  <div>
                    <p className={styles.galleryLabel}>Signature Collection</p>
                    <h3 className={styles.galleryCardTitle}>
                      Hand-crafted designs with modern shine.
                    </h3>
                  </div>
                </div>
              </article>
              <article className={styles.galleryCard}>
                <img
                  src="/images/luxe/salon-interior.jpg"
                  alt="Luxury nail studio interior"
                />
                <div className={styles.galleryOverlay}>
                  <div>
                    <p className={styles.galleryLabel}>Our Studio</p>
                    <h3 className={styles.galleryCardTitle}>
                      A space designed for quiet luxury.
                    </h3>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className={styles.featuresSection}>
            <div className={styles.featuresInner}>
              <p className={styles.sectionEyebrow}>Why {SHIVYA_SITE_NAME}</p>
              <h2 className={styles.sectionTitle}>
                Designed for <em>You</em>
              </h2>
              <p className={styles.sectionText}>
                Every step is shaped to feel calm, elevated, and personal from the
                first click to the final topcoat.
              </p>
              <div className={styles.featuresGrid}>
                {SHIVYA_HOME_FEATURES.map((feature) => (
                  <article key={feature.title} className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDesc}>{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.stepsSection}>
            <p className={styles.sectionEyebrow}>How It Works</p>
            <h2 className={styles.sectionTitle}>
              Book in <em>Minutes</em>
            </h2>
            <p className={styles.sectionText}>
              A seamless experience from choosing your service to sitting in the chair.
            </p>
            <div className={styles.stepsGrid}>
              {SHIVYA_BOOKING_STEPS.map((item) => (
                <div key={item.step} className={styles.stepCard}>
                  <span className={styles.stepNum}>{item.step}</span>
                  <div>
                    <h3 className={styles.stepTitle}>{item.title}</h3>
                    <p className={styles.stepDesc}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>
              Your Perfect <em>Nails</em> Await
            </h2>
            <p className={styles.ctaText}>
              Start with your services, then choose the date and time that suits you best.
            </p>
            <Link href={SHIVYA_BOOKING_START_ROUTE} className={styles.ctaBtn}>
              Book Now
            </Link>
          </div>
        </main>
      </SiteChrome>
    </>
  );
}
