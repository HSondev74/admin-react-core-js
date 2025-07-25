export const pageStyles = {
  root: {
    width: '100%'
  },
  header: {
    mb: 2
  },
  title: {
    fontSize: '1.6vw',
    fontWeight: 'bold',
    variant: 'h2'
  },
  createButton: {
    backgroundColor: 'primary.main',
    variant: 'contained',
    color: 'white',
    width: '8vw',
    height: '3vw',
    fontSize: '0.9vw',
    '&:hover': {
      backgroundColor: 'primary.main',
      opacity: 0.9,
      color: 'white'
    }
  },
  mainCard: {
    mb: 3
  },
  cardHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  searchInput: {
    variant: 'outlined',
    size: 'small',
    width: { xs: '100%', md: '400px' }
  },
  searchInputAdornment: {
    position: 'start'
  },
  searchIcon: {
    fontSize: '16px'
  },
  actionButtons: {
    display: 'flex',
    gap: 30
  },
  filterIcon: {
    marginRight: 10
  },
  collapseDivider: {
    mt: -1,
    mb: 2
  },
  confirmDialogContent: {
    variant: 'body1'
  }
};

export const modalWrapperStyles = {
  paper: {
    width: '35vw',
    margin: '0 auto'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};
