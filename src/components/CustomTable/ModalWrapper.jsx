import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Material UI components
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Ant Design Icons
import { CloseOutlined } from '@ant-design/icons';

/**
 * Component lớp khung cho modal, giúp tái sử dụng dễ dàng
 * Chỉ cần truyền content vào là có thể sử dụng
 */
const ModalWrapper = ({
  open,
  title,
  content,
  maxWidth = 'xs',
  fullWidth = true,
  showActions = true,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmButtonProps = { color: 'primary', variant: 'contained' },
  cancelButtonProps = { color: 'inherit', variant: 'outlined' },
  onConfirm,
  onCancel,
  onClose,
  disableBackdropClick = false,
  disableEscapeKeyDown = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === 'backdropClick') {
      return;
    }
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') {
      return;
    }
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    if (!onConfirm) {
      setIsOpen(false);
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      aria-labelledby="modal-dialog-title"
      PaperProps={{
        sx: {
          width: '100%',
          margin: '0 auto'
        }
      }}
    >
      <DialogTitle id="modal-dialog-title">
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{title}</Typography>
          <IconButton edge="end" color="inherit" onClick={handleCancel} aria-label="close">
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>{content}</DialogContent>
      {showActions && (
        <DialogActions>
          <Button onClick={handleCancel} {...cancelButtonProps}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} {...confirmButtonProps}>
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

ModalWrapper.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  showActions: PropTypes.bool,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmButtonProps: PropTypes.object,
  cancelButtonProps: PropTypes.object,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  disableBackdropClick: PropTypes.bool,
  disableEscapeKeyDown: PropTypes.bool
};

export default ModalWrapper;
