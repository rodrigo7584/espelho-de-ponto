"use client";

import { useEffect, useState } from "react";

export default function Envio() {
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState("");
	const [empresas, setEmpresas] = useState([]);
	const [empresaSelecionada, setEmpresaSelecionada] = useState("");

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setStatus("");
		setProgress(0);
	};

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/empresas`)
			.then(res => res.json())
			.then(data => setEmpresas(data))
			.catch(err => console.error('Erro ao buscar empresas:', err));
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!file) {
			setStatus("Por favor, selecione um arquivo PDF.");
			return;
		}

		if (!empresaSelecionada) {
			setStatus("Por favor, selecione uma empresa.");
			return;
		}

		const formData = new FormData();
		formData.append("pdf", file);
		formData.append("numero_empresa", empresaSelecionada);

		setStatus("Enviando...");

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
				method: "POST",
				body: formData,
			});

			if (res.ok) {
				setStatus("✅ PDF enviado e processado com sucesso!");
			} else {
				setStatus("❌ Erro ao enviar PDF.");
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

					<select
						value={empresaSelecionada}
						onChange={(e) => setEmpresaSelecionada(e.target.value)}
						className="block w-full text-gray-700 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<option value="">Selecione uma empresa</option>
						{empresas.map((empresa) => (
							<option key={empresa.numero_empresa} value={empresa.numero_empresa}>
								{empresa.nome_empresa}
							</option>
						))}
					</select>

					<button
						type="submit"
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
					>
						Enviar PDF
					</button>
				</form>

				{progress > 0 && (
					<div className="mt-4 w-full bg-gray-200 rounded-full h-4">
						<div
							className="bg-blue-500 h-4 rounded-full transition-all duration-500"
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}

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
