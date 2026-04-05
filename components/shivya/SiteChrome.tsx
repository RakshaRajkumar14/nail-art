import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  Home,
  Menu,
  ShoppingBag,
  LogOut,
  User,
} from 'lucide-react';
import styles from './SiteChrome.module.css';
import {
  SHIVYA_BOOKING_START_ROUTE,
  SHIVYA_FOOTER_LINKS,
  SHIVYA_PRIMARY_LINKS,
  SHIVYA_SITE_NAME,
  SHIVYA_SITE_SHORT_NAME,
} from '@/lib/shivyaContent';
import { readUserSession, signOutUser } from '@/lib/userSession';
import { clearAllSelections } from '@/lib/shivyaStorage';
import { useRouter } from 'next/router';

type ActiveTab = 'home' | 'services' | 'book' | 'studio' | 'login' | 'admin';

interface SiteChromeProps {
  active: ActiveTab;
  children: ReactNode;
  contentMode?: 'contained' | 'full';
}

const dockItems = [
  { label: 'Home', href: '/', icon: Home, key: 'home' },
  { label: 'Services', href: '/services', icon: BookOpen, key: 'services' },
  { label: 'Book', href: SHIVYA_BOOKING_START_ROUTE, icon: CalendarDays, key: 'book' },
  { label: 'Studio', href: '/#studio', icon: BookOpen, key: 'studio' },
] as const;

export function SiteChrome({
  active,
  children,
  contentMode = 'contained',
}: SiteChromeProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userSession, setUserSession] = useState<any>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const session = readUserSession();
    setUserSession(session);
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    clearAllSelections();
    setUserSession(null);
    router.push('/');
  };

  const contentClassName =
    contentMode === 'full'
      ? `${styles.content} ${styles.contentFull}`
      : styles.content;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.mobileBrandRow}>
            <button
              type="button"
              className={styles.mobileButton}
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle navigation menu"
            >
              <Menu size={16} />
            </button>
            <Link href="/" className={styles.wordmark}>
              {SHIVYA_SITE_SHORT_NAME}
            </Link>
            <Link
              href={SHIVYA_BOOKING_START_ROUTE}
              className={styles.bagButton}
              aria-label="Go to booking"
            >
              <ShoppingBag size={15} />
            </Link>
          </div>

          <div className={styles.desktopRow}>
            <Link href="/" className={styles.wordmark}>
              {SHIVYA_SITE_NAME}
            </Link>

            <nav className={styles.desktopNav}>
              {SHIVYA_PRIMARY_LINKS.filter((link) => link.label !== 'Book').map((link) => {
                const isActive =
                  (link.label === 'Home' && active === 'home') ||
                  (link.label === 'Services' && active === 'services') ||
                  (link.label === 'Studio' && active === 'studio');

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`${styles.desktopLink} ${
                      isActive ? styles.desktopLinkActive : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className={styles.headerActions}>
              {userSession ? (
                <>
                  <div className={styles.userInfo}>
                    <User size={16} />
                    <span>{userSession.name}</span>
                  </div>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`${styles.accountLink} ${
                    active === 'login' ? styles.accountActive : ''
                  }`}
                >
                  Login
                </Link>
              )}
              <Link href={SHIVYA_BOOKING_START_ROUTE} className={styles.desktopCta}>
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.menu}>
            {SHIVYA_PRIMARY_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={styles.menuLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className={contentClassName}>{children}</div>

      <footer className={styles.footer} id="contact">
        <div className={styles.footerInner}>
          <Link href="/" className={styles.footerBrand}>
            {SHIVYA_SITE_NAME}
          </Link>

          <div className={styles.footerLinks}>
            {SHIVYA_FOOTER_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={styles.footerLink}>
                {link.label}
              </Link>
            ))}
          </div>

          <p className={styles.copyright}>© {currentYear} {SHIVYA_SITE_NAME}. All rights reserved.</p>
        </div>

        <div className={styles.mobileFooter}>
          <div className={styles.mobileFooterTitle}>{SHIVYA_SITE_NAME}</div>
          <div className={styles.mobileFooterLinks}>
            {SHIVYA_FOOTER_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={styles.mobileFooterLink}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles.mobileCopyright}>
            © {currentYear} {SHIVYA_SITE_NAME}. All rights reserved.
          </div>
        </div>
      </footer>

      <nav className={styles.dock}>
        {dockItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.dockLink} ${active === item.key ? styles.dockActive : ''}`}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
