'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');  // 👈 Filtro
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:3001/api/colaboradores')
      .then(res => res.json())
      .then(data => setColaboradores(data))
      .catch(err => console.error('Erro ao buscar colaboradores:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/colaboradores/empresas')
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(err => console.error('Erro ao buscar empresas:', err));
  }, []);

  const excluirColaborador = async (id) => {
    if (confirm('Tem certeza que deseja excluir?')) {
      const res = await fetch(`http://localhost:3001/api/colaboradores/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setColaboradores(colaboradores.filter(c => c.id !== id));
      } else {
        alert('Erro ao excluir colaborador');
      }
    }
  };

  // Filtra os colaboradores conforme a empresa selecionada
  const colaboradoresFiltrados = filtroEmpresa
    ? colaboradores.filter(c => c.numero_empresa === filtroEmpresa)
    : colaboradores;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Colaboradores</h1>
      <button onClick={() => router.push('/colaboradores/novo')}>
        Adicionar Novo Colaborador
      </button>

      {/* Filtro de empresa */}
      <div style={{ marginTop: '20px' }}>
        <label>Filtrar por Empresa:</label>
        <select value={filtroEmpresa} onChange={e => setFiltroEmpresa(e.target.value)}>
          <option value="">Todas</option>
          {empresas.map(empresa => (
            <option key={empresa.id} value={empresa.id}>
              {empresa.nome_empresa}
            </option>
          ))}
        </select>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Matrícula</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {colaboradoresFiltrados.map(colab => (
            <tr key={colab.id}>
              <td>{colab.id}</td>
              <td>{colab.numero_matricula}</td>
              <td>{colab.nome_colaborador}</td>
              <td>{colab.email_colaborador}</td>
              <td>
                <button onClick={() => router.push(`/colaboradores/${colab.id}`)}>
                  Alterar
                </button>
                <button onClick={() => excluirColaborador(colab.id)} style={{ marginLeft: '10px', color: 'red' }}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <h2>Empresas</h2>
        {empresas.map(empresa => (
          <div key={empresa.id}>
            <strong>{empresa.nome_empresa}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
