import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  IconButton
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from 'axios';
import { format, addMonths, subMonths } from 'date-fns';
import { API_ENDPOINT } from "../../../../services/config";

const Schedules = ({ workerId }) => {
  const [schedules, setSchedules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const [schedulesResponse, bookingsResponse] = await Promise.all([
          axios.get(`${API_ENDPOINT}/api/WorkerSchedule/worker/${workerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get(`${API_ENDPOINT}/api/Booking/worker/${workerId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        setSchedules(schedulesResponse.data);
        setBookings(bookingsResponse.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (workerId) {
      fetchData();
    }
  }, [workerId]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const getDateStatus = (date) => {
    const dayOfWeek = date.getDay();
    const formattedDate = date.toISOString().split('T')[0];
    
    const daySchedules = schedules.filter(schedule => schedule.dayOfWeek === dayOfWeek);
    const dayBookings = bookings.filter(booking => 
      booking.bookingDate.split('T')[0] === formattedDate
    );

    if (dayBookings.length > 0) {
      const statuses = dayBookings.map(booking => booking.status);
      if (statuses.includes('Accepted')) return 'accepted';
      if (statuses.includes('Pending')) return 'pending';
      if (statuses.includes('Completed')) return 'completed';
      if (statuses.includes('Cancelled')) return 'cancelled';
    }

    return daySchedules.length > 0 ? 'available' : 'unavailable';
  };

  const getScheduleForDate = (date) => {
    const dayOfWeek = date.getDay();
    const formattedDate = date.toISOString().split('T')[0];
    
    const daySchedules = schedules.filter(schedule => schedule.dayOfWeek === dayOfWeek);
    const dayBookings = bookings.filter(booking => 
      booking.bookingDate.split('T')[0] === formattedDate
    );

    return { schedules: daySchedules, bookings: dayBookings };
  };

  const renderScheduleInfo = () => {
    const { schedules: daySchedules, bookings: dayBookings } = getScheduleForDate(selectedDate);

    if (daySchedules.length === 0) {
      return <Typography>Không có lịch trình cho ngày này</Typography>;
    }

    return (
      <>
        {daySchedules.map((schedule, index) => (
          <Box key={index} sx={{ mt: 1 }}>
            <Typography>
              Thời gian: {schedule.startTime.slice(0, -3)} - {schedule.endTime.slice(0, -3)}
            </Typography>
          </Box>
        ))}
        {dayBookings.map((booking, index) => (
          <Box key={`booking-${index}`} sx={{ mt: 1 }}>
            <Typography>
              Trạng thái công việc: {booking.status}
            </Typography>
          </Box>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Lịch ngày
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeftIcon />
          </IconButton>
        </Grid>
        <Grid item xs>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Grid>
      </Grid>

      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateCalendar
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          date={currentMonth}
          sx={{
            '& .MuiPickersDay-root': {
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
              },
            },
            '& .MuiPickersDay-root[data-status="accepted"]': {
              backgroundColor: '#4CAF50',
              color: 'white',
              '&:hover': {
                backgroundColor: '#45a049',
              }
            },
            '& .MuiPickersDay-root[data-status="pending"]': {
              backgroundColor: '#FFC107',
              color: 'black',
              '&:hover': {
                backgroundColor: '#ffb300',
              }
            },
            '& .MuiPickersDay-root[data-status="completed"]': {
              backgroundColor: '#2196F3',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1976D2',
              }
            },
            '& .MuiPickersDay-root[data-status="cancelled"]': {
              backgroundColor: '#9E9E9E',
              color: 'white',
              '&:hover': {
                backgroundColor: '#757575',
              }
            },
            '& .MuiPickersDay-root[data-status="unavailable"]': {
              backgroundColor: '#f5f5f5',
              color: '#bdbdbd',
            }
          }}
          slots={{
            day: (props) => {
              const status = getDateStatus(props.day);
              return (
                <div {...props} data-status={status}>
                  {props.children}
                </div>
              );
            }
          }}
        />
      </LocalizationProvider> */}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Lịch làm việc: {format(selectedDate, 'MMMM dd, yyyy')}:
        </Typography>
        {renderScheduleInfo()}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Legend:
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#4CAF50', borderRadius: '50%' }} />
              <Typography variant="body2">Accepted</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#FFC107', borderRadius: '50%' }} />
              <Typography variant="body2">Pending</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#2196F3', borderRadius: '50%' }} />
              <Typography variant="body2">Completed</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#9E9E9E', borderRadius: '50%' }} />
              <Typography variant="body2">Cancelled</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Schedules;