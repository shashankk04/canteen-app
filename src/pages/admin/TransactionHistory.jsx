import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Typography, Box, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Chip
} from '@mui/material';
import api from '../../utils/api';

const typeColors = {
  credit: 'success',
  debit: 'error',
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', search: '' });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(tx => {
    const matchesType = filter.type ? tx.type === filter.type : true;
    const matchesSearch = filter.search
      ? (tx.employee?.name?.toLowerCase().includes(filter.search.toLowerCase()) ||
         tx.employee?.email?.toLowerCase().includes(filter.search.toLowerCase()))
      : true;
    return matchesType && matchesSearch;
  });

  return (
    <DashboardLayout>
      <Box className="mb-8 flex items-center justify-between">
        <Box>
          <Typography variant="h4" className="font-extrabold text-slate-100 mb-1 tracking-tight" sx={{ fontSize: '1.5rem' }}>Transaction History</Typography>
          <Typography variant="body1" className="text-slate-400" sx={{ fontSize: '1rem' }}>Monitor all financial transactions</Typography>
        </Box>
        <Box className="flex gap-3">
          <TextField
            select
            label="Type"
            value={filter.type}
            onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
            size="small"
            className="bg-slate-800 rounded-lg"
            InputProps={{ className: 'text-slate-100' }}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="debit">Debit</MenuItem>
          </TextField>
          <TextField
            label="Search by user"
            value={filter.search}
            onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            size="small"
            className="bg-slate-800 rounded-lg"
            InputProps={{ className: 'text-slate-100' }}
          />
        </Box>
      </Box>
      <Card className="rounded-xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40">
        <CardContent>
          {loading ? (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} className="bg-transparent">
              <Table>
                <TableHead>
                  <TableRow className="bg-slate-800/80">
                    <TableCell className="text-slate-200 font-bold">Date</TableCell>
                    <TableCell className="text-slate-200 font-bold">User</TableCell>
                    <TableCell className="text-slate-200 font-bold">Type</TableCell>
                    <TableCell className="text-slate-200 font-bold">Amount</TableCell>
                    <TableCell className="text-slate-200 font-bold">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-slate-400 text-center">No transactions found.</TableCell>
                    </TableRow>
                  ) : filtered.map(tx => (
                    <TableRow key={tx._id} className="hover:bg-slate-700/40 transition">
                      <TableCell className="text-slate-100">{new Date(tx.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-slate-100">{tx.employee?.name} <span className="text-slate-400 text-xs">({tx.employee?.email})</span></TableCell>
                      <TableCell>
                        <Chip label={tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} color={typeColors[tx.type]} size="small" />
                      </TableCell>
                      <TableCell className="text-slate-100">₹{tx.amount}</TableCell>
                      <TableCell className="text-slate-100">{tx.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TransactionHistory; 