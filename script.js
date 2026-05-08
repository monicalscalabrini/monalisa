console.log("SCRIPT CARREGADO");




async function gerarResenha() {
    const texto = document.getElementById("inputText").value;

    if (!texto) {
        alert("Digite um texto primeiro.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/resumir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: texto })
        });

        const data = await response.json();

        console.log("RESPOSTA:", data);

        // 👉 MOSTRA NO SEU QUADRO BONITO
        document.getElementById("resultado").innerText = data.resultado;

    } catch (erro) {
        console.error("ERRO:", erro);

        document.getElementById("resultado").innerText =
            "Erro ao conectar com IA";
    }
}


// LIMPAR TEXTO
function limparInput() {
    document.getElementById("inputText").value = "";

    // 🔥 limpa o arquivo também
    document.getElementById("fileInput").value = "";
}


// COPIAR RESULTADO
function copiarResultado() {
    const texto = document.getElementById("resultado").innerText;
    navigator.clipboard.writeText(texto);
}


// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const usuarioSalvo = localStorage.getItem("usuario");

  if (!usuarioSalvo) {
    alert("Nenhuma conta encontrada. Cadastre-se primeiro.");
    return;
  }

  const usuario = JSON.parse(usuarioSalvo);

  if (email === usuario.email && senha === usuario.senha) {
  window.location.href = "dashboard.html"; 
    usuario.logado = true;
    localStorage.setItem("usuario", JSON.stringify(usuario));

    window.location.href = "dashboard.html";
  } else {
    alert("Email ou senha incorretos");
  }
}
function logout() {
  const usuarioSalvo = localStorage.getItem("usuario");

  if (usuarioSalvo) {
    const usuario = JSON.parse(usuarioSalvo);
    usuario.logado = false;
    localStorage.setItem("usuario", JSON.stringify(usuario));
  }

  window.location.href = "login.html";
}
async function carregarArquivo() {
    const input = document.getElementById("fileInput");
    const file = input.files[0];

    if (!file) {
        alert("Selecione um arquivo.");
        return;
    }

    const nome = file.name.toLowerCase();

    // =========================
    // TXT
    // =========================
    if (nome.endsWith(".txt")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("inputText").value = e.target.result;
        };

        reader.readAsText(file);
    }

    // =========================
    // PDF
    // =========================
    else if (nome.endsWith(".pdf")) {
        const reader = new FileReader();

        reader.onload = async function(e) {
            const typedarray = new Uint8Array(e.target.result);

            const pdf = await pdfjsLib.getDocument(typedarray).promise;

            let texto = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();

                const strings = content.items.map(item => item.str);
                texto += strings.join(" ") + "\n";
            }

            document.getElementById("inputText").value = texto;
        };

        reader.readAsArrayBuffer(file);
    }

    // =========================
    // DOCX (Word)
    // =========================
    else if (nome.endsWith(".docx")) {
        const reader = new FileReader();

        reader.onload = function(e) {
            mammoth.extractRawText({ arrayBuffer: e.target.result })
                .then(result => {
                    document.getElementById("inputText").value = result.value;
                })
                .catch(err => {
                    console.error(err);
                    alert("Erro ao ler arquivo Word.");
                });
        };

        reader.readAsArrayBuffer(file);
    }

    // =========================
    // NÃO SUPORTADO
    // =========================
    else {
        alert("Formato não suportado.");
    }
}
async function refinarTexto() {
    const texto = document.getElementById("resultado").innerText;

    if (!texto) {
        alert("Não há texto para refinar.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/resumir", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto: texto })
        });

        const data = await response.json();

        // 🔥 substitui pelo texto refinado
        document.getElementById("resultado").innerText = data.resultado;

    } catch (erro) {
        console.error("Erro ao refinar:", erro);
        alert("Erro ao refinar texto.");
    }
}async function analisarIA() {
    const texto = document.getElementById("resultado").innerText;

    if (!texto) {
        alert("Gere um texto primeiro.");
        return;
    }

    const response = await fetch("http://localhost:3000/naturalidade", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto })
    });

    const data = await response.json();

    document.getElementById("analiseIA").innerText = data.resultado;
}
async function humanizarTexto() {
    const texto = document.getElementById("resultado").innerText;

    if (!texto) {
        alert("Gere um texto primeiro.");
        return;
    }

    const response = await fetch("http://localhost:3000/humanizar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ texto })
    });

    const data = await response.json();

    document.getElementById("resultado").innerText = data.resultado;
}

async function analisarQualidade() {

    console.log("BOTÃO CLICADO");

    const texto = document.getElementById("resultado").innerText;

    console.log("Texto enviado:", texto);

    if (!texto) {
        alert("Gere um texto primeiro.");
        return;
    }

    try {

        const response = await fetch("http://localhost:3000/analisar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ texto })
        });

        const data = await response.json();

        console.log("DADOS RECEBIDOS:", data);

        document.getElementById("scoreOriginalidade").innerText =
            data.originalidade + "%";

        document.getElementById("scorePlagio").innerText =
            data.similaridade + "%";

        document.getElementById("scoreClareza").innerText =
            data.clareza + "%";

    } catch (erro) {

        console.error("ERRO:", erro);

        alert("Erro ao analisar qualidade.");

    }
}