import { Button } from '@mui/material';
import { RestartAltIcon } from '../theme/Icons';

const ResetFilters = ({ resetAppHandler }: { resetAppHandler: () => void }) => {
  return (
    <Button startIcon={<RestartAltIcon />} size="large" onClick={resetAppHandler} sx={{ fontWeight: 'bold' }}>
      Reset
    </Button>
  );
};

export default ResetFilters;
