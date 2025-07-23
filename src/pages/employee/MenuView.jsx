import { useEffect, useState } from 'react';
import {
  Typography, Box, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Alert, TextField
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import api from '../../utils/api';

const MenuView = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchTodayItems();
  }, []);

  const fetchTodayItems = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/items/today');
      setItems(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to fetch today\'s items');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities(q => ({ ...q, [itemId]: value }));
  };

  const handlePurchase = async (itemId) => {
    setPurchasing(itemId);
    setError('');
    setSuccess('');
    try {
      await api.post('/purchase/employee', { itemId, quantity: Number(quantities[itemId] || 1) });
      setSuccess('Purchase successful!');
      fetchTodayItems();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to purchase item');
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <Box className="max-w-4xl w-full px-6 md:px-12">
      <Box className="mb-8">
        <Typography 
          variant="h4" 
          className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-1 tracking-tight"
          sx={{ fontSize: '2rem', letterSpacing: '-0.03em' }}
        >
          Today’s Menu
        </Typography>
        <Typography variant="body1" className="text-slate-400" sx={{ fontSize: '1rem' }}>Order from today’s available items</Typography>
      </Box>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}
      <Card className="rounded-xl shadow-xl bg-gradient-to-br from-yellow-500 to-yellow-700 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40">
        <CardContent>
          {loading ? (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} className="bg-transparent">
              <Table>
                <TableHead>
                  <TableRow style={{ background: '#243c5a' }}>
                    <TableCell className="text-white font-bold">Name</TableCell>
                    <TableCell className="text-white font-bold">Price</TableCell>
                    <TableCell className="text-white font-bold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-slate-400 text-center">No items available today.</TableCell>
                    </TableRow>
                  ) : items.map(item => (
                    <TableRow
                      key={item._id}
                      style={{ transition: 'background 0.2s', cursor: 'pointer' }}
                      className="hover:bg-blue-900/60"
                    >
                      <TableCell className="text-slate-100">{item.name}</TableCell>
                      <TableCell className="text-slate-100">₹{item.price}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          value={quantities[item._id] || 1}
                          onChange={e => handleQuantityChange(item._id, e.target.value)}
                          inputProps={{ min: 1, max: item.quantity }}
                          style={{ width: 60, marginRight: 8 }}
                        />
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          className="bg-gradient-to-br from-green-500 to-green-700 text-white shadow-lg rounded-xl"
                          onClick={() => handlePurchase(item._id)}
                          disabled={purchasing === item._id}
                        >
                          {purchasing === item._id ? 'Purchasing...' : 'Purchase'}
                        </Button>
                      </TableCell>
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

export default MenuView; 