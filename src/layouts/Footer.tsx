import { Link, Grid } from '@mui/material';
import Image from 'mui-image';
import RSlogo from '../assets/rsschooljs.svg';

const Footer = () => {
  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2} mb={2} fontWeight="600">
      <Grid item>2023</Grid>
      <Grid item>
        <Link href="https://github.com/oibioib" target="_blank" rel="noopener noreferrer" underline="hover">
          oibioib
        </Link>
      </Grid>
      <Grid item>
        <Link href="https://github.com/alextes90" target="_blank" rel="noopener noreferrer" underline="hover">
          alextes90
        </Link>
      </Grid>
      <Grid item>
        <Link href="https://rs.school/js/" target="_blank" rel="noopener noreferrer">
          <Image src={RSlogo} alt={`rs`} height={24} />
        </Link>
      </Grid>
    </Grid>
  );
};

export default Footer;
