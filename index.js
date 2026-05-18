require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const ws = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    transport: ws
  }
});

//teste
app.get("/", (req, res) => {
  res.json({ status: "API do Catálogo de Datasets está online!" });
});

//categorias aqui

//aqui é listar
app.get("/categorias", async (req, res) => {
  const { data, error } = await supabase
    .from("categorias")
    .select();
  if (error) {
    return res.status(500).json({ erro: "Erro ao buscar categorias", detalhes: error.message });
  }
  res.json(data);
});

//criar
app.post('/categorias', async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
  }
  const { data, error } = await supabase
    .from('categorias')
    .insert([{ nome }])
    .select();
  if (error) {
    return res.status(500).json({ erro: 'Erro ao inserir categoria', detalhes: error.message });
  }
  res.status(201).json(data[0]);
});

// EDITAR
app.put('/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório.' });
  }
  const { data, error } = await supabase
    .from('categorias')
    .update({ nome })
    .eq('id', id)
    .select();
  if (error) {
    return res.status(500).json({ erro: 'Erro ao atualizar categoria', detalhes: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ erro: 'Categoria não encontrada.' });
  }
  res.json(data[0]);
});

// DELETAR
app.delete('/categorias/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('id', id);
  if (error) {
    return res.status(500).json({ erro: 'Erro ao deletar categoria', detalhes: error.message });
  }
  res.status(204).send();
});

// ====================== DATASETS =====================

// LISTAR
app.get('/datasets', async (req, res) => {
  const { data, error } = await supabase
    .from('datasets')
    .select();
  if (error) {
    return res.status(500).json({ erro: 'Erro ao buscar datasets', detalhes: error.message });
  }
  res.json(data);
});

// CRIAR
app.post('/datasets', async (req, res) => {
  const { nome, descricao, fonte_url, categoria_id } = req.body;
  if (!nome || !descricao || !categoria_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, descricao, categoria_id' });
  }
  const { data, error } = await supabase
    .from('datasets')
    .insert([{ nome, descricao, fonte_url, categoria_id }])
    .select();
  if (error) {
    return res.status(500).json({ erro: 'Erro ao cadastrar dataset', detalhes: error.message });
  }
  res.status(201).json(data[0]);
});

// EDITAR
app.put('/datasets/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, fonte_url, categoria_id } = req.body;
  if (!nome || !descricao || !categoria_id) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, descricao, categoria_id' });
  }
  const { data, error } = await supabase
    .from('datasets')
    .update({ nome, descricao, fonte_url, categoria_id })
    .eq('id', id)
    .select();
  if (error) {
    return res.status(500).json({ erro: 'Erro ao atualizar dataset', detalhes: error.message });
  }
  if (!data || data.length === 0) {
    return res.status(404).json({ erro: 'Dataset não encontrado.' });
  }
  res.json(data[0]);
});

// DELETAR
app.delete('/datasets/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('datasets')
    .delete()
    .eq('id', id);
  if (error) {
    return res.status(500).json({ erro: 'Erro ao deletar dataset', detalhes: error.message });
  }
  res.status(204).send();
});

// ====================== EXECUTA SERVIDOR =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});