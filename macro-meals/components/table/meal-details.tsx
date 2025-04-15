"use client";

import { DialogContent, DialogTitle, DialogDescription } from "../ui/dialog"; // Importe do seu componente de Dialog customizado
import { DialogHeader } from "../ui/dialog"; // Supondo que o Header do seu Dialog também seja customizado
import { TableBody, TableRow, TableCell } from "../ui/table";
import { ReactNode } from "react";

export interface MealDetailsProps {
  id: ReactNode;
  name: string;
  descrition: string;
  calories: number;
  type: string;
  createdAt: Date;
}

export function MealDetails(props: MealDetailsProps) {
  const formattedDate = new Date(props.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <DialogContent className="w-[90vw] md:w-[50vw] h-[50vh]">
      <DialogHeader>
        <DialogTitle>Refeição: {props.name}</DialogTitle>
        <DialogDescription>Detalhes da refeição registrada</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <TableBody>
            <TableRow>
              <TableCell className="text-muted-foreground">Descrição</TableCell>
              <TableCell className="text-right">
                {props.descrition || "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Calorias</TableCell>
              <TableCell className="text-right">
                {props.calories ?? "-"} kcal
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Tipo</TableCell>
              <TableCell className="text-right capitalize">
                {props.type}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">Data</TableCell>
              <TableCell className="text-right">{formattedDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-muted-foreground">ID</TableCell>
              <TableCell className="text-right">{props.id}</TableCell>
            </TableRow>
          </TableBody>
        </table>
      </div>
    </DialogContent>
  );
}
