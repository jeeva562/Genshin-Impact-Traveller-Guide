import { getFarmingSchedule } from '@/database/repositories/index';
import FarmingClient from '@/components/farming/FarmingClient';
import { DAYS_OF_WEEK } from '@/lib/constants';

export const metadata = {
  title: 'Daily Farming Schedule & Talent Domains | Genshin Impact',
  description: 'See which talent books and weapon materials are farmable today, organized by domain and character requirements.',
};

export default function FarmingPage() {
  const allSchedule = getFarmingSchedule(null);
  const currentDay = DAYS_OF_WEEK[new Date().getDay()];

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Farming Schedule Assistant
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Plan your resin efficiency. Check domain schedules for talent books and character materials by day of the week.
        </p>
      </header>

      <FarmingClient initialSchedule={allSchedule} currentDay={currentDay} />
    </div>
  );
}
