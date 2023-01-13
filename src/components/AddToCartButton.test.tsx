import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddToCartButton from './AddToCartButton';

describe('AddToCartComponent component', () => {
  const key = 'OA_cart';
  ////////////////Hard cord id to check from 1 to 25
  const id = 1;

  test('renders button and the text', () => {
    render(<AddToCartButton id={id} />);
    const linkElement = screen.getByText(/Add to cart/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('should add to localStorage on click', () => {
    render(<AddToCartButton id={id} />);
    const buttonElement = screen.getByText('Add to cart');
    userEvent.click(buttonElement);
    const added = JSON.parse(localStorage.getItem(key) || '');
    expect(added[`${id}`]).toBeTruthy();
  });

  test('should change the button from add to cart => drop if item is in localStorage', () => {
    localStorage.setItem(key, JSON.stringify({ [id]: 1 }));
    render(<AddToCartButton id={id} />);
    const dropButton = screen.getByText('Drop');
    expect(dropButton).toBeInTheDocument();
  });

  test('"Add to cart" should be removed from the document onClick', () => {
    render(<AddToCartButton id={id} />);
    const buttonElement = screen.getByRole('button');
    userEvent.click(buttonElement);
    const isButtonElement = screen.queryByText('Add to cart', { exact: false });
    expect(isButtonElement).toBeNull;
  });
});
