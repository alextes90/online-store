import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CatalogParams } from '../types/CatalogTypes';
import { Product } from '../types/ProductTypes';

export const defaultSortId = 1;
export const defaultSortCb = (a: Product, b: Product) => b.id - a.id;

export type SortParam = {
  id: number;
  value: string;
  label: string;
  cb: (a: Product, b: Product) => number;
};

interface ISortChange {
  sort: number;
  setSort: React.Dispatch<React.SetStateAction<number>>;
}

export const sorts: SortParam[] = [
  {
    id: 1,
    value: 'price-asc',
    label: 'Price ASC',
    cb: (a, b) => a.price - b.price,
  },
  {
    id: 2,
    value: 'price-desc',
    label: 'Price DESC',
    cb: (a, b) => b.price - a.price,
  },
  {
    id: 3,
    value: 'rating-asc',
    label: 'Rating ASC',
    cb: (a, b) => a.rating - b.rating,
  },
  {
    id: 4,
    value: 'rating-desc',
    label: 'Rating DESC',
    cb: (a, b) => b.rating - a.rating,
  },
];

const SortChange = ({ sort, setSort }: ISortChange) => {
  const [urlParams, setUrlParams] = useSearchParams();

  const memoSorts = useMemo(() => {
    return sorts.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {item.label}
      </MenuItem>
    ));
  }, []);

  const sortChangeHandler = (e: SelectChangeEvent<SortParam['id']>) => {
    const clickValue = +e.target.value;
    const sortSelected = sorts.find((item) => item.id === clickValue);
    if (sortSelected) {
      urlParams.set(CatalogParams.Sort, sortSelected.value);
      setUrlParams(urlParams);
      setSort(clickValue);
    }
  };

  return (
    <>
      <FormControl fullWidth>
        <Select id="sort-select" value={sort} onChange={sortChangeHandler} size="small">
          {memoSorts}
        </Select>
      </FormControl>
    </>
  );
};

export default SortChange;
