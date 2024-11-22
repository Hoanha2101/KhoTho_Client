import React, { useState, useEffect } from "react";
import authService from "../../../services/authService";
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import StarRateIcon from "@mui/icons-material/StarRate";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData) {
        console.log(userData)
        setUser(userData);
        setFormData(userData);
        setAvatarPreview(userData.avatarUrl);
      }
    } catch (error) {
      setNotification({
        open: true,
        message: "Lỗi khi tải thông tin người dùng",
        severity: "error",
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const updatedUser = await authService.updateProfile(formDataToSend);
      setUser(updatedUser);
      setIsEditing(false);
      setAvatarFile(null);
      setNotification({
        open: true,
        message: "Cập nhật thông tin thành công!",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Lỗi khi cập nhật thông tin",
        severity: "error",
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ mt: 4, mx: "auto", maxWidth: 900 }}>
        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={3000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        <Card elevation={4} sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            {/* Profile Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
                disabled={!isEditing}
              />
              <label htmlFor="avatar-upload">
                <Avatar
                  alt="Profile Picture"
                  src={avatarPreview || "/default-avatar.png"}
                  sx={{
                    width: 150,  // Increased size
                    height: 150,  // Increased size
                    mr: 2,
                    cursor: isEditing ? "pointer" : "default",
                  }}
                />
                {isEditing && (
                  <PhotoCameraIcon
                    color="primary"
                    sx={{
                      position: "absolute",
                      top: "100px", // Adjusted position
                      left: "140px", // Adjusted position
                      cursor: "pointer",
                    }}
                  />
                )}
              </label>
              <Box>
                <Typography variant="h4" component="div">
                  {user.fullName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {user.email}
                </Typography>
              </Box>
            </Box>

            {/* Rating Section */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography variant="body1">
                <strong>Đánh giá:</strong>
              </Typography>
              <Box sx={{ ml: 1 }}>
                {[...Array(user.rating || 0)].map((_, index) => (
                  <StarRateIcon key={index} color="primary" />
                ))}
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Social Media Links */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" component="div">Mạng xã hội:</Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1">
                  <strong>Twitter:</strong> {user.twitter || "Chưa có"}
                </Typography>
                <Typography variant="body1">
                  <strong>Facebook:</strong> {user.facebook || "Chưa có"}
                </Typography>
                <Typography variant="body1">
                  <strong>Instagram:</strong> {user.instagram || "Chưa có"}
                </Typography>
              </Box>
            </Box>

            {/* User Info */}
            {!isEditing ? (
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Số điện thoại:</strong> {user.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Địa chỉ:</strong> {user.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1">
                      <strong>Website:</strong> {user.website || "Chưa có"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Loại người dùng:</strong> 
                      {user.userType === 1 ? "Quản trị viên" : "Người dùng thông thường"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Ngày tạo:</strong> {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Grid>
                </Grid>

                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                </Box>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  {/* Additional input fields can be added here */}
                </Grid>

                <Box textAlign="center" sx={{ mt: 3 }}>
                  <Button variant="contained" color="primary" type="submit">
                    Cập nhật thông tin
                  </Button>
                </Box>
              </form>
            )}
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>

  );
};

export default Profile;
