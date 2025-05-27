'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NovoColaborador() {
  const [form, setForm] = useState({ matricula: '', nome: '', email: '', empresa: '' });
  const router = useRouter();

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
        <input placeholder="Matrícula" value={form.matricula} onChange={e => setForm({ ...form, matricula: e.target.value })} /><br/>
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /><br/>
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /><br/>
        <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} /><br/>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
