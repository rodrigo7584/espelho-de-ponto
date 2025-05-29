const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const { extractTextFromPDF } = require("../services/pdfService");
const { sendEmail } = require("../services/emailService");
const pool = require("../db");
const resultadosEnvio = [];

async function handleUpload(req, res) {
	try {
		const uploadDir = path.join(__dirname, "..", "uploads");

		// Garantir pasta existe e permissão
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		fs.chmodSync(uploadDir, 0o777);

		const pdfPath = req.file.path;
		const numero_empresa = req.body.numero_empresa;

		if (!numero_empresa) {
			// return res.status(400).send("Número da empresa não informado.");
			return res
				.status(404)
				.json({ mensagem: "Número da empresa não informado." });
		}

		// Consulta os colaboradores dessa empresa
		const { rows: colaboradores } = await pool.query(
			"SELECT numero_matricula, email_colaborador FROM colaboradores WHERE numero_empresa = $1",
			[numero_empresa],
		);

		if (colaboradores.length === 0) {
			// return res.status(404).send("Nenhum colaborador encontrado para esta empresa.");
			return res
				.status(404)
				.json({ mensagem: "Nenhum colaborador encontrado para esta empresa." });
		}

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

			const pageText = await extractTextFromPDF(outputPath);
			const linhas = pageText.split("\n").map((l) => l.trim());
			const linhaMatricula = linhas[5];
			const linhaColaborador = linhas[6];

			const statusEnvio = {
				pagina: i + 1,
				linhaColaborador,
				email: null,
				enviado: false,
			};

			if (linhaMatricula) {
				const match = linhaMatricula.match(/\b\d{5}\b/);
				if (match) {
					const matriculaEncontrada = match[0];
					console.log(
						`Matrícula encontrada na página ${i + 1}: ${matriculaEncontrada}`,
					);

					const colaborador = colaboradores.find(
						(col) => col.numero_matricula === matriculaEncontrada,
					);
					if (colaborador) {
						// await sendEmail(colaborador.email_colaborador, outputPath);
						statusEnvio.email = colaborador.email_colaborador;
						statusEnvio.enviado = true;
						console.log(
							`Página ${i + 1} foi enviada para ${linhaColaborador} no email:${colaborador.email_colaborador}`,
						);
					}
				}
			}
			resultadosEnvio.push(statusEnvio);
			fs.unlinkSync(outputPath);
		}

		fs.unlinkSync(pdfPath);

		res.json({
			mensagem: "PDF processado.",
			resultados: resultadosEnvio,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao processar PDF.");
	}
}

module.exports = {
	handleUpload,
};
