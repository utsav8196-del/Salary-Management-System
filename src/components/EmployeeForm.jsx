import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, MenuItem, FormControl, InputLabel,
  Select, Grid, FormHelperText
} from '@mui/material';

function EmployeeForm({ employee, onSave, onCancel, countries, jobTitles }) {
  const [formData, setFormData] = useState({
    full_name: '', job_title: '', country: '', salary: '', email: '', hire_date: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        job_title: employee.job_title || '',
        country: employee.country || '',
        salary: employee.salary || '',
        email: employee.email || '',
        hire_date: employee.hire_date || ''
      });
    } else {
      setFormData({ full_name: '', job_title: '', country: '', salary: '', email: '', hire_date: '' });
    }
  }, [employee]);

  const validate = () => {
    const e = {};
    if (!formData.full_name.trim()) e.full_name = 'Full name is required';
    if (!formData.job_title) e.job_title = 'Job title is required';
    if (!formData.country) e.country = 'Country is required';
    if (!formData.salary || formData.salary <= 0) e.salary = 'Valid salary is required';
    if (!formData.email) e.email = 'Email is required';
    if (!formData.hire_date) e.hire_date = 'Hire date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave({ ...formData, salary: parseFloat(formData.salary) });
  };

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: 2 } };

  return (
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Full Name" value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            error={!!errors.full_name} helperText={errors.full_name} sx={fieldSx} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.job_title} sx={fieldSx}>
            <InputLabel>Job Title</InputLabel>
            <Select value={formData.job_title} label="Job Title"
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              MenuProps={{ PaperProps: { sx: { maxHeight: 260, borderRadius: 2 } } }}>
              {jobTitles.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
            {errors.job_title && <FormHelperText>{errors.job_title}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.country} sx={fieldSx}>
            <InputLabel>Country</InputLabel>
            <Select value={formData.country} label="Country"
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              MenuProps={{ PaperProps: { sx: { maxHeight: 260, borderRadius: 2 } } }}>
              {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
            {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Salary (INR)" type="number" value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            error={!!errors.salary} helperText={errors.salary}
            InputProps={{ inputProps: { min: 0 } }} sx={fieldSx} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Email" type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={!!errors.email} helperText={errors.email} sx={fieldSx} />
        </Grid>

        <Grid item xs={12}>
          <TextField fullWidth label="Hire Date" type="date" value={formData.hire_date}
            onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
            error={!!errors.hire_date} helperText={errors.hire_date}
            InputLabelProps={{ shrink: true }} sx={fieldSx} />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
        <Button onClick={onCancel} sx={{ color: '#6b7280', borderColor: '#e5e7eb', '&:hover': { bgcolor: '#f9fafb' } }} variant="outlined">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}
          sx={{ bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' }, px: 4 }}>
          {employee ? 'Update' : 'Add Employee'}
        </Button>
      </Box>
    </Box>
  );
}

export default EmployeeForm;
