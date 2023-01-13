import { Button, Input, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartSettings, ICartHeader } from '../types/CartTypes';

const CartHeader = (props: ICartHeader) => {
  const location = useLocation()?.search;
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location);
  let limitParam = '';
  let pageParam = '';
  let itemPerPage: number;

  if (searchParams.get('limit') != null) {
    limitParam = searchParams.get('limit') as string;
  }

  if (searchParams.get('page') != null) {
    pageParam = searchParams.get('page') as string;
  }
  const page = pageParam ? +pageParam : 1;
  let curPage = page;
  const limit = limitParam ? +limitParam : CartSettings.perPage;

  if (limitParam && pageParam && Math.ceil(props.length / +limitParam) < +pageParam) {
    let newPath = location;
    newPath = location.replace(`page=${pageParam}`, `page=${Math.ceil(props.length / +limitParam).toString()}`);
    navigate(newPath);
  }

  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let newPath = location;
    itemPerPage = +event.target.value;
    if (location && location.includes('page=')) {
      newPath += '&';
    } else newPath += '?';
    if (location && location.includes('limit=')) {
      newPath = location.replace(`limit=${limitParam}`, `limit=${itemPerPage.toString()}`);
    } else newPath += `limit=${itemPerPage.toString()}`;
    navigate(newPath);
  }

  function onBackHandler(): void {
    if (curPage > 1) {
      curPage--;
      let newPath = location;
      if (location && location.includes('limit=')) {
        newPath += '&';
      } else newPath += '?';
      if (location && location.includes('page=')) {
        newPath = location.replace(`page=${pageParam}`, `page=${curPage.toString()}`);
      } else newPath += `page=${curPage.toString()}`;
      navigate(newPath);
    }
  }

  function onForwardHandler(): void {
    if (props.length && curPage < Math.ceil(props.length / limit)) {
      curPage++;
      let newPath = location;
      if (location && location.includes('limit=')) {
        newPath += '&';
      } else newPath += '?';
      if (location && location.includes('page=')) {
        newPath = location.replace(`page=${pageParam}`, `page=${curPage.toString()}`);
      } else newPath += `page=${curPage.toString()}`;
      navigate(newPath);
    }
  }

  return (
    <Grid container justifyContent="space-between" mb={1} width="auto" alignItems="center">
      <Grid item>Products in Cart</Grid>
      <Grid item container spacing={2} width="auto" alignItems="center">
        <Grid item>
          <span>Items: </span>
          <Input
            size="small"
            type="number"
            onChange={onChangeHandler}
            defaultValue={`${limit}`}
            sx={{ width: 50 }}
            inputProps={{ min: 1, max: props.length }}
          />
        </Grid>
        <Grid item container width="auto">
          <Grid item>
            Page:
            <Button onClick={onBackHandler}>{`<`}</Button>
          </Grid>
          <Grid item>
            {page}
            <Button onClick={onForwardHandler}>{`>`}</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CartHeader;
