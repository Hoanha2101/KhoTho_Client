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
  Stack,
  TextField,
  Tooltip,
  ThemeProvider,
  createTheme,
  Rating,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import Sidebar from '../Dashboard/Sidebar';
import axios from 'axios';
import { API_ENDPOINT } from "../../../services/config";

const API_URL = `${API_ENDPOINT}/api/Reviews`;
const WORKERS_API_URL = `${API_ENDPOINT}/api/Workers`;
const USERS_API_URL = `${API_ENDPOINT}/api/Users`;

const ReviewManagement = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

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
    fetchReviews();
    fetchWorkers();
    fetchCustomers();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(API_URL);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(WORKERS_API_URL);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(USERS_API_URL);
      const customersData = response.data.filter(user => user.userType === 1);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const getWorkerName = (workerId) => {
    const worker = workers.find(w => w.workerId === workerId);
    return worker ? worker.user.fullName : 'Unknown Worker';
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c => c.userId === customerId);
    return customer ? customer.fullName : 'Unknown Customer';
  };

  // ... (các hàm xử lý khác giữ nguyên)

  const columns = useMemo(
    () => [
      {
        accessorKey: 'reviewId',
        header: 'ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'workerId',
        header: 'Worker',
        size: 200,
        Cell: ({ cell }) => getWorkerName(cell.getValue()),
        Edit: ({ column, row, table }) => (
          <TextField
            select
            fullWidth
            value={row.original.workerId}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              table.setEditingRow({
                ...row,
                original: { ...row.original, workerId: value },
              });
            }}
            SelectProps={{ native: true }}
          >
            {workers.map((worker) => (
              <option key={worker.workerId} value={worker.workerId}>
                {worker.user.fullName}
              </option>
            ))}
          </TextField>
        ),
      },
      {
        accessorKey: 'customerId',
        header: 'Customer',
        size: 200,
        Cell: ({ cell }) => getCustomerName(cell.getValue()),
        Edit: ({ column, row, table }) => (
          <TextField
            select
            fullWidth
            value={row.original.customerId}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              table.setEditingRow({
                ...row,
                original: { ...row.original, customerId: value },
              });
            }}
            SelectProps={{ native: true }}
          >
            {customers.map((customer) => (
              <option key={customer.userId} value={customer.userId}>
                {customer.fullName}
              </option>
            ))}
          </TextField>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        size: 120,
        Cell: ({ cell }) => (
          <Rating value={cell.getValue()} readOnly />
        ),
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
          inputProps: { min: 1, max: 5 },
        },
      },
      {
        accessorKey: 'comments',
        header: 'Comments',
        size: 200,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        enableEditing: false,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
    ],
    [workers, customers],
  );

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      try {
        // Convert values to match your API requirements
        const updatedReview = {
          reviewId: values.reviewId,
          workerId: values.workerId,
          customerId: values.customerId,
          rating: values.rating,
          comments: values.comments,
          createdAt: values.createdAt
        };
  
        // Make the PUT request to update the review
        await axios.put(`${API_URL}/${values.reviewId}`, updatedReview);
        
        // Update the table data
        setTableData((prevTableData) =>
          prevTableData.map((item) =>
            item.reviewId === values.reviewId ? values : item
          )
        );
  
        exitEditingMode(); // Required to exit editing mode
      } catch (error) {
        console.error('Error updating review:', error);
      }
    }
  };

  const handleDeleteRow = async (row) => {
    if (window.confirm(`Are you sure you want to delete review ${row.getValue('reviewId')}?`)) {
      try {
        await axios.delete(`${API_URL}/${row.getValue('reviewId')}`);
        
        // Update the table data
        setTableData((prevTableData) =>
          prevTableData.filter((item) => item.reviewId !== row.getValue('reviewId'))
        );
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };
  const handleCreateNewRow = async (values) => {
    try {
      // Make the POST request to create a new review
      const response = await axios.post(API_URL, values);
      
      // Update the table data with the new review
      setTableData([...tableData, response.data]);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

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
                  Create New Review
                </Button>
              )}
            />
          </Box>
          <CreateNewReviewModal
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

const CreateNewReviewModal = ({ open, columns, onClose, onSubmit }) => {
  const [workers, setWorkers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  useEffect(() => {
    fetchWorkers();
    fetchCustomers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(WORKERS_API_URL);
      setWorkers(response.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(USERS_API_URL);
      const customersData = response.data.filter(user => user.userType === 1);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Review</DialogTitle>
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
            <TextField
              select
              label="Worker"
              name="workerId"
              SelectProps={{ native: true }}
              onChange={(e) =>
                setValues({ ...values, workerId: parseInt(e.target.value) })
              }
            >
              <option value="">Select Worker</option>
              {workers.map((worker) => (
                <option key={worker.workerId} value={worker.workerId}>
                  {worker.user.fullName}
                </option>
              ))}
            </TextField>

            <TextField
              select
              label="Customer"
              name="customerId"
              SelectProps={{ native: true }}
              onChange={(e) =>
                setValues({ ...values, customerId: parseInt(e.target.value) })
              }
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.userId} value={customer.userId}>
                  {customer.fullName}
                </option>
              ))}
            </TextField>

            <TextField
              label="Rating"
              name="rating"
              type="number"
              inputProps={{ min: 1, max: 5 }}
              onChange={(e) =>
                setValues({ ...values, rating: parseInt(e.target.value) })
              }
            />

            <TextField
              label="Comments"
              name="comments"
              onChange={(e) =>
                setValues({ ...values, comments: e.target.value })
              }
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Create Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewManagement;