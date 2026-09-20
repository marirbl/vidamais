# vidamais

# Vida+ — Sistema de Agendamento de Consultas

Vida + é o projeto de sistematização número 3 da disciplina de Programação e Desenvolvimento Web.

É um sistema web desenvolvido para facilitar o agendamento de consultas em uma clínica de saúde.

O sistema permite que o paciente crie uma conta, faça login, escolha um profissional, selecione uma data e horário e acompanhe seus agendamentos.

##  Funcionalidades

- Cadastro de usuários
- Login de usuários
- Listagem de profissionais
- Escolha de especialidade e profissional
- Seleção de data e horário
- Agendamento de consultas
- Consulta dos próprios agendamentos
- Cancelamento de consultas
- Consulta de agendamento por CPF
- Identificação do usuário logado
- Proteção dos agendamentos de cada usuário

## Tecnologias utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript

### Back-end
- Node.js
- Express

### Armazenamento
Os dados são armazenados localmente em arquivos JSON:

- `usuarios.json`
- `profissionais.json`
- `agendamentos.json`

## 📁 Estrutura do projeto

vida-mais/
├── backend/
│   ├── agendamentos.json
│   ├── profissionais.json
│   ├── server.js
│   └── usuarios.json
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── agendamento.html
│   ├── cadastro.html
│   ├── consultar-agendamento.html
│   ├── index.html
│   ├── login.html
│   └── meus-agendamentos.html
│
├── package.json
└── README.md

## Como executar o projeto

### 1. Instale as dependências

No terminal, execute:

npm install

### 2. Inicie o servidor

Execute:

node backend/server.js

### 3. Acesse o sistema

Abra o navegador e acesse:

http://localhost:3000

O servidor será executado na porta **3000**.

## Funcionamento

1. O usuário realiza seu cadastro.
2. Faz login no sistema.
3. Escolhe um especialista.
4. Seleciona uma data e um horário disponíveis.
5. Confere seus dados e informa o CPF.
6. Confirma o agendamento.
7. O agendamento é armazenado no arquivo JSON.
8. O usuário pode visualizar ou cancelar seus agendamentos.
9. Também é possível consultar um agendamento utilizando o CPF.

## API

O back-end utiliza rotas para realizar operações como:

- Cadastro de usuários
- Login
- Consulta de profissionais
- Criação de agendamentos
- Consulta de agendamentos
- Cancelamento de agendamentos

## Objetivo do projeto

O objetivo do Vida+ é aplicar conceitos de desenvolvimento web por meio da integração entre **front-end e back-end**, utilizando uma API desenvolvida com Node.js e Express e arquivos JSON para armazenamento dos dados.

## Desenvolvido por

Projeto acadêmico desenvolvido por **Mariana Rabelo de Farias**.
