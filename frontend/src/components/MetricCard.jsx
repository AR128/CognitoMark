const MetricCard = ({ label, value }) => (
  <div className="card">
    <div style={{ color: "var(--muted)", fontSize: 12 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
  </div>
);

export default MetricCard;
