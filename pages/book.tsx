import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  ChevronRight,
  MoonStar,
  Sun,
  Sunrise,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { SiteChrome } from '@/components/shivya/SiteChrome';
import { formatCurrency } from '@/lib/currency';
import {
  SHIVYA_SITE_NAME,
  ShivyaService,
} from '@/lib/shivyaContent';
import {
  readSelectedEnhancements,
  readSelectedServices,
  SELECTED_ENHANCEMENTS_KEY,
  SELECTED_SERVICE_KEY,
  SELECTED_SERVICES_KEY,
  storeBookingConfirmation,
  storeSelectedServices,
  clearSelectedEnhancements
} from '@/lib/shivyaStorage';
import { readUserSession } from '@/lib/userSession';
import { supabase } from '@/lib/supabase';
import { getAvailableDates } from '@/components/booking/utils';
import { formatDurationDisplay } from '@/lib/bookingTimeUtils';
import styles from '@/styles/ShivyaBookPage.module.css';

interface AvailabilitySlot {
  time: string;
  available: boolean;
}

interface CustomerFormState {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDisplayDateShort(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatDisplayTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMonthDays(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

export default function BookPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const availableDates = useMemo(() => getAvailableDates(60), []);
  const availableDateKeys = useMemo(
    () => new Set(availableDates.map((item) => toDateKey(item))),
    [availableDates]
  );
  const [selectedServices, setSelectedServices] = useState<ShivyaService[]>([]);
  const [selectedEnhancements, setSelectedEnhancements] = useState<ShivyaService[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(availableDates[0] || null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const initial = availableDates[0] || new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [customer, setCustomer] = useState<CustomerFormState>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const selectedItems = useMemo(
    () => [...selectedServices, ...selectedEnhancements],
    [selectedEnhancements, selectedServices]
  );
  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  );
  const totalDuration = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.duration, 0),
    [selectedItems]
  );
  const hasSelectedServices = selectedServices.length > 0;

  useEffect(() => {
    const session = readUserSession();
    if (!session) {
      toast.error('Please sign in to book an appointment');
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    setIsCheckingAuth(false);
  }, [router]);

  const editId = router.query.editId as string | undefined;

  useEffect(() => {
    if (!editId) return;

    const fetchBookingToEdit = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token || '';

        const res = await fetch(`/api/bookings/${editId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const payload = await res.json();

        if (payload.success) {
          const booking = payload.data;

          setCustomer({
            name: booking.customerName || '',
            email: booking.customerEmail || '',
            phone: booking.customerPhone || '',
            notes: booking.notes || '',
          });

          if (booking.date) {
            const [y, m, d] = booking.date.split('-');
            setSelectedDate(new Date(Number(y), Number(m) - 1, Number(d)));
            setCurrentMonth(new Date(Number(y), Number(m) - 1, 1));
          }
          if (booking.timeSlot) {
            setSelectedTime(booking.timeSlot);
          }
        }
      } catch (err) {
        toast.error('Could not load appointment details.');
      }
    };

    fetchBookingToEdit();
  }, [editId]);

  useEffect(() => {
    const syncSelections = () => {
      setSelectedServices(readSelectedServices());
      setSelectedEnhancements(readSelectedEnhancements());
    };
    syncSelections();

    const onVisible = () => {
      if (document.visibilityState === 'visible') syncSelections();
    };
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === SELECTED_SERVICES_KEY ||
        event.key === SELECTED_SERVICE_KEY ||
        event.key === SELECTED_ENHANCEMENTS_KEY
      ) {
        syncSelections();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const loadAvailability = async () => {
      try {
        setLoadingTimes(true);
        setSelectedTime('');

        const response = await fetch(`/api/available-times?date=${toDateKey(selectedDate)}&duration=${totalDuration}`);
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || 'Failed to load time slots');
        }

        setAvailability(payload.data || []);
      } catch (error) {
        console.error(error);
        setAvailability([]);
      } finally {
        setLoadingTimes(false);
      }
    };

    loadAvailability();
  }, [selectedDate]);

  const groupedTimes = useMemo(() => {
    const groups = {
      morning: [] as AvailabilitySlot[],
      afternoon: [] as AvailabilitySlot[],
      evening: [] as AvailabilitySlot[],
    };

    availability.forEach((slot) => {
      const hour = Number(slot.time.split(':')[0]);
      if (hour < 12) {
        groups.morning.push(slot);
      } else if (hour < 17) {
        groups.afternoon.push(slot);
      } else {
        groups.evening.push(slot);
      }
    });

    return groups;
  }, [availability]);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const nextDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!availableDateKeys.has(toDateKey(nextDate))) return;
    setSelectedDate(nextDate);
  };

  const openDetailsModal = () => {
    if (!hasSelectedServices) {
      toast.error('Select your services first.');
      router.push('/services');
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Choose a date and time first.');
      return;
    }

    setShowDetailsModal(true);
  };

  const handleSubmitBooking = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast.error('Choose a date and time before confirming.');
      return;
    }

    try {
      setSubmitting(true);

      const endpoint = editId ? `/api/bookings/${editId}` : '/api/bookings';
      const method = editId ? 'PUT' : 'POST';

      let headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (editId) {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.access_token) {
          headers['Authorization'] = `Bearer ${session.session.access_token}`;
        }
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify({
          services: selectedItems.map((item) => ({
            id: item.id,
            name: item.bookingName || item.name,
            price: item.price,
            duration: item.duration,
            category: item.category,
            description: item.description,
          })),
          date: toDateKey(selectedDate),
          timeSlot: {
            id: `slot-${selectedTime}`,
            time: selectedTime,
            available: true,
          },
          customerDetails: customer,
          totalDuration,
          totalPrice,
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Unable to confirm appointment');
      }

      const finalBookingId = editId || payload.bookingId;

      storeBookingConfirmation({
        bookingId: finalBookingId,
        serviceName: selectedServices.map((s) => s.bookingName || s.name).join(', '),
        servicePrice: totalPrice,
        totalPrice,
        totalDuration,
        dateLabel: formatDisplayDate(selectedDate),
        timeLabel: formatDisplayTime(selectedTime),
        phone: customer.phone,
        name: customer.name,
        email: customer.email,
        enhancements: selectedEnhancements.map((item) => item.name),
      });

      storeSelectedServices([]);
      clearSelectedEnhancements();

      toast.success(editId ? 'Appointment updated.' : 'Appointment confirmed.');
      setShowDetailsModal(false);
      router.push('/book/confirmed');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const totalDays = getMonthDays(currentMonth);
  const monthStart = getMonthStart(currentMonth);

  if (isCheckingAuth) {
    return (
      <>
        <Head>
          <title>{`Book Appointment | ${SHIVYA_SITE_NAME}`}</title>
        </Head>
        <SiteChrome active="book">
          <main className={styles.page}>
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p>Checking authentication...</p>
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
        <title>{`Choose Date & Time | ${SHIVYA_SITE_NAME}`}</title>
        <meta
          name="description"
          content="Review your selected services, then choose the date and time for your appointment at Shivya's Nail Studio."
        />
      </Head>

      <SiteChrome active="book">
        <main className={styles.page}>
          <section className={styles.intro}>
            <h1 className={`${styles.title} ${styles.titleMobile}`}>Secure Your Moment</h1>
            <h1 className={`${styles.title} ${styles.titleDesktop}`}>Select Your Session</h1>
            <p className={`${styles.text} ${styles.textMobile}`}>
              Choose your date and time after selecting the services you want.
            </p>
            <p className={`${styles.text} ${styles.textDesktop}`}>
              Your services are already selected. All that&apos;s left is to choose the
              date and time that suits your schedule.
            </p>
          </section>

          {!hasSelectedServices ? (
            <section className={styles.selectionEmpty}>
              <p className={styles.selectionEmptyEyebrow}>Step 1</p>
              <h2 className={styles.selectionEmptyTitle}>Choose Your Services First</h2>
              <p className={styles.selectionEmptyText}>
                Start at the services page, select one or more treatments with images,
                and then come back here to lock in your date and time.
              </p>
              <Link href="/services" className={styles.selectionEmptyButton}>
                Go To Services
              </Link>
            </section>
          ) : (
            <>
              <section className={styles.serviceSummary}>
                <div className={styles.serviceSummaryHead}>
                  <div>
                    <p className={styles.serviceSummaryLabel}>Step 2</p>
                    <h2 className={styles.serviceSummaryTitle}>Selected Services</h2>
                    <p className={styles.serviceSummaryText}>
                      Review what you&apos;ve chosen, then continue with the date and time step.
                    </p>
                  </div>
                  <Link href="/services" className={styles.serviceSummaryLink}>
                    Change Services
                  </Link>
                </div>

                <div className={styles.serviceSummaryGrid}>
                  {selectedServices.map((service) => (
                    <article key={service.id} className={styles.serviceSummaryCard}>
                      <img
                        src={service.image}
                        alt={service.name}
                        className={styles.serviceSummaryImage}
                      />
                      <div className={styles.serviceSummaryBody}>
                        <div className={styles.serviceSummaryMeta}>
                          <h3 className={styles.serviceSummaryName}>
                            {service.bookingName || service.name}
                          </h3>
                          <span className={styles.serviceSummaryPrice}>
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                        <p className={styles.serviceOptionDesc}>{service.description}</p>
                        <span className={styles.serviceSummaryDuration}>
                          {formatDurationDisplay(service.duration)} artistry
                        </span>
                      </div>
                    </article>
                  ))}
                </div>

                {selectedEnhancements.length > 0 && (
                  <div className={styles.summaryChips}>
                    {selectedEnhancements.map((enhancement) => (
                      <span key={enhancement.id} className={styles.enhancementPill}>
                        {enhancement.name}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Total Estimated Time</h3>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{formatDurationDisplay(totalDuration)}</span>
                </div>
              </section>

              <section className={styles.layout}>
                <div className={styles.calendarCard}>
                  <div className={styles.calendarHead}>
                    <button
                      type="button"
                      className={styles.calendarPrev}
                      onClick={handlePrevMonth}
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <h2 className={styles.calendarMonth}>
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </h2>
                    <button
                      type="button"
                      className={styles.calendarNext}
                      onClick={handleNextMonth}
                      aria-label="Next month"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className={styles.weekdayRow}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className={styles.weekday}>
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className={styles.dayGrid}>
                    {Array.from({ length: monthStart }).map((_, index) => (
                      <div key={`empty-${index}`} className={styles.emptyDay} />
                    ))}

                    {Array.from({ length: totalDays }).map((_, index) => {
                      const day = index + 1;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const dateKey = toDateKey(date);
                      const isAvailable = availableDateKeys.has(dateKey);
                      const isSelected = selectedDate ? toDateKey(selectedDate) === dateKey : false;
                      const isOutsideRange = !isAvailable;

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          className={`${styles.dayButton} ${isSelected ? styles.daySelected : ''
                            } ${isOutsideRange ? styles.dayUnavailable : ''}`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className={styles.quoteCard}>
                    <img
                      src="/images/luxe/cozy_home_nail_setup.png"
                      alt="Shivya's home studio interior"
                      className={styles.quoteImage}
                    />
                    <p className={styles.quote}>
                      &ldquo;Art is the only way to run away without leaving home.&rdquo;
                    </p>
                  </div>
                </div>

                <div className={styles.sideStack}>
                  <div className={styles.timesCard}>
                    <h2 className={styles.timesTitle}>
                      Available Times — {selectedDate ? formatDisplayDateShort(selectedDate) : 'Select a date'}
                    </h2>
                    <hr className={styles.timesDivider} />

                    {([
                      ['morning', 'Morning', Sunrise],
                      ['afternoon', 'Afternoon', Sun],
                      ['evening', 'Evening', MoonStar],
                    ] as const).map(([key, label, Icon]) => {
                      const slots = groupedTimes[key];

                      if (!slots.length) {
                        return null;
                      }

                      return (
                        <div key={key} className={styles.timeGroup}>
                          <div className={styles.timeGroupLabel}>
                            <Icon size={16} />
                            <span>{label}</span>
                          </div>

                          <div className={styles.timeGrid}>
                            {slots.map((slot) => {
                              const isSelected = selectedTime === slot.time && slot.available;

                              return (
                                <button
                                  key={`${key}-${slot.time}`}
                                  type="button"
                                  disabled={!slot.available || loadingTimes}
                                  className={`${styles.timeButton} ${isSelected ? styles.timeButtonActive : ''
                                    } ${!slot.available ? styles.timeButtonDisabled : ''}`}
                                  onClick={() => slot.available && setSelectedTime(slot.time)}
                                >
                                  <span>{formatDisplayTime(slot.time)}</span>
                                  {!slot.available ? <span>Booked</span> : null}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}

                    {!loadingTimes && availability.length === 0 && (
                      <p className={styles.timesEmpty}>
                        No appointment times are available for this date. Choose another day.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className={styles.bookActionsFooter} aria-label="Booking actions">
                <div className={styles.bookActionsInner}>
                  <button
                    type="button"
                    className={styles.confirmButton}
                    onClick={openDetailsModal}
                    disabled={!selectedDate || !selectedTime || loadingTimes}
                  >
                    Confirm Appointment
                  </button>
                  <Link href="/services" className={styles.modifyButton}>
                    Modify Services
                  </Link>
                </div>
              </section>
            </>
          )}

          {showDetailsModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalCard}>
                <div className={styles.modalTop}>
                  <div>
                    <h2 className={styles.modalTitle}>Complete Your Details</h2>
                    <p className={styles.modalText}>
                      Finalize your reservation for{' '}
                      {selectedServices.map((s) => s.bookingName || s.name).join(', ')} on{' '}
                      {selectedDate ? formatDisplayDate(selectedDate) : ''} at{' '}
                      {selectedTime ? formatDisplayTime(selectedTime) : ''}.
                    </p>
                  </div>

                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setShowDetailsModal(false)}
                    aria-label="Close details form"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmitBooking}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Full Name</span>
                    <input
                      className={styles.fieldInput}
                      value={customer.name}
                      onChange={(event) =>
                        setCustomer((prev) => ({ ...prev, name: event.target.value }))
                      }
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Email Address</span>
                    <input
                      className={styles.fieldInput}
                      type="email"
                      value={customer.email}
                      onChange={(event) =>
                        setCustomer((prev) => ({ ...prev, email: event.target.value }))
                      }
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Phone Number</span>
                    <input
                      className={styles.fieldInput}
                      value={customer.phone}
                      onChange={(event) =>
                        setCustomer((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      required
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>Notes</span>
                    <textarea
                      className={styles.fieldTextarea}
                      value={customer.notes}
                      onChange={(event) =>
                        setCustomer((prev) => ({ ...prev, notes: event.target.value }))
                      }
                      placeholder="Anything you'd like us to prepare for your session?"
                    />
                  </label>

                  <button type="submit" className={styles.submitButton} disabled={submitting}>
                    {submitting ? 'Confirming...' : 'Submit Booking'}
                  </button>
                </form>

                <p className={styles.statusText}>
                  Your appointment will be confirmed instantly and saved for your arrival.
                </p>
              </div>
            </div>
          )}
        </main>
      </SiteChrome>
    </>
  );
}
