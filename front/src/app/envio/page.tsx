"use client";

import { useEffect, useState } from "react";

export default function Envio() {
	const [file, setFile] = useState(null);
	const [progress, setProgress] = useState(0);
	const [status, setStatus] = useState("");
	const [empresas, setEmpresas] = useState([]);
	const [empresaSelecionada, setEmpresaSelecionada] = useState("");
	const [resultados, setResultados] = useState([]);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
		setStatus("");
		setProgress(0);
		setResultados([]);
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
			setStatus("❌ Por favor, selecione um arquivo PDF.");
			return;
		}

		if (!empresaSelecionada) {
			setStatus("❌ Por favor, selecione uma empresa.");
			return;
		}

		const formData = new FormData();
		formData.append("pdf", file);
		formData.append("numero_empresa", empresaSelecionada);

		setStatus("⏳ Enviando...");
		setProgress(10);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
				method: "POST",
				body: formData,
			});

			let json = { mensagem: "Resposta inválida do servidor." };

			try {
				json = await res.json();
			} catch (e) {
				console.error("Erro ao converter resposta para JSON:", e);
			}

			if (res.ok) {
				setStatus(`✅ ${json.mensagem}`);
				setResultados(json.resultados || []);
				setProgress(100);
				setFile(null);  // limpa arquivo após sucesso
			} else {
				setStatus(`❌ ${json.mensagem}`);
				setProgress(0);
			}
		} catch (err) {
			console.error("Erro na requisição:", err);
			setStatus("❌ Erro na conexão com o servidor.");
			setProgress(0);
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

				{progress > 0 && progress < 100 && (
					<div className="mt-4 w-full bg-gray-200 rounded-full h-4">
						<div
							className="bg-blue-500 h-4 rounded-full transition-all duration-500"
							style={{ width: `${progress}%` }}
						/>
					</div>
				)}

				{status && (
					<p
						className={`mt-4 text-sm font-medium ${
							status.startsWith("✅") ? "text-green-600" : "text-red-500"
						}`}
					>
						{status}
					</p>
				)}
			</div>

			{resultados.length > 0 && (
				<div className="mt-6 ml-6 bg-white shadow-lg rounded-xl p-6 max-w-md">
					<h2 className="font-semibold mb-4 text-gray-700">Relatório de envio:</h2>
					<ul className="space-y-2">
						{resultados.map((r, index) => (
							<li
								key={index}
								className={`p-2 rounded ${
									r.enviado
										? "bg-green-100 text-green-700"
										: "bg-red-100 text-red-700"
								}`}
							>
								Página {r.pagina}: {r.linhaColaborador || "Desconhecido"} -{" "}
								{r.email || "Email não encontrado"} -{" "}
								{r.enviado ? "✅ Enviado" : "❌ Não enviado"}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
