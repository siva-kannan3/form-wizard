export const ReviewRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div style={{ display: 'flex', gap: 12, padding: '6px 0', alignItems: 'flex-start' }}>
    <div style={{ minWidth: 160, fontWeight: 600 }}>{label}</div>
    <div style={{ color: value === undefined || value === '' ? '#666' : undefined }}>{value}</div>
  </div>
);
