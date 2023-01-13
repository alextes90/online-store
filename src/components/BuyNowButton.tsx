import { Button } from '@mui/material';
import { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isModalContext } from '../context/AppContext';

const BuyNowButton = () => {
  const key = 'OA_cart';
  const [productsInLocalStorage, setProductsInLocalStorage] = useState(localStorage.getItem(key));
  const productsInLocalStorageParsed = productsInLocalStorage ? JSON.parse(productsInLocalStorage) : {};
  const id = useParams().id;

  const { setIsModal } = useContext(isModalContext);

  const handleOpen = () => {
    setIsModal(true);
    if (id && !productsInLocalStorageParsed[id]) {
      localStorage.setItem(key, JSON.stringify({ ...productsInLocalStorageParsed, [id]: 1 }));
      setProductsInLocalStorage(JSON.stringify({ ...productsInLocalStorageParsed, [id]: 1 }));
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen} component={Link} to={'/cart'}>
        Buy now
      </Button>
    </>
  );
};

export default BuyNowButton;
