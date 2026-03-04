function StatCard({ title, value, subtitle, color = 'green' }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <p className="stat-label">{title}</p>
      <p className="stat-value">{value ?? '—'}</p>
      {subtitle && <p className="stat-subtitle">{subtitle}</p>}
    </div>
  );
}
export default StatCard;