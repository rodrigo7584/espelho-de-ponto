require("dotenv").config();

const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const nodemailer = require("nodemailer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const app = express();
const cors = require("cors");
const upload = multer({ dest: "uploads/" });

app.use(
	cors({
		origin: ["http://localhost:3000", "https://seudominio.com"], // só permite esses domínios
		methods: ["POST"], // apenas POST
		allowedHeaders: ["Content-Type"],
	}),
);

const colaboradores = [
	{ matricula: "00736", email: "rodrigo.gandhi.oliveira@gmail.com" },
	{ matricula: "01290", email: "natan.arcenio@cojiba.com.br" },
];

app.post("/upload", upload.single("pdf"), async (req, res) => {
	try {
		const pdfPath = req.file.path;
		const pdfBytes = fs.readFileSync(pdfPath);
		const pdfDoc = await PDFDocument.load(pdfBytes);
		const numPages = pdfDoc.getPageCount();

		console.log(`Total de páginas: ${numPages}`);

		for (let i = 0; i < numPages; i++) {
			const newPdf = await PDFDocument.create();
			const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
			newPdf.addPage(copiedPage);

			const pdfData = await newPdf.save();
			const outputPath = `uploads/page-${i + 1}.pdf`;
			fs.writeFileSync(outputPath, pdfData);

			// Extrair texto da página
			const pageText = await extractTextFromPDF(outputPath);
			const linhas = pageText.split("\n").map((l) => l.trim()); // tira espaços desnecessários

			// console.log(`Texto da página ${i + 1}:`);
			// console.log(linhas);

			// Supondo que a matrícula está na 4ª linha (índice 3)
			const linhaMatricula = linhas[5];

			if (linhaMatricula) {
				const match = linhaMatricula.match(/\b\d{5}\b/); // captura número de 5 dígitos
				if (match) {
					const matriculaEncontrada = match[0];
					console.log(
						`Matrícula encontrada na página ${i + 1}: ${matriculaEncontrada}`,
					);

					// Procurar se a matrícula encontrada está na lista de colaboradores
					const colaborador = colaboradores.find(
						(col) => col.matricula === matriculaEncontrada,
					);

					if (colaborador) {
						// await sendEmail(colaborador.email, outputPath);
						console.log(`Página ${i + 1} enviada para ${colaborador.email}`);
					}
				}
			}

			// Apagar a página após o envio
			fs.unlinkSync(outputPath);
		}

		// Apagar PDF original
		fs.unlinkSync(pdfPath);

		res.send("PDF processado e e-mails enviados!");
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao processar PDF.");
	}
});

// Função para extrair texto usando pdf-parse
async function extractTextFromPDF(filePath) {
	const dataBuffer = fs.readFileSync(filePath);
	const data = await pdfParse(dataBuffer);
	return data.text;
}

// Enviar e-mail
async function sendEmail(to, attachmentPath) {
	const transporter = nodemailer.createTransport({
		host: "suite.penso.com.br",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.SENHA,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	await transporter.sendMail({
		from: "rodrigo.gandhi@cojiba.com.br",
		to,
		subject: "Seu espelho de ponto",
		text: "Segue em anexo seu espelho de ponto, não responda esse email.",
		attachments: [{ path: attachmentPath }],
	});
}

app.listen(3001, () => {
	console.log("Servidor rodando na porta 3001");
});
