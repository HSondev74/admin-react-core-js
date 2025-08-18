import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { ClockCircleOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import timeKeepingApi from '../../../infrastructure/api/http/timeKeeping';
import { useNotification } from '../../../contexts/NotificationContext';

const TimeKeepingActionForm = ({ open, onClose, actionType, onSuccess }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  const isCheckIn = actionType === 'CHECK_IN';
  const title = isCheckIn ? 'Check In' : 'Check Out';
  const icon = isCheckIn ? <LoginOutlined /> : <LogoutOutlined />;
  const buttonColor = isCheckIn ? 'success' : 'error';

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const reqBody = {
        notes: note.trim()
      };

      let response;
      if (isCheckIn) {
        response = await timeKeepingApi.checkin(reqBody);
      } else {
        response = await timeKeepingApi.checkoutLegacy(reqBody);
      }

      if (response?.data?.success) {
        showNotification(`${title} thành công!`, 'success');
        setNote('');
        onSuccess?.();
        onClose();
      } else {
        showNotification(response?.data?.message || `${title} thất bại`, 'error');
      }
    } catch (error) {
      console.error(`${title} error:`, error);
      showNotification(error?.response?.data?.message || `Có lỗi xảy ra khi ${title.toLowerCase()}`, 'error');
    } finally {
      setLoading(false);
    }
  }, [note, isCheckIn, title, showNotification, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      setNote('');
      onClose();
    }
  }, [loading, onClose]);

  const handleNoteChange = useCallback((e) => {
    setNote(e.target.value);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 300
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: isCheckIn ? 'success.light' : 'error.light',
              color: isCheckIn ? 'success.dark' : 'error.dark'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            Thời gian: {new Date().toLocaleString('vi-VN')}
          </Typography>

          <TextField
            fullWidth
            label="Ghi chú"
            placeholder={`Nhập ghi chú cho ${title.toLowerCase()}...`}
            value={note}
            onChange={handleNoteChange}
            multiline
            rows={4}
            variant="outlined"
            disabled={loading}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading} variant="contained" color="warning">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color={buttonColor}
          startIcon={loading ? <CircularProgress size={16} /> : icon}
        >
          {loading ? 'Đang xử lý...' : title}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TimeKeepingActionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actionType: PropTypes.oneOf(['CHECK_IN', 'CHECK_OUT']).isRequired,
  onSuccess: PropTypes.func
};

export default TimeKeepingActionForm;
