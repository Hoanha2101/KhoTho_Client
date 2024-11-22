import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import Sidebar from '../Dashboard/Sidebar';
import axios from 'axios';
import { format } from 'date-fns';
import { API_ENDPOINT } from "../../../services/config";

// const API_URL = 'https://localhost:7062/api/Booking';
const API_URL = `${API_ENDPOINT}/api/Booking`;

const BookingManagement = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [workers, setWorkers] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#2196f3',
      },
    },
  });

  useEffect(() => {
    fetchBookings();
    fetchWorkers();
    fetchJobTypes();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(API_URL);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/api/Workers`);
      // const response = await axios.get('https://localhost:7062/api/Workers');
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/api/JobTypes`);
      // const response = await axios.get('https://localhost:7062/api/JobTypes');
      setJobTypes(response.data);
    } catch (error) {
      console.error('Error fetching job types:', error);
    }
  };

  const handleCreateNewRow = async (values) => {
    try {
      const newBooking = {
        ...values,
        bookingID: 0,
        status: 'Pending'
      };

      const response = await axios.post(API_URL, newBooking);
      setTableData([...tableData, response.data]);
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (Object.keys(validationErrors).length) return;

    try {
      const bookingId = row.original.bookingID;
      const updatedBooking = {
        ...values,
        bookingID: bookingId
      };
      
      await axios.put(`${API_URL}/${bookingId}`, updatedBooking);
      const updatedData = [...tableData];
      updatedData[row.index] = updatedBooking;
      setTableData(updatedData);
      exitEditingMode();
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (!confirm(`Are you sure you want to delete booking #${row.getValue('bookingID')}`)) {
        return;
      }

      try {
        const bookingId = row.original.bookingID;
        await axios.delete(`${API_URL}/${bookingId}`);
        setTableData(tableData.filter(booking => booking.bookingID !== bookingId));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    },
    [tableData],
  );

  const BOOKING_STATUS = {
    'Pending': 'Pending',
    'Accepted': 'Accepted',
    'Rejected': 'Rejected',
    'Completed': 'Completed',
    'Cancelled': 'Cancelled'
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'bookingID',
        header: 'Booking ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'customerID',
        header: 'Customer ID',
        size: 100,
      },
      {
        accessorKey: 'workerID',
        header: 'Worker',
        size: 140,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: workers.map((worker) => (
            <MenuItem key={worker.workerId} value={worker.workerId}>
              {worker.user.fullName}
            </MenuItem>
          )),
        },
        Cell: ({ cell }) => {
          const worker = workers.find(w => w.workerId === cell.getValue());
          return worker ? worker.user.fullName : cell.getValue();
        },
      },
      {
        accessorKey: 'jobTypeID',
        header: 'Job Type',
        size: 140,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: jobTypes.map((jobType) => (
            <MenuItem key={jobType.jobTypeId} value={jobType.jobTypeId}>
              {jobType.jobTypeName}
            </MenuItem>
          )),
        },
        Cell: ({ cell }) => {
          const jobType = jobTypes.find(j => j.jobTypeId === cell.getValue());
          return jobType ? jobType.jobTypeName : cell.getValue();
        },
      },
      {
        accessorKey: 'bookingDate',
        header: 'Booking Date',
        size: 120,
        Cell: ({ cell }) => format(new Date(cell.getValue()), 'dd/MM/yyyy'),
      },
      {
        accessorKey: 'startTime',
        header: 'Start Time',
        size: 100,
      },
      {
        accessorKey: 'endTime',
        header: 'End Time',
        size: 100,
      },
      {
        accessorKey: 'totalAmount',
        header: 'Amount',
        size: 100,
        Cell: ({ cell }) => `$${cell.getValue()}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: Object.values(BOOKING_STATUS).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          )),
        },
      },
    ],
    [workers, jobTypes],
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen bg-gray-100">
        <div className="fixed inset-y-0 left-0">
          <Sidebar />
        </div>

        <div className="flex-1 ml-[260px] p-8">
          <Box sx={{ maxWidth: '100%' }}>
            <MaterialReactTable
              displayColumnDefOptions={{
                'mrt-row-actions': {
                  muiTableHeadCellProps: {
                    align: 'center',
                  },
                  size: 120,
                },
              }}
              columns={columns}
              data={tableData}
              editingMode="modal"
              enableColumnOrdering
              enableEditing
              enableColumnFiltering
              enableColumnResizing
              enableGlobalFilter
              enablePagination
              enableSelectAll
              onEditingRowSave={handleSaveRowEdits}
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                  <Tooltip arrow placement="left" title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow placement="right" title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              renderTopToolbarCustomActions={() => (
                <Button
                  color="primary"
                  onClick={() => setCreateModalOpen(true)}
                  variant="contained"
                  startIcon={<Add />}
                >
                  Create New Booking
                </Button>
              )}
            />
          </Box>
          <CreateNewBookingModal
            columns={columns}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

const CreateNewBookingModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Booking</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
              mt: 2,
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === 'bookingID') return null;

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  select={column.muiTableBodyCellEditTextFieldProps?.select}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                >
                  {column.muiTableBodyCellEditTextFieldProps?.children}
                </TextField>
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Create Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingManagement;