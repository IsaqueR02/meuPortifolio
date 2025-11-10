document.addEventListener('DOMContentLoaded', function() {
    // 1. Saudação dinâmica
    const headerH1 = document.querySelector('header h1');
    if (headerH1) {
        const horaAtual = new Date().getHours();
        let saudacao = '';
        if (horaAtual >= 0 && horaAtual < 12) {
            saudacao = 'Bom dia';
        } else if (horaAtual >= 12 && horaAtual < 18) {
            saudacao = 'Boa tarde';
        } else {
            saudacao = 'Boa noite';
        }
        const nome = 'Isaque';
        const spanSaudacao = document.createElement('span');
        spanSaudacao.id = 'saudacao';
        spanSaudacao.textContent = `${saudacao}, ${nome}!`;
        spanSaudacao.style.fontSize = '18px';
        spanSaudacao.style.color = '#3e5872';
        spanSaudacao.style.marginLeft = '10px';
        headerH1.appendChild(spanSaudacao);
    }

    // 2. Expandir/Recolher seções
    function criarToggleParaLista(tituloSelector, elementoSelector, nomeSecao, elemento) {
        const titulo = document.querySelector(tituloSelector);
        if (titulo && elemento) {
            // Criar botão do toggle
            const botao = document.createElement('button');
            botao.textContent = `Expandir ${nomeSecao}`;
            botao.setAttribute('aria-expanded', 'false');
            botao.style.margin = '10px 0';
            botao.style.padding = '5px 10px';
            botao.style.backgroundColor = '#3e5872';
            botao.style.color = '#faf5ff';
            botao.style.border = 'none';
            botao.style.borderRadius = '5px';
            botao.style.cursor = 'pointer';
            botao.classList.add('btn-toggle');
            titulo.insertAdjacentElement('afterend', botao);

            elemento.classList.add('fechado');
            elemento.style.display = 'none';

            // Event listener para clique e teclado
            function toggleElemento() {
                const estaExpandida = botao.getAttribute('aria-expanded') === 'true';
                if (estaExpandida) {
                    elemento.classList.add('fechado');
                    elemento.style.display = 'none';
                    botao.textContent = `Expandir ${nomeSecao}`;
                    botao.setAttribute('aria-expanded', 'false');
                } else {
                    elemento.classList.remove('fechado');
                    elemento.style.display = 'block';
                    botao.textContent = `Recolher ${nomeSecao}`;
                    botao.setAttribute('aria-expanded', 'true');
                }
            }

            botao.addEventListener('click', toggleElemento);
            botao.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleElemento();
                }
            });
        }
    }

    // Aplicando toggle para Conhecimentos correlacionados
    const olConhecimentos = document.querySelector('#conhecimentos-correlacionados li');
    if (olConhecimentos) {
        criarToggleParaLista('#conhecimentos-correlacionados h3', '#conhecimentos-correlacionados li', 'Conhecimentos', olConhecimentos.parentElement);
    }

    // Aplicar toggle para Menu de Navegação
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.nav');
    if (navToggle && nav) {
        function toggleNav() {
            const estaExpandida = navToggle.getAttribute('aria-expanded') === 'true';
            nav.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', !estaExpandida);
            navToggle.textContent = estaExpandida ? '☰ Menu' : '✕ Fechar';
        }
        navToggle.addEventListener('click', toggleNav);
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleNav();
            }
        });
        // Fechar nav ao clicar em um link (para mobile)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.textContent = '☰ Menu';
                }
            });
        });
    }

    // 3. Lista dinâmica de Hobbies com persistência
    const sectionHobbies = document.querySelector('#hobbies');
    const ulHobbies = sectionHobbies ? sectionHobbies.querySelector('ul') : null;
    if (ulHobbies) {
        // Criar formulário dinâmico abaixo da ul existente
        const formDinamico = document.createElement('form');
        formDinamico.innerHTML = `
            <input type="text" id="novoHobby" placeholder="Adicione um novo hobby..." required style="width: 70%; margin-right: 5px;">
            <button type="submit" style="width: 25%; padding: 5px;">Adicionar</button>
        `;
        formDinamico.style.marginTop = '20px';
        ulHobbies.insertAdjacentElement('afterend', formDinamico);

        // Lista para itens dinâmicos
        const ulDinamica = document.createElement('ul');
        ulDinamica.id = 'hobbiesDinamicos';
        ulDinamica.style.marginTop = '10px';
        ulDinamica.style.listStyleType = 'disc';
        formDinamico.insertAdjacentElement('afterend', ulDinamica);

        // Carregar do localStorage
        function carregarHobbies() {
            const hobbiesSalvos = localStorage.getItem('hobbiesDinamicos');
            if (hobbiesSalvos) {
                const hobbies = JSON.parse(hobbiesSalvos);
                hobbies.forEach(hobby => adicionarHobbyElemento(hobby.texto, hobby.id));
            }
        }

        // Salvar no via local
        function salvarHobbies() {
            const hobbies = [];
            ulDinamica.querySelectorAll('li').forEach(li => {
                const texto = li.querySelector('span').textContent;
                const id = li.dataset.id;
                hobbies.push({ texto, id });
            });
            localStorage.setItem('hobbiesDinamicos', JSON.stringify(hobbies));
        }

        // Adicionar novo hobby
        function adicionarHobbyElemento(texto, id = Date.now().toString()) {
            const li = document.createElement('li');
            li.dataset.id = id;
            li.innerHTML = `
                <span>${texto}</span>
                <button class="remover" style="margin-left: 10px; padding: 2px 5px; background: #833c99; color: white; border: none; border-radius: 3px;">Remover</button>
                <button class="mover-up" style="margin-left: 5px; padding: 2px 5px; background: #3e5872; color: white; border: none; border-radius: 3px;" ${ulDinamica.children.length === 1 ? 'disabled' : ''}>↑</button>
                <button class="mover-down" style="margin-left: 5px; padding: 2px 5px; background: #3e5872; color: white; border: none; border-radius: 3px;" ${ulDinamica.children.length === 1 ? 'disabled' : ''}>↓</button>
            `;
            ulDinamica.appendChild(li);

            // Event listeners para controles
            li.querySelector('.remover').addEventListener('click', () => {
                li.remove();
                salvarHobbies();
                atualizarBotoesMovimento();
            });

            li.querySelector('.mover-up').addEventListener('click', () => {
                if (li.previousElementSibling) {
                    ulDinamica.insertBefore(li, li.previousElementSibling);
                    salvarHobbies();
                    atualizarBotoesMovimento();
                }
            });

            li.querySelector('.mover-down').addEventListener('click', () => {
                if (li.nextElementSibling) {
                    ulDinamica.insertBefore(li.nextElementSibling, li);
                    salvarHobbies();
                    atualizarBotoesMovimento();
                }
            });
        }

        // Função para atualizar estado dos botões de movimento
        function atualizarBotoesMovimento() {
            const lis = ulDinamica.querySelectorAll('li');
            lis.forEach((li, index) => {
                const upBtn = li.querySelector('.mover-up');
                const downBtn = li.querySelector('.mover-down');
                upBtn.disabled = index === 0;
                downBtn.disabled = index === lis.length - 1;
            });
        }

        // Event listener para o formulário de hobbies
        formDinamico.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = document.getElementById('novoHobby');
            const texto = input.value.trim();
            if (texto) {
                adicionarHobbyElemento(texto);
                input.value = '';
                salvarHobbies();
                atualizarBotoesMovimento();
            }
        });

        // Carregar hobbies ao inicializar
        carregarHobbies();
    }

    // 4. Botão de adicionar novo projeto com mini formulário
    const btnAdd = document.getElementById('btn-adicionar');
    const proForm = document.getElementById('add-project-form');
    const proGrid = document.getElementById('projetos-grid');
    const cancelAdd = document.getElementById('cancelar-adicionar');
    if (btnAdd && proForm && proGrid) {
        // Carregar projetos do localStorage (antes dos listeners)
        function carregarProjetos() {
            const projetosSalvos = localStorage.getItem('projetosDinamicos');
            if (projetosSalvos) {
                const projetos = JSON.parse(projetosSalvos);
                projetos.forEach(projeto => adicionarProjetoElemento(projeto.nome, projeto.url, projeto.desc, projeto.id));
            }
        }
        // Salvar projetos no localStorage
        function salvarProjetos() {
            const projetos = [];
            proGrid.querySelectorAll('.projeto-item[data-id]').forEach(article => {
                const nome = article.querySelector('h3').textContent;
                const url = article.querySelector('a').href;
                const desc = article.querySelector('p').textContent;
                const id = article.dataset.id;
                projetos.push({ nome, url, desc, id });
            });
            localStorage.setItem('projetosDinamicos', JSON.stringify(projetos));
        }
    // Adicionando novo projeto
    function adicionarProjetoElemento(nome, url, desc, id = Date.now().toString()) {
        const article = document.createElement('article');
        article.classList.add('projeto-item');
        article.dataset.id = id;
        article.innerHTML = `
            <a href="${url}" class="projeto-link" target="_blank">
                <h3>${nome}</h3>
            </a>
            <p>${desc}</p>
            <button class="btn-remover">Remover</button>
        `;
        proGrid.appendChild(article);
        // Event listener para remover
        const btnRemover = article.querySelector('.btn-remover');
        btnRemover.addEventListener('click', function() {
            article.remove();
            salvarProjetos();
        });
    }
    // Mostrar/ocultar formulário (sem esconder a grid)
    btnAdd.addEventListener('click', () => {
        proForm.style.display = 'block';
        btnAdd.style.display = 'none';
    });
    if (cancelAdd) {
        cancelAdd.addEventListener('click', () => {
            proForm.style.display = 'none';
            btnAdd.style.display = 'block';
            proForm.reset(); // Limpa campos
        });
    }
    // Event listener para submeter formulário de projeto
    addProjectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('projeto-nome').value.trim();
        const url = document.getElementById('projeto-url').value.trim();
        const desc = document.getElementById('projeto-desc').value.trim();
        if (nome && url && desc) {
            adicionarProjetoElemento(nome, url, desc);
            salvarProjetos();
            addProjectForm.style.display = 'none';
            btnAdicionar.style.display = 'block';
            addProjectForm.reset();
        } else {
            alert('Por favor, preencha todos os campos.');
        }
    });
        carregarProjetos();
    }

    // 5. Formulário de Contato: Receber e armazenar mensagens
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();
            if (nome && email && mensagem) {
                const contatosSalvos = localStorage.getItem('contatos') ? JSON.parse(localStorage.getItem('contatos')) : [];
                contatosSalvos.push({
                    nome,
                    email,
                    mensagem,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('contatos', JSON.stringify(contatosSalvos));
                // Confirmar envio (simulação, pois é local)
                alert('Mensagem enviada com sucesso! Armazenada localmente.');
                formContato.reset(); // Limpa o formulário
                // Opcional: Log para debug
                console.log('Contatos salvos:', contatosSalvos);
            } else {
                alert('Por favor, preencha todos os campos.');
            }
        });
    }
})
    