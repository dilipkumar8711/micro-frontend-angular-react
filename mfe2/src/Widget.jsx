import { useState, useEffect } from 'react';

export default function Widget({ user = "User" }) {
  const [receivedData, setReceivedData] = useState('No data received yet');

  useEffect(() => {
    // Access the global event bus
    const eventBus = window.eventBus;
    
    if (eventBus) {
      const subscription = eventBus.subscribe((event) => {
        console.log('[MFE2] Received event:', event);
        
        // Listen for events targeted to MFE2 or broadcasts
        if (event.type === 'shell-to-mfe2' || event.type === 'shell-broadcast' || event.type === 'mfe1-to-mfe2') {
          setReceivedData(`From ${event.source}: ${JSON.stringify(event.data)}`);
        }
      });

      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    } else {
      console.warn('[MFE2] Event bus not available');
    }
  }, []);

  const sendToMFE1 = () => {
    const eventBus = window.eventBus;
    if (eventBus) {
      const data = { message: 'Hello from React MFE2!', timestamp: new Date().toISOString() };
      eventBus.emit('mfe2-to-mfe1', data, 'mfe2');
    }
  };

  const sendToShell = () => {
    const eventBus = window.eventBus;
    if (eventBus) {
      const data = { message: 'Response from React MFE2!', timestamp: new Date().toISOString() };
      eventBus.emit('mfe2-to-shell', data, 'mfe2');
    }
  };

  return (
    <div style={{
      padding: '20px',
      border: '2px solid #FF5722',
      margin: '10px',
      backgroundColor: '#fbe9e7'
    }}>
      <h2 style={{ color: '#FF5722' }}>🔶 React MFE2 Widget</h2>
      <p style={{ color: '#666' }}>Hello {user}, React MFE works!</p>
      
      <div style={{
        margin: '20px 0',
        padding: '15px',
        background: '#fff3cd',
        borderRadius: '4px'
      }}>
        <h3>📡 Send Data:</h3>
        <button
          onClick={sendToMFE1}
          style={{
            margin: '5px',
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send to MFE1
        </button>
        <button
          onClick={sendToShell}
          style={{
            margin: '5px',
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send to Shell
        </button>
      </div>

      <div style={{
        margin: '20px 0',
        padding: '15px',
        background: '#e8f5e9',
        borderRadius: '4px'
      }}>
        <h3>📥 Received Data:</h3>
        <p style={{
          fontFamily: 'monospace',
          background: 'white',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {receivedData}
        </p>
      </div>
    </div>
  );
}
