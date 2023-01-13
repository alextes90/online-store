import { Grid, Modal, Paper } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import CartHeader from '../components/CartHeader';
import CartProduct from '../components/CartProducts';
import { useNavigate } from 'react-router';
import SummaryCart from '../components/SummaryCart';
import { useSearchParams } from 'react-router-dom';
import { Product } from '../types/ProductTypes';
import { CartSettings, storeItem } from '../types/CartTypes';
import { isModalContext, productsContext } from '../context/AppContext';
import ModalCart from '../components/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const CartPage = () => {
  const productsAll = useContext(productsContext);
  const key = 'OA_cart';
  const [store, setStore] = useState<string>(() => {
    return JSON.parse(localStorage?.getItem(key) || '{}');
  });
  const [productArr, setProductArr] = useState<Product[]>();
  const totalSum = productArr?.reduce<number>((acc: number, cur: Product) => {
    if (cur.quantity && cur.price) {
      return (acc += +cur?.quantity * +cur?.price);
    }
    return 0;
  }, 0);
  const totalItems = productArr?.reduce<number>((acc: number, cur: Product) => {
    if (cur.quantity && cur.price) {
      return (acc += +cur?.quantity);
    }
    return 0;
  }, 0);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  let limitParam = '';
  let pageParam = '';
  if (searchParams.get('limit') != null) {
    limitParam = searchParams.get('limit') as string;
  }

  if (searchParams.get('page') != null) {
    pageParam = searchParams.get('page') as string;
  }
  const page = pageParam ? +pageParam : 1;
  const itemPerPage = limitParam ? +limitParam : CartSettings.perPage;

  const { isModal, setIsModal } = useContext(isModalContext);
  const handleClose = () => {
    setIsModal(false);
  };

  useEffect(() => {
    (async () => {
      const storeTempArr: storeItem[] = [];
      for (const [productId, value] of Object.entries<string>(store)) {
        storeTempArr.push({ id: +productId, quantity: +value });
      }

      const productsToRender: Product[] = [];
      const result = storeTempArr.map((item) => productsAll.find((product) => product.id === item.id));
      result.forEach((item) => {
        if (item) {
          productsToRender.push({ ...item, quantity: +store[item.id] });
        }
      });
      if (productsToRender.length) {
        setProductArr(productsToRender);
      } else {
        navigate('/cart');
        setProductArr(undefined);
      }
    })();
  }, [store, navigate, totalSum]);

  useEffect(() => {
    const setLocalStorage = () => {
      setStore(JSON.parse(localStorage?.getItem(key) || '{}'));
    };
    const checkTheLastItemHandler = () => {
      if (productArr && productArr.length < +limitParam * +pageParam && +pageParam > 1) {
        console.log('here');
        const tempNewPath = { page: (+pageParam - 1).toString(), limit: limitParam };
        setSearchParams(tempNewPath);
      }
    };
    window.addEventListener('TheLastItem', checkTheLastItemHandler);
    window.addEventListener('build', setLocalStorage);
    return () => {
      window.removeEventListener('build', setLocalStorage);
      window.removeEventListener('TheLastItem', checkTheLastItemHandler);
    };
  }, [store]);

  if (productArr) {
    return (
      <Paper
        elevation={5}
        sx={{
          mb: 2,
          p: 2,
          backgroundColor: 'white',
          overflow: 'hidden',
          height: '100%',
        }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <CartHeader length={productArr.length} />
            {productArr
              .filter((_, index) => {
                return index >= (page - 1) * itemPerPage && index < page * itemPerPage;
              })
              .map((item, index) => {
                return <CartProduct key={item.id} {...item} index={index + (page - 1) * itemPerPage} />;
              })}
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCart totalSum={totalSum ? totalSum : 0} totalItems={totalItems ? totalItems : 0} />
          </Grid>
        </Grid>
        <Modal
          open={isModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description">
          <Paper sx={style}>
            <ModalCart />
          </Paper>
        </Modal>
      </Paper>
    );
  } else return <h1>Cart is empty</h1>;
};

export default CartPage;
