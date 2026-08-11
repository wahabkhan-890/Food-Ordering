const ChartCard = ({ title, subtitle, children }) => (
  <div style={{
    background: 'white',
    padding: 25,
    borderRadius: 12,
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.3s'
  }}>
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ margin: 0, color: '#333', fontSize: 18 }}>{title}</h3>
      {subtitle && <p style={{ margin: '5px 0 0 0', color: '#999', fontSize: 13 }}>{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default ChartCard;