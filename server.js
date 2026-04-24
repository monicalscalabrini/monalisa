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

// ==============================
// ROTA DE RESUMO COM IA
// ==============================
app.post("/resumir", async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto) {
      return res.status(400).json({ erro: "Texto vazio" });
    }

    const resposta = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um especialista em escrita acadêmica."
        },
        {
          role: "user",
          content: `




Reescreva o texto abaixo em múltiplas camadas de refinamento interno, como se estivesse sendo revisado várias vezes por um humano.

REGRAS:

Resuma o texto abaixo de forma objetiva e profissional.

REGRAS:
- Nao repita mais de tres palavras iguais
- Reduza o tamanho em pelo menos 40%
- Elimine redundâncias
- Mantenha apenas as ideias principais
- Reescreva com linguagem natural e fluida
- Não copie frases do texto original
-Jamais inicie o paragrafo com a palavra do texto original

REESCRITA:
crie uma versao do texto que assemelhe-se a um humano falando,
calmo, com palavras de um vocabulario simples porem nunca 
previsiveis, a cada tres palavras encontre um sinonimo para a 
terceira palavra, mude a estrutura da frase alternando entre
virgulas, prefira expressoes humanas de pouco intelecto, preserve 
integralmente o sentido da frase.
Crie uma versão do texto que soe naturalmente humana, 
evitando construções previsíveis ou padronizadas. Reformule 
todas as frases com fluidez, variando o ritmo e a estrutura sintática.
Substitua palavras recorrentes por sinônimos adequados ao contexto,
garantindo precisão semântica e coerência. 
Elimine repetições desnecessárias, prefira expressões mais 
orgânicas e menos mecânicas, e introduza pequenas variações de estilo
que simulem a escrita espontânea de um humano. Preserve integralmente 
o sentido original, sem acrescentar novas informações ou alterar o conteúdo.


TEXTO:
${texto}
`
        }
      ],
    });

    const resumo = resposta.choices[0].message.content;

    res.json({ resumo });

  } catch (error) {
    console.error("ERRO NO BACKEND:", error);
    res.status(500).json({ erro: "Erro ao gerar resumo" });
  }
});

// ==============================
// START SERVIDOR
// ==============================
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});