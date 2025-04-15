"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { toast } from "sonner"; // Importe o toast aqui

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  calories: z.number().min(0),
  type: z.string().min(1),
  createdAt: z.date(), // Usando z.date()
  time: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Meal {
  _id: string;
  name: string;
  description: string;
  calories: number;
  type: string;
  createdAt: string;
  time?: string;
}

interface EditMealModalProps {
  meal: Meal;
  onClose: () => void;
  onUpdate: (meal: Meal) => void;
}

export function EditMealModal({ meal, onClose, onUpdate }: EditMealModalProps) {
  const initialDate = meal.createdAt ? new Date(meal.createdAt) : new Date();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      type: meal.type,
      createdAt: initialDate, // Usando objeto Date diretamente
      time: meal.time || meal.createdAt?.split("T")[1]?.slice(0, 5) || "00:00",
    },
  });

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("createdAt", date);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const createdAtISO = data.createdAt.toISOString(); // Convertendo para ISO no envio
      const res = await fetch(`/api/meals/${meal._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          createdAt: createdAtISO,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        console.log("Refeição atualizada no frontend:", updated);
        onUpdate(updated);
        onClose();
        toast.success("Refeição atualizada com sucesso!"); // Toast de sucesso aqui
      } else {
        console.error("Erro ao atualizar refeição:", res.status);
        toast.error("Erro ao atualizar a refeição."); // Toast de erro opcional
      }
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error);
      toast.error("Erro ao atualizar a refeição."); // Toast de erro opcional
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Refeição</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Nome" />
          {errors.name && (
            <span className="text-xs text-red-500">Nome obrigatório</span>
          )}
          <Textarea {...register("description")} placeholder="Descrição" />
          <Input
            type="number"
            {...register("calories", { valueAsNumber: true })}
            placeholder="Calorias"
          />
          {errors.calories && (
            <span className="text-xs text-red-500">
              Insira um número válido
            </span>
          )}
          <Input {...register("type")} placeholder="Tipo (Ex: Almoço, Janta)" />
          {errors.type && (
            <span className="text-xs text-red-500">Tipo obrigatório</span>
          )}

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {watch("createdAt")?.toLocaleDateString("pt-BR") ||
                    "Escolher data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("createdAt")}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.createdAt && (
              <span className="text-xs text-red-500">Data obrigatória</span>
            )}
          </div>

          <Input
            type="time"
            {...register("time")}
            placeholder="Hora"
            className="py-2 px-3 border border-#1b1b1d rounded-md"
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
