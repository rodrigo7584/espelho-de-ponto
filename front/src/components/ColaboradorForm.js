"use client";

import { useEffect, useState } from "react";

export default function ColaboradorForm({ initialData = {}, onSubmit }) {
	const [form, setForm] = useState({
		matricula: "",
		nome: "",
		email: "",
		empresa: "",
	});

	useEffect(() => {
		if (initialData) {
			setForm({
				matricula: initialData.numero_matricula || "",
				nome: initialData.nome_colaborador || "",
				email: initialData.email_colaborador || "",
				empresa: initialData.numero_empresa || "",
			});
		}
	}, [initialData]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(form);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-4"
		>
			<input
				type="text"
				name="matricula"
				placeholder="Matrícula"
				value={form.matricula}
				onChange={handleChange}
				className="border p-2 rounded-xl"
				required
			/>
			<input
				type="text"
				name="nome"
				placeholder="Nome"
				value={form.nome}
				onChange={handleChange}
				className="border p-2 rounded-xl"
				required
			/>
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={form.email}
				onChange={handleChange}
				className="border p-2 rounded-xl"
				required
			/>
			<input
				type="text"
				name="empresa"
				placeholder="Empresa"
				value={form.empresa}
				onChange={handleChange}
				className="border p-2 rounded-xl"
				required
			/>
			<button
				type="submit"
				className="bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
			>
				Salvar
			</button>
		</form>
	);
}
