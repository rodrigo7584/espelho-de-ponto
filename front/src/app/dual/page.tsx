"use client";

import { useState } from "react";

export default function Dual() {
	const [pdfColaboradores, setPdfColaboradores] = useState(null);
	const [pdfTarget, setPdfTarget] = useState(null);
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!pdfColaboradores || !pdfTarget) {
			setStatus("❌ Selecione os dois arquivos PDF.");
			return;
		}

		const formData = new FormData();
		formData.append("pdfColaboradores", pdfColaboradores);
		formData.append("pdfTarget", pdfTarget);

		setLoading(true);
		setStatus("⏳ Enviando...");

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadDual/dual`, {
				method: "POST",
				body: formData,
			});

			const data = await res.json();

			if (res.ok) {
				setStatus(`✅ ${data.mensagem} (${data.colaboradoresEncontrados} encontrados)`);
			} else {
				setStatus(`❌ ${data.mensagem || "Erro no envio"}`);
			}
		} catch (err) {
			console.error(err);
			setStatus("❌ Erro na conexão com o servidor.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
			<div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-gray-700">Envio Dual de PDFs</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block mb-1 font-medium text-gray-600">PDF de Colaboradores</label>
						<input
							type="file"
							accept="application/pdf"
							onChange={(e) => setPdfColaboradores(e.target.files[0])}
							className="block w-full text-gray-700 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block mb-1 font-medium text-gray-600">PDF Target</label>
						<input
							type="file"
							accept="application/pdf"
							onChange={(e) => setPdfTarget(e.target.files[0])}
							className="block w-full text-gray-700 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full flex items-center justify-center ${
							loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
						} text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
					>
						{loading ? "Enviando..." : "Enviar PDFs"}
					</button>
				</form>

				{status && (
					<p
						className={`mt-4 text-sm font-medium ${
							status.startsWith("✅")
								? "text-green-600"
								: status.startsWith("⏳")
								? "text-gray-600"
								: "text-red-500"
						}`}
					>
						{status}
					</p>
				)}
			</div>
		</div>
	);
}
