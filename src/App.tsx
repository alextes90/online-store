import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage, CartPage, ProductPage, ErrorPage } from './pages';
import { Layout } from './layouts';
import { useEffect, useState } from 'react';
import { Product } from './types/ProductTypes';
import { getProducts } from './services/ProductsApi';
import { CircularProgress, ThemeProvider } from '@mui/material';
import { Box } from '@mui/system';
import muiThemeSettings from './theme/Theme';
import { FilterCheckbox, FilterStringParams, FilterValue } from './types/FilterTypes';
import { brandsContext, categoriesContext, productsContext, isModalContext } from './context/AppContext';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<FilterValue[]>([]);
  const [categories, setCategories] = useState<FilterValue[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModal, setIsModal] = useState<boolean>(false);

  const { Provider: ProductsProvider } = productsContext;
  const { Provider: BrandsProvider } = brandsContext;
  const { Provider: CategoriesProvider } = categoriesContext;
  const { Provider: IsModalProvider } = isModalContext;

  const getUniqueValues = (products: Product[], param: `${FilterStringParams}`) => {
    const values: FilterValue[] = [];

    Array.from(
      new Set<FilterCheckbox['title']>(products.map<FilterCheckbox['title']>((product: Product) => product[param]))
    )
      .sort()
      .forEach((value, i) =>
        values.push({
          id: i,
          title: value,
        })
      );

    return values;
  };

  useEffect(() => {
    (async () => {
      const products = await getProducts();
      if (products) {
        setProducts(products);
        setBrands(getUniqueValues(products, FilterStringParams.Brand));
        setCategories(getUniqueValues(products, FilterStringParams.Cat));
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    })();
  }, []);

  return isLoading ? (
    <ThemeProvider theme={muiThemeSettings}>
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={70} thickness={3} color="primary" />
      </Box>
    </ThemeProvider>
  ) : (
    <>
      <ProductsProvider value={products}>
        <BrandsProvider value={brands}>
          <CategoriesProvider value={categories}>
            <IsModalProvider value={{ isModal, setIsModal }}>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<MainPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                  </Route>
                  <Route path="*" element={<ErrorPage />} />
                </Routes>
              </Router>
            </IsModalProvider>
          </CategoriesProvider>
        </BrandsProvider>
      </ProductsProvider>
    </>
  );
}

export default App;
