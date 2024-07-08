import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import './matchMedia.mock';
import 'cross-fetch/polyfill';
import 'dotenv/config';
import App from "../src/App";

test("Test App.tsx", async () => {
  const user = userEvent.setup();

  render(<App />);
  //screen.debug(undefined, Infinity);
  
  await user.click(screen.getByRole('button', {name: /Refresh/i}));

  await user.click(screen.getByRole('button', {name: /Add/i}));
  await waitFor(() => {
    expect(screen.queryByText('Add Duty')).toBeInTheDocument();
  });
})
