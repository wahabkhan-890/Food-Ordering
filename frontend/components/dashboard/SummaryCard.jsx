const SummaryCard = ({ title, value, color = '#0088FE', icon }) => (
  <div style={{
    background: 'white',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    minWidth: 200,
    textAlign: 'center',
    borderTop: `4px solid ${color}`,
    transition: 'transform 0.2s',
    cursor: 'default'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    {icon && <div style={{ fontSize: 30, marginBottom: 5 }}>{icon}</div>}
    <h4 style={{ color: '#888', margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
      {title}
    </h4>
    <h2 style={{ color: color, margin: '8px 0 0 0', fontSize: 30, fontWeight: 700 }}>
      {value}
    </h2>
  </div>
);

export default SummaryCard;