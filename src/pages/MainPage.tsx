import { useContext, useEffect, useMemo, useState } from 'react';
import { Link as LinkRouter, useSearchParams } from 'react-router-dom';

import { Product, ProductDetailsLabels } from '../types/ProductTypes';
import { CatalogParams } from '../types/CatalogTypes';

import { Button, Grid, Link as MuiLink, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { brandsContext, categoriesContext, productsContext } from '../context/AppContext';
import ViewChange, { ViewParams } from '../components/ViewChange';
import SortChange, { defaultSortCb, defaultSortId, sorts } from '../components/SortChange';
import CopyToClipboard from '../components/CopyToClipboard';
import ResetFilters from '../components/ResetFilters';
import Search from '../components/Search';
import FilterWithCheckbox from '../components/FilterWithCheckbox';
import FilterWithRangeSlider from '../components/FilterWithRangeSlider';
import { filterDelimiter, FilterNumberParams, FilterStringParams, FilterValue } from '../types/FilterTypes';
import AddToCartButton from '../components/AddToCartButton';

const MainPage = () => {
  const productsAll = useContext(productsContext);
  const brandsAll = useContext(brandsContext);
  const categoriesAll = useContext(categoriesContext);

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [canCopyUrlToClipboard, setCanCopyUrlToClipboard] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<ViewParams>(ViewParams.Default);
  const [sort, setSort] = useState<number>(defaultSortId);
  const [search, setSearch] = useState<string>('');
  const [brands, setBrands] = useState<number[]>([]);
  const [categories, setCategories] = useState<number[]>([]);
  const [price, setPrice] = useState<number[]>([0, 1000000]);
  const [stock, setStock] = useState<number[]>([0, 1000000]);

  const [urlParams, setUrlParams] = useSearchParams();
  const viewParam = urlParams.get(CatalogParams.View) as ViewParams;
  const sortParam = urlParams.get(CatalogParams.Sort);
  const searchParam = urlParams.get(CatalogParams.Search);
  const brandFilterParam = urlParams.get(FilterStringParams.Brand);
  const categoryFilterParam = urlParams.get(FilterStringParams.Cat);
  const priceFilterParam = urlParams.get(FilterNumberParams.Price);
  const stockFilterParam = urlParams.get(FilterNumberParams.Stock);

  useEffect(() => {
    setProducts(productsAll);
    setIsFirstLoad(false);
  }, [productsAll]);

  useEffect(() => {
    if (viewParam) {
      const viewParamsList: string[] = Object.values(ViewParams);
      viewParamsList.includes(viewParam) ? setView(viewParam) : setView(ViewParams.Default);
    } else {
      setView(ViewParams.Default);
    }
  }, [viewParam]);

  useEffect(() => {
    if (sortParam) {
      const sortCurrent = sorts.find((item) => item.value === sortParam);
      setSort(sortCurrent ? sortCurrent.id : defaultSortId);
    } else {
      setSort(defaultSortId);
    }
  }, [sortParam]);

  useEffect(() => {
    if (searchParam) {
      setSearch(searchParam);
    } else setSearch('');
  }, [searchParam]);

  useEffect(() => {
    if (brandFilterParam) {
      const brands = brandFilterParam.split(filterDelimiter).map((item) => +item);
      setBrands(brands);
    } else setBrands([]);
  }, [brandFilterParam]);

  useEffect(() => {
    if (categoryFilterParam) {
      const categories = categoryFilterParam.split(filterDelimiter).map((item) => +item);
      setCategories(categories);
    } else setCategories([]);
  }, [categoryFilterParam]);

  useEffect(() => {
    if (priceFilterParam) {
      const prices = priceFilterParam.split(filterDelimiter).map((item) => +item);
      setPrice(prices);
    }
  }, [priceFilterParam]);

  useEffect(() => {
    if (stockFilterParam) {
      const stocks = stockFilterParam.split(filterDelimiter).map((item) => +item);
      setStock(stocks);
    }
  }, [stockFilterParam]);

  const resetAppHandler = () => {
    const pageParams = [
      CatalogParams.Search,
      CatalogParams.View,
      CatalogParams.Sort,
      FilterStringParams.Brand,
      FilterStringParams.Cat,
      FilterNumberParams.Price,
      FilterNumberParams.Stock,
    ];
    pageParams.forEach((param) => {
      urlParams.delete(param);
    });
    setView(ViewParams.Default);
    setSort(defaultSortId);
    setSearch('');
    setBrands([]);
    setCategories([]);
    setPrice([0, 1000000]);
    setStock([0, 1000000]);
    setUrlParams(urlParams);
  };

  const sortProductsCb = (a: Product, b: Product) => {
    const sortCurrent = sorts.find((item) => item.id === sort);
    if (sortCurrent) {
      return sortCurrent.cb(a, b);
    }
    return defaultSortCb(a, b);
  };

  const searchProductsCb = (product: Product) => {
    const searchFields = [
      'title',
      'description',
      'price',
      'brand',
      'rating',
      'stock',
      'discountPercentage',
      'category',
    ];

    const productFileds = searchFields.map((searchField) => {
      const key = searchField as keyof Product;
      return key in product ? product[key] : '';
    });
    return productFileds.some((field) =>
      field ? field.toString().toLowerCase().includes(search.toLowerCase()) : false
    );
  };

  const filterCb = (
    product: Product,
    filterData: number[],
    productFieldToFilter: Product['brand'],
    allFilterItems: FilterValue[]
  ) => {
    if (!filterData.length) return true;

    const key = productFieldToFilter as `${FilterStringParams}`;
    const item = allFilterItems.find((item) => item.title === product[key]);

    if (item) {
      return filterData.includes(item.id);
    }
  };

  const filterPriceCb = (product: Product) => {
    const [min, max] = price;
    return product.price >= min && product.price <= max;
  };

  const filterStockCb = (product: Product) => {
    const [min, max] = stock;
    return product.stock >= min && product.stock <= max;
  };

  const getProductsShown = (products: Product[]) =>
    products
      .filter(searchProductsCb)
      .filter((product: Product) => filterCb(product, categories, FilterStringParams.Cat, categoriesAll))
      .filter((product: Product) => filterCb(product, brands, FilterStringParams.Brand, brandsAll))
      .filter(filterStockCb)
      .filter(filterPriceCb);

  const productsFiltered = useMemo(() => {
    return getProductsShown(products);
  }, [brands, categories, price, stock, search]);

  const productsToRender = productsFiltered.sort(sortProductsCb).map((item) => {
    return view === ViewParams.Full ? (
      <Grid item key={item.id} xs={12} md={6} lg={4}>
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
          <LinkRouter to={'/product/' + item.id}>
            <Box
              m={2}
              borderRadius={1}
              sx={{
                height: 250,
                backgroundImage: 'url(' + item.thumbnail + ')',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                boxShadow: 3,
              }}
            />
          </LinkRouter>
          <MuiLink
            component={LinkRouter}
            to={'/product/' + item.id}
            variant="h6"
            underline="hover"
            color="black"
            sx={{ m: 2, display: 'block' }}>
            {item.title}
          </MuiLink>
          <Box>
            <Typography gutterBottom variant="body2" component="p" sx={{ m: 0, lineHeight: 1.2 }}>
              {ProductDetailsLabels.Brand}: {item.brand}
            </Typography>
            <Typography gutterBottom variant="body2" component="p" sx={{ m: 0, lineHeight: 1.2 }}>
              {ProductDetailsLabels.Category}: {item.category}
            </Typography>
            <Typography gutterBottom variant="body2" component="p" sx={{ m: 0, lineHeight: 1.2 }}>
              {ProductDetailsLabels.Rating}: {item.rating}
            </Typography>
            <Typography gutterBottom variant="body2" component="p" sx={{ m: 0, lineHeight: 1.2 }}>
              {ProductDetailsLabels.DiscountPercentage}: {item.discountPercentage}
            </Typography>
            <Typography gutterBottom variant="body2" component="p" sx={{ m: 0, lineHeight: 1.2 }}>
              {ProductDetailsLabels.Stock}: {item.stock}
            </Typography>
          </Box>
          <Typography gutterBottom variant="h5" component="div" sx={{ p: 1 }}>
            {ProductDetailsLabels.Currency} {item.price}.00
          </Typography>
          <Grid container gap={1} justifyContent="center" alignItems="center">
            <AddToCartButton id={item.id} />
            <Button size="large" component={LinkRouter} to={'/product/' + item.id}>
              Details
            </Button>
          </Grid>
        </Paper>
      </Grid>
    ) : (
      <Grid item key={item.id} xs={12}>
        <Paper
          elevation={5}
          sx={{
            '&:hover': {
              boxShadow: 8,
            },
            mb: 0,
            backgroundColor: 'white',
            overflow: 'hidden',
          }}>
          <Grid container spacing={{ xs: 2 }} sx={{ p: 2 }} columns={{ xs: 2 }}>
            <Grid item>
              <LinkRouter to={'/product/' + item.id}>
                <Box
                  borderRadius={1}
                  sx={{
                    width: 130,
                    height: 130,
                    backgroundImage: 'url(' + item.thumbnail + ')',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    boxShadow: 3,
                  }}
                />
              </LinkRouter>
            </Grid>
            <Grid container item xs gap={1} justifyContent="space-between">
              <Grid item xs={12} md={7}>
                <Grid container direction="column">
                  <Grid item sx={{ textAlign: 'left' }}>
                    <MuiLink
                      component={LinkRouter}
                      to={'/product/' + item.id}
                      variant="h6"
                      underline="hover"
                      color="black"
                      sx={{ m: 0, display: 'block' }}>
                      {item.title}
                    </MuiLink>
                  </Grid>
                  <Grid item sx={{ textAlign: 'left' }}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Typography gutterBottom variant="body2" component="span" sx={{ m: 0, lineHeight: 1.2 }}>
                          {ProductDetailsLabels.Brand}: {item.brand}
                        </Typography>
                      </Grid>
                      <Grid item>
                        {' '}
                        <Typography gutterBottom variant="body2" component="span" sx={{ m: 0, lineHeight: 1.2 }}>
                          {ProductDetailsLabels.Category}: {item.category}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="body2" component="span" sx={{ m: 0, lineHeight: 1.2 }}>
                          {ProductDetailsLabels.Rating}: {item.rating}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="body2" component="span" sx={{ m: 0, lineHeight: 1.2 }}>
                          {ProductDetailsLabels.DiscountPercentage}: {item.discountPercentage}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography gutterBottom variant="body2" component="span" sx={{ m: 0, lineHeight: 1.2 }}>
                          {ProductDetailsLabels.Stock}: {item.stock}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item sx={{ textAlign: 'left' }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ mt: 1 }}>
                      {ProductDetailsLabels.Currency} {item.price}.00
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item xs={12} md={4} alignItems="center">
                <Grid container gap={1} justifyContent="flex-end" alignItems="center">
                  <AddToCartButton id={item.id} />
                  <Button component={LinkRouter} to={'/product/' + item.id}>
                    Details
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  });

  return (
    <Grid container>
      <Grid container item spacing={2}>
        <Grid item container xs={12} sm={5} md={3} direction="column">
          <Grid item mb={2}>
            <CopyToClipboard
              canCopyUrlToClipboard={canCopyUrlToClipboard}
              setCanCopyUrlToClipboard={setCanCopyUrlToClipboard}
            />
            <ResetFilters resetAppHandler={resetAppHandler} />
          </Grid>
          <Grid item>
            <>
              <FilterWithCheckbox
                filterName={FilterStringParams.Brand}
                productsFiltered={productsFiltered}
                filterData={brandsAll}
              />
              <FilterWithCheckbox
                filterName={FilterStringParams.Cat}
                productsFiltered={productsFiltered}
                filterData={categoriesAll}
              />
              <FilterWithRangeSlider filterName={FilterNumberParams.Price} productsFiltered={productsFiltered} />
              <FilterWithRangeSlider filterName={FilterNumberParams.Stock} productsFiltered={productsFiltered} />
            </>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <Grid container item>
            <Grid container item spacing={{ xs: 2, md: 3 }} alignItems="center" justifyContent="space-between" mb={2}>
              <Grid item>
                <SortChange sort={sort} setSort={setSort} />
              </Grid>
              <Grid item>
                <Search search={search} setSearch={setSearch} />
              </Grid>
              <Grid item>
                <Typography color="primary" fontWeight="bold">
                  Products: {productsToRender.length}
                </Typography>
              </Grid>
              <Grid item>
                <ViewChange view={view} setView={setView} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item spacing={{ xs: 2 }}>
            {!isFirstLoad ? (
              productsToRender.length ? (
                productsToRender
              ) : (
                <Grid item xs>
                  <Paper
                    elevation={5}
                    sx={{
                      '&:hover': {
                        boxShadow: 8,
                      },
                      mb: 0,
                      backgroundColor: 'white',
                      minHeight: 250,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Typography variant="h6" component="span">
                      Ups! No product founded
                    </Typography>
                  </Paper>
                </Grid>
              )
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MainPage;
