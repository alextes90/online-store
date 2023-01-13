import { useContext, useEffect, useMemo, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import { Product } from '../types/ProductTypes';
import { productsContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { FilterCheckbox, filterDelimiter, FilterStringParams, FilterValue } from '../types/FilterTypes';

const FilterWithCheckbox = ({
  filterName,
  productsFiltered,
  filterData,
}: {
  filterName: `${FilterStringParams}`;
  productsFiltered: Product[];
  filterData: FilterValue[];
}) => {
  const productsAll = useContext(productsContext);
  const key = filterName as `${FilterStringParams}`;
  const [filterValues, setFilterValues] = useState<number[]>([]);
  const [urlParams, setUrlParams] = useSearchParams();
  const filterParam = urlParams.get(filterName);

  const memoFilterValues = useMemo(
    () =>
      Array.from(
        new Set<FilterCheckbox['title']>(productsAll.map<FilterCheckbox['title']>((product: Product) => product[key]))
      ).sort(),
    [productsAll]
  );

  const memoFilterItems = useMemo(() => {
    const data: FilterCheckbox[] = [];

    memoFilterValues.forEach((filterValue, i) => {
      const filterValueData = filterData.find((item) => item.title === filterValue);
      const filterValueId = filterValueData ? filterValueData.id : -1;
      const filterValueProductsNum = productsAll.filter((product) => product[key] === filterValue).length;
      const isFilterValueSelected = filterValues.includes(i) ? true : false;
      const productsFilteredForCurrentFilterItem = productsFiltered.filter(
        (product) => product[key] === filterValue
      ).length;

      data.push({
        id: filterValueId,
        title: filterValue,
        products: filterValueProductsNum,
        isCheked: isFilterValueSelected,
        productsFiltered: productsFilteredForCurrentFilterItem,
      });
    });

    return data;
  }, [productsAll, filterName, key, filterValues, filterParam, productsFiltered]);

  useEffect(() => {
    if (filterParam) {
      const filterItemIds = filterParam.split(filterDelimiter).map((item) => +item);
      setFilterValues(filterItemIds);
    } else {
      setFilterValues([]);
    }
  }, [filterParam]);

  const filterElementOnChange = (id: number) => {
    const index = filterValues.indexOf(id);
    const data =
      index >= 0
        ? [...filterValues.slice(id === 0 ? 1 : 0, index), ...filterValues.slice(index + 1)]
        : [...filterValues, id].sort();

    const prepareData = data.join(filterDelimiter);
    prepareData ? urlParams.set(filterName, prepareData) : urlParams.delete(filterName);
    setUrlParams(urlParams);
  };

  const filterItems = memoFilterItems.map((item) => {
    return (
      <Grid
        key={item.id}
        item
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{
          pl: 1,
          pr: 1,
          pt: 0.5,
          pb: 0.5,
          ':hover': {
            backgroundColor: 'neutral.light',
            cursor: 'pointer',
            ' *': {
              color: 'primary.main',
              fontWeight: 'bold',
            },
          },
        }}>
        <Grid item ml={1} sx={{ flex: 1, width: '100%' }}>
          <FormControlLabel
            key={item.id}
            control={
              <Checkbox
                sx={{
                  padding: 0.5,
                  color: item.productsFiltered ? (filterParam ? 'primary.main' : 'body1') : 'neutral.main',
                }}
              />
            }
            checked={item.isCheked}
            label={item.title}
            onChange={() => filterElementOnChange(item.id)}
            sx={{
              color: item.productsFiltered ? (filterParam ? 'primary.main' : 'body1') : 'neutral.main',
              width: '100%',
              ' .MuiFormControlLabel-label': {
                fontWeight: filterParam && item.productsFiltered ? 'bold' : 'inherit',
              },
            }}
          />
        </Grid>
        <Grid item mr={1}>
          <Typography
            color={item.productsFiltered ? (filterParam ? 'primary.main' : 'body1') : 'neutral.main'}
            sx={{ fontWeight: filterParam && item.productsFiltered ? 'bold' : 'inherit' }}>
            {item.productsFiltered} / {item.products}
          </Typography>
        </Grid>
      </Grid>
    );
  });

  const filterNameTitleCase = useMemo(() => filterName.charAt(0).toUpperCase() + filterName.slice(1), [filterName]);

  return (
    <FormGroup sx={{ mb: 2, backgroundColor: 'white', borderRadius: 1, overflow: 'hidden' }}>
      <Typography textAlign="left" fontWeight="bold" m={1.5} mt={1} mb={1}>
        {filterNameTitleCase}
      </Typography>
      <Grid container sx={{ overflow: 'auto', maxHeight: 300 }}>
        {filterItems}
      </Grid>
    </FormGroup>
  );
};

export default FilterWithCheckbox;
