const LoadingSpinner = ({ message = "Loading..." }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    flexDirection: 'column',
    gap: 15
  }}>
    <div style={{
      width: 50,
      height: 50,
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #0088FE',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <h3 style={{ color: '#666' }}>{message}</h3>
    
    {/* CSS Animation */}
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;