'use client';
import VoltarBotao from '@/components/btnVoltar';
import { Button } from '@/components/ui/button';
 import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {  FunnelIcon, UserRoundPen, UserRoundPlus, UserRoundX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('all');  // 👈 Filtro
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
 const colaboradoresFiltrados = 
  filtroEmpresa === "all"
    ? colaboradores
    : colaboradores.filter(c => c.numero_empresa === filtroEmpresa);
  return (
    <main className="max-w-[1100px] m-auto p-5 flex flex-col gap-6">
      <h1 className="text-3xl text-center font-medium">
        Colaboradores
      </h1>
      <div className="flex items-center justify-between gap-3">
        <VoltarBotao/>
        <div className="flex gap-3">
          <Button onClick={() => router.push('/colaboradores/novo')}>
            <UserRoundPlus/>
            Adicionar Novo Colaborador
          </Button> 

          <Select value={filtroEmpresa} onValueChange={setFiltroEmpresa}>
            <SelectTrigger className="w-[230px]">
                <FunnelIcon/>
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
        </div>
      </div>
      <Table className="p-6 bg-blue-50 rounded-lg shadow-lg">
        <TableCaption>Lista de todos colaboradores</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Matrícula</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[110px] text-right"> </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colaboradoresFiltrados.map(colaborador => (
            <TableRow  key={colaborador.id}>
              <TableCell className="font-medium">{colaborador.numero_matricula}</TableCell>
              <TableCell>{colaborador.nome_colaborador}</TableCell>
              <TableCell>{colaborador.email_colaborador}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button onClick={() => router.push(`/colaboradores/${colaborador.id}`)}>
                  <UserRoundPen/>
                </Button>
                <Button variant='destructive' onClick={() => excluirColaborador(colaborador.id)} className='bg-red-500 '>
                    <UserRoundX/>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
