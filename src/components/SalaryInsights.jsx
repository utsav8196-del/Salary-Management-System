import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, FormControl, InputLabel,
  Select, MenuItem, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Chip, Divider
} from '@mui/material';
import { TrendingUp, TrendingDown, CurrencyRupee, People } from '@mui/icons-material';
import { getCountries, getJobTitles, getCountryInsights, getJobTitleInsights, getCountryStats, getGlobalInsights } from '../api';

const StatCard = ({ title, value, icon, bgcolor, color }) => (
  <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3, height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
          {title}
        </Typography>
        <Box sx={{ bgcolor, borderRadius: 2, p: 0.8, display: 'flex' }}>
          {React.cloneElement(icon, { sx: { fontSize: 18, color } })}
        </Box>
      </Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#111827' }}>{value}</Typography>
    </CardContent>
  </Card>
);

function SalaryInsights() {
  const [countries, setCountries] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');
  const [countryInsights, setCountryInsights] = useState(null);
  const [jobTitleInsight, setJobTitleInsight] = useState(null);
  const [countryStats, setCountryStats] = useState([]);
  const [globalInsights, setGlobalInsights] = useState(null);
  const [loading, setLoading] = useState({ country: false, jobTitle: false, stats: false });

  useEffect(() => { loadMetadata(); loadGlobalInsights(); loadCountryStats(); }, []);
  useEffect(() => { if (selectedCountry) loadCountryInsights(); }, [selectedCountry]);
  useEffect(() => { if (selectedCountry && selectedJobTitle) loadJobTitleInsight(); }, [selectedCountry, selectedJobTitle]);

  const loadMetadata = async () => {
    try {
      const [cr, jr] = await Promise.all([getCountries(), getJobTitles()]);
      const cl = Array.isArray(cr.data) ? cr.data : [];
      const jl = Array.isArray(jr.data) ? jr.data : [];
      setCountries(cl); setJobTitles(jl);
      if (cl.length > 0) setSelectedCountry(cl[0]);
      if (jl.length > 0) setSelectedJobTitle(jl[0]);
    } catch {}
  };

  const loadCountryInsights = async () => {
    setLoading(p => ({ ...p, country: true }));
    try { const r = await getCountryInsights(selectedCountry); setCountryInsights(r.data); } catch {}
    setLoading(p => ({ ...p, country: false }));
  };

  const loadJobTitleInsight = async () => {
    setLoading(p => ({ ...p, jobTitle: true }));
    try { const r = await getJobTitleInsights(selectedCountry, selectedJobTitle); setJobTitleInsight(r.data); } catch {}
    setLoading(p => ({ ...p, jobTitle: false }));
  };

  const loadCountryStats = async () => {
    setLoading(p => ({ ...p, stats: true }));
    try { const r = await getCountryStats(); setCountryStats(Array.isArray(r.data) ? r.data : []); } catch {}
    setLoading(p => ({ ...p, stats: false }));
  };

  const loadGlobalInsights = async () => {
    try { const r = await getGlobalInsights(); setGlobalInsights(r.data); } catch {}
  };

  const fmt = (v) => '₹' + new Intl.NumberFormat('en-IN', { minimumFractionDigits: 0 }).format(v);

  const selectSx = { '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#fff' } };
  const menuProps = { PaperProps: { sx: { maxHeight: 260, borderRadius: 2 } } };

  return (
    <Box>
      {/* Global Stats */}
      {globalInsights && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Employees" value={globalInsights.totalEmployees?.toLocaleString()}
              icon={<People />} bgcolor="#ede9fe" color="#7c3aed" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Global Avg Salary" value={fmt(globalInsights.globalAvg)}
              icon={<CurrencyRupee />} bgcolor="#d1fae5" color="#059669" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Highest Salary" value={fmt(globalInsights.globalMax)}
              icon={<TrendingUp />} bgcolor="#fee2e2" color="#dc2626" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Lowest Salary" value={fmt(globalInsights.globalMin)}
              icon={<TrendingDown />} bgcolor="#fef3c7" color="#d97706" />
          </Grid>
        </Grid>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Country & Job Title Insights */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#111827' }}>
        Country-Specific Insights
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#374151' }}>
                Salary by Country
              </Typography>
              <FormControl fullWidth size="small" sx={{ ...selectSx, mb: 2 }}>
                <InputLabel>Country</InputLabel>
                <Select value={selectedCountry} label="Country" onChange={(e) => setSelectedCountry(e.target.value)} MenuProps={menuProps}>
                  {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>

              {loading.country ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={28} sx={{ color: '#4f46e5' }} /></Box>
              ) : countryInsights && (
                <Grid container spacing={1.5}>
                  {[
                    { label: 'Min Salary', value: fmt(countryInsights.minSalary), color: '#fef3c7', text: '#92400e' },
                    { label: 'Avg Salary', value: fmt(countryInsights.avgSalary), color: '#d1fae5', text: '#065f46' },
                    { label: 'Max Salary', value: fmt(countryInsights.maxSalary), color: '#fee2e2', text: '#991b1b' },
                  ].map(({ label, value, color, text }) => (
                    <Grid item xs={4} key={label}>
                      <Box sx={{ p: 1.5, textAlign: 'center', bgcolor: color, borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: text, fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase' }}>{label}</Typography>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ color: text, mt: 0.3 }}>{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', textAlign: 'center' }}>
                      {countryInsights.employeeCount} employees in {selectedCountry}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, color: '#374151' }}>
                Avg Salary by Job Title
              </Typography>
              <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small" sx={selectSx}>
                    <InputLabel>Country</InputLabel>
                    <Select value={selectedCountry} label="Country" onChange={(e) => setSelectedCountry(e.target.value)} MenuProps={menuProps}>
                      {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small" sx={selectSx}>
                    <InputLabel>Job Title</InputLabel>
                    <Select value={selectedJobTitle} label="Job Title" onChange={(e) => setSelectedJobTitle(e.target.value)} MenuProps={menuProps}>
                      {jobTitles.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {loading.jobTitle ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}><CircularProgress size={28} sx={{ color: '#4f46e5' }} /></Box>
              ) : jobTitleInsight && jobTitleInsight.employeeCount > 0 ? (
                <Box sx={{ p: 2, bgcolor: '#ede9fe', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#5b21b6', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    Avg {selectedJobTitle} in {selectedCountry}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: '#4f46e5', my: 0.5 }}>{fmt(jobTitleInsight.avgSalary)}</Typography>
                  <Typography variant="caption" sx={{ color: '#7c3aed' }}>Based on {jobTitleInsight.employeeCount} employee(s)</Typography>
                </Box>
              ) : jobTitleInsight && (
                <Box sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#92400e' }}>No data for this combination</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Country Stats Table */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: '#111827' }}>
        Salary Metrics by Country
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f8fafc' }}>
              {['Country', 'Employees', 'Min Salary', 'Avg Salary', 'Max Salary'].map((h, i) => (
                <TableCell key={h} align={i > 0 ? 'right' : 'left'}
                  sx={{ color: '#6b7280', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading.stats ? (
              <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4 }}><CircularProgress size={28} sx={{ color: '#4f46e5' }} /></TableCell></TableRow>
            ) : countryStats.map((stat) => (
              <TableRow key={stat.country} hover sx={{ '&:hover': { bgcolor: '#f8fafc' }, '&:last-child td': { border: 0 } }}>
                <TableCell>
                  <Chip label={stat.country} size="small" variant="outlined" sx={{ borderColor: '#e5e7eb', color: '#374151', fontSize: '0.75rem' }} />
                </TableCell>
                <TableCell align="right" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{stat.employeeCount}</TableCell>
                <TableCell align="right" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{fmt(stat.minSalary)}</TableCell>
                <TableCell align="right">
                  <Typography fontWeight={700} fontSize="0.8rem" color="#059669">{fmt(stat.avgSalary)}</Typography>
                </TableCell>
                <TableCell align="right" sx={{ color: '#6b7280', fontSize: '0.8rem' }}>{fmt(stat.maxSalary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default SalaryInsights;
