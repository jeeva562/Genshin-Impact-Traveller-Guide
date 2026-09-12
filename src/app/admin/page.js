import { getSourceHealth, getSyncLogs } from '@/database/repositories/index';
import { getCharacters } from '@/database/repositories/character-repository';
import { getWeapons, getArtifactSets, getTalentBooks, getTeamTemplates } from '@/database/repositories/index';

export const metadata = {
  title: 'System Health & Admin Dashboard | Genshin Guide',
  description: 'Database health, data source sync logs, and record metrics for the Genshin Guide platform.',
};

export default function AdminPage() {
  const sources = getSourceHealth();
  const syncLogs = getSyncLogs(10);
  const charCount = getCharacters().length;
  const weapCount = getWeapons().length;
  const artCount = getArtifactSets().length;
  const bookCount = getTalentBooks().length;
  const teamCount = getTeamTemplates().length;

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-8) var(--space-4) var(--space-16)' }}>
      <header style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-extrabold)', marginBottom: 'var(--space-2)' }}>
          Platform Health &amp; Data Pipeline
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: '700px' }}>
          Monitoring live database metrics, upstream API source status, and sync telemetry.
        </p>
      </header>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Characters</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{charCount}</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>● Normalized</span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Weapons</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{weapCount}</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>● Normalized</span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Artifact Sets</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{artCount}</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>● Normalized</span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Talent Books</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{bookCount}</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>● Active</span>
        </div>

        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Meta Teams</span>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--text-primary)' }}>{teamCount}</div>
          <span style={{ fontSize: '11px', color: '#10b981' }}>● Ready</span>
        </div>
      </div>

      {/* Sources Table */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>
          Upstream Data Sources
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {sources.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
              <div>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{s.source_name}</strong>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{s.url} &bull; License: {s.license}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 'bold' }}>
                  {s.status}
                </span>
                <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Last sync: {s.last_synced || 'Recently'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Logs */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>
          Recent Ingestion &amp; Sync Logs
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {syncLogs.length > 0 ? (
            syncLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)' }}>
                <span>Source ID: <strong>{log.source_id}</strong> &bull; Entities: {log.entities_count}</span>
                <span style={{ color: log.status === 'success' ? '#10b981' : '#ef4444' }}>
                  {log.status} ({log.timestamp})
                </span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Initial seed database migration logged in WAL journal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
