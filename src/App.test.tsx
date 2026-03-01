import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './api';

vi.mock('./api', () => ({
  fetchInbox: vi.fn(),
  transmitCommand: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and buttons', () => {
    render(<App />);
    expect(screen.getByText(/Deep Space Network Terminal/i)).toBeInTheDocument();
    expect(screen.getByText(/Transmit TAKE_PICTURE/i)).toBeInTheDocument();
    expect(screen.getByText(/Check Inbox/i)).toBeInTheDocument();
  });

  it('calls transmitCommand when Transmit button is clicked', async () => {
    (api.transmitCommand as any).mockResolvedValue(undefined);
    render(<App />);
    
    const transmitBtn = screen.getByText(/Transmit TAKE_PICTURE/i);
    fireEvent.click(transmitBtn);

    expect(api.transmitCommand).toHaveBeenCalledWith("simon@earth", "Voyager-1", "TAKE_PICTURE");
  });

  it('calls fetchInbox and displays messages when Check Inbox is clicked', async () => {
    const mockMessages: api.StoredMessage[] = [
      {
        timestamp: '2026-02-28T14:00:00Z',
        senderId: 'Voyager-1',
        type: 'text',
        data: 'SIGNAL RECEIVED',
      },
    ];
    (api.fetchInbox as any).mockResolvedValue(mockMessages);
    
    render(<App />);
    
    const checkBtn = screen.getByText(/Check Inbox/i);
    fireEvent.click(checkBtn);

    await waitFor(() => {
      expect(screen.getByText(/SIGNAL RECEIVED/i)).toBeInTheDocument();
    });

    expect(api.fetchInbox).toHaveBeenCalledWith("simon@earth");
  });
});
