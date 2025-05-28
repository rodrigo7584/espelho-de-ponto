require("dotenv").config();

const express = require("express");
const cors = require("cors");

const uploadRoutes = require("./routes/uploadRoutes");
const colaboradorRoutes = require("./routes/colaboradorRoutes");

const app = express();

// Configura CORS
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://seudominio.com",
			"http://192.168.0.148",
			"https://192.168.0.148",
		],
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type"],
	}),
);

// Middleware para ler JSON
app.use(express.json());

// Rotas
app.use("/api/upload", uploadRoutes);
app.use("/api/colaboradores", colaboradorRoutes);

// Inicia o servidor
app.listen(3000, () => {
	console.log("Servidor rodando na porta 3001");
});
