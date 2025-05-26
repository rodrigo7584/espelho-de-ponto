const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const { extractTextFromPDF } = require("../services/pdfService");
const { sendEmail } = require("../services/emailService");
const colaboradores = require("../data/colaboradores");

async function handleUpload(req, res) {
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

			const pageText = await extractTextFromPDF(outputPath);
			const linhas = pageText.split("\n").map((l) => l.trim());

			const linhaMatricula = linhas[5];

			if (linhaMatricula) {
				const match = linhaMatricula.match(/\b\d{5}\b/);
				if (match) {
					const matriculaEncontrada = match[0];
					console.log(
						`Matrícula encontrada na página ${i + 1}: ${matriculaEncontrada}`,
					);

					const colaborador = colaboradores.find(
						(col) => col.matricula === matriculaEncontrada,
					);

					if (colaborador) {
						await sendEmail(colaborador.email, outputPath);
						console.log(`Página ${i + 1} enviada para ${colaborador.email}`);
					}
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
