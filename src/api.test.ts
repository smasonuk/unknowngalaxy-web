import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchInbox, transmitCommand, type StoredMessage } from './api';

describe('api service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('fetchInbox should fetch messages for a player', async () => {
    const mockMessages: StoredMessage[] = [
      {
        timestamp: '2026-02-28T14:00:00Z',
        senderId: 'Voyager-1',
        type: 'text',
        data: 'Hello from deep space',
      },
    ];

    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockMessages,
    });

    const result = await fetchInbox('Earth');

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/inbox?player=Earth');
    expect(result).toEqual(mockMessages);
  });

  it('transmitCommand should post a command', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
    });

    await transmitCommand('Earth', 'Voyager-1', 'TAKE_PICTURE');

    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/transmit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: 'Earth',
        targetId: 'Voyager-1',
        command: 'TAKE_PICTURE',
      }),
    });
  });
});
