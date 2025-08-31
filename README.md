# Projeto A3 - Sistema de Busca e Comparação de Passagens Aéreas

Este projeto consiste na construção de um sistema de backend para simular a busca e comparação de passagens aéreas. Ele atende aos requisitos da UC "Estruturas de Dados e Análise de Algoritmos", com foco na implementação e análise de diferentes algoritmos de busca e ordenação em memória.

### Requisitos Atendidos

* **Implementação de Algoritmos:** O projeto utiliza algoritmos de ordenação (`Quicksort` e `Bubble Sort`) e de busca (`Busca Linear` e `Busca Binária`) em memória para manipular os dados de voos.
* **Mensuração de Desempenho:** Mecanismos de tempo de execução foram implementados para comparar o desempenho dos diferentes algoritmos.
* **Estruturas de Dados:** Os dados do banco de dados são carregados em memória para otimizar o tempo de execução e o uso de recursos computacionais.
* **Modularização:** O código é organizado em módulos (rotas, controladores e utilidades) para garantir a abstração e a organização.
* **Funcionalidades:** O sistema permite a pesquisa de voos por critérios como origem, destino, data e valor, além de possibilitar a ordenação dos resultados por preço, horário ou duração da viagem.

### Tecnologias Utilizadas

* **Node.js**
* **Express.js** (Framework de backend)
* **PostgreSQL** (Banco de dados)
* **Git** e **GitHub** (Controle de versão)

### Configuração e Execução

Para rodar o projeto localmente, siga os seguintes passos:

1.  **Clone o repositório:**
    ```bash
    git clone
    cd [nome-do-repositorio]
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Banco de Dados:**
    * Crie um banco de dados PostgreSQL na sua máquina local.
    * Crie um arquivo `.env` na raiz do projeto (nunca suba este arquivo para o GitHub) com as seguintes informações:
        ```env
        DB_USER=seu_usuario_db
        DB_PASSWORD=sua_senha_db
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME=nome_do_seu_banco
        PORT=4000
        ```
    * Importe o arquivo `.sql` da estrutura e dados das tabelas de voos para o seu banco.

4.  **Inicie a API:**
    ```bash
    npm start
    ```
    A API será iniciada em `http://localhost:4000`.

### Rotas da API

| Rota | Descrição |
| :--- | :--- |
| **`GET /health`** | Verifica o status da API e a conexão com o banco de dados. Retorna a quantidade de registros na tabela de voos. |
| **`GET /flights`** | Lista voos com filtros, ordenação e paginação. |
| **`GET /flights/search`** | Realiza busca por um voo específico usando diferentes algoritmos e mede o tempo de execução. |
| **`GET /flights/stats/all`** | Retorna estatísticas como preço e duração média, mínimo e máximo, com base nos filtros aplicados. |

#### Exemplo de Uso das Rotas:

**Listar voos:**
`http://localhost:4000/flights?origem=GRU&destino=JFK&sortBy=preco&order=desc&page=1&pageSize=20&algorithm=quicksort`

**Buscar um voo:**
`http://localhost:4000/flights/search?key=preco&value=200.27&algorithm=binary`

### Próximas Etapas

O próximo passo do projeto é a implementação da **interface de usuário (GUI)**, que deve ser feita usando alguma tecnologia de GUI web, mobile ou desktop.

---

### Autores

* Saulo Guedes da Cruz
* Solano Guedes da Cruz
* Ramael dos Santos Cerqueira
* Erik Ryú Guimarães Lima
* Renato Costa Laranjeira
* Vinicius Ribeiro Santos
* Eduardo Dourado Marotta
