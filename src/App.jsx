import React, { useState } from 'react';
import {
  Container, AppBar, Toolbar, Typography, Box, Tabs, Tab, Paper
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import InsightsIcon from '@mui/icons-material/Insights';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmployeeList from './components/EmployeeList';
import SalaryInsights from './components/SalaryInsights';

const theme = createTheme({
  palette: {
    primary: { main: '#4f46e5' },
    secondary: { main: '#06b6d4' },
    background: { default: '#f0f2f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6b7280' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)', borderRadius: 12 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
      },
    },
  },
});

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" elevation={0} sx={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Toolbar sx={{ py: 0.5 }}>
            <AccountBalanceWalletIcon sx={{ mr: 1.5, fontSize: 28 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Salary Management System
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.75, fontSize: '0.7rem' }}>
                HR Manager Portal
              </Typography>
            </Box>
            <Box sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              px: 2, py: 0.5,
              borderRadius: 20,
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                Admin
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
          <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{
                px: 2,
                pt: 1,
                borderBottom: '1px solid #e5e7eb',
                bgcolor: '#fafafa',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  minHeight: 48,
                  color: '#6b7280',
                  gap: 1,
                  '&.Mui-selected': { color: '#4f46e5' },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#4f46e5',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              <Tab icon={<PeopleAltIcon fontSize="small" />} iconPosition="start" label="Employee Management" />
              <Tab icon={<InsightsIcon fontSize="small" />} iconPosition="start" label="Salary Insights" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <EmployeeList />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <SalaryInsights />
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
