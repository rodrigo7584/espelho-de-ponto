const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const { extractTextFromPDF } = require("../services/pdfService");
const { sendEmail } = require("../services/emailService");

async function handleUpload(req, res) {
	const colaboradores = [
		{ nome: "ADRIELE COLTRI TARRAFEL", email: "adrieletarrafel@hotmail.com" },
		{
			nome: "RODRIGO GANDHI DE OLIVEIRA",
			email: "rodrigo.gandhi@cojiba.com.br",
		},
	];

	try {
		const uploadDir = path.join(__dirname, "..", "uploads");

		// Garantir que a pasta de upload existe
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		fs.chmodSync(uploadDir, 0o777);

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

			const pageText = await extractTextFromPDF(outputPath);
			const linhas = pageText.split("\n").map((l) => l.trim());
			const linhaColaborador = linhas[6];

			if (linhaColaborador) {
				// Procurar o colaborador pelo nome
				const colaboradorEncontrado = colaboradores.find((col) =>
					linhaColaborador
						.toLowerCase()
						.includes(col.nome.toLowerCase().trim()),
				);

				if (colaboradorEncontrado) {
					console.log(
						`Colaborador encontrado na página ${i + 1}: ${colaboradorEncontrado.nome}`,
					);

					// Enviar e-mail
					console.log(
						`Página ${i + 1} foi enviada para ${colaboradorEncontrado.email}`,
					);
					// await sendEmail(colaboradorEncontrado.email, outputPath);
				}
			}

			fs.unlinkSync(outputPath);
		}

		fs.unlinkSync(pdfPath);

		res.send("PDF processado e e-mails enviados!");
	} catch (error) {
		console.error(error);
		res.status(500).send("Erro ao processar PDF.");
	}
}

module.exports = {
	handleUpload,
};
