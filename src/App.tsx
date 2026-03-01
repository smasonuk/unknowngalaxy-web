import { useState } from 'react';
import './App.css';
import { fetchInbox, transmitCommand, type StoredMessage } from './api';

function App() {
  const [messages, setMessages] = useState<StoredMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playerId = "simon@earth";
  const targetProbe = "Voyager-1";

  const handleTransmit = async () => {
    setIsTransmitting(true);
    setError(null);
    try {
      await transmitCommand(playerId, targetProbe, "TAKE_PICTURE");
    } catch (err: any) {
      setError(`Transmission Error: ${err.message}`);
    } finally {
      setIsTransmitting(false);
    }
  };

  const handleCheckInbox = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newMessages = await fetchInbox(playerId);
      if (newMessages.length > 0) {
        setMessages(prev => [...newMessages, ...prev]);
      }
    } catch (err: any) {
      setError(`Inbox Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <h1>Deep Space Network Terminal</h1>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleTransmit} 
          disabled={isTransmitting}
          style={{ padding: '10px 20px', fontSize: '1.2em', cursor: 'pointer', backgroundColor: '#333', color: '#0f0', border: '1px solid #0f0' }}
        >
          {isTransmitting ? 'TRANSMITTING...' : 'Transmit TAKE_PICTURE'}
        </button>
        <button 
          onClick={handleCheckInbox} 
          disabled={isLoading}
          style={{ marginLeft: '20px', padding: '10px 20px', fontSize: '1.2em', cursor: 'pointer', backgroundColor: '#333', color: '#0f0', border: '1px solid #0f0' }}
        >
          {isLoading ? 'CHECKING...' : 'Check Inbox'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div style={{ border: '1px solid #0f0', padding: '10px', height: '600px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <p>NO MESSAGES IN QUEUE</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} style={{ marginBottom: '20px', borderBottom: '1px dashed #0f0', paddingBottom: '10px' }}>
              <div>
                <strong>From:</strong> {msg.senderId} | <strong>Timestamp:</strong> {new Date(msg.timestamp).toLocaleString()}
              </div>
              <div style={{ marginTop: '10px' }}>
                {msg.type === 'image' ? (
                  <img 
                    src={`data:image/png;base64,${msg.data}`} 
                    alt="Probe Capture"
                    style={{ imageRendering: 'pixelated', width: '512px', height: '512px', display: 'block' }} 
                  />
                ) : (
                  <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.data}</pre>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
