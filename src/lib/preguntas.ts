export type TipoPregunta = "text" | "textarea" | "select" | "checkbox";

export interface Pregunta {
  key: string;
  label: string;
  tipo: TipoPregunta;
  opciones?: string[];
  requerida: boolean;
  placeholder?: string;
  condicional?: { dependsOn: string; showWhen: string };
}

export const SECCIONES: { titulo: string; preguntas: Pregunta[] }[] = [
  {
    titulo: "Confirmación de requisitos",
    preguntas: [
      { key: "confirmaMicrofono", label: "Confirmo que dispongo de un micrófono funcional.", tipo: "checkbox", requerida: true },
      { key: "confirmaNoStaffOtroServidor", label: "Confirmo que actualmente no pertenezco al Staff de otro servidor.", tipo: "checkbox", requerida: true },
      { key: "confirmaDisponibilidad", label: "Confirmo que tengo disponibilidad y compromiso real para colaborar con el servidor.", tipo: "checkbox", requerida: true },
    ],
  },
  {
    titulo: "Perfil y disponibilidad",
    preguntas: [
      { key: "zonaHoraria", label: "Zona horaria / país", tipo: "text", requerida: true, placeholder: "Ej: Chile (GMT-4)" },
      { key: "tiempoEnServidor", label: "¿Desde cuándo formas parte de PlanetMC?", tipo: "text", requerida: true, placeholder: "Ej: hace 8 meses" },
      { key: "experienciaPrevia", label: "¿Has sido staff en otros servidores de Minecraft?", tipo: "select", opciones: ["Sí", "No"], requerida: true },
      { key: "detalleExperiencia", label: "¿En qué servidores y qué roles?", tipo: "textarea", requerida: false, condicional: { dependsOn: "experienciaPrevia", showWhen: "Sí" } },
      { key: "disponibilidadSemanal", label: "Disponibilidad semanal (horas aproximadas)", tipo: "text", requerida: true, placeholder: "Ej: 15 horas semanales" },
      { key: "horarioHabitual", label: "¿En qué horario y días sueles conectarte?", tipo: "text", requerida: true, placeholder: "Ej: Tardes/noches, de lunes a viernes" },
      { key: "sancionesPrevias", label: "¿Tienes o has tenido alguna sanción en el servidor (mute/warn/ban)?", tipo: "select", opciones: ["Sí", "No"], requerida: true },
      { key: "detalleSanciones", label: "Cuéntanos qué pasó y qué aprendiste de eso", tipo: "textarea", requerida: false, condicional: { dependsOn: "sancionesPrevias", showWhen: "Sí" } },
    ],
  },
  {
    titulo: "Criterio y resolución de situaciones",
    preguntas: [
      { key: "comandosBasicos", label: "Enumera 5 comandos básicos de Staff (excluyendo comandos para sancionar como Mute/Warn/Ban)", tipo: "textarea", requerida: true },
      { key: "escenarioReglas", label: "Si ves a un jugador rompiendo las reglas, ¿cómo actuarías?", tipo: "textarea", requerida: true },
      { key: "escenarioStaffInjusto", label: "Si otro staff actúa injustamente con un jugador, ¿qué harías?", tipo: "textarea", requerida: true },
      { key: "escenarioInsulto", label: "Un jugador te insulta durante el juego, ¿cómo respondes?", tipo: "textarea", requerida: true },
      { key: "escenarioHacks", label: "Notas que un jugador parece estar usando hacks, ¿qué pasos tomarías antes de sancionarlo?", tipo: "textarea", requerida: true },
      { key: "escenarioReporteIncierto", label: "Un jugador reporta a otro por mal comportamiento, pero tú no estás seguro si es cierto. ¿Qué harías?", tipo: "textarea", requerida: true },
      { key: "escenarioConflictoStaff", label: "Si ocurre un conflicto entre dos miembros del staff, ¿cómo lo resolverías?", tipo: "textarea", requerida: true },
      { key: "escenarioEventoCaos", label: "Se produce un evento importante y hay muchos jugadores, pero algunos intentan aprovecharse del caos. ¿Cómo mantienes el orden?", tipo: "textarea", requerida: true },
      { key: "escenarioBug", label: "Si descubres un bug o exploit grave que te da ventaja injusta, ¿qué harías?", tipo: "textarea", requerida: true },
      { key: "imparcialidad", label: "Si fueras staff, ¿serías imparcial? ¿Cómo garantizarías la imparcialidad?", tipo: "textarea", requerida: true },
      { key: "strike", label: "Si recibieras un Strike, ¿cómo lo tomarías y qué harías al respecto?", tipo: "textarea", requerida: true },
      { key: "importanciaStaff", label: "¿Cuál consideras que es la importancia de un Staff en el servidor? ¿Por qué?", tipo: "textarea", requerida: true },
    ],
  },
  {
    titulo: "Conocimientos técnicos",
    preguntas: [
      { key: "queEsSS", label: "¿Sabes qué es SS (Screen Share) y cuándo debe realizarse?", tipo: "textarea", requerida: true },
      { key: "nivelSS", label: "¿Cuál consideras que es tu nivel de habilidad en SS, en una escala del 1 al 10?", tipo: "select", opciones: ["1","2","3","4","5","6","7","8","9","10"], requerida: true },
      { key: "diferenciaSanciones", label: "¿Cuál es la diferencia entre Mute, Warn y Ban? ¿Cuándo aplicarías cada uno?", tipo: "textarea", requerida: true },
      { key: "clientsConocidos", label: "Nombra algunos hacked/ghost clients que conozcas", tipo: "textarea", requerida: true },
    ],
  },
  {
    titulo: "Motivación",
    preguntas: [
      { key: "motivacion", label: "¿Por qué quieres ser staff en PlanetMC?", tipo: "textarea", requerida: true },
      { key: "cualidades", label: "¿Qué cualidades te hacen un buen candidato?", tipo: "textarea", requerida: true },
      { key: "compromisoTiempo", label: "Si eres aceptado, ¿por cuánto tiempo planeas mantenerte activo como staff?", tipo: "text", requerida: true, placeholder: "Ej: Al menos 6 meses" },
      { key: "comoTeEnteraste", label: "¿Cómo te enteraste de esta postulación? (opcional)", tipo: "text", requerida: false },
    ],
  },
];

export const TODAS_LAS_PREGUNTAS: Pregunta[] = SECCIONES.flatMap((s) => s.preguntas);

export const REQUISITOS = [
  "Tener micrófono funcional.",
  "Tener más de 17 años.",
  "No pertenecer al Staff de otro servidor.",
  "Tener disponibilidad y compromiso para colaborar con el servidor.",
];
