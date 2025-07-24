import { forwardRef } from 'react';
import { Theme, styled } from '@mui/material/styles';
import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';

// project imports
import getColors from '@/utils/getColors';

// Type definitions
type AvatarType = 'filled' | 'outlined' | 'combined' | 'default';
type AvatarSize = 'badge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'md2' | 'lg2' | 'xl2' | 'xxl';

interface AvatarProps extends MuiAvatarProps {
  color?: string;
  type?: AvatarType;
  size?: AvatarSize;
  children?: React.ReactNode;
}

// Function to get color styles based on type
const getColorStyle = ({ 
  theme, 
  color = 'primary', 
  type = 'default' 
}: { 
  theme: Theme; 
  color?: string; 
  type?: AvatarType 
}) => {
  const colors = getColors(theme, color);
  const { lighter, light, main, contrastText } = colors;

  switch (type) {
    case 'filled':
      return {
        color: contrastText,
        backgroundColor: main
      };
    case 'outlined':
      return {
        color: main,
        border: '1px solid',
        borderColor: main,
        backgroundColor: 'transparent'
      };
    case 'combined':
      return {
        color: main,
        border: '1px solid',
        borderColor: light,
        backgroundColor: lighter
      };
    default:
      return {
        color: main,
        backgroundColor: lighter
      };
  }
};

// Function to get size styles
const getSizeStyle = (size: AvatarSize = 'md') => {
  switch (size) {
    case 'badge':
      return {
        width: 16,
        height: 16,
        fontSize: '0.625rem'
      };
    case 'xs':
      return {
        width: 24,
        height: 24,
        fontSize: '0.75rem'
      };
    case 'sm':
      return {
        width: 32,
        height: 32,
        fontSize: '0.8125rem'
      };
    case 'lg':
      return {
        width: 52,
        height: 52,
        fontSize: '1.125rem'
      };
    case 'xl':
      return {
        width: 64,
        height: 64,
        fontSize: '1.25rem'
      };
    case 'md2':
      return {
        width: 48,
        height: 48,
        fontSize: '1rem'
      };
    case 'lg2':
      return {
        width: 56,
        height: 56,
        fontSize: '1.125rem'
      };
    case 'xl2':
      return {
        width: 80,
        height: 80,
        fontSize: '1.5rem'
      };
    case 'xxl':
      return {
        width: 96,
        height: 96,
        fontSize: '1.75rem'
      };
    case 'md':
    default:
      return {
        width: 40,
        height: 40,
        fontSize: '0.9375rem'
      };
  }
};

// Styled component with proper TypeScript types
const AvatarStyled = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== 'color' && prop !== 'type' && prop !== 'size',
})<AvatarProps>(({ theme, size = 'md', color = 'primary', type = 'default' }) => ({
  ...getSizeStyle(size as AvatarSize),
  ...getColorStyle({ theme, color, type }),
  '&.MuiAvatar-root': {
    fontWeight: 500,
    textTransform: 'uppercase',
    '&.MuiAvatar-colorDefault': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.grey[200]
    }
  },
  '& .MuiSvgIcon-root': {
    width: '70%',
    height: '70%'
  }
}));

/**
 * Extended Avatar component with additional styling options
 */
const Avatar = forwardRef<HTMLDivElement, AvatarProps>(({ children, color = 'primary', type = 'default', size = 'md', ...others }, ref) => (
  <AvatarStyled ref={ref} color={color} type={type} size={size} {...others}>
    {children}
  </AvatarStyled>
));

export default Avatar;
