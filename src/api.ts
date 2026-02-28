export interface StoredMessage {
  timestamp: string; // ISO string from Go's time.Time
  senderId: string;
  type: 'image' | 'text';
  data: string; // Base64 string for images, plain string for text
}

const BASE_URL = 'http://localhost:8080/api';

export async function fetchInbox(playerId: string): Promise<StoredMessage[]> {
  const response = await fetch(`${BASE_URL}/inbox?player=${playerId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch inbox: ${response.statusText}`);
  }
  return response.json();
}

export async function transmitCommand(playerId: string, targetId: string, command: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/transmit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerId,
      targetId,
      command,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to transmit command: ${response.statusText}`);
  }
}
