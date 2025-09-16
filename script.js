
let tarefas = [];
let indiceEdicao = -1;
let inputTarefa, listaTarefas, mensagemDiv, botaoAdicionar;

document.addEventListener('DOMContentLoaded', function() {

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    createThemeSwitcher();
    document.getElementById('theme-switcher').addEventListener('click', toggleTheme);
    initMobileMenu();
    
    // Gerenciamento de tarefas - inicializar variáveis
    const formularioTarefa = document.getElementById('form-tarefa');
    inputTarefa = document.getElementById('input-tarefa');
    listaTarefas = document.getElementById('lista-tarefas');
    mensagemDiv = document.getElementById('mensagem');
    botaoAdicionar = document.getElementById('botao-adicionar');

    carregarLocalStorage();
    listarTarefas();
    
    formularioTarefa.addEventListener('submit', manipularEnvioFormulario);
});

// Funções para gerenciamento de tema
function applyTheme(theme) {
    const body = document.body;
    
    if (theme === 'light') {
        body.classList.add('light-mode');
        body.style.background = 'linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 50%, #d1d1d1 100%)';
    } else {
        body.classList.remove('light-mode');
        body.style.background = 'linear-gradient(to bottom, #000000 0%, #1a0000 50%, #790808 100%)';
    }
    
    localStorage.setItem('theme', theme);
}

function createThemeSwitcher() {
    if (document.getElementById('theme-switcher')) return;
    
    const switcher = document.createElement('button');
    switcher.id = 'theme-switcher';
    switcher.className = 'theme-switcher';
    switcher.innerHTML = '🌓';
    switcher.title = 'Alternar entre modo claro e escuro';
    
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(switcher);
    }
}

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
    applyTheme(currentTheme);
}

function initMobileMenu() {
    // Verificar se já existe um menu toggle
    if (document.querySelector('.menu-toggle')) return;
    
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(menuToggle);
    }
}

function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.classList.toggle('active');
    }
}

// Funções para gerenciamento de tarefas
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
    exibirMensagem('Tarefa excluída com sucesso!', 'sucesso');
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
    
    // Ocultar a mensagem após 3 segundos
    setTimeout(() => {
        mensagemDiv.classList.add('oculto');
    }, 3000);
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
