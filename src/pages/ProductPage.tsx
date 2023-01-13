import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link as LinkRouter } from 'react-router-dom';
import { Typography, Breadcrumbs, Grid, Paper, Box, ImageList, ImageListItem, Link as MuiLink } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'mui-image';
import { Product, ProductDetailsLabels } from '../types/ProductTypes';
import AddToCartButton from '../components/AddToCartButton';
import BuyNowButton from '../components/BuyNowButton';
import { HomeRoundedIcon } from '../theme/Icons';
import { brandsContext, categoriesContext, productsContext } from '../context/AppContext';
import { FilterStringParams } from '../types/FilterTypes';

const DescriptionItem = styled(Box)(({ theme }) => ({
  ...theme.typography.body1,
  padding: 0,
  textAlign: 'left',
  marginBottom: '1rem',
}));

const ProductPage = () => {
  const productsAll = useContext(productsContext);
  const brandsAll = useContext(brandsContext);
  const categoriesAll = useContext(categoriesContext);
  const [product, setProduct] = useState<Product>();
  const [productImage, setProductImage] = useState<string>();

  const [productBrandId, setProductBrandId] = useState<number>(-1);
  const [productCategoryId, setProductCategoryId] = useState<number>(-1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const productAvailable = productsAll.find((product) => product.id === +id);
      if (productAvailable) {
        setProduct(productAvailable);
        setProductImage(productAvailable.images[0]);
        const productBrand = brandsAll.find((brand) => brand.title === productAvailable.brand);
        if (productBrand) {
          setProductBrandId(productBrand.id);
        }
        const productCategory = categoriesAll.find((category) => category.title === productAvailable.category);
        if (productCategory) {
          setProductCategoryId(productCategory.id);
        }
      } else {
        navigate('/error', { replace: true });
      }
    }
  }, [id, navigate]);

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    const clickedImage = event.target as HTMLImageElement;
    setProductImage(`${clickedImage.src}`);
  }

  if (product) {
    return (
      <div>
        <Paper
          elevation={5}
          sx={{
            '&:hover': {
              boxShadow: 8,
            },
            mb: 2,
            backgroundColor: 'white',
            overflow: 'hidden',
            height: '100%',
          }}>
          <Grid container p={2}>
            <Grid item xs={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <MuiLink component={LinkRouter} to={'/'} underline="hover" sx={{ m: 0, display: 'block' }}>
                  <HomeRoundedIcon
                    sx={{
                      m: 0,
                      fontSize: '1rem',
                      lineHeight: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': { color: 'primary.light' },
                    }}
                  />
                </MuiLink>
                <MuiLink
                  component={LinkRouter}
                  to={productCategoryId >= 0 ? `/?${FilterStringParams.Cat}=${productCategoryId}` : '/'}
                  underline="hover">
                  {product.category}
                </MuiLink>
                <MuiLink
                  component={LinkRouter}
                  to={productBrandId >= 0 ? `/?${FilterStringParams.Brand}=${productBrandId}` : '/'}
                  underline="hover">
                  {product.brand}
                </MuiLink>
                <Typography color="text.primary">{product.title}</Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'left' }}>
                <Typography gutterBottom variant="h4" component="h1" sx={{ mt: 1, mb: 1 }}>
                  {product.brand} {product.title}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} container spacing={2}>
              <Grid item container xs={12} md={6} spacing={2}>
                <Grid item xs={2} alignSelf="center">
                  <Box onClick={handleClick}>
                    <ImageList cols={1}>
                      {product.images.map((item) => (
                        <ImageListItem sx={{ mb: 1, '&:hover': { cursor: 'pointer' } }} key={item}>
                          <img src={`${item}`} srcSet={`${item}`} alt={item} loading="lazy" />
                        </ImageListItem>
                      ))}
                    </ImageList>
                  </Box>
                </Grid>
                <Grid item xs={9}>
                  <Image src={`${productImage}`} alt={`${product.title}`} />
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <DescriptionItem>
                  {ProductDetailsLabels.Description}: {product.description}
                </DescriptionItem>
                <DescriptionItem>
                  {ProductDetailsLabels.DiscountPercentage}: {product.discountPercentage}
                </DescriptionItem>
                <DescriptionItem>
                  {ProductDetailsLabels.Rating}: {product.rating}
                </DescriptionItem>
                <DescriptionItem>
                  {ProductDetailsLabels.Stock}: {product.stock}
                </DescriptionItem>
                <DescriptionItem>
                  {ProductDetailsLabels.Brand}: {product.brand}
                </DescriptionItem>
                <DescriptionItem>
                  {ProductDetailsLabels.Category}: {product.category}
                </DescriptionItem>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography variant="h5" component="p" sx={{ mt: 1, mb: 1 }}>
                    {ProductDetailsLabels.Currency} {product.price}.00
                  </Typography>
                  <Box m={2}>
                    <AddToCartButton id={id ? +id : 0} />
                  </Box>
                  <Box>
                    <BuyNowButton />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  } else return <></>;
};

export default ProductPage;
