"use client";

import { useState } from "react";

export default function Dual() {
  const [pdfColaboradores, setPdfColaboradores] = useState(null);
  const [pdfTarget, setPdfTarget] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfColaboradores || !pdfTarget) {
      setStatus("❌ Selecione os dois arquivos PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfColaboradores", pdfColaboradores);
    formData.append("pdfTarget", pdfTarget);

    setLoading(true);
    setStatus("⏳ Processando...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadDual/processarDual`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setResultados(data.resultados);
        setStatus(`✅ Processado. ${data.resultados.length} e-mails prontos.`);
      } else {
        setStatus(`❌ ${data.mensagem || "Erro no processamento"}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarEmails = async () => {
    setLoading(true);
    setStatus("⏳ Enviando e-mails...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadDual/enviarEmailsDual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lista: resultados }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ E-mails enviados com sucesso!");
        setResultados([]);
      } else {
        setStatus(`❌ ${data.error || "Erro ao enviar e-mails"}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao enviar os e-mails.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async () => {
    setLoading(true);
    setStatus("⏳ Cancelando operação...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadDual/cancelarOperacao`, {
        method: "POST",
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Operação cancelada.");
        setResultados([]);
      } else {
        setStatus(`❌ ${data.error || "Erro ao cancelar"}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Erro ao cancelar a operação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-700">Envio Dual de PDFs</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept="application/pdf" onChange={(e) => setPdfColaboradores(e.target.files[0])} />
          <input type="file" accept="application/pdf" onChange={(e) => setPdfTarget(e.target.files[0])} />
          <button type="submit" disabled={loading}>
            {loading ? "Processando..." : "Processar PDFs"}
          </button>
        </form>

        {resultados.length > 0 && (
          <div className="mt-4">
            <h2 className="font-bold mb-2">E-mails prontos:</h2>
            <ul className="text-sm">
              {resultados.map((r, idx) => (
                <li key={idx}>
                  📄 Página {r.pagina}: {r.nome} → {r.email}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-4">
              <button onClick={handleEnviarEmails} disabled={loading} className="bg-green-500 text-white p-2 rounded">
                Enviar E-mails
              </button>
              <button onClick={handleCancelar} disabled={loading} className="bg-red-500 text-white p-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {status && <p className="mt-4 text-sm">{status}</p>}
      </div>
    </div>
  );
}
