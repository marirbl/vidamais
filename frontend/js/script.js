console.log("SCRIPT COMEÇOU");
const formularioCadastro = document.querySelector("#formCadastro");

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const cpf = document.querySelector("#cpf").value;
        const senha = document.querySelector("#senha").value;

        try {
            const resposta = await fetch("/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: nome,
                    email: email,
                    cpf: cpf,
                    senha: senha
                })
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            } else {
                alert(dados.mensagem || "Erro ao realizar cadastro.");
            }

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
}

// LOGIN
const formularioLogin = document.getElementById("formLogin");

if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

const cpf = document.getElementById("cpf").value;
const senha = document.getElementById("senha").value;

        try {
            const resposta = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
    cpf: cpf,
    senha: senha
})
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                localStorage.setItem(
                    "usuarioLogado",
                    JSON.stringify(dados.usuario)
                );

                alert("Login realizado com sucesso!");
                window.location.href = "index.html";
            } else {
                alert(dados.mensagem || "E-mail ou senha incorretos.");
            }

        } catch (erro) {
            console.error("Erro:", erro);
            alert("Não foi possível conectar ao servidor.");
        }
    });
}

// ===============================
// PÁGINA INICIAL
// ===============================

const boasVindas = document.getElementById("boasVindas");
const listaProfissionais = document.getElementById("listaProfissionais");
const btnSair = document.getElementById("btnSair");

// Recupera o usuário que fez login
const usuarioSalvo = localStorage.getItem("usuarioLogado");

if (boasVindas && usuarioSalvo) {
    const usuario = JSON.parse(usuarioSalvo);

    boasVindas.textContent = `Olá, ${usuario.nome}!`;
}


// Carrega os profissionais cadastrados no backend
if (listaProfissionais) {

    async function carregarProfissionais() {

        try {

            const resposta = await fetch("/api/profissionais");

            const profissionais = await resposta.json();

            listaProfissionais.innerHTML = "";

            profissionais.forEach(profissional => {

                const card = document.createElement("div");

                card.innerHTML = `
                    <h3>${profissional.nome}</h3>
                    <p>${profissional.especialidade}</p>
                    <a href="agendamento.html?id=${profissional.id}">
                        Agendar consulta
                    </a>
                `;

                listaProfissionais.appendChild(card);

            });

        } catch (erro) {

            console.error("Erro ao carregar profissionais:", erro);

            listaProfissionais.innerHTML =
                "<p>Não foi possível carregar os profissionais.</p>";
        }
    }

    carregarProfissionais();
}


// Logout
if (btnSair) {

    btnSair.addEventListener("click", function () {

        localStorage.removeItem("usuarioLogado");

        window.location.href = "login.html";

    });

}

// ===============================
// PÁGINA DE AGENDAMENTO
// ===============================

const nomeProfissional = document.getElementById("nomeProfissional");
const especialidadeProfissional = document.getElementById("especialidadeProfissional");
const dataConsulta = document.getElementById("dataConsulta");
const horarioConsulta = document.getElementById("horarioConsulta");

let profissionalAtual = null;

// Só executa se estivermos na página de agendamento
if (nomeProfissional) {

    async function carregarProfissionalSelecionado() {

        try {

            // Pega o ID que veio na URL
            const parametros = new URLSearchParams(window.location.search);
            const idProfissional = parametros.get("id");

            if (!idProfissional) {
                nomeProfissional.textContent = "Nenhum profissional selecionado.";
                return;
            }

            // Busca todos os profissionais na API
            const resposta = await fetch("/api/profissionais");
            const profissionais = await resposta.json();

            // Procura o profissional pelo ID
            profissionalAtual = profissionais.find(
                profissional => profissional.id == idProfissional
            );

            if (!profissionalAtual) {
                nomeProfissional.textContent = "Profissional não encontrado.";
                return;
            }

            // Mostra nome e especialidade
            nomeProfissional.textContent = profissionalAtual.nome;
            especialidadeProfissional.textContent =
                profissionalAtual.especialidade;

            // Coloca as datas disponíveis
            profissionalAtual.disponibilidade.forEach(item => {

                const option = document.createElement("option");

                option.value = item.data;
                option.textContent = item.data;

                dataConsulta.appendChild(option);

            });

        } catch (erro) {

            console.error("Erro ao carregar profissional:", erro);

            nomeProfissional.textContent =
                "Erro ao carregar profissional.";
        }
    }


    // Quando escolher uma data
    dataConsulta.addEventListener("change", function () {

        horarioConsulta.innerHTML =
            '<option value="">Selecione um horário</option>';

        const disponibilidade =
            profissionalAtual.disponibilidade.find(
                item => item.data === dataConsulta.value
            );

        if (!disponibilidade) {
            horarioConsulta.disabled = true;
            return;
        }

        disponibilidade.horarios.forEach(horario => {

            const option = document.createElement("option");

            option.value = horario;
            option.textContent = horario;

            horarioConsulta.appendChild(option);

        });

        horarioConsulta.disabled = false;

    });


    carregarProfissionalSelecionado();
}

