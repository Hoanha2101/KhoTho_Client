// CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  Typography,
  Button,
  Box,
  Avatar,
  Rating,
  List,
  ListItem,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Work,
  Payment,
  StarRate,
  History
} from '@mui/icons-material';
import { API_ENDPOINT } from "../../../services/config";

const CustomerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Giả sử userId được lưu trong localStorage sau khi đăng nhập
        const userId = localStorage.getItem('userId');
        
        const [userResponse, jobTypesResponse] = await Promise.all([
          axios.get(`/api/Users/${userId}`),
          axios.get('/api/JobTypes')
        ]);

        setUserData(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleHireWorker = () => {
    // Implement navigation to worker hiring page
  };

  const handleViewHistory = () => {
    // Implement navigation to job history page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Chào mừng, {userData?.fullName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Kho Thợ - Việc làm gấp, thợ tới tấp
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Thuê Thợ Ngay
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Tìm thợ cho công việc của bạn một cách nhanh chóng và đáng tin cậy
            </Typography>
            <Button
              variant="contained"
              startIcon={<Work />}
              onClick={handleHireWorker}
              fullWidth
            >
              Tìm Thợ
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Lịch Sử Công Việc
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Xem lại các công việc đã thực hiện và đánh giá
            </Typography>
            <Button
              variant="outlined"
              startIcon={<History />}
              onClick={handleViewHistory}
              fullWidth
            >
              Xem Lịch Sử
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Công Việc Gần Đây
            </Typography>
            <List>
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <React.Fragment key={job.id}>
                    <ListItem>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle1">
                          {job.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {job.date} - {job.status}
                        </Typography>
                      </Box>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Chưa có công việc nào
                </Typography>
              )}
            </List>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông Tin Tài Khoản
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}
                src={userData?.profilePicture}
              />
              <Typography variant="h6">{userData?.fullName}</Typography>
              <Typography variant="body2" color="textSecondary">
                {userData?.email}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Số điện thoại: {userData?.phoneNumber}
              </Typography>
              <Typography variant="body2">
                <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Địa chỉ: {userData?.address}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerDashboard;