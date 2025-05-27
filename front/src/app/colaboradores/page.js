"use client";
import ColaboradorItem from "@/components/ColaboradorItem";
import { useEffect, useState } from "react";

export default function ColaboradoresPage() {
	const [colaboradores, setColaboradores] = useState([]);

	const fetchColaboradores = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores`);
		const data = await res.json();
		setColaboradores(data);
	};

	const deleteColaborador = async (id) => {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/${id}`, {
			method: "DELETE",
		});
		fetchColaboradores();
	};

	useEffect(() => {
		fetchColaboradores();
	}, []);

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Colaboradores</h1>
			<a
				href="/colaboradores/novo"
				className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition mb-4 inline-block"
			>
				Novo Colaborador
			</a>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{colaboradores.map((colaborador) => (
					<ColaboradorItem
						key={colaborador.id}
						colaborador={colaborador}
						onDelete={deleteColaborador}
					/>
				))}
			</div>
		</div>
	);
}
