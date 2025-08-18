import PropTypes from 'prop-types';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Collapse } from '@mui/material';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
// project imports
import IconButton from '../../../../../@extended/IconButton';

import { handlerDrawerOpen, useGetMenuMaster } from '../../../../../../../infrastructure/utils/menu';

// Icon ant design
import { DownOutlined } from '@ant-design/icons';
import { RightOutlined } from '@ant-design/icons';

// Hooks
import { useRef, useState } from 'react';
import NavSubMenu from './NavSubMenu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

export default function NavItem({ item, level, isParents = false, setSelectedID }) {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  console.log('item navitem', item);

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const itemHandler = () => {
    if (downLG) handlerDrawerOpen(false);

    if (isParents && setSelectedID) {
      setSelectedID(item.id);
    }
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon
      style={{
        fontSize: drawerOpen ? '1rem' : '1.25rem',
        ...(isParents && { fontSize: 20, stroke: '1.5' })
      }}
    />
  ) : (
    false
  );

  const { pathname } = useLocation();
  const path = item?.link || item?.url || '';
  const isSelected = path ? !!matchPath({ path, end: false }, pathname) : false;
  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  /**
   *
   *<=================== Condition dynamic dashboard (side bar) ===================>
   *
   */
  const [isOpen, setIsOpen] = useState(false);
  const hasChild = Array.isArray(item.children) && item.children.length > 0;
  const showIcon = Array.isArray(item.children) && item.children.length > 0 && !item.children.every((child) => child.type === 'button');
  const isSubMenu = hasChild && item.children.some((child) => child.type !== 'button');

  // Condition dynamic dashboard (popup)
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isHoverable, setIsHoverable] = useState(true);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHoverable(true);
    hoverTimeoutRef.current = setTimeout(() => {
      setShowSubMenu(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsHoverable(false);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setShowSubMenu(false);
    }, 100); // Delay 100ms when mouse leaves
  };

  const handleClick = (e) => {
    if (isSubMenu && drawerOpen) {
      e.preventDefault();
      setIsOpen((prev) => !prev); // Ony navigate when there is no submenu
    } else if (!isSubMenu) {
      itemHandler();
    }
  };
  const buttonRef = useRef();
  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <ListItemButton
          ref={buttonRef}
          component={Link}
          to={item.url}
          target={itemTarget}
          disabled={item.disabled}
          selected={isSelected}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={(theme) => ({
            zIndex: 1201,
            pl: drawerOpen ? `${level * 28}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
            ...(drawerOpen && {
              '&:hover': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'divider' }) },
              '&.Mui-selected': {
                bgcolor: 'primary.lighter',
                ...theme.applyStyles('dark', { bgcolor: 'divider' }),
                borderRight: '2px solid',
                borderColor: 'primary.main',
                color: iconSelectedColor,
                '&:hover': { color: iconSelectedColor, bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'divider' }) }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': { bgcolor: 'transparent' },
              '&.Mui-selected': { '&:hover': { bgcolor: 'transparent' }, bgcolor: 'transparent' }
            })
          })}
        >
          {itemIcon && level === 1 && (
            <ListItemIcon
              sx={(theme) => ({
                minWidth: 28,
                color: isSelected ? iconSelectedColor : textColor,
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { bgcolor: 'secondary.lighter', ...theme.applyStyles('dark', { bgcolor: 'secondary.light' }) }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: 'primary.lighter',
                    ...theme.applyStyles('dark', { bgcolor: 'primary.900' }),
                    '&:hover': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'primary.darker' }) }
                  })
              })}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {/* Popper submenu */}
          {hasChild && !drawerOpen && (
            <Popper
              open={showSubMenu}
              anchorEl={buttonRef.current}
              placement="right-start"
              disablePortal={false}
              style={{ zIndex: 2100, pointerEvents: isHoverable ? 'auto' : 'none' }}
              onMouseEnter={handleMouseEnter}
              transition
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} style={{ transformOrigin: 'top left' }} timeout={200}>
                  <Box
                    sx={{
                      mt: level == 1 ? 1 : 0
                    }}
                  >
                    <NavSubMenu
                      items={item.children.filter((child) => child.type != 'button')}
                      level={level + 1}
                      setSelectedID={setSelectedID}
                    />
                  </Box>
                </Grow>
              )}
            </Popper>
          )}

          {/* Show popup */}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
                    {item.title}
                  </Typography>

                  {hasChild && !drawerOpen && (
                    <RightOutlined
                      style={{
                        fontSize: '12px',
                        transition: 'transform 0.2s'
                      }}
                    />
                  )}
                </Box>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}

          {/* Show icon  */}
          {showIcon && drawerOpen && (
            <Fade in={drawerOpen} timeout={300} unmountOnExit>
              <Box sx={{ marginRight: '2px' }}>
                <DownOutlined
                  style={{
                    fontSize: '12px',
                    transition: 'transform 0.2s',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}
                />
              </Box>
            </Fade>
          )}
        </ListItemButton>

        {/* Collapse for open drawer */}
        {drawerOpen && hasChild && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Box>
              {item.children.map((child, id) => {
                if (child.type !== 'button') {
                  return <NavItem key={id} item={child} level={level} isParents={false} setSelectedID={setSelectedID} />;
                }
              })}
            </Box>
          </Collapse>
        )}

        {(drawerOpen || (!drawerOpen && level !== 1)) &&
          item?.actions &&
          item?.actions.map((action, index) => {
            const ActionIcon = action.icon;
            const callAction = action?.function;
            return (
              <IconButton
                key={index}
                {...(action.type === 'function' && {
                  onClick: (event) => {
                    event.stopPropagation();
                    callAction();
                  }
                })}
                {...(action.type === 'link' && {
                  component: Link,
                  to: action.url,
                  target: action.target ? '_blank' : '_self'
                })}
                color="secondary"
                variant="outlined"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 20,
                  zIndex: 1202,
                  width: 20,
                  height: 20,
                  mr: -1,
                  ml: 1,
                  color: 'secondary.dark',
                  borderColor: isSelected ? 'primary.light' : 'secondary.light',
                  '&:hover': { borderColor: isSelected ? 'primary.main' : 'secondary.main' }
                }}
              >
                <ActionIcon style={{ fontSize: '0.625rem' }} />
              </IconButton>
            );
          })}
      </Box>
    </>
  );
}

NavItem.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.oneOfType([PropTypes.func, PropTypes.any])
};
