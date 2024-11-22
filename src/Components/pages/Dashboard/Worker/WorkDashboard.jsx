import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../../../NavBarLogin/NavBar';
import Footer from '../../../FooterDiv/Footer';
import Bookings from './Bookings';
import Schedules from './Schedules';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Rating,
  CircularProgress,
  Alert
} from '@mui/material';
import { API_ENDPOINT } from "../../../../services/config";

const WorkerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_ENDPOINT}/api/Workers/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Worker data:', response.data);
        setWorker(response.data);

        if (response.data?.workerId) {
          fetchBookings(response.data.workerId);
        } else {
          setError('Worker ID not found');
          setLoading(false);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          localStorage.removeItem('userType');
          window.location.href = '/login';
        }
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [token]);

  const fetchBookings = async (workerId) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/api/Booking/worker/${workerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`${API_ENDPOINT}/api/Booking/${bookingId}/status`,
        JSON.stringify(newStatus),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (worker?.workerId) {
        fetchBookings(worker.workerId);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Box p={3}>
      <Alert severity="error">{error}</Alert>
    </Box>
  );

  return (
    <Box className = "w-[85%] m-auto white-color-sl" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Grid container spacing={3}>
          {/* Worker Profile Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Thông tin của tôi
              </Typography>

             
              {worker && (
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <Avatar
                    src={worker.user.profilePicture || 'default-avatar.png'}
                    sx={{ width: 120, height: 120 }}
                  />
                  <Typography variant="h6">
                    {worker.user.fullName}
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body1" gutterBottom>
                      Kinh nghiệm: {worker.experienceYears} năm.
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>Đánh giá:</Typography>
                      <Rating value={worker.rating} readOnly precision={0.5} />
                      <Typography>({worker.rating}/5)</Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Giới thiệu: {worker.bio}
                    </Typography>
                  </Box>
                </Box>
                
              )}
            </Paper>
            <Grid item xs={12}>
                 {worker && <Schedules workerId={worker.workerId} />}
               </Grid>
          </Grid>

          {/* Bookings Section */}
          <Grid item xs={12} md={8}>
            <Bookings 
              bookings={bookings} 
              handleUpdateBookingStatus={handleUpdateBookingStatus}
            />
          </Grid>
          
        </Grid>
        
      </Container>

      <Footer />
    </Box>
  );
};

export default WorkerDashboard;