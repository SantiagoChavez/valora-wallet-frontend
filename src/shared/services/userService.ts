// No existe endpoint real todavía (verificado contra el backend de Santiago) —
// esto simula la latencia de un request real para que el hook/UI se comporten
// igual el día que se reemplace por un apiFetch real. Solo hay que cambiar esta
// función, no el hook ni el componente que la consumen.
export function updatePhone(phone: string): Promise<{ phone: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ phone }), 400);
  });
}

// Mismo criterio que updatePhone: sin endpoint real, mock de latencia. Hace
// falta de verdad — cuentas creadas antes de que "du" existiera en el backend
// (o cualquier cuenta a la que ese dato le haya quedado null) no tienen forma
// de cargarlo hoy, ni self-service ni por otro lado.
export function updateDu(du: string): Promise<{ du: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ du }), 400);
  });
}
