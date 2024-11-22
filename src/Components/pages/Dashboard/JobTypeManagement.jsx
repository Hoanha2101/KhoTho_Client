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
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import Sidebar from '../Dashboard/Sidebar';
import axios from 'axios';
import { API_ENDPOINT } from "../../../services/config";

// const API_URL = 'https://localhost:7062/api/JobTypes';
const API_URL = `${API_ENDPOINT}/api/JobTypes`;

const JobTypeManagement = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
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

  // useEffect(() => {
  //   fetchJobTypes();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchJobTypes();
      await fetchWorkerJobTypes();
    };
  
    fetchData();
  }, []);
  

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get(API_URL);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching job types:', error);
    }
  };

  const handleCreateNewRow = async (values) => {
    try {
      const newJobType = {
        ...values,
        jobTypeId: 0,
      };

      const response = await axios.post(API_URL, newJobType);
      setTableData([...tableData, response.data]);
    } catch (error) {
      console.error('Error creating job type:', error.response ? error.response.data : error.message);
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (Object.keys(validationErrors).length) return;

    try {
      const jobTypeId = row.original.jobTypeId;
      const updatedJobType = {
        ...values,
        jobTypeId: jobTypeId,
      };
      
      await axios.put(`${API_URL}/${jobTypeId}`, updatedJobType);
      const updatedData = [...tableData];
      updatedData[row.index] = updatedJobType;
      setTableData(updatedData);
      exitEditingMode();
    } catch (error) {
      console.error('Error updating job type:', error);
    }
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (!confirm(`Are you sure you want to delete ${row.getValue('jobTypeName')}`)) {
        return;
      }

      try {
        const jobTypeId = row.original.jobTypeId;
        await axios.delete(`${API_URL}/${jobTypeId}`);
        setTableData(tableData.filter(jobType => jobType.jobTypeId !== jobTypeId));
      } catch (error) {
        console.error('Error deleting job type:', error);
      }
    },
    [tableData],
  );

  const fetchWorkerJobTypes = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/api/WorkerJobTypes`);
      // const response = await axios.get('https://localhost:7062/api/WorkerJobTypes');
      const workerJobTypes = response.data;
  
      // Đếm số lượng nhân viên cho mỗi Job Type
      const jobTypeWorkerCounts = workerJobTypes.reduce((acc, item) => {
        acc[item.jobTypeId] = (acc[item.jobTypeId] || 0) + 1;
        return acc;
      }, {});
  
      // Cập nhật số lượng nhân viên vào bảng Job Types
      setTableData((prevData) =>
        prevData.map((jobType) => ({
          ...jobType,
          numberOfWorker: jobTypeWorkerCounts[jobType.jobTypeId] || 0,
        }))
      );
    } catch (error) {
      console.error('Error fetching worker job types:', error);
    }
  };
  
  const columns = useMemo(
    () => [
      {
        accessorKey: 'jobTypeId',
        header: 'ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'jobTypeName',
        header: 'Job Type Name',
        size: 140,
      },
      {
        accessorKey: 'numberOfWorker',
        header: 'Number of Workers',
        size: 140,
      },
      // {
      //   accessorKey: 'description',
      //   header: 'Description',
      //   size: 200,
      // },
      {
        accessorKey: 'pricePerHour',
        header: 'Price Per Hour',
        size: 120,
      },
      
    ],
    [],
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
                  Create New Job Type
                </Button>
              )}
            />
          </Box>
          <CreateNewJobTypeModal
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

const CreateNewJobTypeModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {}),
  );

  const handleSubmit = () => {
    // Convert numeric fields to numbers
    const processedValues = {
      ...values,
      pricePerHour: Number(values.pricePerHour),
      numberOfWorker: Number(values.numberOfWorker)
    };
    onSubmit(processedValues);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Job Type</DialogTitle>
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
              if (column.accessorKey === 'jobTypeId') return null;

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  type={['pricePerHour', 'numberOfWorker'].includes(column.accessorKey) ? 'number' : 'text'}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              );
            })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Create Job Type
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JobTypeManagement;