// ===============================
// CONFIRMAR AGENDAMENTO
// ===============================

// =============================
// ETAPAS 3 E 4 DO AGENDAMENTO
// =============================

const btnConfirmarAgendamento =
    document.getElementById("btnConfirmarAgendamento");

const etapaSeusDados =
    document.getElementById("etapaSeusDados");

const btnFinalizarAgendamento =
    document.getElementById("btnFinalizarAgendamento");

const voltarDataHorario =
    document.getElementById("voltarDataHorario");


// BOTÃO CONTINUAR - ABRE A ETAPA 4
if (btnConfirmarAgendamento) {

    btnConfirmarAgendamento.addEventListener("click", function () {

        const usuarioSalvo =
            localStorage.getItem("usuarioLogado");

        if (!usuarioSalvo) {
            alert("Você precisa fazer login para agendar.");
            window.location.href = "login.html";
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        if (!profissionalAtual) {
            alert("Profissional não encontrado.");
            return;
        }

        if (!dataConsulta.value) {
            alert("Selecione uma data.");
            return;
        }

        if (!horarioConsulta.value) {
            alert("Selecione um horário.");
            return;
        }

console.log("PROFISSIONAL:", profissionalAtual);
console.log("DATA:", dataConsulta.value);
console.log("HORARIO:", horarioConsulta.value);

        // Preenche o resumo
        document.getElementById("resumoEspecialidade").textContent =
            profissionalAtual.especialidade;

        document.getElementById("resumoProfissional").textContent =
            profissionalAtual.nome;

        const partesData = dataConsulta.value.split("-");

        document.getElementById("resumoData").textContent =
            `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

        document.getElementById("resumoHorario").textContent =
            horarioConsulta.value;

        // Preenche dados do usuário
        document.getElementById("nomePaciente").value =
            usuario.nome || "";

        document.getElementById("cpfPaciente").value =
            usuario.cpf || "";

        // Esconde a etapa 3
        document.querySelector(".main-agendar > .card-agendamento")
            .style.display = "none";

        // Mostra a etapa 4
        etapaSeusDados.style.display = "block";

        // Atualiza a barrinha
        const etapa3 = document.querySelector(".etapa-3");
        const etapa4 = document.querySelector(".etapa-4");

        if (etapa3) {
            etapa3.classList.add("concluida");
        }

        if (etapa4) {
            etapa4.classList.add("ativa");
        }

etapaSeusDados.scrollIntoView({
    behavior: "smooth",
    block: "start"
});
    });
}


// VOLTAR PARA DATA E HORÁRIO
if (voltarDataHorario) {

    voltarDataHorario.addEventListener("click", function (event) {

        event.preventDefault();

        etapaSeusDados.style.display = "none";

        document.querySelector(".main-agendar > .card-agendamento")
            .style.display = "block";
    });
}


// CONFIRMAR DEFINITIVAMENTE O AGENDAMENTO
if (btnFinalizarAgendamento) {

    btnFinalizarAgendamento.addEventListener(
        "click",
        async function () {

            const usuarioSalvo =
                localStorage.getItem("usuarioLogado");

            if (!usuarioSalvo) {
                window.location.href = "login.html";
                return;
            }

            const usuario = JSON.parse(usuarioSalvo);

            const cpfPaciente =
    document.getElementById("cpfPaciente").value.trim();

if (!cpfPaciente) {
    alert("Digite seu CPF para confirmar o agendamento.");
    return;
}

const novoAgendamento = {
    usuarioId: usuario.id,
    profissionalId: profissionalAtual.id,
    profissionalNome: profissionalAtual.nome,
    especialidade: profissionalAtual.especialidade,
    data: dataConsulta.value,
    horario: horarioConsulta.value,
    cpf: cpfPaciente
};

            try {

                const resposta = await fetch(
                    "/api/agendamentos",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(novoAgendamento)
                    }
                );

                const dados = await resposta.json();

                if (resposta.ok) {

                    alert("Consulta agendada com sucesso!");

                    window.location.href =
                        "meus-agendamentos.html";

                } else {

                    alert(
                        dados.mensagem ||
                        "Não foi possível realizar o agendamento."
                    );
                }

            } catch (erro) {

                console.error(
                    "Erro ao realizar agendamento:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }
    );
}


console.log("TERMINEI BLOCO AGENDAMENTO");

// ===============================
// MEUS AGENDAMENTOS
// ===============================

const listaAgendamentos = document.getElementById("listaAgendamentos");
console.log("CHEGUEI EM MEUS AGENDAMENTOS");

if (listaAgendamentos) {

    async function carregarAgendamentos() {

        console.log("FUNÇÃO DE AGENDAMENTOS INICIOU");

        const usuarioSalvo = localStorage.getItem("usuarioLogado");

        if (!usuarioSalvo) {
            window.location.href = "login.html";
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        try {

            const resposta = await fetch(
                `/api/agendamentos/${usuario.id}`
            );

            const agendamentos = await resposta.json();

            listaAgendamentos.innerHTML = "";

            if (agendamentos.length === 0) {

                listaAgendamentos.innerHTML = `
                    <div class="sem-agendamentos">
                        <h3>Nenhuma consulta agendada</h3>
                        <p>
                            Você ainda não possui consultas agendadas.
                        </p>
                        <a href="index.html">
                            Encontrar especialista
                        </a>
                    </div>
                `;

                return;
            }

            agendamentos.forEach(agendamento => {

                const card = document.createElement("div");

                card.classList.add("card-agendamento");

                // Converte 2026-09-22 para 22/09/2026
                const partesData = agendamento.data.split("-");
                const dataFormatada =
                    `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

card.innerHTML = `
    <div class="info-agendamento">

        <span class="status-agendamento ${
    agendamento.status === "cancelado" ? "status-cancelado" : ""
}">
    ${agendamento.status === "cancelado"
        ? "Consulta cancelada"
        : "Consulta agendada"}
</span>

        <h3>${agendamento.profissionalNome}</h3>

        <p class="especialidade-agendamento">
            ${agendamento.especialidade}
        </p>

        <div class="detalhes-agendamento">

            <p>
                📅 <strong>Data:</strong>
                ${dataFormatada}
            </p>

            <p>
                🕐 <strong>Horário:</strong>
                ${agendamento.horario}
            </p>

        </div>

    </div>

    ${
        agendamento.status === "cancelado"
            ? ""
            : `
                <button
                    class="btn-cancelar"
                    data-id="${agendamento.id}"
                >
                    Cancelar agendamento
                </button>
            `
    }
`;
                listaAgendamentos.appendChild(card);

            });

        } catch (erro) {

            console.error(
                "Erro ao carregar agendamentos:",
                erro
            );

            listaAgendamentos.innerHTML = `
                <p>Não foi possível carregar seus agendamentos.</p>
            `;
        }
    }

    carregarAgendamentos();
}

