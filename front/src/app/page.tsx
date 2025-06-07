import { Button } from "@/components/ui/button";
import { FilesIcon, FileUp, Users } from "lucide-react";
import Link from "next/link";
export default function Home() {
	return (
		<div className="h-[100vh] flex justify-center items-center gap-4">
			{/* <Button asChild >
				<Link href="/envio">
					<FileUp/>
					Enviar Arquivos
				</Link>
			</Button>
			<Button asChild>
				<Link href="/colaboradores">
					<Users/>
					Colaboradores
				</Link>
			</Button>
			<Button asChild>
				<Link href="/arquivos">
					<Users/>
					Arquivos
				</Link>
			</Button>
			<Button asChild>
				<Link href="/dual">
					<Users/>
					Dual
				</Link>
			</Button> */}
			<Button asChild>
				<Link href="/dualWithReturn">
					<FilesIcon/>
					Enviar arquivos 
				</Link>
			</Button>
		</div>
	);
}
