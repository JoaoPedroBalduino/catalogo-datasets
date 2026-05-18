const API = "http://localhost:3000"; // Troque se precisar

// --- CATEGORIAS ---
const categoriasList = document.getElementById('categorias-list');
const categoriaForm = document.getElementById('categoria-form');
const novaCategoria = document.getElementById('nova-categoria');

async function carregarCategorias() {
  const res = await fetch(`${API}/categorias`);
  const categorias = await res.json();
  categoriasList.innerHTML = '';
  categorias.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${cat.id}</b>: ${cat.nome} 
      <button data-id="${cat.id}" class="del-cat"
        style="float:right;background:#222;color:#af5;min-width:38px;">🗑</button>`;
    categoriasList.appendChild(li);
    li.querySelector('.del-cat').onclick = async e => {
      await fetch(`${API}/categorias/${cat.id}`, { method: "DELETE" });
      carregarCategorias();
      carregarDatasets();
    };
  });
}

categoriaForm.onsubmit = async (e) => {
  e.preventDefault();
  await fetch(`${API}/categorias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: novaCategoria.value })
  });
  novaCategoria.value = '';
  carregarCategorias();
};


// --- DATASETS ---
const datasetsList = document.getElementById('datasets-list');
const datasetForm = document.getElementById('dataset-form');
const nomeDataset = document.getElementById('nome-dataset');
const descricaoDataset = document.getElementById('descricao-dataset');
const categoriaIdDataset = document.getElementById('categoria-id-dataset');

async function carregarDatasets() {
  const res = await fetch(`${API}/datasets`);
  const datasets = await res.json();
  datasetsList.innerHTML = '';
  datasets.forEach(ds => {
    const li = document.createElement('li');
    li.innerHTML = `<b>${ds.id}</b>: ${ds.nome}<br>
    <i>${ds.descricao}</i> <span style="color:#9ff;font-size:11px;">[cat:${ds.categoria_id}]</span>
    <button data-id="${ds.id}" class="del-dataset"
      style="float:right;background:#222;color:#ff6040;min-width:38px;">🗑</button>`;
    datasetsList.appendChild(li);
    li.querySelector('.del-dataset').onclick = async e => {
      await fetch(`${API}/datasets/${ds.id}`, { method: "DELETE" });
      carregarDatasets();
    };
  });
}

datasetForm.onsubmit = async (e) => {
  e.preventDefault();
  await fetch(`${API}/datasets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nomeDataset.value,
      descricao: descricaoDataset.value,
      categoria_id: Number(categoriaIdDataset.value)
    })
  });
  nomeDataset.value = '';
  descricaoDataset.value = '';
  categoriaIdDataset.value = '';
  carregarDatasets();
};

carregarCategorias();
carregarDatasets();