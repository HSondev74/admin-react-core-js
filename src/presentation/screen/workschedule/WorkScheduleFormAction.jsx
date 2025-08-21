/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from 'react';
import workScheduleApi from '../../../infrastructure/api/http/workschedule';

// Material UI components
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { SearchOutlined } from '@ant-design/icons';

// third-party
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

// style
import { formStyles, formViewStyles } from '../../assets/styles/formStyles';
import { Checkbox } from '@mui/material';
import usersApi from '../../../infrastructure/api/http/users';
import { debounce } from 'lodash-es';

const WorkScheduleFormAction = ({ item, onClose, onSubmit, title, isView, isAssignSchedule }) => {
  const [schedule, setSchedule] = useState(item);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalItems: 0
  });
  const isUpdate = !!item;

  // Lấy danh sách user để gán lịch làm việc
  const fetchAvailableUsers = useCallback(
    async (params = {}) => {
      if (!isAssignSchedule) return;
      setLoading(true);
      try {
        const reqBody = {
          page: params.page !== undefined ? params.page + 1 : pagination.page + 1,
          size: params.size || pagination.size
        };

        if (params.searchTerm) {
          reqBody.searchTerm = params.searchTerm;
        }

        const response = await usersApi.getListUser(reqBody);

        const responseData = response?.data?.data;
        setUserList(responseData?.content || []);
        setPagination((prev) => ({
          ...prev,
          page: responseData?.pageNumber !== undefined ? responseData.pageNumber - 1 : params.page !== undefined ? params.page : prev.page,
          size: responseData?.pageSize || params.size || prev.size,
          totalItems: responseData?.totalElements || 0
        }));
      } catch (error) {
        setUserList([]);
      } finally {
        setLoading(false);
      }
    },
    [isAssignSchedule]
  );

  // Debounce search
  const debouncedSearch = useMemo(
    () =>
      debounce((searchValue) => {
        if (isAssignSchedule) {
          fetchAvailableUsers({
            searchTerm: searchValue,
            page: 0,
            size: pagination.size
          });
        }
      }, 500),
    [isAssignSchedule, pagination.size]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    if (isAssignSchedule) {
      fetchAvailableUsers({
        page: 0,
        size: 10
      });
    }
  }, [item?.id, isView, isAssignSchedule, fetchAvailableUsers]);

  // form handler
  const handleSubmit = (data) => {
    // Transform workDays data to match API format
    const transformedData = {
      ...data,
      workDays: data.workDays?.map((workDay) => ({
        id: workDay.id,
        dayOfWeek: workDay.dayOfWeek,
        isWorkingDay: workDay.isWorkingDay,
        morningCheckInStart:
          workDay.isWorkingDay && workDay.morningCheckInStart && workDay.morningCheckInStart.trim()
            ? `${workDay.morningCheckInStart}:00`
            : null,
        morningCheckInDeadline:
          workDay.isWorkingDay && workDay.morningCheckInDeadline && workDay.morningCheckInDeadline.trim()
            ? `${workDay.morningCheckInDeadline}:00`
            : null,
        morningCheckOutStart:
          workDay.isWorkingDay && workDay.morningCheckOutStart && workDay.morningCheckOutStart.trim()
            ? `${workDay.morningCheckOutStart}:00`
            : null,
        morningCheckOutDeadline:
          workDay.isWorkingDay && workDay.morningCheckOutDeadline && workDay.morningCheckOutDeadline.trim()
            ? `${workDay.morningCheckOutDeadline}:00`
            : null,
        afternoonCheckInStart:
          workDay.isWorkingDay && workDay.afternoonCheckInStart && workDay.afternoonCheckInStart.trim()
            ? `${workDay.afternoonCheckInStart}:00`
            : null,
        afternoonCheckInDeadline:
          workDay.isWorkingDay && workDay.afternoonCheckInDeadline && workDay.afternoonCheckInDeadline.trim()
            ? `${workDay.afternoonCheckInDeadline}:00`
            : null,
        afternoonCheckOutStart:
          workDay.isWorkingDay && workDay.afternoonCheckOutStart && workDay.afternoonCheckOutStart.trim()
            ? `${workDay.afternoonCheckOutStart}:00`
            : null,
        afternoonCheckOutDeadline:
          workDay.isWorkingDay && workDay.afternoonCheckOutDeadline && workDay.afternoonCheckOutDeadline.trim()
            ? `${workDay.afternoonCheckOutDeadline}:00`
            : null,
        weekPattern: workDay.weekPattern || 'ALL'
      }))
    };

    onSubmit(transformedData);
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangePage = (e, newPage) => {
    fetchAvailableUsers({
      searchTerm: searchTerm,
      page: newPage,
      size: pagination.size
    });
  };

  const handleChangeRowsPerPage = (e) => {
    const newSize = parseInt(e.target.value, 10);
    fetchAvailableUsers({
      searchTerm: searchTerm,
      page: 0,
      size: newSize
    });
  };

  const handleSelectAllClick = (e, setFieldValue, values) => {
    if (e.target.checked) {
      const newSelecteds = userList.map((user) => user.id);
      setFieldValue('userIds', [...new Set([...values.userIds, ...newSelecteds])]);
      return;
    }
    const currentPageUserIds = userList.map((user) => user.id);
    setFieldValue(
      'userIds',
      values.userIds.filter((id) => !currentPageUserIds.includes(id))
    );
  };

  const handleClick = (event, userId, setFieldValue, values) => {
    const selectedIndex = values.userIds.indexOf(userId);
    let newSelected = [...values.userIds];

    if (selectedIndex === -1) {
      newSelected.push(userId);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setFieldValue('userIds', newSelected);
  };

  const isAllCurrentPageSelected = (values) => {
    return userList.length > 0 && userList.every((user) => values.userIds.includes(user.id));
  };

  const isSomeCurrentPageSelected = (values) => {
    return userList.some((user) => values.userIds.includes(user.id)) && !isAllCurrentPageSelected(values);
  };

  // Default workDays structure
  const getDefaultWorkDays = () => {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return days.map((day, index) => {
      const existingWorkDay = schedule?.workDays?.find((wd) => wd.dayOfWeek === day);
      const isWorkingDay = existingWorkDay?.workingDay ?? index < 5;

      return {
        id: existingWorkDay?.id || null,
        dayOfWeek: day,
        isWorkingDay: isWorkingDay,
        morningCheckInStart: isWorkingDay ? existingWorkDay?.morningCheckInStart?.substring(0, 5) || '08:00' : '',
        morningCheckInDeadline: isWorkingDay ? existingWorkDay?.morningCheckInDeadline?.substring(0, 5) || '08:15' : '',
        morningCheckOutStart: isWorkingDay ? existingWorkDay?.morningCheckOutStart?.substring(0, 5) || '12:00' : '',
        morningCheckOutDeadline: isWorkingDay ? existingWorkDay?.morningCheckOutDeadline?.substring(0, 5) || '12:30' : '',
        afternoonCheckInStart:
          isWorkingDay && (index < 5 || existingWorkDay?.afternoonCheckInStart)
            ? existingWorkDay?.afternoonCheckInStart?.substring(0, 5) || '13:30'
            : '',
        afternoonCheckInDeadline:
          isWorkingDay && (index < 5 || existingWorkDay?.afternoonCheckInDeadline)
            ? existingWorkDay?.afternoonCheckInDeadline?.substring(0, 5) || '13:45'
            : '',
        afternoonCheckOutStart:
          isWorkingDay && (index < 5 || existingWorkDay?.afternoonCheckOutStart)
            ? existingWorkDay?.afternoonCheckOutStart?.substring(0, 5) || '17:30'
            : '',
        afternoonCheckOutDeadline:
          isWorkingDay && (index < 5 || existingWorkDay?.afternoonCheckOutDeadline)
            ? existingWorkDay?.afternoonCheckOutDeadline?.substring(0, 5) || '18:00'
            : '',
        weekPattern: existingWorkDay?.weekPattern || 'ALL'
      };
    });
  };

  const initialValues = isAssignSchedule
    ? { scheduleId: schedule?.id, userIds: [] }
    : {
        id: schedule?.id || '',
        name: schedule?.name || '',
        description: schedule?.description || '',
        timezone: schedule?.timezone || 'Asia/Ho_Chi_Minh',
        minimumWorkHours: schedule?.minimumWorkHours || 8,
        maxLunchBreakMinutes: schedule?.maxLunchBreakMinutes || 90,
        flexibleTimeEnabled: schedule?.flexibleTimeEnabled !== undefined ? schedule.flexibleTimeEnabled : false,
        flexibleMinutes: schedule?.flexibleMinutes || 15,
        active: schedule?.active !== undefined ? schedule.active : true,
        default: schedule?.default !== undefined ? schedule.default : false,
        workDays: getDefaultWorkDays()
      };

  const validationSchema = !isView
    ? isAssignSchedule
      ? Yup.object().shape({
          userIds: Yup.array().min(1, 'Vui lòng chọn ít nhất một người dùng').required('Danh sách người dùng là bắt buộc')
        })
      : Yup.object().shape({
          name: Yup.string().max(255, 'Tên lịch làm việc không được vượt quá 255 ký tự').required('Tên lịch làm việc là bắt buộc'),
          description: Yup.string().max(500, 'Mô tả không được vượt quá 500 ký tự'),
          timezone: Yup.string().required('Múi giờ là bắt buộc'),
          minimumWorkHours: Yup.number()
            .min(1, 'Giờ làm tối thiểu phải lớn hơn 0')
            .max(24, 'Giờ làm tối thiểu không được vượt quá 24')
            .required('Giờ làm tối thiểu là bắt buộc'),
          maxLunchBreakMinutes: Yup.number()
            .min(0, 'Thời gian nghỉ trưa không được âm')
            .max(480, 'Thời gian nghỉ trưa không được vượt quá 8 tiếng')
            .required('Thời gian nghỉ trưa tối đa là bắt buộc'),
          flexibleMinutes: Yup.number()
            .min(0, 'Thời gian linh hoạt không được âm')
            .max(60, 'Thời gian linh hoạt không được vượt quá 60 phút'),
          workDays: Yup.array().of(
            Yup.object().shape({
              morningCheckInStart: Yup.string().when('isWorkingDay', {
                is: true,
                then: (schema) => schema.required('Giờ vào ca sáng là bắt buộc'),
                otherwise: (schema) => schema.nullable()
              }),
              morningCheckInDeadline: Yup.string().when('isWorkingDay', {
                is: true,
                then: (schema) => schema.required('Deadline vào ca sáng là bắt buộc'),
                otherwise: (schema) => schema.nullable()
              }),
              morningCheckOutStart: Yup.string().when('isWorkingDay', {
                is: true,
                then: (schema) => schema.required('Giờ ra ca sáng là bắt buộc'),
                otherwise: (schema) => schema.nullable()
              }),
              morningCheckOutDeadline: Yup.string().when('isWorkingDay', {
                is: true,
                then: (schema) => schema.required('Deadline ra ca sáng là bắt buộc'),
                otherwise: (schema) => schema.nullable()
              })
            })
          )
        })
    : null;

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            {!isAssignSchedule ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên lịch làm việc"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    error={Boolean(touched.name && errors.name)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.name && errors.name}</FormHelperText>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    name="description"
                    multiline
                    rows={3}
                    value={values.description}
                    onChange={handleChange}
                    error={Boolean(touched.description && errors.description)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.description && errors.description}</FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Múi giờ"
                    name="timezone"
                    value={values.timezone}
                    onChange={handleChange}
                    error={Boolean(touched.timezone && errors.timezone)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.timezone && errors.timezone}</FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Giờ làm tối thiểu"
                    name="minimumWorkHours"
                    type="number"
                    value={values.minimumWorkHours}
                    onChange={handleChange}
                    error={Boolean(touched.minimumWorkHours && errors.minimumWorkHours)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{
                      style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                      readOnly: isView,
                      min: 1,
                      max: 24,
                      step: 0.5
                    }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.minimumWorkHours && errors.minimumWorkHours}</FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Thời gian nghỉ trưa tối đa (phút)"
                    name="maxLunchBreakMinutes"
                    type="number"
                    value={values.maxLunchBreakMinutes}
                    onChange={handleChange}
                    error={Boolean(touched.maxLunchBreakMinutes && errors.maxLunchBreakMinutes)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView, min: 0, max: 480 }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.maxLunchBreakMinutes && errors.maxLunchBreakMinutes}</FormHelperText>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Thời gian linh hoạt (phút)"
                    name="flexibleMinutes"
                    type="number"
                    value={values.flexibleMinutes}
                    onChange={handleChange}
                    error={Boolean(touched.flexibleMinutes && errors.flexibleMinutes)}
                    InputLabelProps={{ style: formStyles.label }}
                    inputProps={{ style: isView ? formViewStyles.inputReadOnly : formStyles.input, readOnly: isView, min: 0, max: 60 }}
                  />
                  <FormHelperText sx={formStyles.helperText}>{touched.flexibleMinutes && errors.flexibleMinutes}</FormHelperText>
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.flexibleTimeEnabled}
                        onChange={(e) => setFieldValue('flexibleTimeEnabled', e.target.checked)}
                        disabled={isView}
                      />
                    }
                    label="Cho phép giờ linh hoạt"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch checked={values.active} onChange={(e) => setFieldValue('active', e.target.checked)} disabled={isView} />
                    }
                    label="Trạng thái hoạt động"
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Switch checked={values.default} onChange={(e) => setFieldValue('default', e.target.checked)} disabled={isView} />
                    }
                    label="Lịch mặc định"
                  />
                </Grid>

                {/* WorkDays Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
                    Chi tiết các ngày làm việc
                  </Typography>

                  {values.workDays.map((workDay, index) => {
                    const dayNames = {
                      MONDAY: 'Thứ 2',
                      TUESDAY: 'Thứ 3',
                      WEDNESDAY: 'Thứ 4',
                      THURSDAY: 'Thứ 5',
                      FRIDAY: 'Thứ 6',
                      SATURDAY: 'Thứ 7',
                      SUNDAY: 'Chủ nhật'
                    };

                    return (
                      <Paper key={workDay.dayOfWeek} sx={{ p: 2, mb: 2, backgroundColor: '#f9f9f9' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                              {dayNames[workDay.dayOfWeek]}
                            </Typography>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={workDay.isWorkingDay}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].isWorkingDay = e.target.checked;
                                    // Clear time fields when not working
                                    if (!e.target.checked) {
                                      newWorkDays[index].morningCheckInStart = '';
                                      newWorkDays[index].morningCheckInDeadline = '';
                                      newWorkDays[index].morningCheckOutStart = '';
                                      newWorkDays[index].morningCheckOutDeadline = '';
                                      newWorkDays[index].afternoonCheckInStart = '';
                                      newWorkDays[index].afternoonCheckInDeadline = '';
                                      newWorkDays[index].afternoonCheckOutStart = '';
                                      newWorkDays[index].afternoonCheckOutDeadline = '';
                                    }
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  disabled={isView}
                                />
                              }
                              label="Ngày làm việc"
                            />
                          </Grid>

                          {workDay.isWorkingDay && (
                            <>
                              <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  Ca sáng
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Vào ca sáng"
                                  type="time"
                                  value={workDay.morningCheckInStart}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].morningCheckInStart = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Deadline vào"
                                  type="time"
                                  value={workDay.morningCheckInDeadline}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].morningCheckInDeadline = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Ra ca sáng"
                                  type="time"
                                  value={workDay.morningCheckOutStart}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].morningCheckOutStart = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Deadline ra"
                                  type="time"
                                  value={workDay.morningCheckOutDeadline}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].morningCheckOutDeadline = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                  Ca chiều
                                </Typography>
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Vào ca chiều"
                                  type="time"
                                  value={workDay.afternoonCheckInStart}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].afternoonCheckInStart = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Deadline vào"
                                  type="time"
                                  value={workDay.afternoonCheckInDeadline}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].afternoonCheckInDeadline = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Ra ca chiều"
                                  type="time"
                                  value={workDay.afternoonCheckOutStart}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].afternoonCheckOutStart = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <TextField
                                  fullWidth
                                  label="Deadline ra"
                                  type="time"
                                  value={workDay.afternoonCheckOutDeadline}
                                  onChange={(e) => {
                                    const newWorkDays = [...values.workDays];
                                    newWorkDays[index].afternoonCheckOutDeadline = e.target.value;
                                    setFieldValue('workDays', newWorkDays);
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                  inputProps={{
                                    style: isView ? formViewStyles.inputReadOnly : formStyles.input,
                                    readOnly: isView
                                  }}
                                  sx={{
                                    '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                      display: 'none'
                                    }
                                  }}
                                  size="small"
                                />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Paper>
                    );
                  })}
                </Grid>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="h6" gutterBottom>
                    Gán lịch làm việc {item?.name || ''} cho người dùng
                  </Typography>

                  {/* Search Field */}
                  <TextField
                    fullWidth
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlined />
                        </InputAdornment>
                      )
                    }}
                    sx={{ mb: 2 }}
                    disabled={isView || loading}
                  />

                  {/* Users Table */}
                  <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table aria-label="user selection table">
                      <TableHead
                        sx={{
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                          '& .MuiTableCell-head': {
                            backgroundColor: 'background.paper',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)'
                          }
                        }}
                      >
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              indeterminate={isSomeCurrentPageSelected(values)}
                              checked={isAllCurrentPageSelected(values)}
                              onChange={(event) => handleSelectAllClick(event, setFieldValue, values)}
                              disabled={isView || loading}
                            />
                          </TableCell>
                          <TableCell>Tên người dùng</TableCell>
                          <TableCell>Email</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              Đang tải...
                            </TableCell>
                          </TableRow>
                        ) : userList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              {searchTerm ? 'Không tìm thấy người dùng phù hợp' : 'Không có người dùng khả dụng'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          userList.map((user) => {
                            const isItemSelected = values.userIds.includes(user.id);
                            return (
                              <TableRow
                                hover
                                onClick={(event) => !isView && handleClick(event, user.id, setFieldValue, values)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={user.id}
                                selected={isItemSelected}
                                sx={{ cursor: isView ? 'default' : 'pointer' }}
                              >
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={isItemSelected}
                                    disabled={isView || loading}
                                    onChange={(event) => handleClick(event, user.id, setFieldValue, values)}
                                  />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {user.name || 'N/A'}
                                </TableCell>
                                <TableCell>{user.email || 'N/A'}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={pagination.totalItems}
                    rowsPerPage={pagination.size}
                    page={pagination.page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số hàng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count !== -1 ? count : `hơn ${to}`}`}
                  />

                  {/* Selected Count */}
                  {values.userIds.length > 0 && (
                    <Typography variant="body2" sx={{ mt: 1, color: 'primary.main' }}>
                      Đã chọn: {values.userIds.length} người dùng
                    </Typography>
                  )}
                </FormControl>
                <FormHelperText sx={formStyles.helperText}>{touched.userIds && errors.userIds}</FormHelperText>
              </Grid>
            )}

            {!isView && ( // Chỉ hiển thị button khi không phải chế độ xem
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={formStyles.button}>
                  Hủy
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={formStyles.button}>
                  {isUpdate ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Box>
            )}
            {isView && ( // Hiển thị button đóng khi ở chế độ xem
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onClose} sx={formStyles.button}>
                  Đóng
                </Button>
              </Box>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default WorkScheduleFormAction;
