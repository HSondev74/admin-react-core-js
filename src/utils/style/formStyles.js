export const formStyles = {
    label: {
      fontWeight: 'bold',
      fontSize: '0.9rem'
    },
    input: {
      fontSize: '0.8rem',
      padding: '16px 16px'
    },
    helperText: {
      color: 'red',
      fontSize: '0.7rem'
    },
    button: {
      fontSize: '0.9rem'
    }
  };
  
  export const formViewStyles = {
    inputReadOnly: {
      ...formStyles.input,
      backgroundColor: '#f5f5f5',
      color: 'rgba(0, 0, 0, 0.6)'
    },
    passwordInputAdornmentDisabled: {
      opacity: 0.6,
      pointerEvents: 'none' // Ngăn chặn tương tác với icon
    },
    viewButtonContainer: {
      mt: 3,
      display: 'flex',
      justifyContent: 'flex-end'
    },
    viewButton: {
      ...formStyles.button
    }
  };
