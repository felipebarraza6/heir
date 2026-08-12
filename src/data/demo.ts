// Datos simulados para la demo visual — Semana del 10 al 14 de agosto de 2026

export const PROFESSIONAL = {
  name: 'Felipe Ulloa',
  role: 'Kinesiólogo',
  initials: 'FU',
  specialty: 'Kinesiología y rehabilitación',
  location: 'Providencia, Santiago',
};

export const formatCLP = (n: number) =>
  '$' + n.toLocaleString('es-CL');

export interface Procedure {
  id: string;
  name: string;
  duration: number; // minutos
  price: number;
}

export const PROCEDURES: Procedure[] = [
  { id: 'eval', name: 'Evaluación inicial', duration: 60, price: 25000 },
  { id: 'kine', name: 'Sesión de kinesiología', duration: 60, price: 35000 },
  { id: 'deportiva', name: 'Rehabilitación deportiva', duration: 60, price: 38000 },
  { id: 'respiratoria', name: 'Kinesiología respiratoria', duration: 60, price: 40000 },
  { id: 'neuro', name: 'Kinesiología neurológica', duration: 60, price: 45000 },
  { id: 'postqx', name: 'Rehabilitación post-quirúrgica', duration: 60, price: 42000 },
  { id: 'maso', name: 'Masoterapia', duration: 45, price: 30000 },
];

export type PayStatus = 'pagado' | 'pendiente' | 'por_cobrar';
export type ApptStatus = 'confirmada' | 'pendiente' | 'completada';

export interface Patient {
  id: string;
  name: string;
  initials: string;
  weeklySlot: string; // horario semanal fijo
  day: number; // 0=Lun ... 4=Vie
  time: string;
  procedureId: string;
  status: ApptStatus;
  payStatus: PayStatus;
  color: string; // tono del bloque en agenda
  since: string;
  sessions: number;
  bookedBy: 'agente' | 'profesional';
}

export const PATIENTS: Patient[] = [
  { id: 'p1', name: 'María José Paredes', initials: 'MP', weeklySlot: 'Lunes 09:00', day: 0, time: '09:00', procedureId: 'kine', status: 'completada', payStatus: 'pagado', color: 'terra', since: 'Mar 2026', sessions: 18, bookedBy: 'profesional' },
  { id: 'p2', name: 'Carlos Henríquez', initials: 'CH', weeklySlot: 'Lunes 18:00', day: 0, time: '18:00', procedureId: 'deportiva', status: 'confirmada', payStatus: 'pagado', color: 'sage', since: 'Ene 2026', sessions: 26, bookedBy: 'agente' },
  { id: 'p3', name: 'Antonia Silva', initials: 'AS', weeklySlot: 'Martes 10:00', day: 1, time: '10:00', procedureId: 'respiratoria', status: 'confirmada', payStatus: 'pendiente', color: 'sand', since: 'May 2026', sessions: 11, bookedBy: 'profesional' },
  { id: 'p4', name: 'José Miguel Rojas', initials: 'JR', weeklySlot: 'Martes 19:00', day: 1, time: '19:00', procedureId: 'kine', status: 'pendiente', payStatus: 'por_cobrar', color: 'terra', since: 'Jun 2026', sessions: 7, bookedBy: 'agente' },
  { id: 'p5', name: 'Fernanda Ortiz', initials: 'FO', weeklySlot: 'Miércoles 09:30', day: 2, time: '09:30', procedureId: 'maso', status: 'confirmada', payStatus: 'pagado', color: 'sage', since: 'Feb 2026', sessions: 22, bookedBy: 'profesional' },
  { id: 'p6', name: 'Ricardo Fuentes', initials: 'RF', weeklySlot: 'Miércoles 18:30', day: 2, time: '18:30', procedureId: 'deportiva', status: 'confirmada', payStatus: 'pagado', color: 'sand', since: 'Abr 2026', sessions: 14, bookedBy: 'agente' },
  { id: 'p7', name: 'Valentina Campos', initials: 'VC', weeklySlot: 'Jueves 11:00', day: 3, time: '11:00', procedureId: 'neuro', status: 'confirmada', payStatus: 'pendiente', color: 'terra', since: 'Jul 2026', sessions: 4, bookedBy: 'agente' },
  { id: 'p8', name: 'Diego Araya', initials: 'DA', weeklySlot: 'Jueves 19:30', day: 3, time: '19:30', procedureId: 'postqx', status: 'pendiente', payStatus: 'por_cobrar', color: 'sage', since: 'Jul 2026', sessions: 3, bookedBy: 'agente' },
  { id: 'p9', name: 'Camila Torres', initials: 'CT', weeklySlot: 'Viernes 08:30', day: 4, time: '08:30', procedureId: 'kine', status: 'confirmada', payStatus: 'pagado', color: 'sand', since: 'Ene 2026', sessions: 25, bookedBy: 'profesional' },
  { id: 'p10', name: 'Sebastián Núñez', initials: 'SN', weeklySlot: 'Viernes 17:30', day: 4, time: '17:30', procedureId: 'deportiva', status: 'pendiente', payStatus: 'pendiente', color: 'terra', since: 'Ago 2026', sessions: 1, bookedBy: 'agente' },
];

export const procedureOf = (id: string) => PROCEDURES.find((p) => p.id === id)!;

export const WEEK_DAYS = ['Lun 10', 'Mar 11', 'Mié 12', 'Jue 13', 'Vie 14'];
export const WEEK_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

export type PayMethod = 'online' | 'transferencia' | 'efectivo';

