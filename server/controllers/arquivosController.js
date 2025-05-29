const fs = require("fs");
const pdfParse = require("pdf-parse");

async function handleUpload(req, res) {
	if (!req.file) {
		return res.status(400).json({ error: "Nenhum arquivo enviado." });
	}

	const filePath = req.file.path;

	try {
		const dataBuffer = fs.readFileSync(filePath);
		const pdfData = await pdfParse(dataBuffer);

		const text = pdfData.text;

		const results = [];

		// Regex para capturar Nome e E-Mail
		const regex =
			/Nome:\s+\d+-([A-Z\s]+)\s[\s\S]+?E-Mail\s+Comercial:\s*([\w.-]+@[\w.-]+\.\w+)/g;

		let match;
		while ((match = regex.exec(text)) !== null) {
			const nome = match[1].trim();
			const email = match[2].trim();

			results.push({ nome, email });
		}

		// Deletar o arquivo após o processamento (opcional)
		fs.unlinkSync(filePath);

		return res.json({ dados: results });
	} catch (err) {
		console.error("Erro ao processar o PDF:", err);
		return res.status(500).json({ error: "Erro ao processar o PDF." });
	}
}

module.exports = { handleUpload };
