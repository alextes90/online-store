import { Grid, Typography } from '@mui/material';

function ErrorPage() {
  return (
    <Grid container alignItems="center" justifyContent="center" direction="column" sx={{ height: '100vh' }}>
      <Typography variant="h1" component="span">
        404
      </Typography>
      <p>Sorry, an unexpected error has occurred.</p>
    </Grid>
  );
}

export default ErrorPage;
