const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://jusxnnedjqazpvdwrrie.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1c3hubmVkanFhenB2ZHdycmllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTE5NTQ2OSwiZXhwIjoyMDY0NzcxNDY5fQ.MvmNfCibrQp-StYqFPm2rlZOJaxropPwOmEkCRbmL7c';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// USERS -----------------------------
app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/users', async (req, res) => {
  const { name, avatar } = req.body;
  if (!name) return res.status(400).json({ error: 'Имя обязательно' });
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, avatar }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// CATEGORIES ------------------------
app.get('/categories', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/categories', async (req, res) => {
  const { name, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Название обязательно' });
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, color }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  // Проверяем, есть ли todos с этой категорией
  const { count, error: countError } = await supabase
    .from('todos')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);
  if (countError) return res.status(500).json({ error: countError.message });
  if ((count ?? 0) > 0) return res.status(400).json({ error: 'Категория используется в задачах' });

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});
    app.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ error: 'Название обязательно' });
    const { data, error } = await supabase
        .from('categories')
        .update({ name, color })
        .eq('id', id)
        .select()
        .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
    });
// TODOS -----------------------------
app.get('/todos', async (req, res) => {
  const { user_id } = req.query;
  let query = supabase.from('todos').select('*');
  if (user_id) {
    query = query.eq('user_id', user_id);
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/todos', async (req, res) => {
  const { text, category_id, user_id } = req.body;
  if (!text || !user_id) return res.status(400).json({ error: 'Текст и пользователь обязательны' });
  const { data, error } = await supabase
    .from('todos')
    .insert([{ text, category_id, user_id }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { text, category_id } = req.body;
  const { data, error } = await supabase
    .from('todos')
    .update({ text, category_id })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.patch('/todos/:id/toggle', async (req, res) => {
  const { id } = req.params;
  // Получить текущее значение completed
  const { data: todo, error: getError } = await supabase
    .from('todos')
    .select('completed')
    .eq('id', id)
    .single();
  if (getError || !todo) return res.status(500).json({ error: getError?.message || 'Not found' });
  const { data, error } = await supabase
    .from('todos')
    .update({ completed: !todo.completed })
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('todos').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Порт и запуск ----------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});