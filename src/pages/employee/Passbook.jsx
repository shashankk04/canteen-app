import { useEffect, useState } from 'react';
import {
  Typography, Box, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Chip, Alert
} from '@mui/material';
import api from '../../utils/api';

const typeColors = {
  credit: 'success',
  debit: 'error',
};

const Passbook = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/transactions/me');
      setTransactions(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(tx => filter.type ? tx.type === filter.type : true);

  return (
    <Box>
      <Box className="mb-8 flex items-center justify-between">
        <Box>
          <Typography variant="h4" className="font-extrabold text-slate-100 mb-1 tracking-tight">My Passbook</Typography>
          <Typography variant="body1" className="text-slate-400">View your transaction history</Typography>
        </Box>
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
      </Box>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40">
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
                    <TableCell className="text-slate-200 font-bold">Type</TableCell>
                    <TableCell className="text-slate-200 font-bold">Amount</TableCell>
                    <TableCell className="text-slate-200 font-bold">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-slate-400 text-center">No transactions found.</TableCell>
                    </TableRow>
                  ) : filtered.map(tx => (
                    <TableRow key={tx._id} className="hover:bg-slate-700/40 transition">
                      <TableCell className="text-slate-100">{new Date(tx.createdAt).toLocaleString()}</TableCell>
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
    </Box>
  );
};

export default Passbook; 