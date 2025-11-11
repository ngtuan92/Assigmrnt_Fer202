import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Stack,
  Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import QuizIcon from '@mui/icons-material/Quiz';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

const navItems = [
  { label: 'Quản lý Practice Tests', to: '/admin/exams', icon: <QuizIcon /> },
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AD';
  };

  const drawer = (
    <Box sx={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      height: '100%',
      color: 'white'
    }}>
      <Toolbar sx={{
        flexDirection: 'column',
        alignItems: 'center',
        py: 3,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {user?.avatar ? (
          <Avatar 
            src={user.avatar} 
            alt={user.name}
            sx={{
              width: 56,
              height: 56,
              mb: 2,
              border: '3px solid rgba(255, 255, 255, 0.3)'
            }}
          />
        ) : (
          <Avatar sx={{
            width: 56,
            height: 56,
            mb: 2,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 600,
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}>
            {user ? getInitials(user.name) : <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />}
          </Avatar>
        )}

        <Typography variant="h6" fontWeight="600" textAlign="center">
          {user?.name || 'TOEIC Admin'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
          {user?.email || 'admin@toeic.com'}
        </Typography>
        <Chip
          label={user?.role === 'admin' ? 'Administrator' : 'User'}
          size="small"
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            fontWeight: 500
          }}
        />
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />

      <List sx={{ px: 1, py: 2 }}>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={Link}
              to={item.to}
              selected={location.pathname === item.to}
              sx={{
                py: 1.2,
                px: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  }
                }
              }}
            >
              <ListItemIcon sx={{
                color: 'inherit',
                minWidth: 36
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.to ? 600 : 400,
                  fontSize: '0.9rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        p: 2
      }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            py: 1.2,
            px: 2,
            borderRadius: 1,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
            }
          }}
        >
          <ListItemIcon sx={{
            color: 'inherit',
            minWidth: 36
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Đăng xuất"
            primaryTypographyProps={{
              fontWeight: 400,
              fontSize: '0.9rem'
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: { xs: 'block', sm: 'none' },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" fontWeight="600" sx={{ flexGrow: 1 }}>
            TOEIC Admin Panel
          </Typography>
          
          {user && (
            <Stack direction="row" alignItems="center" spacing={1}>
              {user.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.8rem'
                }}>
                  {getInitials(user.name)}
                </Avatar>
              )}
              <Typography variant="body2" fontWeight="500" sx={{ display: { xs: 'none', md: 'block' } }}>
                {user.name}
              </Typography>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none'
            }
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Outlet />
      </Box>
    </Box>
  );
}


