import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Register component', () => {
  test('renders button', () => {
    render(
      <Router>
        <Modal />
      </Router>
    );
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
  test('There are no Errors or Invalid', () => {
    render(
      <Router>
        <Modal />
      </Router>
    );
    const errorText = screen.queryByText('Error', { exact: false });
    const invalidText = screen.queryByText('invalid', { exact: false });
    expect(errorText).toBeNull();
    expect(invalidText).toBeNull();
  });

  test('if fields are filled wrong 4*Error should appear', () => {
    render(
      <Router>
        <Modal />
      </Router>
    );
    const buttonElement = screen.getByRole('button');
    userEvent.click(buttonElement);
    const errorArr = screen.getAllByText('error', { exact: false });
    expect(errorArr).toHaveLength(4);
  });

  test('if fields are filled wrong 3*Invalid should appear', () => {
    render(
      <Router>
        <Modal />
      </Router>
    );
    const buttonElement = screen.getByRole('button');
    userEvent.click(buttonElement);
    const errorArr = screen.getAllByText('Invalid', { exact: false });
    expect(errorArr).toHaveLength(3);
  });
});
