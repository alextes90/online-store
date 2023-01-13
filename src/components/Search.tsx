import { FormControl, TextField } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { CatalogParams } from '../types/CatalogTypes';

interface ISearch {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const Search = ({ search, setSearch }: ISearch) => {
  const [urlParams, setUrlParams] = useSearchParams();

  const searchChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const searchValue = e.target.value;
    searchValue ? urlParams.set(CatalogParams.Search, searchValue) : urlParams.delete(CatalogParams.Search);
    setUrlParams(urlParams);
    setSearch(searchValue);
  };
  return (
    <FormControl fullWidth>
      <TextField id="search" value={search} variant="outlined" onChange={searchChangeHandler} size="small" />
    </FormControl>
  );
};

export default Search;
