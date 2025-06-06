"use client";

import { useEffect, useState } from "react";

export default function Envio() {
	const [file, setFile] = useState(null);
	const [status, setStatus] = useState("");

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setStatus("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			setStatus("Por favor, selecione um arquivo PDF.");
			return;
		}

		const formData = new FormData();
		formData.append("pdf", file);

		setStatus("Enviando...");

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/arquivos`, {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			
			if (res.ok) {
				setStatus(`✅ ${data.mensagem}`);
			} else {
				setStatus(`❌ ${data.mensagem}`);
			}
		} catch (err) {
			console.error(err);
			setStatus("❌ Erro na conexão com o servidor.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
			<div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
				<h1 className="text-2xl font-bold mb-6 text-gray-700">Envio de PDF</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<input
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						className="block w-full text-gray-700 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
					>
						Enviar PDF
					</button>
				</form>

				{status && (
					<p
						className={`mt-4 text-sm font-medium ${status.startsWith("✅") ? "text-green-600" : "text-red-500"}`}
					>
						{status}
					</p>
				)}
			</div>
		</div>
	);
}
