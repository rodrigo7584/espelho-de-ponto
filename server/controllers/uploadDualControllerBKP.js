const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { PDFDocument } = require("pdf-lib");
const { extractTextFromPDF } = require("../services/pdfService");
const { sendEmail } = require("../services/emailService");

async function handleUploadDual(req, res) {
	try {
		// Arquivos
		const pdfColaboradores = req.files.pdfColaboradores[0];
		const pdfTarget = req.files.pdfTarget[0];

		// === Passo 1: Processar o PDF de colaboradores ===
		const dataBuffer = fs.readFileSync(pdfColaboradores.path);
		const pdfData = await pdfParse(dataBuffer);
		const text = pdfData.text;

		const colaboradores = [];
		const regex =
			/Nome:\s+\d+-([A-Z\s]+)\s[\s\S]+?E-Mail\s+Comercial:\s*([\w.-]+@[\w.-]+\.\w+)/g;

		let match;
		while ((match = regex.exec(text)) !== null) {
			const nome = match[1].trim();
			const email = match[2].trim();
			colaboradores.push({ nome, email });
		}

		fs.unlinkSync(pdfColaboradores.path);

		if (colaboradores.length < 1) {
			return res.status(400).json({
				mensagem: "Nenhum colaborador encontrado no PDF de colaboradores",
			});
		}

		// === Passo 2: Processar o PDF target ===
		const pdfBytes = fs.readFileSync(pdfTarget.path);
		const pdfDoc = await PDFDocument.load(pdfBytes);
		const numPages = pdfDoc.getPageCount();

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
				const colaboradorEncontrado = colaboradores.find((col) =>
					linhaColaborador
						.toLowerCase()
						.includes(col.nome.toLowerCase().trim()),
				);

				if (colaboradorEncontrado) {
					console.log(
						`Colaborador encontrado na página ${i + 1}: ${colaboradorEncontrado.nome}`,
					);
					console.log(
						`Página ${i + 1} foi enviada para ${colaboradorEncontrado.email}`,
					);
					console.log(outputPath);
					await sendEmail(colaboradorEncontrado.email, outputPath);
				}
			}

			fs.unlinkSync(outputPath);
		}

		fs.unlinkSync(pdfTarget.path);

		return res.json({
			mensagem: "PDF processado e e-mails enviados com base no outro PDF",
			colaboradoresEncontrados: colaboradores.length,
		});
	} catch (err) {
		console.error("Erro ao processar:", err);
		return res.status(500).json({ error: "Erro ao processar os PDFs." });
	}
}

module.exports = { handleUploadDual };
