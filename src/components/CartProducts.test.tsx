import { render, screen } from '@testing-library/react';
import CartProducts from './CartProducts';
import { BrowserRouter as Router } from 'react-router-dom';

const testProduct = {
  id: 1,
  title: 'car',
  description: 'buy',
  price: 100,
  brand: 'bmw-motors',
  images: ['hop'],
  rating: 1,
  stock: 23,
  thumbnail: 'hop',
  discountPercentage: 1,
  category: 'bmw',
  quantity: 1,
  index: 1,
};

describe('CartProducts component', () => {
  test('renders title correctly', () => {
    render(
      <Router>
        <CartProducts {...testProduct} />
      </Router>
    );
    const carElement = screen.getByText('car');
    expect(carElement).toBeInTheDocument();
  });
  test('renders stock correctly', () => {
    render(
      <Router>
        <CartProducts {...testProduct} />
      </Router>
    );
    const stockNumber = screen.getByText('23', { exact: false });
    expect(stockNumber).toBeInTheDocument();
  });
});
