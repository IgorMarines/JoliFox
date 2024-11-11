const express = require('express');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.DATABASE_ID;

app.use(express.json());

// Rota para criar uma página no Notion
app.post('/api/addPage', async (req, res) => {
    const { titulo, descricao, linkImagem, campanha, data, empresa } = req.body;

    try {
        // Cria a página no Notion com os dados passados
        const response = await notion.pages.create({
            parent: {
                database_id: '1290d303-ccf9-808d-8697-f7a3dc42ef3f',  // ID do banco de dados
            },
            properties: {
                Company: {  // Define o nome da empresa
                    title: [
                        {
                            text: {
                                content: empresa || "Valor padrão",  // Se não houver empresa, coloca "Valor padrão"
                            },
                        },
                    ],
                },
                Content: {
                    rich_text: [
                        {
                            text: {
                                content: titulo || "Valor padrão",  // Se não houver título, coloca "Valor padrão"
                            },
                        },
                    ],
                },
                Description: {
                    rich_text: [
                        {
                            text: {
                                content: descricao || "Valor padrão",  // Se não houver descrição, coloca "Valor padrão"
                            },
                        },
                    ],
                },
                Campaign: {
                    rich_text: [
                        {
                            text: {
                                content: campanha || "Valor padrão",  // Se não houver campanha, coloca "Valor padrão"
                            },
                        },
                    ],
                },
                Where: {
                    rich_text: [
                        {
                            text: {
                                content: linkImagem || "Valor padrão",  // Coloca o link da imagem ou "Valor padrão"
                            },
                        },
                    ],
                },
                PlannedDate: {
                    date: {
                        start: data,  // Formato esperado para data: YYYY-MM-DD
                    },
                },
                'image content': {
                    rich_text: [
                        {
                            text: {
                                content: linkImagem || "Valor padrão",  // Link da imagem ou valor padrão
                            },
                        },
                    ],
                },
                Language: {
                    select: {
                        name: "Português"  // Definindo idioma como "Português"
                    },
                },
                ID: {
                    number: Math.floor(Math.random() * 1000),  // Gera um ID aleatório para a página
                },
            },
        });

        res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro ao criar página' });
    }
});

// Rota para buscar páginas no Notion com filtros
app.get('/api/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, campaign, language, where, idRow } = req.query;
        const filters = [];

        // Adiciona filtros conforme os parâmetros passados
        if (companyName) {
            filters.push({
                property: 'Company',
                rich_text: {
                    equals: companyName,
                },
            });
        }

        if (campaign) {
            filters.push({
                property: 'Campaign',
                rich_text: {
                    equals: campaign,
                },
            });
        }

        if (language) {
            filters.push({
                property: 'Language',
                select: {
                    equals: language,
                },
            });
        }

        if (where) {
            filters.push({
                property: 'Where',
                rich_text: {
                    equals: where,
                },
            });
        }

        // Faz a consulta no banco de dados do Notion com os filtros definidos
        const response = await notion.databases.query({
            database_id: id,
            filter: {
                and: filters,
            },
        });

        // Filtra resultados pela ID, se necessário
        const filteredResults = idRow
            ? response.results.filter(result => result.id === idRow)
            : response.results;

        res.status(200).json(filteredResults.map(result => {
            return {
                id: result.id,
                companyName: result.properties.Company.title[0]?.text.content ?? 'Campo sem valor',
                campaign: result.properties.Campaign.rich_text[0]?.text.content ?? 'Campo sem valor',
                description: result.properties.Description.rich_text[0]?.text.content ?? 'Campo sem valor',
                plannedDate: result.properties.PlannedDate.date?.start ?? 'Data não especificada',
                where: result.properties.Where.rich_text[0]?.text.content ?? 'Não especificado',
                language: result.properties.Language?.select?.name ?? 'Não especificada',
                content: result.properties.Content.rich_text[0]?.text?.content ?? 'Não especificado',
                imageUrl: result.properties["image content"]?.rich_text[0]?.text.content ?? 'Não especificado',
                imageText: result.properties.Image?.files[0]?.name ?? 'Imagem não especificada'
            };
        }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para atualizar uma página existente no Notion
app.put('/api/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            companyName, 
            campaign, 
            description, 
            plannedDate, 
            where, 
            language, 
            content, 
            imageUrl, 
            imageText 
        } = req.body;
        
        // Atualiza a página no Notion com os novos valores
        const response = await notion.pages.update({
            page_id: id,
            properties: {
                Company: {
                    title: [{ text: { content: companyName || "Valor padrão" } }],
                },
                Campaign: {
                    rich_text: [{ text: { content: campaign || "Valor padrão" } }],
                },
                Description: {
                    rich_text: [{ text: { content: description || "Valor padrão" } }],
                },
                PlannedDate: {
                    date: { start: plannedDate || "2024-11-10" },
                },
                Where: {
                    rich_text: [{ text: { content: where || "Valor padrão" } }],
                },
                Language: {
                    select: { name: language || "Não especificada" },
                },
                Content: {
                    rich_text: [{ text: { content: content || "Valor padrão" } }],
                },
                'image content': {
                    rich_text: [{ text: { content: imageUrl || "Valor padrão" } }],
                },
                Image: {
                    files: [{ 
                        name: imageText || "Imagem não especificada", 
                        external: { url: imageUrl || "URL não especificada" }
                    }],
                },
            },
        });
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para deletar uma página, arquivando-a
app.delete('/api/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Arquiva a página ao invés de deletá-la permanentemente
        const response = await notion.pages.update({
            page_id: id,
            archived: true,
        });

        if (response) {
            res.status(204).send();  // Retorna 204 para indicar sucesso sem conteúdo
        } else {
            res.status(404).json({ error: 'Página não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao arquivar a página:', error);
        res.status(500).json({ error: error.message });
    }
});

// Inicia o servidor na porta configurada
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
