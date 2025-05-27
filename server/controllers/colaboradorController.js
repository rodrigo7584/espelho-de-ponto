const pool = require("../db");

async function listar(req, res) {
	try {
		const result = await pool.query("SELECT * FROM colaboradores");
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensagem: "Erro ao listar colaboradores" });
	}
}

async function buscarPorColaborador(req, res) {
	const id = req.params.id;
	try {
		const result = await pool.query(
			"SELECT * FROM colaboradores WHERE id = $1",
			[id],
		);
		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.status(404).json({ mensagem: "Colaborador não encontrado" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensagem: "Erro ao buscar colaborador" });
	}
}

async function buscarPorEmpresa(req, res) {
	const id = Number.parseInt(req.params.id);
	if (!id) {
		return res.status(400).json({ erro: "ID obrigatório!" });
	}
	try {
		const result = await pool.query(
			"SELECT * FROM colaboradores WHERE numero_empresa = $1",
			[id],
		);
		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.status(404).json({ mensagem: "Nenhum colaborador encontrado" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensagem: "Erro ao buscar colaborador" });
	}
}

async function criar(req, res) {
	try {
		const { matricula, nome, email, empresa } = req.body;
		if (!matricula || !nome || !email || !empresa) {
			return res.status(400).json({ erro: "Campos obrigatórios!" });
		}

		const result = await pool.query(
			"INSERT INTO colaboradores (numero_matricula, nome_colaborador, email_colaborador, numero_empresa) VALUES ($1, $2, $3, $4) RETURNING *",
			[matricula, nome, email, empresa],
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ erro: "Erro ao criar colaborador" });
	}
}

async function atualizar(req, res) {
	const id = Number.parseInt(req.params.id);
	const { matricula, nome, email, empresa } = req.body;
	if (!matricula || !nome || !email || !empresa) {
		return res.status(400).json({ erro: "Campos obrigatórios!" });
	}
	try {
		const result = await pool.query(
			"UPDATE colaboradores SET numero_matricula = $1, nome_colaborador = $2, email_colaborador = $3 , numero_empresa = $4  WHERE id = $5 RETURNING *",
			[matricula, nome, email, empresa, id],
		);
		if (result.rows.length > 0) {
			res.json(result.rows[0]);
		} else {
			res.status(404).json({ mensagem: "Colaborador não encontrado" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensagem: "Erro ao atualizar colaborador" });
	}
}

async function excluir(req, res) {
	const id = Number.parseInt(req.params.id);
	try {
		const result = await pool.query(
			"DELETE FROM colaboradores WHERE id = $1 RETURNING *",
			[id],
		);
		if (result.rows.length > 0) {
			res.json({ mensagem: "Colaborador removido" });
		} else {
			res.status(404).json({ mensagem: "Colaborador não encontrado" });
		}
	} catch (err) {
		console.error(err);
		res.status(500).json({ mensagem: "Erro ao excluir colaborador" });
	}
}

module.exports = {
	listar,
	buscarPorColaborador,
	buscarPorEmpresa,
	criar,
	atualizar,
	excluir,
};
