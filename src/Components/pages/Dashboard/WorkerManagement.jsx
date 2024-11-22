import React, { useCallback, useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Typography } from "@mui/material";

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
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import Sidebar from "../Dashboard/Sidebar";
import axios from "axios";
import { API_ENDPOINT } from "../../../services/config";

const API_URL = `${API_ENDPOINT}/api/Workers`;

const WorkerManagement = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [workerJobTypes, setWorkerJobTypes] = useState({});

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
      secondary: {
        main: "#2196f3",
      },
    },
  });

  useEffect(() => {
    fetchWorkers();
    fetchUsers();
    fetchJobTypes();
  }, []);

  const fetchUsers = async () => {
    try {
      // const response = await axios.get("https://localhost:7062/api/Users");
      const response = await axios.get(`${API_ENDPOINT}/api/Users`);
      const availableUsers = response.data.filter(
        (user) => user.userType === 1 && !user.worker
      );
      setUsers(availableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Thêm hàm fetch WorkerJobTypes
const fetchWorkerJobTypes = async (workerId) => {
  try {
    // const response = await axios.get(`https://localhost:7062/api/WorkerJobTypes/worker/${workerId}`);
    const response = await axios.get(`${API_ENDPOINT}/api/WorkerJobTypes/worker/${workerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching worker job types:", error);
    return [];
  }
};



  const fetchJobTypes = async () => {
    try {
      // const response = await axios.get("https://localhost:7062/api/JobTypes");
      const response = await axios.get(`${API_ENDPOINT}/api/JobTypes`);
      console.log("Job Types:", response.data);
      setJobTypes(response.data);
    } catch (error) {
      console.error("Error fetching job types:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const response = await axios.get(API_URL);
      const workersData = response.data;
      
      // Fetch job types for each worker
      const workersWithJobTypes = await Promise.all(
        workersData.map(async (worker) => {
          const jobTypes = await fetchWorkerJobTypes(worker.workerId);
          return {
            ...worker,
            workerJobTypes: jobTypes
          };
        })
      );
      
      setTableData(workersWithJobTypes);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };
  

  // const handleCreateNewRow = async (values) => {
  //   try {
  //     const newWorker = {
  //       workerId: 0,
  //       userId: values.selectedUser.userId,
  //       experienceYears: values.experienceYears,
  //       rating: 0,
  //       bio: values.bio,
  //       verified: values.verified,
  //       workerJobTypes: values.selectedJobTypes.map((jobType) => ({
  //         jobTypeId: jobType.jobTypeId,
  //         workerId: 0,
  //       })),
  //     };

  //     const response = await axios.post(API_URL, newWorker);
  //     setTableData([...tableData, response.data]);
  //     fetchUsers();
  //   } catch (error) {
  //     console.error(
  //       "Error creating worker:",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };

  const handleCreateNewRow = async (values) => {
    try {
      const newWorker = {
        workerId: 0,
        userId: values.selectedUser.userId,
        experienceYears: values.experienceYears,
        rating: 0,
        bio: values.bio,
        verified: values.verified
      };
  
      // Tạo worker mới
      const response = await axios.post(API_URL, newWorker);
      const createdWorker = response.data;
  
      // Thêm worker job types
      for (const jobType of values.selectedJobTypes) {
        // await axios.post('https://localhost:7062/api/WorkerJobTypes', {
        await axios.post(`${API_ENDPOINT}/api/WorkerJobTypes`, {
          workerId: createdWorker.workerId,
          jobTypeId: jobType.jobTypeId
        });
      }
  
      await fetchWorkers(); // Refresh data
      fetchUsers();
    } catch (error) {
      console.error(
        "Error creating worker:",
        error.response ? error.response.data : error.message
      );
    }
  };
  
  const handleSaveRowEdits = async ({ values, row }) => {
    try {
      const workerId = row.original.workerId;
      const updatedWorker = {
        workerId: workerId,
        userId: row.original.userId,
        experienceYears: values.experienceYears,
        rating: values.rating,
        bio: values.bio,
        verified: values.verified,
      };

      await axios.put(`${API_URL}/${workerId}`, updatedWorker);
      fetchWorkers();
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleDeleteRow = useCallback(
    async (row) => {
      if (
        !confirm(
          `Are you sure you want to delete ${row.getValue("user.fullName")}`
        )
      ) {
        return;
      }

      try {
        const workerId = row.original.workerId;
        await axios.delete(`${API_URL}/${workerId}`);
        setTableData(tableData.filter((worker) => worker.workerId !== workerId));
      } catch (error) {
        console.error("Error deleting worker:", error);
      }
    },
    [tableData]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "workerId",
        header: "Worker ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "user.fullName",
        header: "Full Name",
        size: 140,
      },
      {
        accessorKey: "user.email",
        header: "Email",
        size: 140,
      },
      {
        accessorKey: "user.phoneNumber",
        header: "Phone Number",
        size: 120,
      },
      {
        accessorKey: "user.address",
        header: "Address",
        size: 200,
      },
      {
        accessorKey: "experienceYears",
        header: "Experience (Years)",
        size: 120,
      },
      {
        accessorKey: "rating",
        header: "Rating",
        size: 100,
      },
      {
        accessorKey: "bio",
        header: "Bio",
        size: 200,
      },
      {
        accessorKey: "verified",
        header: "Verified",
        size: 100,
        Cell: ({ cell }) => (cell.getValue() ? "Yes" : "No"),
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: [
            <MenuItem key={true} value={true}>
              Yes
            </MenuItem>,
            <MenuItem key={false} value={false}>
              No
            </MenuItem>,
          ],
        },
      },
      {
        accessorKey: "workerJobTypes",
        header: "Job Types",
        size: 200,
        Cell: ({ row }) => {
          const workerJobTypes = row.original.workerJobTypes;
          return workerJobTypes
            ?.map((wjt) => {
              const jobType = jobTypes.find(jt => jt.jobTypeId === wjt.jobTypeId);
              return jobType?.jobTypeName;
            })
            .filter(Boolean)
            .join(", ");
        },
      },
    ],
    [jobTypes]
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-screen bg-gray-100">
        <div className="fixed inset-y-0 left-0">
          <Sidebar />
        </div>

        <div className="flex-1 ml-[260px] p-8">
          <Box sx={{ maxWidth: "100%" }}>
            <MaterialReactTable
              displayColumnDefOptions={{
                "mrt-row-actions": {
                  muiTableHeadCellProps: {
                    align: "center",
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
              renderRowActions={({ row }) => (
                <Box sx={{ display: "flex", gap: "1rem" }}>
                  <Tooltip arrow placement="left" title="Edit">
                    <IconButton
                      onClick={() => {
                        setEditingRow(row);
                        setIsEditModalOpen(true);
                      }}
                    >
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
                  Create New Worker
                </Button>
              )}
            />
          </Box>
          {editingRow && (
            <EditWorkerModal
              open={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingRow(null);
              }}
              onSubmit={handleSaveRowEdits}
              row={editingRow}
              jobTypes={jobTypes}
            />
          )}
          <CreateNewWorkerModal
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
            users={users}
            jobTypes={jobTypes}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

const EditWorkerModal = ({ open, onClose, onSubmit, row, jobTypes }) => {
  // const [values, setValues] = useState({
  //   experienceYears: row.original.experienceYears,
  //   rating: row.original.rating,
  //   bio: row.original.bio,
  //   verified: row.original.verified,
  //   selectedJobTypes: row.original.workerJobTypes.map(wjt => 
  //     jobTypes.find(jt => jt.jobTypeId === wjt.jobTypeId)
  //   ).filter(Boolean)
  // });
  const [values, setValues] = useState({
    experienceYears: row.original.experienceYears,
    rating: row.original.rating,
    bio: row.original.bio,
    verified: row.original.verified,
    selectedJobTypes: row.original.workerJobTypes.length > 0 
      ? [jobTypes.find(jt => jt.jobTypeId === row.original.workerJobTypes[0].jobTypeId)].filter(Boolean)
      : []
  });

  // const handleSubmit = async () => {
  //   try {
  //     const updatedWorker = {
  //       ...row.original,
  //       experienceYears: values.experienceYears,
  //       rating: values.rating,
  //       bio: values.bio,
  //       verified: values.verified,
  //       workerJobTypes: values.selectedJobTypes.map(jobType => ({
  //         jobTypeId: jobType.jobTypeId,
  //         workerId: row.original.workerId
  //       }))
  //     };

  //     await axios.put(`${API_URL}/${row.original.workerId}`, updatedWorker);
  //     onClose();
  //     window.location.reload(); // Refresh the page to show updated data
  //   } catch (error) {
  //     console.error("Error updating worker:", error);
  //   }
  // };

  // const handleSubmit = async () => {
  //   try {
  //     // Cập nhật thông tin worker
  //     const updatedWorker = {
  //       ...row.original,
  //       experienceYears: values.experienceYears,
  //       rating: values.rating,
  //       bio: values.bio,
  //       verified: values.verified,
  //     };
  //     await axios.put(`${API_URL}/${row.original.workerId}`, updatedWorker);
  
  //     // Cập nhật worker job types
  //     // Trước tiên xóa các job types cũ
  //     await axios.delete(`https://localhost:7062/api/WorkerJobTypes/worker/${row.original.workerId}`);
  
  //     // Thêm các job types mới
  //     for (const jobType of values.selectedJobTypes) {
  //       await axios.post('https://localhost:7062/api/WorkerJobTypes', {
  //         workerId: row.original.workerId,
  //         jobTypeId: jobType.jobTypeId
  //       });
  //     }
  
  //     onClose();
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error updating worker:", error);
  //   }
  // };

  const handleSubmit = async () => {
    try {
      console.log("Current values:", values);
      console.log("Selected job type:", values.selectedJobTypes[0]);
  
      if (!values.selectedJobTypes || values.selectedJobTypes.length === 0) {
        alert("Please select a job type");
        return;
      }
  
      const updatedWorker = {
        workerId: row.original.workerId,
        userId: row.original.userId,
        experienceYears: values.experienceYears,
        rating: values.rating,
        bio: values.bio,
        verified: values.verified,
      };
  
      console.log("Updating worker with data:", updatedWorker);
      await axios.put(`${API_URL}/${row.original.workerId}`, updatedWorker);
  
      console.log("Deleting old job types...");
      // await axios.delete(`https://localhost:7062/api/WorkerJobTypes/worker/${row.original.workerId}`);
      await axios.delete(`${API_ENDPOINT}/api/WorkerJobTypes/worker/${row.original.workerId}`);

  
      const newWorkerJobType = {
        workerId: row.original.workerId,
        jobTypeId: values.selectedJobTypes[0].jobTypeId
      };
      
      console.log("Adding new job type:", newWorkerJobType);
      // await axios.post('https://localhost:7062/api/WorkerJobTypes', newWorkerJobType);
      await axios.post(`${API_ENDPOINT}/api/WorkerJobTypes`, newWorkerJobType);

  
      console.log("Update completed successfully");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error updating worker:", error);
      console.error("Error details:", error.response?.data);
      alert("Error updating worker: " + error.message);
    }
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">Edit Worker</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1">Worker Information:</Typography>
              <Typography>Full Name: {row.original.user.fullName}</Typography>
              <Typography>Email: {row.original.user.email}</Typography>
              <Typography>Phone: {row.original.user.phoneNumber}</Typography>
              <Typography>Address: {row.original.user.address}</Typography>
            </Box>

            {/* <TextField
              select
              fullWidth
              label="Select Job Types"
              SelectProps={{
                multiple: true,
                renderValue: (selected) => 
                  selected.map(job => job.jobTypeName).join(', ')
              }}
              value={values.selectedJobTypes}
              onChange={(e) => setValues({ ...values, selectedJobTypes: e.target.value })}
            >
              {jobTypes.map((jobType) => (
                <MenuItem key={jobType.jobTypeId} value={jobType}>
                  {jobType.jobTypeName}
                </MenuItem>
              ))}
            </TextField> */}

<TextField
  select
  fullWidth
  label="Select Job Type"
  value={values.selectedJobTypes[0] || ''} // Chỉ lấy giá trị đầu tiên
  onChange={(e) =>
    setValues({ ...values, selectedJobTypes: [e.target.value] }) // Wrap trong mảng với 1 phần tử
  }
>
  {jobTypes.map((jobType) => (
    <MenuItem key={jobType.jobTypeId} value={jobType}>
      {jobType.jobTypeName}
    </MenuItem>
  ))}
</TextField>

            <TextField
              fullWidth
              label="Experience Years"
              type="number"
              value={values.experienceYears}
              onChange={(e) =>
                setValues({ ...values, experienceYears: parseInt(e.target.value) })
              }
            />

            <TextField
              fullWidth
              label="Rating"
              type="number"
              inputProps={{ step: "0.1", min: "0", max: "5" }}
              value={values.rating}
              onChange={(e) =>
                setValues({ ...values, rating: parseFloat(e.target.value) })
              }
            />

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={values.bio}
              onChange={(e) => setValues({ ...values, bio: e.target.value })}
            />

            <TextField
              select
              fullWidth
              label="Verified"
              value={values.verified}
              onChange={(e) => setValues({ ...values, verified: e.target.value })}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateNewWorkerModal = ({ open, onClose, onSubmit, users, jobTypes }) => {
  const [values, setValues] = useState({
    selectedUser: null,
    selectedJobTypes: [],
    experienceYears: "",
    bio: "",
    verified: false,
  });

  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const handleUserChange = (user) => {
    setValues({ ...values, selectedUser: user });
    setSelectedUserDetails(user);
  };

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">Create New Worker</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Select User"
              value={values.selectedUser || ""}
              onChange={(e) => handleUserChange(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.userId} value={user}>
                  {user.fullName}
                </MenuItem>
              ))}
            </TextField>

            {selectedUserDetails && (
              <Box sx={{ bgcolor: "background.paper", p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1">Selected User Details:</Typography>
                <Typography>Full Name: {selectedUserDetails.fullName}</Typography>
                <Typography>Email: {selectedUserDetails.email}</Typography>
                <Typography>Phone: {selectedUserDetails.phoneNumber}</Typography>
                <Typography>Address: {selectedUserDetails.address}</Typography>
              </Box>
            )}

            {/* <TextField
              select
              fullWidth
              label="Select Job Types"
              SelectProps={{
                multiple: true,
                renderValue: (selected) =>
                  selected.map((job) => job.jobTypeName).join(", "),
              }}
              value={values.selectedJobTypes}
              onChange={(e) =>
                setValues({ ...values, selectedJobTypes: e.target.value })
              }
            >
              {jobTypes.map((jobType) => (
                <MenuItem key={jobType.jobTypeId} value={jobType}>
                  {jobType.jobTypeName}
                </MenuItem>
              ))}
            </TextField> */}

<TextField
  select
  fullWidth
  label="Select Job Type"
  value={values.selectedJobTypes[0] || ''} // Chỉ lấy giá trị đầu tiên
  onChange={(e) =>
    setValues({ ...values, selectedJobTypes: [e.target.value] }) // Wrap trong mảng với 1 phần tử
  }
>
  {jobTypes.map((jobType) => (
    <MenuItem key={jobType.jobTypeId} value={jobType}>
      {jobType.jobTypeName}
    </MenuItem>
  ))}
</TextField>

            <TextField
              fullWidth
              label="Experience Years"
              type="number"
              value={values.experienceYears}
              onChange={(e) =>
                setValues({ ...values, experienceYears: parseInt(e.target.value) })
              }
            />

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={values.bio}
              onChange={(e) => setValues({ ...values, bio: e.target.value })}
            />

            <TextField
              select
              fullWidth
              label="Verified"
              value={values.verified}
              onChange={(e) =>
                setValues({ ...values, verified: e.target.value })
              }
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: "1.25rem" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleSubmit} variant="contained">
          Create Worker
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerManagement;