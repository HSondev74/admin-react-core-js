// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';
import { JSX } from 'react';

// Styles for the footer
const footerStyles: Record<string, SxProps<Theme>> = {
  root: {
    alignItems: 'center',
    justifyContent: 'space-between',
    p: '24px 16px 0px',
    mt: 'auto',
  },
  linksContainer: {
    gap: 1.5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    color: 'text.primary',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

/**
 * Footer component for the dashboard layout
 * Displays copyright information and links
 */
const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <Stack direction="row" sx={footerStyles.root}>
      <Typography variant="caption">
        © {currentYear} All rights reserved{' '}
        <Link 
          href="https://codedthemes.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          underline="hover"
          sx={footerStyles.link}
        >
          CodedThemes
        </Link>
      </Typography>
      <Stack direction="row" sx={footerStyles.linksContainer}>
        <Link 
          href="https://codedthemes.com/about-us/" 
          target="_blank" 
          rel="noopener noreferrer"
          variant="caption" 
          sx={footerStyles.link}
        >
          About us
        </Link>
        <Link 
          href="https://mui.com/legal/privacy/" 
          target="_blank" 
          rel="noopener noreferrer"
          variant="caption" 
          sx={footerStyles.link}
        >
          Privacy
        </Link>
        <Link 
          href="https://mui.com/store/terms/" 
          target="_blank" 
          rel="noopener noreferrer"
          variant="caption" 
          sx={footerStyles.link}
        >
          Terms
        </Link>
      </Stack>
    </Stack>
  );
};

export default Footer;
