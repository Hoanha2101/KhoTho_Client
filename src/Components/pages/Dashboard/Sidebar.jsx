import { useNavigate, useLocation } from 'react-router-dom';

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Typography,
  Avatar,
  Divider,
  Tooltip,
  styled
} from '@mui/material';
import {
  Dashboard,
  People,
  Work,
  Category,
  Star,
  Logout,
  ChevronLeft,
  ChevronRight,
  BookOnline,
  Schedule,
} from '@mui/icons-material';
import { useState } from 'react';
import { API_ENDPOINT } from "../../../services/config";

// Styled components remain the same
const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  justifyContent: 'space-between',
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    border: 'none',
    background: theme.palette.background.default,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const CollapsedDrawer = styled(Drawer)(({ theme }) => ({
  width: 72,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 72,
    boxSizing: 'border-box',
    border: 'none',
    background: theme.palette.background.default,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
}));

const UserProfile = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/khotho/dashboard',
      name: 'Dashboard',
      icon: <Dashboard />
    },
    {
      path: '/khotho/admin/users',
      name: 'Users',
      icon: <People />
    },
    {
      path: '/khotho/admin/workers',
      name: 'Workers',
      icon: <Work />
    },
    {
      path: '/khotho/admin/bookings',
      name: 'Booking',
      icon: <BookOnline />
    },
    // {
    //   path: '/admin/workerschedule',
    //   name: 'Worker Schedule',
    //   icon: <Schedule />
    // },
    {
      path: '/khotho/admin/jobtypes',
      name: 'Job Types',
      icon: <Category />
    },
    {
      path: '/khotho/admin/reviews',
      name: 'Reviews',
      icon: <Star />
    }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    navigate('/khotho/login');
  };

  const DrawerComponent = isCollapsed ? CollapsedDrawer : StyledDrawer;

  return (
    <DrawerComponent variant="permanent">
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src="../../../Assets/logokhotho.png"
            alt="Logo"
            sx={{ width: 40, height: 40, bgcolor: 'white' }}
          />
          {!isCollapsed && (
            <Box>
              <Typography variant="h6" fontWeight="bold">KhoTho</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Management System
              </Typography>
            </Box>
          )}
        </Box>
      </DrawerHeader>

      <Divider />

      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
            <Tooltip title={isCollapsed ? item.name : ''} placement="right">
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: isCollapsed ? 'center' : 'initial',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isCollapsed ? 0 : 2,
                    justifyContent: 'center',
                    color: isActive(item.path) ? 'primary.main' : 'inherit',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText 
                    primary={item.name}
                    sx={{
                      opacity: 1,
                      color: isActive(item.path) ? 'primary.main' : 'inherit',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <UserProfile>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              KT
            </Avatar>
            {!isCollapsed && (
              <Box>
                <Typography variant="subtitle2">KhoTho</Typography>
                <Typography variant="caption" color="text.secondary">
                  khotho.24h@gmail.com
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        <Tooltip title={isCollapsed ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              justifyContent: isCollapsed ? 'center' : 'initial',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2 }}>
              <Logout />
            </ListItemIcon>
            {!isCollapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </UserProfile>
    </DrawerComponent>
  );
};

export default Sidebar;