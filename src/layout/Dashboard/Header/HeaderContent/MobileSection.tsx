import { useEffect, useRef, useState, MouseEvent } from 'react';
import { Theme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

// project imports
import Search from './Search';
import Profile from './Profile';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

// assets
import { MoreOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - MOBILE ||============================== //

/**
 * MobileSection component
 * Displays mobile-specific navigation and actions
 */
const MobileSection = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (): void => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent<HTMLDivElement> | Event): void => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  // Return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef<boolean>(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false && anchorRef.current) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  // Styles
  const styles: { [key: string]: SxProps<Theme> } = {
    mobileSection: {
      display: { xs: 'flex', md: 'none' },
      width: '100%',
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 1200,
      bgcolor: 'background.paper',
      boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: 2,
      py: 1,
    },
    moreButton: {
      ml: 1,
      color: 'text.primary',
      '&:hover': {
        bgcolor: 'action.hover',
      },
    },
    popper: {
      width: '100%',
      zIndex: 1201,
    },
    paper: {
      width: '100%',
      maxWidth: '100%',
      borderRadius: 0,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.2), 0px -4px 5px 0px rgba(0,0,0,0.14), 0px -1px 10px 0px rgba(0,0,0,0.12)',
    },
    content: {
      p: 2,
      '& > *': {
        mb: 2,
        '&:last-child': {
          mb: 0,
        },
      },
    },
  };

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <AppBar component="div" position="fixed" color="inherit" elevation={0} sx={styles.mobileSection}>
          <Toolbar disableGutters sx={styles.toolbar}>
            <Search />
            <IconButton
              component="span"
              variant="light"
              color="secondary"
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              sx={styles.moreButton}
            >
              <MoreOutlined />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Popper
          placement="top-end"
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
          sx={styles.popper}
          popperOptions={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, -8],
                },
              },
            ],
          }}
        >
          {({ TransitionProps }) => (
            <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
              <Paper sx={styles.paper}>
                <ClickAwayListener onClickAway={handleClose}>
                  <Box sx={styles.content}>
                    <Profile />
                  </Box>
                </ClickAwayListener>
              </Paper>
            </Transitions>
          )}
        </Popper>
      </Box>
    </>
  );
};

export default MobileSection;
