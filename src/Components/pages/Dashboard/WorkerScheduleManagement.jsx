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

// const API_URL = 'https://localhost:7062/api/WorkerSchedule';
const API_URL = `${API_ENDPOINT}/api/WorkerSchedule`;
const WorkerScheduleManagement = () => {
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

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(API_URL);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleCreateNewRow = async (values) => {
    try {
      const newSchedule = {
        ...values,
        scheduleId: 0,
      };

      const response = await axios.post(API_URL, newSchedule);
      setTableData([...tableData, response.data]);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (Object.keys(validationErrors).length) return;

    try {
      const scheduleId = row.original.scheduleId;
      const updatedSchedule = {
        ...values,
        scheduleId: scheduleId,
      };
      
      await axios.put(`${API_URL}/${scheduleId}`, updatedSchedule);
      const updatedData = [...tableData];
      updatedData[row.index] = updatedSchedule;
      setTableData(updatedData);
      exitEditingMode();
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (!confirm(`Are you sure you want to delete this schedule?`)) {
        return;
      }

      try {
        const scheduleId = row.original.scheduleId;
        await axios.delete(`${API_URL}/${scheduleId}`);
        setTableData(tableData.filter(schedule => schedule.scheduleId !== scheduleId));
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    },
    [tableData],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'scheduleId',
        header: 'ID',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'userId',
        header: 'Worker ID',
        size: 100,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 140,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: 'startTime',
        header: 'Start Time',
        size: 120,
      },
      {
        accessorKey: 'endTime',
        header: 'End Time',
        size: 120,
      },
      {
        accessorKey: 'status',
        header: 'Status',
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
                  Create New Schedule
                </Button>
              )}
            />
          </Box>
          <CreateNewScheduleModal
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

const CreateNewScheduleModal = ({ open, columns, onClose, onSubmit }) => {
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
      <DialogTitle textAlign="center">Create New Schedule</DialogTitle>
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
              if (column.accessorKey === 'scheduleId') {
                return null;
              }

              return (
                <TextField
                  key={column.accessorKey}
                  label={column.header}
                  name={column.accessorKey}
                  type={column.accessorKey.includes('date') ? 'date' : 
                        column.accessorKey.includes('time') ? 'time' : 'text'}
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
          Create Schedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerScheduleManagement;