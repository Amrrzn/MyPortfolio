require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// 1. GET all tasks
app.get('/api/tasks', async (req, res) => {
  const { data, error } = await supabase.from('tasks').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// 2. POST create a new task
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  const { data, error } = await supabase.from('tasks').insert([{ title }]).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 3. PUT update a task (toggle completion or edit)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// 4. DELETE a task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Task deleted successfully' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
