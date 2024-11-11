
# Projeto Notion API - Express.js

Este projeto é uma API construída em Node.js com o framework Express para manipulação de dados em um banco de dados Notion. A API permite criar, ler, atualizar e deletar (arquivar) páginas de um banco de dados Notion específico.

## Configuração e Inicialização do Projeto

### Pré-requisitos

- Node.js instalado (versão 12 ou superior)
- Uma conta no Notion e um banco de dados Notion configurado para integração

### Passo a Passo

1. Clone este repositório e acesse o diretório do projeto.

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```plaintext
   NOTION_API_KEY=SEU_TOKEN_DE_INTEGRAÇÃO
   DATABASE_ID=ID_DO_SEU_BANCO_DE_DADOS
   PORT=3000 # Porta opcional, pode deixar o padrão
   ```

4. Inicie o servidor:
   ```bash
   npm run server
   ```

   O servidor estará rodando na porta definida no `.env`, ou na porta `3000` por padrão.

## Utilizando a API

Abaixo estão descritas as rotas disponíveis nesta API e como usá-las.

### Rota para Criar uma Página

- **Rota**: `POST /api/addPage`
- **Descrição**: Cria uma nova página no banco de dados do Notion.
- **Body (JSON)**:
  ```json
  {
      "titulo": "Título da Página",
      "descricao": "Descrição da Página",
      "linkImagem": "URL da Imagem",
      "campanha": "Nome da Campanha",
      "data": "2024-11-10",
      "empresa": "Nome da Empresa"
  }
  ```

### Rota para Buscar Páginas com Filtros

- **Rota**: `GET /api/:id`
- **Descrição**: Busca páginas de acordo com os filtros especificados.
- **Query Params**:
  - `companyName` - Nome da empresa
  - `campaign` - Nome da campanha
  - `language` - Idioma
  - `where` - Link da imagem
  - `idRow` - ID específico de uma página

### Rota para Atualizar uma Página

- **Rota**: `PUT /api/:id`
- **Descrição**: Atualiza uma página existente no banco de dados do Notion.
- **Body (JSON)**:
  ```json
  {
      "companyName": "Nome da Empresa",
      "campaign": "Nome da Campanha",
      "description": "Nova Descrição",
      "plannedDate": "2024-11-11",
      "where": "Novo Link da Imagem",
      "language": "Português",
      "content": "Conteúdo Atualizado",
      "imageUrl": "Nova URL da Imagem",
      "imageText": "Texto da Imagem"
  }
  ```

### Rota para Deletar (Arquivar) uma Página

- **Rota**: `DELETE /api/:id`
- **Descrição**: Arquiva uma página específica ao invés de deletá-la permanentemente.

## Observações

- Todas as requisições `POST`, `PUT` e `DELETE` devem incluir um cabeçalho `Content-Type: application/json`.
- A API utiliza o conceito de arquivamento ao invés de exclusão permanente, permitindo uma melhor gestão dos dados no Notion.

---

Desenvolvido com ❤️ e Express.js.
