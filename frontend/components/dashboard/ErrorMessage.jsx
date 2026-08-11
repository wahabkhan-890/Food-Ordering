const ErrorMessage = ({ message = "Something went wrong!" }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh'
  }}>
    <div style={{
      background: '#fff',
      padding: 30,
      borderRadius: 10,
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderLeft: '5px solid #dc3545'
    }}>
      <h2 style={{ color: '#dc3545', marginBottom: 10 }}>⚠️ Error</h2>
      <p style={{ color: '#666', fontSize: 16 }}>{message}</p>
    </div>
  </div>
);

export default ErrorMessage;