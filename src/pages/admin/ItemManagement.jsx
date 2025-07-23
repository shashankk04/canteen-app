import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Typography, Box, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Tooltip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Alert
} from '@mui/material';
import { Add, Edit, Delete, RestaurantMenu, Save, Close, RemoveCircle } from '@mui/icons-material';
import api from '../../utils/api';

const ItemManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: '', price: '' });
  const [saving, setSaving] = useState(false);
  const [todayDialogOpen, setTodayDialogOpen] = useState(false);
  const [todayItemId, setTodayItemId] = useState("");
  const [todayQuantity, setTodayQuantity] = useState("");
  const [todayLoading, setTodayLoading] = useState(false);
  const [todayAvailableIds, setTodayAvailableIds] = useState([]);
  const [editingQtyId, setEditingQtyId] = useState(null);
  const [editingQtyValue, setEditingQtyValue] = useState('');
  const [qtySaving, setQtySaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchItems();
    fetchTodayItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items/master');
      setItems(res.data);
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayItems = async () => {
    try {
      const res = await api.get('/items/today');
      setTodayAvailableIds(res.data.map(i => i._id));
    } catch (e) {
      // handle error
    }
  };

  const handleOpen = (item = null) => {
    setEditMode(!!item);
    setSelected(item);
    setForm(item ? { name: item.name, price: item.price } : { name: '', price: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelected(null);
    setForm({ name: '', price: '' });
    setEditMode(false);
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!form.name || form.price === '') {
      setError('All fields are required.');
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      setError('Price must be a non-negative number.');
      return;
    }
    setSaving(true);
    try {
      if (editMode && selected) {
        await api.patch(`/items/master/${selected._id}`, { ...form, price });
        setSuccess('Item updated successfully!');
      } else {
        await api.post('/items/master', { ...form, price });
        setSuccess('Item added successfully!');
      }
      fetchItems();
      handleClose();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await api.delete(`/items/master/${id}`);
      fetchItems();
      fetchTodayItems();
    } catch (e) {
      // handle error
    }
  };

  const handleToggleToday = id => {
    setTodayItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSaveToday = async () => {
    setSavingToday(true);
    try {
      await api.post('/items/today', { itemIds: todayItems });
      fetchTodayItems();
    } catch (e) {
      // handle error
    } finally {
      setSavingToday(false);
    }
  };

  // Handler for opening today's item dialog
  const openTodayDialog = (itemId) => {
    setTodayItemId(itemId);
    setTodayQuantity("");
    setTodayDialogOpen(true);
  };
  const closeTodayDialog = () => {
    setTodayDialogOpen(false);
    setTodayItemId("");
    setTodayQuantity("");
  };

  // Handler for setting today's item
  const handleSetToday = async () => {
    setTodayLoading(true);
    setError('');
    setSuccess('');
    const qty = parseFloat(todayQuantity);
    if (isNaN(qty) || qty < 0) {
      setError('Quantity must be a non-negative number.');
      setTodayLoading(false);
      return;
    }
    try {
      await api.post('/items/today', { itemId: todayItemId, quantity: qty });
      fetchItems();
      fetchTodayItems();
      closeTodayDialog();
      setSuccess('Today\'s item set successfully!');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to set today\'s item');
    } finally {
      setTodayLoading(false);
    }
  };

  // Handler for removing from today's items
  const handleRemoveToday = async (itemId) => {
    try {
      await api.patch(`/items/today/${itemId}/unset`);
      fetchItems();
      fetchTodayItems();
    } catch (e) {
      // handle error
    }
  };

  // Inline quantity save handler
  const handleSaveQuantity = async (item) => {
    setError('');
    setSuccess('');
    const qty = parseFloat(editingQtyValue);
    if (isNaN(qty) || qty < 0) {
      setError('Quantity must be a non-negative number.');
      return;
    }
    setQtySaving(true);
    try {
      if (item.isTodayAvailable) {
        await api.patch(`/items/today/${item._id}/quantity`, { quantity: qty });
      } else {
        await api.patch(`/items/master/${item._id}`, { quantity: qty });
      }
      setEditingQtyId(null);
      setEditingQtyValue('');
      fetchItems();
      fetchTodayItems();
      setSuccess('Quantity updated successfully!');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update quantity');
    } finally {
      setQtySaving(false);
    }
  };

  return (
    <DashboardLayout>
      <Box className="mb-8 flex items-center justify-between">
        <Typography variant="h4" className="font-extrabold text-slate-100 mb-1 tracking-tight" sx={{ fontSize: '1.5rem' }}>Item Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md rounded-lg"
          sx={{ fontSize: 14, px: 2.5, py: 1, borderRadius: '0.75rem', height: 36 }}
          onClick={() => handleOpen()}
        >
          Add Item
        </Button>
      </Box>
      <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-80 backdrop-blur-xl border border-[#334155]/40 mb-8">
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
                    <TableCell className="text-slate-200 font-bold">Name</TableCell>
                    <TableCell className="text-slate-200 font-bold">Price</TableCell>
                    <TableCell className="text-slate-200 font-bold">Quantity</TableCell>
                    <TableCell className="text-slate-200 font-bold">Today’s Menu</TableCell>
                    <TableCell className="text-slate-200 font-bold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item._id} className="hover:bg-slate-700/40 transition">
                      <TableCell className="text-slate-100">{item.name}</TableCell>
                      <TableCell className="text-slate-100">₹{item.price}</TableCell>
                      <TableCell className="text-slate-100">
                        {editingQtyId === item._id ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            {error && <Alert severity="error" className="mb-2">{error}</Alert>}
                            {success && <Alert severity="success" className="mb-2">{success}</Alert>}
                            <TextField
                              value={editingQtyValue}
                              onChange={e => setEditingQtyValue(e.target.value)}
                              type="number"
                              size="small"
                              sx={{ width: 80 }}
                              inputProps={{ min: 0 }}
                            />
                            <IconButton onClick={() => handleSaveQuantity(item)} disabled={qtySaving}>
                              <Save className="text-green-400" />
                            </IconButton>
                            <IconButton onClick={() => { setEditingQtyId(null); setEditingQtyValue(''); }}>
                              <Close className="text-red-400" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center" gap={1}>
                            <span>{item.quantity ?? '--'}</span>
                            <IconButton size="small" onClick={() => { setEditingQtyId(item._id); setEditingQtyValue(item.quantity ?? ''); }}>
                              <Edit className="text-blue-400" fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {todayAvailableIds.includes(item._id) ? (
                          <Box display="flex" alignItems="center" gap={1}>
                            <span style={{ color: 'green', fontWeight: 'bold' }}>Today</span>
                            <Tooltip title="Remove from Today's Items">
                              <IconButton size="small" onClick={() => handleRemoveToday(item._id)}>
                                <RemoveCircle className="text-red-400" fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        ) : (
                          <Button size="small" variant="outlined" onClick={() => openTodayDialog(item._id)}>
                            Set as Today's Item
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpen(item)}>
                            <Edit className="text-green-400" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleDelete(item._id)}>
                            <Delete className="text-red-400" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle className="font-bold text-slate-100 bg-slate-900">{editMode ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent className="bg-slate-800">
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
          <TextField
            margin="dense"
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            type="number"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
        </DialogContent>
        <DialogActions className="bg-slate-900">
          <Button onClick={handleClose} className="text-slate-300">Cancel</Button>
          <Button onClick={handleSave} variant="contained" className="bg-gradient-to-br from-green-500 to-green-700 text-white" disabled={saving}>
            {saving ? 'Saving...' : (editMode ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Today's Item Dialog */}
      <Dialog open={todayDialogOpen} onClose={closeTodayDialog} maxWidth="xs" fullWidth>
        <DialogTitle className="font-bold text-slate-100 bg-slate-900">Set Today's Item Quantity</DialogTitle>
        <DialogContent className="bg-slate-800">
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          {success && <Alert severity="success" className="mb-4">{success}</Alert>}
          <TextField
            margin="dense"
            label="Quantity"
            name="quantity"
            value={todayQuantity}
            onChange={e => setTodayQuantity(e.target.value)}
            fullWidth
            variant="outlined"
            type="number"
            className="mb-4"
            InputProps={{ className: 'text-slate-100' }}
          />
        </DialogContent>
        <DialogActions className="bg-slate-900">
          <Button onClick={closeTodayDialog} className="text-slate-300">Cancel</Button>
          <Button onClick={handleSetToday} variant="contained" className="bg-gradient-to-br from-yellow-500 to-yellow-700 text-white" disabled={todayLoading || !todayQuantity}>
            {todayLoading ? 'Saving...' : 'Set'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default ItemManagement; 