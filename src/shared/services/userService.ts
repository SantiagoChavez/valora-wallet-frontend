// No existe endpoint real todavía (verificado contra el backend de Santiago) —
// esto simula la latencia de un request real para que el hook/UI se comporten
// igual el día que se reemplace por un apiFetch real. Solo hay que cambiar esta
// función, no el hook ni el componente que la consumen.
export function updatePhone(phone: string): Promise<{ phone: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ phone }), 400);
  });
}

// Mismo criterio que updatePhone: mock de latencia hasta que exista endpoint real.
export function updateAlias(alias: string): Promise<{ alias: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ alias }), 400);
  });
}
