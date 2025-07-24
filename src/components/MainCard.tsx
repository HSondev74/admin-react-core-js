import { forwardRef, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

// Type definitions
interface MainCardProps {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentSX?: SxProps<Theme>;
  darkTitle?: boolean;
  divider?: boolean;
  elevation?: number;
  secondary?: ReactNode;
  shadow?: string;
  sx?: SxProps<Theme>;
  title?: ReactNode | string;
  subheader?: string | ReactNode;
  codeHighlight?: boolean;
  codeString?: string;
  modal?: boolean;
  [key: string]: any; // For any additional props
}

// header style
const headerSX: SxProps<Theme> = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

/**
 * MainCard component that provides a consistent card layout with various customization options
 */
const MainCard = forwardRef<HTMLDivElement, MainCardProps>((
  {
    border = true,
    boxShadow,
    children,
    content = true,
    contentSX = {},
    darkTitle,
    divider = true,
    elevation,
    secondary,
    shadow,
    sx = {},
    title,
    subheader,
    codeHighlight = false,
    codeString,
    modal = false,
    ...others
  },
  ref
) => {
  return (
    <Card
      elevation={elevation || 0}
      ref={ref}
      sx={[
        {
          border: border ? '1px solid' : 'none',
          borderRadius: 2,
          borderColor: (theme) => theme.palette.divider,
          boxShadow: boxShadow ? shadow || '0 2px 14px 0 rgb(32 40 45 / 8%)' : 'inherit',
          position: 'relative',
          ...(modal && {
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 'calc(100% - 32px)', md: 'auto' },
            '& .MuiCardHeader-root': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiTypography-root': {
                color: 'primary.contrastText'
              }
            }
          })
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...others}
    >
      {/* Card header and title */}
      {!darkTitle && title && (
        <CardHeader
          sx={headerSX}
          title={title}
          action={secondary}
          subheader={subheader}
          titleTypographyProps={{ variant: 'h4' }}
        />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={headerSX}
          title={title}
          action={secondary}
          subheader={subheader}
          titleTypographyProps={{ variant: 'h4', color: 'text.primary' }}
        />
      )}

      {/* Content */}
      {content && (
        <CardContent sx={contentSX}>
          {children}
        </CardContent>
      )}
      {!content && children}

      {/* Divider */}
      {divider && <Divider />}

      {/* Code highlight - if needed */}
      {codeHighlight && codeString && (
        <pre style={{ margin: 0, padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <code>{codeString}</code>
        </pre>
      )}
    </Card>
  );
});

export default MainCard;
