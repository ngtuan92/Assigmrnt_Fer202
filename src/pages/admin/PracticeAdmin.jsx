import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  OutlinedInput,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Add, 
  MoreVert, 
  MenuBook, 
  Headphones, 
  Edit, 
  Delete,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { practiceService } from '../../services/practiceService';
import CreatePracticeDialog from '../../components/admin/CreatePracticeDialog';
import EditPracticeDialog from '../../components/admin/EditPracticeDialog';
import ManageReadingDialog from '../../components/admin/ManageReadingDialog';
import ManageListeningDialog from '../../components/admin/ManageListeningDialog';


export default function PracticeAdmin() {
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openReading, setOpenReading] = useState(false);
  const [openListening, setOpenListening] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [practiceToDelete, setPracticeToDelete] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPractice, setMenuPractice] = useState(null);


  useEffect(() => { 
    fetchPractices(); 
  }, []);


  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);


  const fetchPractices = async () => {
    setLoading(true);
    try {
      const data = await practiceService.fetchPractices();
      setPractices(data || []);
      setPage(1);
      setError('');
    } catch (e) {
      setError('❌ Không thể tải danh sách Practice. Vui lòng thử lại.');
      console.error('Error fetching practices:', e);
      setPractices([]);
    } finally {
      setLoading(false);
    }
  };



  const handleCreate = async (formData) => {
    try {
      await practiceService.createPractice(formData);
      setSuccess('✅ Tạo Practice thành công!');
      setOpenCreate(false);
      await fetchPractices();
      return true;
    } catch (e) {
      setError('❌ Tạo Practice thất bại. Vui lòng kiểm tra dữ liệu.');
      console.error('Error creating practice:', e);
      return false;
    }
  };


  const handleUpdate = async (id, formData) => {
    try {
      await practiceService.updatePractice(id, formData);
      setSuccess('✅ Cập nhật Practice thành công!');
      setOpenEdit(false);
      await fetchPractices();
      return true;
    } catch (e) {
      setError('❌ Cập nhật thất bại. Vui lòng kiểm tra dữ liệu.');
      console.error('Error updating practice:', e);
      return false;
    }
  };


  const handleDelete = async (id) => {
    try {
      await practiceService.deletePractice(id);
      setSuccess('✅ Xóa Practice thành công!');
      setOpenDeleteConfirm(false);
      setPracticeToDelete(null);
      await fetchPractices();
    } catch (e) {
      setError('❌ Xóa Practice thất bại. Vui lòng thử lại.');
      console.error('Error deleting practice:', e);
    }
  };



  const handleMenuOpen = (event, practice) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setMenuPractice(practice);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuPractice(null);
  };


  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const openEditDialog = (practice) => {
    setSelectedPractice(practice);
    setOpenEdit(true);
    handleMenuClose();
  };


  const openReadingDialog = (practice) => {
    setSelectedPractice(practice);
    setOpenReading(true);
    handleMenuClose();
  };



  const openListeningDialog = (practice) => {
    setSelectedPractice(practice);
    setOpenListening(true);
    handleMenuClose();
  };



  const openDeleteDialog = (practice) => {
    setPracticeToDelete(practice);
    setOpenDeleteConfirm(true);
    handleMenuClose();
  };


  const closeAllDialogs = () => {
    setOpenEdit(false);
    setOpenReading(false);
    setOpenListening(false);
    setSelectedPractice(null);
  };



  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 60, 
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <strong>{params.value}</strong>
    },
    { 
      field: 'title', 
      headerName: 'Tiêu đề', 
      flex: 1, 
      sortable: false,
      minWidth: 200
    },
    { 
      field: 'durationMinutes', 
      headerName: 'Thời lượng (phút)', 
      width: 140, 
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span>{params.value || 0}</span>
    },
    { 
      field: 'learners', 
      headerName: 'Lượt thi', 
      width: 100, 
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => <span>{params.value || 0}</span>
    },
    { 
      field: 'description', 
      headerName: 'Mô tả', 
      flex: 1.2, 
      sortable: false,
      minWidth: 250
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 100,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5} justifyContent="center">
        
          <IconButton 
            size="small"
            title="Thêm tùy chọn"
            onClick={(e) => handleMenuOpen(e, params.row)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Stack>
      )
    }
  ];



  const totalPages = Math.ceil(practices.length / rowsPerPage) || 1;
  const displayedRows = practices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ xs: 1, sm: 2, md: 3  }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        spacing={2}
      >
        <Typography 
          variant="h5" 
          fontWeight="600"
          sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
        >
          Quản lý Practice
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => setOpenCreate(true)}
          sx={{
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            px: 3
          }}
        >
          Tạo Practice Mới
        </Button>
      </Stack>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => setError('')}
          icon={<Error />}
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert 
          severity="success" 
          sx={{ mb: 2 }} 
          onClose={() => setSuccess('')}
          icon={<CheckCircle />}
        >
          {success}
        </Alert>
      )}

      <Card sx={{ boxShadow: 1, borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ height: 600, width: '100%', position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 10
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <DataGrid
            rows={displayedRows}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            hideFooter={true}
            sx={{
              '& .MuiDataGrid-root': {
                borderRadius: 0,
                border: 'none'
              },
              '& .MuiDataGrid-cell': {
                borderColor: '#e0e0e0',
                padding: '12px 8px',
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#f5f5f5',
                borderColor: '#e0e0e0',
                fontWeight: 600,
                padding: '12px 8px',
                fontSize: '0.875rem'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: '#f9f9f9'
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer'
              }
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#ffffff'
          }}
        >
          {/* LEFT: Rows Per Page Select */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#333', 
                fontWeight: 600,
                whiteSpace: 'nowrap'
              }}
            >
              Số hàng:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
                input={<OutlinedInput />}
                sx={{
                  '& .MuiOutlinedInput-input': {
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1565c0'
                  }
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '0.85rem',
                    minWidth: '32px',
                    height: '32px'
                  }
                }}
              />
            
          </Stack>
        </Box>
      </Card>

      {/* ===== CONTEXT MENU ===== */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => openReadingDialog(menuPractice)}>
          <ListItemIcon><MenuBook fontSize="small" /></ListItemIcon>
          <ListItemText>Xem Reading</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openListeningDialog(menuPractice)}>
          <ListItemIcon><Headphones fontSize="small" /></ListItemIcon>
          <ListItemText>Xem Listening</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openEditDialog(menuPractice)} divider>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Sửa Practice</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openDeleteDialog(menuPractice)}>
          <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Xóa Practice</ListItemText>
        </MenuItem>
      </Menu>

      {/* ===== DELETE CONFIRMATION DIALOG ===== */}
      <Dialog
        open={openDeleteConfirm}
        onClose={() => {
          setOpenDeleteConfirm(false);
          setPracticeToDelete(null);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          🗑️ Xác nhận xóa Practice
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          {practiceToDelete && (
            <>
              <Typography sx={{ mb: 2 }}>
                Bạn có chắc chắn muốn xóa Practice <strong>"{practiceToDelete.title}"</strong>?
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Hành động này sẽ xóa toàn bộ nội dung Reading, Listening, câu hỏi và dữ liệu liên quan. <strong>Không thể khôi phục!</strong>
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              setOpenDeleteConfirm(false);
              setPracticeToDelete(null);
            }}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button 
            onClick={() => handleDelete(practiceToDelete.id)}
            variant="contained" 
            color="error"
            autoFocus
          >
            Xóa ngay
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== CREATE PRACTICE DIALOG ===== */}
      <CreatePracticeDialog 
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreate}
      />

      {/* ===== EDIT PRACTICE DIALOG ===== */}
      {selectedPractice && (
        <EditPracticeDialog
          open={openEdit}
          onClose={() => closeAllDialogs()}
          practice={selectedPractice}
          onSubmit={handleUpdate}
        />
      )}

      {selectedPractice && (
        <ManageReadingDialog
          open={openReading}
          onClose={() => closeAllDialogs()}
          practice={selectedPractice}
          onUpdate={fetchPractices}
        />
      )}

      {selectedPractice && (
        <ManageListeningDialog
          open={openListening}
          onClose={() => closeAllDialogs()}
          practice={selectedPractice}
          onUpdate={fetchPractices}
        />
      )}
    </Box>
  );
}
