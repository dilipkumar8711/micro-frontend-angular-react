import { useState, useEffect } from 'react';
import './Widget.css';

export default function Widget({ user = "User" }) {
  const [receivedData, setReceivedData] = useState('No data received yet');

  useEffect(() => {
    // Access the global event bus with namespaced property
    const eventBus = window.__MFE_EVENT_BUS__;
    
    if (!eventBus) {
      console.warn('[MFE2] Event bus not available');
      return;
    }

    let subscription;
    
    try {
      subscription = eventBus.subscribe((event) => {
        // Listen for events targeted to MFE2 or broadcasts
        if (event.type === 'shell-to-mfe2' || event.type === 'shell-broadcast' || event.type === 'mfe1-to-mfe2') {
          try {
            setReceivedData(`From ${event.source}: ${JSON.stringify(event.data)}`);
          } catch (error) {
            console.error('[MFE2] Error processing received event:', error);
            setReceivedData(`Error processing data from ${event.source}`);
          }
        }
      });

      console.info('[MFE2] Connected to global event bus');
    } catch (error) {
      console.error('[MFE2] Failed to subscribe to event bus:', error);
    }

    // Cleanup subscription on unmount
    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  const sendToMFE1 = () => {
    const eventBus = window.__MFE_EVENT_BUS__;
    
    if (!eventBus) {
      console.error('[MFE2] Cannot send message - event bus not available');
      setReceivedData('Error: Event bus not available');
      return;
    }

    try {
      const data = { 
        message: 'Hello from React MFE2!', 
        timestamp: new Date().toISOString() 
      };
      eventBus.emit('mfe2-to-mfe1', data, 'mfe2');
    } catch (error) {
      console.error('[MFE2] Failed to send message to MFE1:', error);
      setReceivedData('Error: Failed to send message to MFE1');
    }
  };

  const sendToShell = () => {
    const eventBus = window.__MFE_EVENT_BUS__;
    
    if (!eventBus) {
      console.error('[MFE2] Cannot send message - event bus not available');
      setReceivedData('Error: Event bus not available');
      return;
    }

    try {
      const data = { 
        message: 'Response from React MFE2!', 
        timestamp: new Date().toISOString() 
      };
      eventBus.emit('mfe2-to-shell', data, 'mfe2');
    } catch (error) {
      console.error('[MFE2] Failed to send message to Shell:', error);
      setReceivedData('Error: Failed to send message to Shell');
    }
  };

  return (
    <div className="widget-container">
      <h2 className="widget-title">🔶 React MFE2 Widget</h2>
      <p className="widget-subtitle">Hello {user}, React MFE works!</p>
      
      <div className="send-section">
        <h3>📡 Send Data:</h3>
        <button
          onClick={sendToMFE1}
          className="btn btn-mfe1"
          aria-label="Send message to MFE1"
          type="button"
        >
          Send to MFE1
        </button>
        <button
          onClick={sendToShell}
          className="btn btn-shell"
          aria-label="Send message to Shell application"
          type="button"
        >
          Send to Shell
        </button>
      </div>

      <div className="received-section">
        <h3>📥 Received Data:</h3>
        <p className="received-data" role="status" aria-live="polite">
          {receivedData}
        </p>
      </div>
    </div>
  );
}

// Made with Bob
