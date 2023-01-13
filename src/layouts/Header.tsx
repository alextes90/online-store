import { Grid } from '@mui/material';
import Image from 'mui-image';
import { Link } from 'react-router-dom';
import storeLogo from '../assets/logo.png';
import CartInfo from '../components/CartInfo';

const Header = () => {
  return (
    <Grid container direction="row" justifyContent="space-between" alignItems="center" mb={3} mt={3}>
      <Grid item>
        <Link to="/">
          <Image src={storeLogo} alt="Online store"></Image>
        </Link>
      </Grid>
      <Grid item xs={12} sm={8}>
        <CartInfo />
      </Grid>
    </Grid>
  );
};

export default Header;
