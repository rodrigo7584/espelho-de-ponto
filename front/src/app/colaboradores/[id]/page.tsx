'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditarColaborador() {
  const { id } = useParams();
  const [form, setForm] = useState({ matricula: '', nome: '', email: '', empresa: '' });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/api/colaboradores/colaborador/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          matricula: data.numero_matricula ?? '',
          nome: data.nome_colaborador ?? '',
          email: data.email_colaborador ?? '',
          empresa: data.numero_empresa ?? '',
        });
      })
      .catch(err => {
        console.error('Erro ao buscar colaborador:', err);
        alert('Erro ao carregar dados do colaborador');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/api/colaboradores/colaborador/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/colaboradores');
    } else {
      alert('Erro ao atualizar colaborador');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Carregando dados...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Editar Colaborador</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Matrícula"
          value={form.matricula}
          onChange={e => setForm({ ...form, matricula: e.target.value })}
        /><br/>
        <input
          placeholder="Nome"
          value={form.nome}
          onChange={e => setForm({ ...form, nome: e.target.value })}
        /><br/>
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        /><br/>
        <input
          placeholder="Empresa"
          value={form.empresa}
          onChange={e => setForm({ ...form, empresa: e.target.value })}
        /><br/>
        <button type="submit">Atualizar</button>
      </form>
    </div>
  );
}
