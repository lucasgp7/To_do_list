const botaoAdiciona = document.querySelector("#botaoAdiciona");
const inputTarefa = document.querySelector("#tarefa");
const lista = document.querySelector("#lista");

botaoAdiciona.addEventListener('click', adicionaTarefa);

async function fetchTarefas() {
    const response = await fetch('http://localhost:3000/tarefas');
    const tarefas = await response.json();
    lista.innerHTML = '';
    tarefas.forEach(tarefa => {
        adicionaTarefaNaLista(tarefa);
    });
}

function adicionaTarefaNaLista(tarefa) {
    let itemDiv = document.createElement('div');
    itemDiv.classList.add('tarefa-item');
    if (tarefa.status === 1) itemDiv.classList.add('completa');

    let li = document.createElement('li');
    li.innerText = tarefa.descricao;
    itemDiv.appendChild(li);

    let btFeito = document.createElement('button');
    btFeito.innerHTML = '<i class="fas fa-check"></i>';
    btFeito.classList.add('botao-feito');
    itemDiv.appendChild(btFeito);

    let btExcluir = document.createElement('button');
    btExcluir.innerHTML = '<i class="fas fa-trash"></i>';
    btExcluir.classList.add('botao-excluir');
    itemDiv.appendChild(btExcluir);

    itemDiv.dataset.id = tarefa.id;

    lista.appendChild(itemDiv);
}

async function adicionaTarefa() {
    if (inputTarefa.value.length > 3) {
        const novaTarefa = { descricao: inputTarefa.value, status: 0 };
        await fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaTarefa)
        });
        fetchTarefas();
        inputTarefa.value = '';
    }
}

inputTarefa.addEventListener("keyup", (evento) => {
    if (evento.key === "Enter") {
        adicionaTarefa();
    }
});

lista.addEventListener('click', async (evento) => {
    let targetElement = evento.target;
    if (targetElement.tagName.toLowerCase() === 'i') {
        targetElement = targetElement.parentElement;
    }

    const tarefaDiv = targetElement.parentElement;
    const tarefaId = tarefaDiv.dataset.id;

    if (targetElement.classList.contains('botao-feito')) {
        const status = tarefaDiv.classList.contains('completa') ? 0 : 1;
        await fetch(`http://localhost:3000/tarefas/${tarefaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        fetchTarefas();
    } else if (targetElement.classList.contains('botao-excluir')) {
        await fetch(`http://localhost:3000/tarefas/${tarefaId}`, {
            method: 'DELETE'
        });
        fetchTarefas();
    }
});

document.addEventListener('DOMContentLoaded', fetchTarefas);