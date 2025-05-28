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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NovoColaborador() {
  const [form, setForm] = useState({ matricula: '', nome: '', email: '', empresa: '' });
  const [empresas, setEmpresas] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores/empresas`)
      .then(res => res.json())
      .then(data => setEmpresas(data))
      .catch(err => console.error('Erro ao buscar empresas:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/colaboradores`, {
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
    <main className="max-w-[1100px] m-auto p-5 flex flex-col gap-6">
      <h1 className="text-3xl text-center font-medium">
        Novo Colaborador
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
            Salvar
          </Button>
        </form>
        <VoltarBotao/>
      </div>
    </main>
  );
}
