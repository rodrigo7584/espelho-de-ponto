"use client";

export default function ColaboradorItem({ colaborador, onDelete }) {
	return (
		<div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-2 hover:shadow-2xl transition">
			<h2 className="text-xl font-bold">{colaborador.nome_colaborador}</h2>
			<p className="text-gray-600">{colaborador.email_colaborador}</p>
			<p className="text-gray-500 text-sm">
				Matrícula: {colaborador.numero_matricula}
			</p>
			<p className="text-gray-500 text-sm">
				Empresa: {colaborador.numero_empresa}
			</p>

			<div className="flex gap-2 mt-4">
				<a
					href={`/colaboradores/${colaborador.id}/editar`}
					className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
				>
					Editar
				</a>
				<button
					onClick={() => onDelete(colaborador.id)}
					className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
				>
					Excluir
				</button>
			</div>
		</div>
	);
}
