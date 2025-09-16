let tarefas = [];
let indiceEdicao = -1;

const formularioTarefa = document.getElementById('form-tarefa');
const inputTarefa = document.getElementById('input-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const mensagemDiv = document.getElementById('mensagem');
const botaoAdicionar = document.getElementById('botao-adicionar');

document.addEventListener('DOMContentLoaded', () => {
    carregarLocalStorage();
    listarTarefas();
    
    formularioTarefa.addEventListener('submit', manipularEnvioFormulario);
});

function manipularEnvioFormulario(e) {
    e.preventDefault();
    
    const texto = inputTarefa.value.trim();
    
    if (indiceEdicao === -1) {
        if (validarTarefa(texto)) {
            adicionarTarefa(texto);
            inputTarefa.value = '';
            exibirMensagem('Tarefa adicionada com sucesso!', 'sucesso');
        }
    } else {
        if (validarTarefa(texto, indiceEdicao)) {
            editarTarefa(indiceEdicao, texto);
            inputTarefa.value = '';
            botaoAdicionar.textContent = 'Adicionar';
            indiceEdicao = -1;
            exibirMensagem('Tarefa atualizada com sucesso!', 'sucesso');
        }
    }
}

function adicionarTarefa(texto) {
    tarefas.push(texto);
    salvarLocalStorage();
    listarTarefas();
}

function listarTarefas() {
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, indice) => {
        const li = document.createElement('li');
        li.className = 'item-tarefa';
        
        const spanTarefa = document.createElement('span');
        spanTarefa.className = 'texto-tarefa';
        spanTarefa.textContent = tarefa;
        
        const divBotoes = document.createElement('div');
        divBotoes.className = 'botoes-tarefa';
        
        const botaoEditar = document.createElement('button');
        botaoEditar.className = 'botao-editar';
        botaoEditar.textContent = 'Editar';
        botaoEditar.addEventListener('click', () => iniciarEdicao(indice));
        
        const botaoExcluir = document.createElement('button');
        botaoExcluir.className = 'botao-excluir';
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.addEventListener('click', () => removerTarefa(indice));
        
        divBotoes.appendChild(botaoEditar);
        divBotoes.appendChild(botaoExcluir);
        
        li.appendChild(spanTarefa);
        li.appendChild(divBotoes);
        
        listaTarefas.appendChild(li);
    });
}

function removerTarefa(indice) {
    tarefas.splice(indice, 1);
    salvarLocalStorage();
    listarTarefas();
    exibirMensagem('Tarefa excluída com sucesso!', 'sucesso')
}

function iniciarEdicao(indice) {
    inputTarefa.value = tarefas[indice];
    inputTarefa.focus();
    indiceEdicao = indice;
    botaoAdicionar.textContent = 'Atualizar';
}

function editarTarefa(indice, novoTexto) {
    tarefas[indice] = novoTexto;
    salvarLocalStorage();
    listarTarefas();
}

function validarTarefa(texto, indiceEdicao = -1) {
    if (texto === '') {
        exibirMensagem('Por favor, digite uma tarefa!', 'erro');
        return false;
    }
    
    const duplicata = tarefas.some((tarefa, indice) => 
        tarefa.toLowerCase() === texto.toLowerCase() && indice !== indiceEdicao
    );
    
    if (duplicata) {
        exibirMensagem('Esta tarefa já existe na lista!', 'erro');
        return false;
    }
    
    return true;
}

function exibirMensagem(mensagem, tipo) {
    mensagemDiv.textContent = mensagem;
    mensagemDiv.className = tipo === 'sucesso' ? 'mensagem-sucesso' : 'mensagem-erro';
    mensagemDiv.classList.remove('oculto');
}

function salvarLocalStorage() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarLocalStorage() {
    const tarefasSalvas = localStorage.getItem('tarefas');
    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas);
    } 
}
