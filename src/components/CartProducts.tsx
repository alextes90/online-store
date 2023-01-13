import Image from 'mui-image';
import { Grid, Box, Button, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { ICartProducts, ProductDetailsLabels } from '../types/ProductTypes';

const CartProduct = (props: ICartProducts) => {
  const key = 'OA_cart';
  const store = JSON.parse(localStorage?.getItem(key) || '{}');
  const [quantity, setQuantity] = useState(props.quantity);
  let curQuantity = quantity;
  const onClickRiseHandler = () => {
    if (curQuantity && curQuantity < props.stock) {
      curQuantity++;
    }
    setQuantity(curQuantity);
    if (props.id) {
      localStorage.setItem(key, JSON.stringify({ ...store, [props.id]: curQuantity }));
      window.dispatchEvent(new Event('build'));
    }
  };

  const onClickDecreaseHandler = () => {
    if (curQuantity && curQuantity >= 0) {
      curQuantity--;
    }
    setQuantity(curQuantity);
    if (curQuantity === 0) {
      const tempObj = store;
      delete tempObj[`${props.id}`];
      localStorage.setItem(key, JSON.stringify({ ...tempObj }));
      window.dispatchEvent(new Event('build'));
      window.dispatchEvent(new Event('TheLastItem'));
    } else if (props.id) {
      localStorage.setItem(key, JSON.stringify({ ...store, [props.id]: curQuantity }));
      window.dispatchEvent(new Event('build'));
    }
  };
  return (
    <Paper
      elevation={5}
      sx={{
        mb: 2,
        p: 2,
        backgroundColor: 'white',
        overflow: 'hidden',
      }}>
      <Grid container mb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid item>{props.index + 1}</Grid>
        <Grid item xs={12} md={3}>
          <Image src={`${props.images[0]}`} alt={`${props.title}`} />
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: 'left' }}>
          <Typography variant="h6" component="h2" mb={1}>
            {props.title}
          </Typography>
          <Box mb={2}>{props.description}</Box>
          <Box sx={{ display: 'flex', justifyContent: 'left', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              {ProductDetailsLabels.Brand}: {props.brand}
            </Box>
            <Box>
              {ProductDetailsLabels.Category}: {props.category}
            </Box>
            <Box>
              {ProductDetailsLabels.Rating}: {props.rating}
            </Box>
            <Box>
              {ProductDetailsLabels.DiscountPercentage}: {props.discountPercentage} %
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} sx={{ mt: { xs: 3 } }} container alignItems="center" justifyContent="center">
          <Box>
            {ProductDetailsLabels.Stock}:{props.stock}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Button onClick={onClickRiseHandler}>+</Button>
            <Box>{quantity}</Box>
            <Button onClick={onClickDecreaseHandler}>-</Button>
          </Box>
          <Box>
            {ProductDetailsLabels.Currency}
            {quantity && quantity * props.price}.00
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CartProduct;
