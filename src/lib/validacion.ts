import { z } from "zod";
import { TODAS_LAS_PREGUNTAS } from "./preguntas";

const shapeRespuestas = Object.fromEntries(
  TODAS_LAS_PREGUNTAS.map((p) => {
    let schema: z.ZodTypeAny;

    if (p.tipo === "checkbox") {
      schema = p.requerida
        ? z.boolean().refine((v) => v === true, { message: "Debes confirmar este requisito." })
        : z.boolean().optional();
    } else {
      schema = p.requerida
        ? z.string().trim().min(1, "Esta pregunta es obligatoria.")
        : z.string().trim().optional().default("");
    }

    return [p.key, schema];
  })
);

const RespuestasSchema = z.object(shapeRespuestas).superRefine((data, ctx) => {
  for (const p of TODAS_LAS_PREGUNTAS) {
    if (!p.condicional) continue;
    const valorTrigger = (data as Record<string, unknown>)[p.condicional.dependsOn];
    const debeSerVisible = valorTrigger === p.condicional.showWhen;
    const valor = (data as Record<string, unknown>)[p.key];

    if (debeSerVisible && (!valor || (typeof valor === "string" && valor.trim() === ""))) {
      ctx.addIssue({
        code: "custom",
        path: [p.key],
        message: "Esta pregunta es obligatoria.",
      });
    }
  }
});

export const PostulacionSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo electrónico inválido."),
  minecraftUsuario: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9_]{3,16}$/, "Usuario de Minecraft inválido (3-16 caracteres, letras/números/guión bajo)."),
  discordUsuario: z
    .string()
    .trim()
    .regex(/^@[a-zA-Z0-9._]{2,32}$/, "Debe tener el formato @usuario."),
  edad: z.coerce
    .number({ message: "La edad es obligatoria." })
    .int()
    .min(18, "Debes tener más de 17 años para postular."),
  respuestas: RespuestasSchema,
});

export type PostulacionInput = z.infer<typeof PostulacionSchema>;

export const EstadoValues = ["REVISAR", "APROBADO", "RECHAZADO"] as const;
export const CambiarEstadoSchema = z.object({
  id: z.string().min(1),
  estado: z.enum(EstadoValues),
});
