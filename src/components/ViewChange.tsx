import { Button } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { GridViewRoundedIcon, ViewListRoundedIcon } from '../theme/Icons';
import { CatalogParams } from '../types/CatalogTypes';

export enum ViewParams {
  Default = 'full',
  Full = 'full',
  Short = 'short',
}

interface IViewChange {
  view: ViewParams;
  setView: React.Dispatch<React.SetStateAction<ViewParams>>;
}

const ViewChange = ({ view, setView }: IViewChange) => {
  const [urlParams, setUrlParams] = useSearchParams();

  const viewChangeHandler = (viewClicked: ViewParams) => {
    urlParams.set(CatalogParams.View, viewClicked);
    setUrlParams(urlParams);
    setView(viewClicked);
  };

  return (
    <>
      <Button
        size="large"
        sx={{ minWidth: 'unset', color: view === ViewParams.Short ? 'primary' : 'primary.light' }}
        onClick={() => viewChangeHandler(ViewParams.Short)}>
        <ViewListRoundedIcon />
      </Button>
      <Button
        size="large"
        sx={{ minWidth: 'unset', color: view === ViewParams.Full ? 'primary' : 'primary.light' }}
        onClick={() => viewChangeHandler(ViewParams.Full)}>
        <GridViewRoundedIcon />
      </Button>
    </>
  );
};

export default ViewChange;
