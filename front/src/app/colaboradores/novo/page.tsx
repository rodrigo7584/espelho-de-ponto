'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NovoColaborador() {
  const [form, setForm] = useState({ matricula: '', nome: '', email: '', empresa: '' });
  const [empresas, setEmpresas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3001/api/colaboradores/empresas')
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(err => console.error('Erro ao buscar empresas:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/colaboradores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/colaboradores');
    } else {
      alert('Erro ao criar colaborador');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Novo Colaborador</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Matrícula"
          value={form.matricula}
          onChange={e => setForm({ ...form, matricula: e.target.value })}
        /><br />

        <input
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        /><br />

        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        /><br />

        {/* Select de empresa */}
        <label>Empresa:</label>
        <select
          value={form.empresa}
          onChange={e => setForm({ ...form, empresa: e.target.value })}
        >
          <option value="">Selecione uma empresa</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.numero_empresa}>
              {empresa.nome_empresa}
            </option>
          ))}
        </select><br />

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
