import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ROTA
app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

    const resposta = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `Resuma o texto abaixo de forma clara e humana:\n\n${texto}`
    });

    const resumo = resposta.output[0].content[0].text;

    res.json({ resultado: resumo });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao gerar resumo" });
  }
});

// SERVIDOR
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});

app.post("/naturalidade", async (req, res) => {
  const { texto } = req.body;

  try {
    const resposta = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
Analise o texto abaixo e diga se ele parece escrito por humano ou IA.

Explique brevemente:
- nível de naturalidade
- se parece robótico ou fluido

Texto:
${texto}
`
    });

    const resultado = resposta.output[0].content[0].text;

    res.json({ resultado });

  } catch (error) {
    res.status(500).json({ erro: "Erro na análise" });
  }
});
app.post("/humanizar", async (req, res) => {
  const { texto } = req.body;

  try {
    const resposta = await openai.responses.create({
      model: "gpt-4o-mini",
      input: `
Reescreva o texto abaixo de forma mais humana, natural e fluida.
Evite parecer robótico ou artificial.

Texto:
${texto}
`
    });

    const resultado = resposta.output[0].content[0].text;

    res.json({ resultado });

  } catch (error) {
    res.status(500).json({ erro: "Erro ao humanizar" });
  }
});



app.post("/analisar", async (req, res) => {
  try {
    const { texto } = req.body;

    const resposta = await openai.responses.create({
      model: "gpt-4o-mini",
      

input: `

Você é um avaliador textual.

Analise o texto abaixo e retorne APENAS um JSON válido.

NÃO escreva explicações.
NÃO use markdown.
NÃO use \`\`\`json.
NÃO escreva nenhum texto adicional.

Formato obrigatório:

{
  "originalidade": 0,
  "similaridade": 0,
  "clareza": 0
}

As notas devem ser números de 0 a 100.


${texto}
`
    });

    const resultado = resposta.output[0].content[0].text;

    console.log(resultado);

    res.json(JSON.parse(resultado));

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro na análise" });
  }
});