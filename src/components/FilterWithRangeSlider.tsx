import { Box, Slider, Typography } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsContext } from '../context/AppContext';
import { filterDelimiter, FilterNumberParams } from '../types/FilterTypes';
import { Product } from '../types/ProductTypes';

const FilterWithRangeSlider = ({
  filterName,
  productsFiltered,
}: {
  filterName: `${FilterNumberParams}`;
  productsFiltered: Product[];
}) => {
  const [filterValues, setFilterValues] = useState<number[]>([0, 0]);

  const productsAll = useContext(productsContext);
  const key = filterName as `${FilterNumberParams}`;
  const [urlParams, setUrlParams] = useSearchParams();
  const filterParam = urlParams.get(filterName);

  const getMinMaxValue = (products: Product[]) => {
    const sortedProductsByFilterName = products.sort((a, b) => a[key] - b[key]);
    const minValue: number = sortedProductsByFilterName.length ? sortedProductsByFilterName[0][key] : 0;
    const maxValue: number = sortedProductsByFilterName.length
      ? sortedProductsByFilterName[sortedProductsByFilterName.length - 1][key]
      : 0;
    return [minValue, maxValue];
  };

  const memoInitValues = useMemo(() => getMinMaxValue(productsAll), [productsAll]);
  const [minValue, maxValue] = memoInitValues;

  useEffect(() => {
    if (filterParam) {
      const filterParamValues = filterParam.split(filterDelimiter).map((item) => +item);
      setFilterValues(filterParamValues);
    } else if (productsFiltered) {
      setFilterValues(getMinMaxValue(productsFiltered));
    } else {
      setFilterValues(memoInitValues);
    }
  }, [productsFiltered]);

  const filterElementOnChange = (event: Event, newFilterValue: number | number[]) => {
    setFilterValues(newFilterValue as number[]);
    urlParams.set(
      filterName,
      typeof newFilterValue === 'number'
        ? `${newFilterValue}${filterDelimiter}${newFilterValue}`
        : newFilterValue.join(filterDelimiter)
    );
    setUrlParams(urlParams);
  };

  const filterNameTitleCase = useMemo(() => filterName.charAt(0).toUpperCase() + filterName.slice(1), [filterName]);

  return (
    <Box sx={{ pt: 1, pb: 3, pl: 1.5, pr: 1.5, mb: 2, borderRadius: 1, background: 'white' }}>
      <Typography textAlign="left" fontWeight="bold">
        {filterNameTitleCase}
      </Typography>
      <Box sx={{ ml: 2, mr: 2 }}>
        <Slider
          color={productsFiltered.length ? 'primary' : 'secondary'}
          value={filterValues}
          min={minValue}
          step={1}
          max={maxValue}
          onChange={filterElementOnChange}
          valueLabelDisplay="on"
          sx={{
            mt: 2,
            mb: 2,
            '& .MuiSlider-valueLabel': {
              top: 1,
              fontWeight: 'bold',
              backgroundColor: 'unset',
              transform: 'translateY(100%)',
              color: productsFiltered.length ? 'primary.main' : 'secondary.main',
              '&:before': {
                display: 'none',
              },
              '& *': {
                background: 'transparent',
              },
            },
            '& .MuiSlider-valueLabelOpen': {
              transform: 'translateY(100%) !important',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default FilterWithRangeSlider;
