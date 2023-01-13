import { Button } from '@mui/material';
import { ContentCopyIcon, ContentCopyRoundedIcon } from '../theme/Icons';

interface ICopyToClipboard {
  canCopyUrlToClipboard: boolean;
  setCanCopyUrlToClipboard: React.Dispatch<React.SetStateAction<boolean>>;
}

const CopyToClipboard = ({ canCopyUrlToClipboard, setCanCopyUrlToClipboard }: ICopyToClipboard) => {
  const copyUrlToClipboardHandler = async () => {
    if (canCopyUrlToClipboard) {
      setCanCopyUrlToClipboard(false);
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setTimeout(() => {
        setCanCopyUrlToClipboard(true);
      }, 800);
    }
  };
  return (
    <Button
      startIcon={canCopyUrlToClipboard ? <ContentCopyIcon /> : <ContentCopyRoundedIcon />}
      size="large"
      onClick={copyUrlToClipboardHandler}
      sx={{ fontWeight: 'bold' }}>
      {canCopyUrlToClipboard ? 'Copy' : 'Copied!'}
    </Button>
  );
};

export default CopyToClipboard;
