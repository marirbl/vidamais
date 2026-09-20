const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Permite que o servidor receba dados em JSON
app.use(express.json());

// Disponibiliza os arquivos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rota de teste
app.get("/api", (req, res) => {
    res.json({
        mensagem: "API Vida+ funcionando!"
    });
});

// Retorna a lista de profissionais
app.get("/api/profissionais", (req, res) => {
    const profissionais = require("./profissionais.json");
    res.json(profissionais);
});

// Cadastro de usuário
app.post("/api/usuarios", (req, res) => {
    const fs = require("fs");
    const arquivoUsuarios = path.join(__dirname, "usuarios.json");

    const usuarios = JSON.parse(
        fs.readFileSync(arquivoUsuarios, "utf-8")
    );

    const novoUsuario = {
        id: Date.now(),
        nome: req.body.nome,
        email: req.body.email,
        cpf: req.body.cpf,
        senha: req.body.senha
    };

    // Verifica se o e-mail já está cadastrado
    const emailExiste = usuarios.some(
        usuario => usuario.email === novoUsuario.email
    );

    if (emailExiste) {
        return res.status(400).json({
            mensagem: "Este e-mail já está cadastrado."
        });
    }

    // Verifica se o CPF já está cadastrado
const cpfExiste = usuarios.some(
    usuario => usuario.cpf === novoUsuario.cpf
);

if (cpfExiste) {
    return res.status(400).json({
        mensagem: "Este CPF já está cadastrado."
    });
}

    usuarios.push(novoUsuario);

    fs.writeFileSync(
        arquivoUsuarios,
        JSON.stringify(usuarios, null, 2)
    );

    res.status(201).json({
        mensagem: "Usuário cadastrado com sucesso!",
        usuario: {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email
        }
    });
});

// Login do usuário
app.post("/api/login", (req, res) => {
    const fs = require("fs");
    const path = require("path");

    const arquivoUsuarios = path.join(__dirname, "usuarios.json");

    const usuarios = JSON.parse(
        fs.readFileSync(arquivoUsuarios, "utf-8")
    );

    const { cpf, senha } = req.body;

const usuario = usuarios.find(
    u => u.cpf === cpf && u.senha === senha
);

    if (!usuario) {
        return res.status(401).json({
            mensagem: "CPF ou senha incorretos."
        });
    }

    res.json({
        mensagem: "Login realizado com sucesso!",
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    });
});

// ==========================================
// CRIAR AGENDAMENTO
// ==========================================

app.post("/api/agendamentos", (req, res) => {

    const fs = require("fs");

    const arquivoAgendamentos = path.join(
        __dirname,
        "agendamentos.json"
    );

    const agendamentos = JSON.parse(
        fs.readFileSync(arquivoAgendamentos, "utf-8")
    );

const {
    usuarioId,
    profissionalId,
    profissionalNome,
    especialidade,
    data,
    horario,
    cpf
} = req.body;

    // Verifica se todos os dados foram enviados
    if (
        !usuarioId ||
        !profissionalId ||
        !profissionalNome ||
        !data ||
        !horario
    ) {
        return res.status(400).json({
            mensagem: "Preencha todos os dados do agendamento."
        });
    }

const novoAgendamento = {
    id: Date.now(),
    usuarioId: usuarioId,
    profissionalId: profissionalId,
    profissionalNome: profissionalNome,
    especialidade: especialidade,
    data: data,
    horario: horario,
    cpf: cpf
};
    agendamentos.push(novoAgendamento);

    fs.writeFileSync(
        arquivoAgendamentos,
        JSON.stringify(agendamentos, null, 2)
    );

    res.status(201).json({
        mensagem: "Consulta agendada com sucesso!",
        agendamento: novoAgendamento
    });

});

// Buscar agendamentos de um usuário
app.get("/api/agendamentos/:usuarioId", (req, res) => {

    const fs = require("fs");
    const arquivoAgendamentos = path.join(
        __dirname,
        "agendamentos.json"
    );

    const agendamentos = JSON.parse(
        fs.readFileSync(arquivoAgendamentos, "utf-8")
    );

    const usuarioId = Number(req.params.usuarioId);

    const agendamentosDoUsuario = agendamentos.filter(
        agendamento => Number(agendamento.usuarioId) === usuarioId
    );


    res.json(agendamentosDoUsuario);
});

// Buscar agendamentos pelo CPF
app.get("/api/consultar-agendamento/:cpf", (req, res) => {

    const fs = require("fs");

    const arquivoAgendamentos = path.join(
        __dirname,
        "agendamentos.json"
    );

    const agendamentos = JSON.parse(
        fs.readFileSync(arquivoAgendamentos, "utf-8")
    );

    const cpfInformado = req.params.cpf.replace(/\D/g, "");

    const agendamentosEncontrados = agendamentos.filter(
        agendamento => {

            if (!agendamento.cpf) {
                return false;
            }

            const cpfAgendamento =
                String(agendamento.cpf).replace(/\D/g, "");

            return cpfAgendamento === cpfInformado;
        }
    );

    res.json(agendamentosEncontrados);
});

// Cancelar agendamento
app.delete("/api/agendamentos/:id", (req, res) => {

    const fs = require("fs");
    const arquivoAgendamentos = path.join(
        __dirname,
        "agendamentos.json"
    );

    let agendamentos = JSON.parse(
        fs.readFileSync(arquivoAgendamentos, "utf-8")
    );

    const id = Number(req.params.id);

    // Procura o agendamento
    const agendamento = agendamentos.find(
        agendamento => Number(agendamento.id) === id
    );

    if (!agendamento) {
        return res.status(404).json({
            mensagem: "Agendamento não encontrado."
        });
    }

    // Em vez de apagar, altera o status
    agendamento.status = "cancelado";

    fs.writeFileSync(
        arquivoAgendamentos,
        JSON.stringify(agendamentos, null, 2)
    );

    res.json({
        mensagem: "Agendamento cancelado com sucesso!"
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor Vida+ rodando na porta ${PORT}`);
});