export interface Transaction {
  id: string;
  patientId: string;
  amount: number;
  method: PayMethod;
  date: string;
  concept: string;
  status: 'completado' | 'pendiente';
}

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', patientId: 'p6', amount: 38000, method: 'online', date: 'Hoy · 09:12', concept: 'Sesión Mié 12 ago', status: 'completado' },
  { id: 't2', patientId: 'p5', amount: 30000, method: 'transferencia', date: 'Hoy · 08:47', concept: 'Masoterapia Mié 12 ago', status: 'completado' },
  { id: 't3', patientId: 'p2', amount: 38000, method: 'online', date: 'Ayer · 18:02', concept: 'Rehabilitación Lun 10 ago', status: 'completado' },
  { id: 't4', patientId: 'p1', amount: 35000, method: 'efectivo', date: 'Ayer · 10:05', concept: 'Sesión Lun 10 ago', status: 'completado' },
  { id: 't5', patientId: 'p9', amount: 35000, method: 'online', date: 'Vie 07 ago', concept: 'Sesión Vie 07 ago', status: 'completado' },
  { id: 't6', patientId: 'p3', amount: 40000, method: 'online', date: 'Pendiente', concept: 'Sesión Mar 11 ago', status: 'pendiente' },
  { id: 't7', patientId: 'p7', amount: 45000, method: 'transferencia', date: 'Pendiente', concept: 'Sesión Jue 13 ago', status: 'pendiente' },
];

export interface Reminder {
  id: string;
  patientId: string;
  when: string;
  channel: 'WhatsApp' | 'Correo';
  status: 'enviado' | 'programado';
  message: string;
}

export const REMINDERS: Reminder[] = [
  { id: 'r1', patientId: 'p5', when: 'Hoy · 08:00', channel: 'WhatsApp', status: 'enviado', message: 'Hola Fernanda, te recuerdo tu sesión mañana miércoles a las 09:30. ¿Confirmas tu asistencia?' },
  { id: 'r2', patientId: 'p6', when: 'Hoy · 08:00', channel: 'WhatsApp', status: 'enviado', message: 'Hola Ricardo, te recuerdo tu sesión mañana miércoles a las 18:30. ¿Confirmas tu asistencia?' },
  { id: 'r3', patientId: 'p7', when: 'Mañana · 08:00', channel: 'WhatsApp', status: 'programado', message: 'Hola Valentina, te recuerdo tu sesión el jueves a las 11:00. ¿Confirmas tu asistencia?' },
  { id: 'r4', patientId: 'p8', when: 'Mañana · 08:00', channel: 'WhatsApp', status: 'programado', message: 'Hola Diego, te recuerdo tu sesión el jueves a las 19:30. ¿Confirmas tu asistencia?' },
  { id: 'r5', patientId: 'p9', when: 'Jue 13 · 08:00', channel: 'WhatsApp', status: 'programado', message: 'Hola Camila, te recuerdo tu sesión el viernes a las 08:30. ¿Confirmas tu asistencia?' },
  { id: 'r6', patientId: 'p10', when: 'Jue 13 · 08:00', channel: 'Correo', status: 'programado', message: 'Hola Sebastián, te recuerdo tu primera sesión el viernes a las 17:30.' },
];

export const AGENT_ACTIVITY = [
  { id: 'a1', text: 'agendó a Sebastián Núñez para el viernes 17:30', time: 'Hace 20 min', type: 'booking' as const },
  { id: 'a2', text: 'respondió una consulta por el valor de rehabilitación deportiva', time: 'Hace 1 h', type: 'question' as const },
  { id: 'a3', text: 'envió 2 recordatorios de confirmación por WhatsApp', time: 'Hoy 08:00', type: 'reminder' as const },
  { id: 'a4', text: 'registró el pago online de Ricardo Fuentes ($38.000)', time: 'Hoy 09:12', type: 'payment' as const },
  { id: 'a5', text: 'agendó a Diego Araya para el jueves 19:30', time: 'Ayer 21:44', type: 'booking' as const },
];

export const MONTHLY_INCOME = [
  { month: 'Mar', amount: 980000 },
  { month: 'Abr', amount: 1140000 },
  { month: 'May', amount: 1260000 },
  { month: 'Jun', amount: 1180000 },
  { month: 'Jul', amount: 1390000 },
  { month: 'Ago', amount: 745000 },
];

// Guión del chat del agente (landing)
export interface ChatStep {
  from: 'user' | 'agent';
  text?: string;
  chips?: string[];
  pickedChip?: string;
  chipsType?: 'slots' | 'confirm';
  typedText?: string; // texto que se "escribe" en el input
}

export const CHAT_SCRIPT: ChatStep[] = [
  { from: 'user', text: 'Hola, quisiera agendar una sesión de kinesiología' },
  {
    from: 'agent',
    text: '¡Hola! Soy el asistente de Felipe Ulloa. Con gusto te agendo. Estos son los horarios disponibles esta semana:',
    chips: ['Mié 12 · 15:00', 'Jue 13 · 11:00', 'Vie 14 · 17:30'],
    chipsType: 'slots',
    pickedChip: 'Jue 13 · 11:00',
  },
  { from: 'user', text: 'El jueves a las 11:00 me queda perfecto' },
  {
    from: 'agent',
    text: 'Listo. Agendé tu sesión para el jueves 13 de agosto a las 11:00 hrs. El valor es $35.000 y puedes pagar online desde aquí. Te enviaré un recordatorio por WhatsApp 24 horas antes para que confirmes.',
  },
  { from: 'user', text: '¿Y cuánto cuesta la rehabilitación deportiva?' },
  {
    from: 'agent',
    text: 'La sesión de rehabilitación deportiva tiene un valor de $38.000 e incluye evaluación de progreso sin costo. ¿Quieres que te reserve una hora?',
  },
];
