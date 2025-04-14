"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FormValues = {
  name: string;
  description: string;
  calories: number;
  type: "café" | "almoço" | "jantar" | "lanche";
  createdAt: Date;
  hour?: string;
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200),
  calories: z
    .number({
      required_error: "Informe as calorias",
      invalid_type_error: "O valor precisa ser um número",
    })
    .min(0, { message: "O mínimo é 0 calorias" })
    .max(10000, { message: "O máximo é 10000 calorias" }),
  type: z.enum(["café", "almoço", "lanche", "jantar"]),
  createdAt: z.date({
    required_error: "A data é obrigatória",
  }),
});

export function MealForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      calories: 0,
      type: "café",
      createdAt: new Date(),
    },
  });

  const [selectedTime] = useState(
    form.watch("createdAt")?.toLocaleTimeString() || "00:00"
  );

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    const newDate = new Date(date);
    const [hours, minutes] = selectedTime.split(":");
    newDate.setHours(Number(hours), Number(minutes));
    form.setValue("createdAt", newDate);
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Erro ao salvar:", error);
        return;
      }

      const data = await response.json();
      console.log("Refeição criada com sucesso:", data);
      toast.success("Refeição salva com sucesso!");
      form.reset();
    } catch (err) {
      console.error("Erro ao enviar dados:", err);
      toast.error("Erro ao enviar dados");
    }
  };

  return (
    <Card className="bg-transparent w-[98%] md:w-[450px]">
      <CardHeader>
        <CardTitle>Nova Refeição</CardTitle>
        <CardDescription>
          Cadastre uma refeição com os dados abaixo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de refeição" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="café">Café da manhã</SelectItem>
                        <SelectItem value="almoço">Almoço</SelectItem>
                        <SelectItem value="lanche">Lanche</SelectItem>
                        <SelectItem value="jantar">Jantar</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="createdAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? field.value.toLocaleString()
                            : "Escolher data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <label
                                htmlFor="calendar"
                                className="block text-sm font-medium p-4"
                              >
                                Data
                              </label>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={handleDateChange}
                                initialFocus
                              />
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="outline" className="w-full" type="submit">
              Salvar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