// ===============================
// CANCELAR AGENDAMENTO
// ===============================

document.addEventListener("click", async function (event) {

    if (!event.target.classList.contains("btn-cancelar")) {
        return;
    }

    const id = event.target.dataset.id;

    const confirmar = confirm(
        "Tem certeza que deseja cancelar este agendamento?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const resposta = await fetch(
            `/api/agendamentos/${id}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        if (resposta.ok) {

            alert("Agendamento cancelado com sucesso!");

            // Atualiza a página
            window.location.reload();

        } else {

            alert(
                dados.mensagem ||
                "Não foi possível cancelar o agendamento."
            );
        }

    } catch (erro) {

        console.error("Erro ao cancelar:", erro);

        alert(
            "Não foi possível conectar ao servidor."
        );
    }
});

// ========================================
// CONSULTAR AGENDAMENTO PELO CPF
// ========================================

const btnConsultarCpf = document.getElementById("btnConsultarCpf");

if (btnConsultarCpf) {

    btnConsultarCpf.addEventListener("click", async function () {

        const cpfConsulta =
            document.getElementById("cpfConsulta").value.trim();

        const resultadoConsulta =
            document.getElementById("resultadoConsulta");

        if (!cpfConsulta) {
            alert("Digite seu CPF.");
            return;
        }

        try {

            const resposta = await fetch(
                `/api/consultar-agendamento/${cpfConsulta}`
            );

            const agendamentos = await resposta.json();

            console.log("AGENDAMENTOS ENCONTRADOS:", agendamentos);

            if (agendamentos.length === 0) {

                resultadoConsulta.innerHTML = `
                    <div class="card-consulta-cpf">
                        <p>Nenhum agendamento encontrado para este CPF.</p>
                    </div>
                `;

                return;
            }

resultadoConsulta.innerHTML = "";

agendamentos.forEach(agendamento => {

    const partesData = agendamento.data.split("-");

    const dataFormatada =
        `${partesData[2]}/${partesData[1]}/${partesData[0]}`;

    const card = document.createElement("div");

    card.classList.add("card-consulta-cpf");

    card.innerHTML = `
        <span class="status-agendamento ${
            agendamento.status === "cancelado"
                ? "status-cancelado"
                : ""
        }">
            ${
                agendamento.status === "cancelado"
                    ? "Consulta cancelada"
                    : "Consulta agendada"
            }
        </span>

        <h3>${agendamento.profissionalNome}</h3>

        <p>
            <strong>Especialidade:</strong>
            ${agendamento.especialidade}
        </p>

        <p>
            <strong>CPF:</strong>
            ${agendamento.cpf}
        </p>

        <p>
            <strong>Data:</strong>
            ${dataFormatada}
        </p>

        <p>
            <strong>Horário:</strong>
            ${agendamento.horario}
        </p>
    `;

    resultadoConsulta.appendChild(card);

});

        } catch (erro) {

            console.error("Erro ao consultar CPF:", erro);

            alert("Não foi possível consultar o agendamento.");
        }

    });

}
