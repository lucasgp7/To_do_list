const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const tarefasFilePath = path.join(__dirname, 'public', 'tarefas.json');

function readTarefas() {
    const tarefasData = fs.readFileSync(tarefasFilePath);
    return JSON.parse(tarefasData);
}

function writeTarefas(tarefas) {
    fs.writeFileSync(tarefasFilePath, JSON.stringify(tarefas, null, 2));
}

app.get('/tarefas', (req, res) => {
    const tarefas = readTarefas();
    res.json(tarefas);
});

app.post('/tarefas', (req, res) => {
    const novaTarefa = req.body;
    const tarefas = readTarefas();
    novaTarefa.id = tarefas.length ? tarefas[tarefas.length - 1].id + 1 : 1;
    tarefas.push(novaTarefa);
    writeTarefas(tarefas);
    res.status(201).json(novaTarefa);
});

app.put('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const tarefas = readTarefas();
    const tarefa = tarefas.find(t => t.id === parseInt(id));
    if (tarefa) {
        tarefa.status = status;
        writeTarefas(tarefas);
        res.json(tarefa);
    } else {
        res.status(404).send('Tarefa não encontrada');
    }
});

app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params;
    let tarefas = readTarefas();
    tarefas = tarefas.filter(t => t.id !== parseInt(id));
    writeTarefas(tarefas);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});