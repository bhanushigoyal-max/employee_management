import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../src/App';
import { api } from '../src/utils/api';
import { MESSAGES } from '../src/lang/messages';

jest.mock('../src/utils/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: { token: 'mock-token', result: [] } })
  }
}));

describe('App', () => {
  it('renders loading state initially then transitions to employee list', async () => {
    render(<App />);
    expect(screen.getByText(MESSAGES.APP.LOADING)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(MESSAGES.APP.LOADING)).not.toBeInTheDocument();
      expect(screen.getByText(MESSAGES.APP.TITLE)).toBeInTheDocument();
    });
  });
});
