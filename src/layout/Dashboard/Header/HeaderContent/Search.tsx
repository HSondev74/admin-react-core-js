import { FC } from 'react';
import { Theme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

interface SearchProps {
  sx?: SxProps<Theme>;
}

/**
 * Search component for the header
 * Provides a search input field with a search icon
 */
const Search: FC<SearchProps> = ({ sx }) => {
  // Styles
  const styles: { [key: string]: SxProps<Theme> } = {
    root: {
      width: '100%',
      ml: { xs: 0, md: 1 },
      ...sx,
    },
    formControl: {
      width: { xs: '100%', md: 224 },
    },
    input: {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.light',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: 1,
      },
    },
  };

  return (
    <Box sx={styles.root}>
      <FormControl sx={styles.formControl}>
        <OutlinedInput
          size="small"
          id="header-search"
          startAdornment={
            <InputAdornment position="start" sx={{ mr: -0.5, color: 'text.secondary' }}>
              <SearchOutlined />
            </InputAdornment>
          }
          aria-describedby="header-search-text"
          inputProps={{
            'aria-label': 'Search',
          }}
          placeholder="Ctrl + K"
          sx={styles.input}
        />
      </FormControl>
    </Box>
  );
};

export default Search;
