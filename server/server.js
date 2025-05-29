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
			"https://desenvolvimento-pontofront.x0k8xs.easypanel.host",
			"http://desenvolvimento-pontofront.x0k8xs.easypanel.host",
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
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}`);
});
