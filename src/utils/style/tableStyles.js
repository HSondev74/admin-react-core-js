export const tableStyles = {
    paper: {
      width: '100%',
      overflow: 'hidden'
    },
    tableContainer: {
      maxHeight: 'calc(100vh - 300px)'
    },
    tableHeadSticky: {
      position: 'sticky',
      top: 0,
      zIndex: 4,
      backgroundColor: '#f5f5f5'
    },
    tableHeadCellExpand: {
      padding: 'checkbox',
      backgroundColor: '#f5f5f5',
      position: 'sticky',
      left: 0,
      zIndex: 3
    },
    tableHeadCellCheckbox: {
      padding: 'checkbox',
      backgroundColor: '#f5f5f5',
      left: 10,
      zIndex: 3
    },
    tableHeadCellData: {
      minWidth: (column) => column.minWidth,
      width: (column) => column.width,
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
      position: 'sticky',
      left: 0,
      zIndex: 3
    },
    tableHeadCellActions: {
      align: 'center',
      maxWidth: { xs: 25, sm: 80 },
      right: 0,
      backgroundColor: '#f5f5f5',
      fontWeight: 'bold',
      zIndex: 2
    },
    tableBodyCellExpand: {
      padding: 'checkbox',
      position: 'sticky',
      left: 0,
      backgroundColor: 'inherit',
      zIndex: 1
    },
    tableBodyCellCheckbox: (isItemSelected, collapsible) => ({
      padding: 'checkbox',
      position: 'sticky',
      left: collapsible ? 40 : 0,
      backgroundColor: 'white',
      zIndex: 1
    }),
    tableBodyCellActions: {
      textAlign: 'center',
      position: 'sticky',
      right: 0,
      backgroundColor: 'white',
      zIndex: 1
    },
    collapsibleRow: {
      paddingBottom: 0,
      paddingTop: 0,
      border: 0
    },
    collapsibleBox: {
      margin: 2
    },
    actionButtonStyle: {
      display: 'flex',
      justifyContent: 'center'
    },
    actionIconButton: {
      padding: '4px'
    },
    actionMenu: {
      MenuListProps: {
        'aria-labelledby': 'basic-button'
      }
    },
    viewMenuItem: {
      color: 'green'
    },
    editMenuItem: {
      color: 'blue'
    },
    deleteMenuItem: {
      color: 'red'
    },
    menuItemIcon: {
      marginRight: 8
    },
    loadingRow: {
      TableCell: {
        textAlign: 'center'
      },
      CircularProgress: {
        size: 40
      },
      Typography: {
        mt: 1
      }
    },
    noDataRow: {
      TableCell: {
        textAlign: 'center'
      },
      Typography: {}
    }
  };
  