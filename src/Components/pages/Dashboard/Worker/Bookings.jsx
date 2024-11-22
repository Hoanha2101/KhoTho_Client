import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Button,
  Divider,
  Paper,
  styled,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack
} from '@mui/material';
import { AccessTime, AttachMoney, Notes, FilterList, Sort } from '@mui/icons-material';
import { API_ENDPOINT } from "../../../../services/config";

const StatusChip = styled(Box)(({ status }) => {
  const statusColors = {
    pending: { bg: '#fff3e0', color: '#f57c00' },
    accepted: { bg: '#e8f5e9', color: '#2e7d32' },
    rejected: { bg: '#ffebee', color: '#c62828' },
    completed: { bg: '#e3f2fd', color: '#1565c0' }
  };
  const currentStatus = status?.toLowerCase() || 'pending';
  return {
    backgroundColor: statusColors[currentStatus].bg,
    color: statusColors[currentStatus].color,
    padding: '6px 12px',
    borderRadius: '16px',
    fontWeight: 'bold',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.875rem'
  };
});

const BookingCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const IconText = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  marginBottom: 1
});

const Bookings = ({ bookings, handleUpdateBookingStatus }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateSort, setDateSort] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Sort bookings by date
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.bookingDate);
    const dateB = new Date(b.bookingDate);
    return dateSort === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Filter bookings
  const filteredBookings = sortedBookings.filter(booking => {
    const matchesStatus = statusFilter === 'all' || booking.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = booking.bookingID.toString().includes(searchTerm) ||
      booking.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.totalAmount.toString().includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Paginate bookings
  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        Lịch đặt chỗ
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Filters and Search */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Lọc lịch</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xác nhận</MenuItem>
            <MenuItem value="accepted">Đồng ý</MenuItem>
            <MenuItem value="rejected">Không đồng ý</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Xếp theo ngày</InputLabel>
          <Select
            value={dateSort}
            label="Sort by Date"
            onChange={(e) => setDateSort(e.target.value)}
          >
            <MenuItem value="desc">Mới nhất</MenuItem>
            <MenuItem value="asc">Cũ nhất</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Tìm kiếm lịch"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      
      <Box display="flex" flexDirection="column" gap={3}>
        {paginatedBookings.map((booking) => (
          <BookingCard key={booking.bookingID} elevation={2}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" color="primary" fontWeight="medium">
                  Đặt chỗ số #{booking.bookingID}
                </Typography>
                <StatusChip status={booking.status}>
                  {booking.status}
                </StatusChip>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <IconText>
                    <AccessTime color="action" />
                    <Typography>
                      Ngày: {new Date(booking.bookingDate).toLocaleDateString()}
                    </Typography>
                  </IconText>
                  <IconText>
                    <AccessTime color="action" />
                    <Typography>
                      Giờ: {booking.startTime} - {booking.endTime}
                    </Typography>
                  </IconText>
                  <IconText>
                    <AccessTime color="action" />
                    <Typography>
                      Khoảng thời gian: {booking.totalHours} giờ
                    </Typography>
                  </IconText>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <IconText>
                    <AttachMoney color="action" />
                    <Typography>
                      Giá: {booking.hourlyRate}.VND/Giờ
                    </Typography>
                  </IconText>
                  <IconText>
                    <AttachMoney color="action" />
                    <Typography>
                      Thành tiền: ${booking.totalAmount}
                    </Typography>
                  </IconText>
                  <IconText>
                    <Notes color="action" />
                    <Typography>
                      Ghi chú: {booking.notes || 'Không có ghi chú nào được cung cấp'}
                    </Typography>
                  </IconText>
                </Grid>
              </Grid>
            </CardContent>

            <CardActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
              {booking.status === "Pending" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleUpdateBookingStatus(booking.bookingID, "Accepted")}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Đồng ý nhận việc
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleUpdateBookingStatus(booking.bookingID, "Rejected")}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Từ chối nhận việc
                  </Button>
                </>
              )}
              {booking.status === "Accepted" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateBookingStatus(booking.bookingID, "Completed")}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Đánh dấu hoàn thành
                </Button>
              )}
            </CardActions>
          </BookingCard>
        ))}
      </Box>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredBookings.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ mt: 2 }}
      />
    </Paper>
  );
};

export default Bookings;