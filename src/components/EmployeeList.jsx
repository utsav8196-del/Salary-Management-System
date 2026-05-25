import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, IconButton, Dialog, DialogTitle,
  DialogContent, Alert, Snackbar, Typography, Chip, InputAdornment, Stack,
  Tooltip, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add, Search, Refresh, CheckCircle } from '@mui/icons-material';
import { getEmployees, deleteEmployee, createEmployee, updateEmployee, getCountries, getJobTitles } from '../api';
import EmployeeForm from './EmployeeForm';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [countries, setCountries] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees(page + 1, rowsPerPage, search);
      setEmployees(Array.isArray(response.data?.employees) ? response.data.employees : []);
      setTotal(response.data?.total || 0);
    } catch {
      showSnackbar('Failed to load employees', 'error');
    }
    setLoading(false);
  };

  const loadMetadata = async () => {
    try {
      const [countriesRes, jobsRes] = await Promise.all([getCountries(), getJobTitles()]);
      setCountries(Array.isArray(countriesRes.data) ? countriesRes.data : []);
      setJobTitles(Array.isArray(jobsRes.data) ? jobsRes.data : []);
    } catch {}
  };

  useEffect(() => { loadEmployees(); loadMetadata(); }, [page, rowsPerPage, search]);

  const handleSearch = () => { setSearch(searchInput); setPage(0); };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) {
      try {
        await deleteEmployee(id);
        showSnackbar('Employee deleted successfully', 'success');
        loadEmployees();
      } catch {
        showSnackbar('Failed to delete employee', 'error');
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id || editingEmployee.id, employeeData);
        showSnackbar('Employee updated successfully', 'success');
      } else {
        await createEmployee(employeeData);
        showSnackbar('Employee added successfully', 'success');
      }
      setOpenDialog(false);
      setEditingEmployee(null);
      loadEmployees();
    } catch (error) {
      showSnackbar(error.response?.data?.error || 'Operation failed', 'error');
    }
  };

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

  const formatSalary = (salary) => '₹' + new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(salary);

  return (
    <Box>
      {/* Toolbar */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }} alignItems="center">
        <TextField
          size="small"
          placeholder="Search by name, job, country or email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: '#9ca3af', fontSize: 20 }} /></InputAdornment>,
          }}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ px: 3, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}>
          Search
        </Button>
        <Button variant="outlined" onClick={() => { setSearchInput(''); setSearch(''); }} startIcon={<Refresh />}
          sx={{ borderColor: '#e5e7eb', color: '#6b7280', '&:hover': { borderColor: '#d1d5db', bgcolor: '#f9fafb' } }}>
          Reset
        </Button>
        <Button variant="contained" onClick={() => { setEditingEmployee(null); setOpenDialog(true); }}
          startIcon={<Add />}
          sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' }, whiteSpace: 'nowrap' }}>
          Add Employee
        </Button>
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              <TableCell sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Job Title</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Country</TableCell>
              <TableCell align="right" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salary</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</TableCell>
              <TableCell sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hire Date</TableCell>
              <TableCell align="center" sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} sx={{ color: '#4f46e5' }} />
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                  No employees found
                </TableCell>
              </TableRow>
            ) : employees.map((emp, idx) => (
              <TableRow key={emp._id || emp.id} hover sx={{ '&:hover': { bgcolor: '#f8fafc' }, '&:last-child td': { border: 0 } }}>
                <TableCell sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>{(page * rowsPerPage) + idx + 1}</TableCell>
                <TableCell>
                  <Typography fontWeight={600} fontSize="0.875rem">{emp.full_name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={emp.job_title} size="small" sx={{ bgcolor: '#ede9fe', color: '#5b21b6', fontWeight: 500, fontSize: '0.75rem' }} />
                </TableCell>
                <TableCell>
                  <Chip label={emp.country} size="small" variant="outlined" sx={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '0.75rem' }} />
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700} fontSize="0.875rem" color="#059669">{formatSalary(emp.salary)}</Typography>
                </TableCell>
                <TableCell sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{emp.email}</TableCell>
                <TableCell sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{emp.hire_date}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => { setEditingEmployee(emp); setOpenDialog(true); }}
                      sx={{ color: '#4f46e5', '&:hover': { bgcolor: '#ede9fe' }, mr: 0.5 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => handleDelete(emp._id || emp.id, emp.full_name)}
                      sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        rowsPerPageOptions={[10, 20, 50, 100]}
        sx={{ borderTop: '1px solid #e5e7eb', color: '#6b7280' }}
      />

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setEditingEmployee(null); }}
        maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1.1rem', borderBottom: '1px solid #e5e7eb' }}>
          {editingEmployee ? '✏️ Edit Employee' : '➕ Add New Employee'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <EmployeeForm
            employee={editingEmployee}
            onSave={handleSaveEmployee}
            onCancel={() => { setOpenDialog(false); setEditingEmployee(null); }}
            countries={countries}
            jobTitles={jobTitles}
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          icon={snackbar.severity === 'success' ? <CheckCircle fontSize="inherit" /> : undefined}
          sx={{ width: '100%', fontWeight: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EmployeeList;
