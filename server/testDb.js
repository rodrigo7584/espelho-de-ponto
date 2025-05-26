const pool = require("./db"); // Importa a conexão configurada

async function testConnection() {
	try {
		const res = await pool.query("SELECT NOW();"); // Executa uma query simples
		console.log(
			"Conexão bem-sucedida! Data e hora do servidor:",
			res.rows[0].now,
		);
	} catch (error) {
		console.error("Erro ao conectar ao banco:", error);
	} finally {
		pool.end(); // Fecha a conexão
	}
}

testConnection();
