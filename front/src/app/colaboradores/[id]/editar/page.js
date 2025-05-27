import ColaboradorForm from "@/components/ColaboradorForm";
("use client");

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditarColaboradorPage() {
	const params = useParams();
	const id = params.id;

	const [colaborador, setColaborador] = useState(null);

	useEffect(() => {
		const fetchColaborador = async () => {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/${id}`,
			);
			const data = await res.json();
			setColaborador(data);
		};
		fetchColaborador();
	}, [id]);

	const atualizarColaborador = async (form) => {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(form),
		});
		window.location.href = "/colaboradores";
	};

	if (!colaborador) return <p>Carregando...</p>;

	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Editar Colaborador</h1>
			<ColaboradorForm
				initialData={colaborador}
				onSubmit={atualizarColaborador}
			/>
		</div>
	);
}
