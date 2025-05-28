'use client';
import VoltarBotao from '@/components/btnVoltar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SaveIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditarColaborador() {
  const { id } = useParams();
  const [form, setForm] = useState({ matricula: '', nome: '', email: '', empresa: '' });
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Buscar empresas
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/empresas`)
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(err => console.error('Erro ao buscar empresas:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/colaborador/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          matricula: data.numero_matricula ?? '',
          nome: data.nome_colaborador ?? '',
          email: data.email_colaborador ?? '',
          empresa: data.numero_empresa ?? '',  // Aqui continua vindo o ID da empresa
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/colaborador/${id}`, {
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
    <main className="max-w-[1100px] m-auto p-5 flex flex-col gap-6">
      <h1 className="text-3xl text-center font-medium">
        Atualizar Colaborador
      </h1>
      <div className="p-6 bg-blue-50 rounded-lg shadow-lg w-[500px] m-auto flex flex-col gap-2">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
          <Input 
            placeholder="Matrícula"
            value={form.matricula}
            onChange={e => setForm({ ...form, matricula: e.target.value })}
          />
          <Input 
            placeholder="Nome"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
          />
          <Input 
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <Select value={form.empresa} onValueChange={(value) => setForm({ ...form, empresa: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Empresas</SelectLabel>
                  <SelectItem value="all">
                    Todas
                  </SelectItem>
                  {empresas.map(empresa => (
                    <SelectItem  key={empresa.id} value={empresa.numero_empresa}>
                    {empresa.nome_empresa}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="submit" className="bg-green-500 hover:bg-green-400">
            <SaveIcon/>
            Atualizar
          </Button>
        </form>
        <VoltarBotao/>
      </div>
    </main>
  );
}
