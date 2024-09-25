document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');
    const mensagem = document.getElementById('mensagem');
    const formUsuario = document.getElementById('formUsuario');
    const formRecurso = document.getElementById('formRecurso');
    const listaUsuarios = document.getElementById('listaUsuarios');
    const listaRecursos = document.getElementById('listaRecursos');
    const recursoId = document.getElementById('recursoId');
    const descricaoInput = document.getElementById('descricao');
    const tipoRecursoInput = document.getElementById('tipoRecurso');
    const usuarioId = document.getElementById('usuarioId');
    const nomeInput = document.getElementById('nome');
    const senhaInput = document.getElementById('senha');
    const tipoUsuarioInput = document.getElementById('tipoUsuario');

    const usuariosIniciais = [
        { "id": 1, "nome": "João", "senha": "1234", "tipo": "funcionario" },
        { "id": 2, "nome": "Maria", "senha": "5678", "tipo": "gerente" },
        { "id": 3, "nome": "Ana", "senha": "abcd", "tipo": "administrador" }
    ];

    const recursosIniciais = [
        { "id": 1, "descricao": "Computador", "tipo": "equipamento" },
        { "id": 2, "descricao": "Caminhão", "tipo": "veiculo" }
    ];

    function carregarDados() {
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || usuariosIniciais;
        const recursos = JSON.parse(localStorage.getItem('recursos')) || recursosIniciais;
        return { usuarios, recursos };
    }

    function salvarDados(usuarios, recursos) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('recursos', JSON.stringify(recursos));
    }

    function autenticarUsuario(nome, senha) {
        const { usuarios } = carregarDados();
        const usuario = usuarios.find(u => u.nome === nome && u.senha === senha);
        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
        }
        return usuario;
    }

    function redirecionarUsuario(tipo) {
        switch (tipo) {
            case 'funcionario':
                window.location.href = 'index.html';
                break;
            case 'gerente':
                window.location.href = 'usuarios.html';
                break;
            case 'administrador':
                window.location.href = 'recursos.html';
                break;
            default:
                window.location.href = 'index.html';
        }
    }

    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = nomeInput.value.trim();
            const senha = senhaInput.value.trim();

            const usuario = autenticarUsuario(nome, senha);
            if (usuario) {
                redirecionarUsuario(usuario.tipo);
            } else {
                mensagem.textContent = 'Nome ou senha incorretos!';
                mensagem.style.color = 'red';
            }
        });
    }

    function atualizarListas() {
        const { usuarios, recursos } = carregarDados();

        if (listaUsuarios) {
            listaUsuarios.innerHTML = usuarios.map(usuario =>
                `<div>
                    ${usuario.nome} (${usuario.tipo})
                    ${usuario.tipo === 'gerente' || usuario.tipo === 'administrador' ? 
                        `<button onclick="editarUsuario(${usuario.id})">Editar</button>
                         <button onclick="removerUsuario(${usuario.id})">Remover</button>` : ''}
                </div>`
            ).join('');
        }

        if (listaRecursos) {
            listaRecursos.innerHTML = recursos.map(recurso =>
                `<div>
                    ${recurso.descricao} (${recurso.tipo})
                    ${['gerente', 'administrador'].includes(JSON.parse(localStorage.getItem('usuario')).tipo) ? 
                        `<button onclick="editarRecurso(${recurso.id})">Editar</button>
                         <button onclick="removerRecurso(${recurso.id})">Remover</button>` : ''}
                </div>`
            ).join('');
        }
    }

    function adicionarUsuario() {
        const { usuarios } = carregarDados();
        const nome = nomeInput.value.trim();
        const senha = senhaInput.value.trim();
        const tipoUsuario = tipoUsuarioInput.value;
        const id = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;

        const novoUsuario = { id, nome, senha, tipo: tipoUsuario };
        usuarios.push(novoUsuario);
        salvarDados(usuarios, carregarDados().recursos);

        nomeInput.value = '';
        senhaInput.value = '';
        tipoUsuarioInput.value = 'funcionario';
        usuarioId.value = '';
        atualizarListas();
    }

    function removerUsuario(id) {
        const { usuarios, recursos } = carregarDados();
        const novosUsuarios = usuarios.filter(u => u.id !== id);
        salvarDados(novosUsuarios, recursos);
        atualizarListas();
    }

    function editarUsuario(id) {
        const { usuarios } = carregarDados();
        const usuario = usuarios.find(u => u.id === id);
        if (usuario) {
            nomeInput.value = usuario.nome;
            senhaInput.value = usuario.senha;
            tipoUsuarioInput.value = usuario.tipo;
            usuarioId.value = usuario.id;
        }
    }

    function adicionarRecurso() {
        const { recursos } = carregarDados();
        const descricao = descricaoInput.value.trim();
        const tipoRecurso = tipoRecursoInput.value;
        const id = recursos.length > 0 ? Math.max(...recursos.map(r => r.id)) + 1 : 1;

        const novoRecurso = { id, descricao, tipo: tipoRecurso };
        recursos.push(novoRecurso);
        salvarDados(carregarDados().usuarios, recursos);

        descricaoInput.value = '';
        tipoRecursoInput.value = 'equipamento';
        recursoId.value = '';
        atualizarListas();
    }

    function removerRecurso(id) {
        const { usuarios, recursos } = carregarDados();
        const novosRecursos = recursos.filter(r => r.id !== id);
        salvarDados(usuarios, novosRecursos);
        atualizarListas();
    }

    function editarRecurso(id) {
        const { recursos } = carregarDados();
        const recurso = recursos.find(r => r.id === id);
        if (recurso) {
            descricaoInput.value = recurso.descricao;
            tipoRecursoInput.value = recurso.tipo;
            recursoId.value = recurso.id;
        }
    }

    if (formUsuario) {
        formUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            adicionarUsuario();
        });

        atualizarListas();
    }

    if (formRecurso) {
        formRecurso.addEventListener('submit', function(e) {
            e.preventDefault();
            adicionarRecurso();
        });

        atualizarListas();
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (usuario) {
        const page = window.location.pathname.split('/').pop();
        if ((page === 'usuarios.html' && usuario.tipo === 'funcionario') ||
            (page === 'recursos.html' && usuario.tipo !== 'administrador')) {
            alert('Acesso negado. Você não tem permissão para acessar esta página.');
            window.location.href = 'index.html';
        }
    } else if (window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }

    window.editarUsuario = editarUsuario;
    window.removerUsuario = removerUsuario;
    window.editarRecurso = editarRecurso;
    window.removerRecurso = removerRecurso;
});
