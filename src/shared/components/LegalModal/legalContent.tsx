import type { PropsWithChildren } from "react";
import styles from "./LegalModal.module.css";

const LAST_UPDATED = "4 de agosto de 2026";

function Meta() {
  return <p className={styles.meta}>Última actualización: {LAST_UPDATED}</p>;
}

function Section({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </section>
  );
}

function P({ children }: PropsWithChildren) {
  return <p className={styles.paragraph}>{children}</p>;
}

function List({ items }: { items: string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TermsContent() {
  return (
    <>
      <Meta />

      <Section title="1. Aceptación de los términos">
        <P>
          Al acceder o usar Valora Wallet ("la Aplicación"), aceptás estos Términos y Condiciones en su
          totalidad. Si no estás de acuerdo, no debés utilizar la Aplicación.
        </P>
      </Section>

      <Section title="2. Naturaleza del proyecto">
        <P>
          Valora Wallet es un <strong>proyecto académico</strong> desarrollado como Proyecto Final de la
          carrera Full Stack del bootcamp Henry, por el equipo Nexo Tech Solutions.{" "}
          <strong>No es un producto financiero real.</strong> Todos los balances, transacciones, tasas de
          cambio y movimientos de dinero mostrados en la Aplicación son <strong>simulados</strong> con fines
          demostrativos y educativos. No se procesa, transfiere ni custodia dinero real bajo ninguna
          circunstancia.
        </P>
      </Section>

      <Section title="3. Elegibilidad">
        <P>
          Debés ser mayor de 18 años para acceder o utilizar la Aplicación. La Aplicación está destinada a
          fines de demostración. Cualquier persona que acceda a ella lo hace bajo su propia responsabilidad
          y con pleno conocimiento de su carácter no comercial.
        </P>
      </Section>

      <Section title="4. Cuenta de usuario">
        <List
          items={[
            "Sos responsable de mantener la confidencialidad de tus credenciales de acceso.",
            "No debés utilizar datos financieros, personales o de identificación reales al registrarte o interactuar con la Aplicación.",
            "Nos reservamos el derecho de suspender o eliminar cuentas que hagan un uso indebido de la Aplicación.",
          ]}
        />
      </Section>

      <Section title="5. Uso permitido">
        <P>Te comprometés a no utilizar la Aplicación para:</P>
        <List
          items={[
            "Ingresar información real de tarjetas, cuentas bancarias o datos financieros propios o de terceros.",
            "Intentar vulnerar la seguridad del sistema o acceder a datos de otros usuarios.",
            "Cualquier fin que no sea la evaluación o exploración del proyecto.",
          ]}
        />
      </Section>

      <Section title="6. Chatbot con inteligencia artificial">
        <P>
          La Aplicación incluye un asistente financiero impulsado por una API de inteligencia artificial de
          terceros (Google Gemini). Las respuestas del asistente son generadas automáticamente y{" "}
          <strong>no constituyen asesoramiento financiero real</strong>. No debés compartir información
          personal o financiera sensible en las conversaciones con el chatbot.
        </P>
      </Section>

      <Section title="7. Propiedad intelectual">
        <P>
          El código, diseño y contenidos de Valora Wallet fueron desarrollados por el equipo Nexo Tech
          Solutions en el marco de un proyecto educativo. Su uso, reproducción o distribución fuera de ese
          contexto requiere autorización previa del equipo.
        </P>
      </Section>

      <Section title="8. Limitación de responsabilidad">
        <P>
          La Aplicación se ofrece "tal cual", sin garantías de ningún tipo, dado su carácter de proyecto
          académico en desarrollo. El equipo no se responsabiliza por errores, interrupciones del servicio,
          pérdida de datos simulados o cualquier inconveniente derivado del uso de la Aplicación.
        </P>
      </Section>

      <Section title="9. Modificaciones">
        <P>
          Estos Términos pueden actualizarse en cualquier momento mientras el proyecto esté en desarrollo.
          Los cambios se reflejarán en la fecha de última actualización de este documento.
        </P>
      </Section>

      <Section title="10. Ley aplicable">
        <P>
          Estos Términos se rigen por las leyes de la República Argentina, sin perjuicio del carácter
          académico y no comercial del proyecto.
        </P>
      </Section>

      <Section title="11. Contacto">
        <P>
          Para consultas sobre estos Términos, escribinos a: <code>nexot.solutions@gmail.com</code>
        </P>
      </Section>
    </>
  );
}

export function PrivacyContent() {
  return (
    <>
      <Meta />

      <Section title="1. Introducción">
        <P>
          Esta Política de Privacidad describe cómo Valora Wallet ("la Aplicación"), desarrollada por el
          equipo Nexo Tech Solutions como Proyecto Final del bootcamp Henry, trata la información que
          ingresás al usarla. Recordá que se trata de un <strong>proyecto académico</strong>: no manejamos
          dinero real ni operamos como entidad financiera.
        </P>
      </Section>

      <Section title="2. Qué información recopilamos">
        <List
          items={[
            "Datos de registro: nombre, email y contraseña (encriptada) que ingreses al crear una cuenta.",
            "Datos de uso simulado: balances ficticios, transacciones simuladas (compra, venta, intercambio) que generás dentro de la Aplicación.",
            "Conversaciones con el chatbot: los mensajes que le enviás al asistente financiero con IA.",
          ]}
        />
        <P>
          No solicitamos ni debés ingresar datos financieros reales (tarjetas, cuentas bancarias, CBU/CVU
          reales, etc.).
        </P>
      </Section>

      <Section title="3. Para qué usamos esta información">
        <List
          items={[
            "Permitir el funcionamiento básico de la Aplicación (login, balances, historial).",
            "Enviar confirmaciones automáticas por email de las transacciones simuladas que realices, a través de Amazon SES.",
            "Procesar tus consultas al chatbot financiero.",
            "Fines de evaluación académica del proyecto.",
          ]}
        />
        <P>
          No usamos tus datos con fines comerciales, publicitarios, ni los vendemos ni compartimos con
          terceros más allá de lo estrictamente necesario para el funcionamiento técnico descrito abajo.
        </P>
      </Section>

      <Section title="4. Servicios de terceros involucrados">
        <List
          items={[
            "Amazon Web Services (AWS SES): para el envío de emails de confirmación de transacciones.",
            "Google Gemini API: para el funcionamiento del chatbot financiero. Los mensajes que le escribas al asistente se envían a esta API para generar una respuesta.",
            "Railway y Vercel: infraestructura de hosting del backend y frontend respectivamente.",
          ]}
        />
        <P>
          Estos proveedores procesan datos según sus propias políticas de privacidad; te recomendamos no
          ingresar información sensible real en ningún punto de la Aplicación.
        </P>
      </Section>

      <Section title="5. Almacenamiento y seguridad">
        <List
          items={[
            "Las contraseñas se almacenan encriptadas (bcrypt), nunca en texto plano.",
            "Los datos se guardan en una base de datos PostgreSQL alojada en Railway.",
            "Al ser un proyecto en desarrollo con fines educativos, no garantizamos los mismos estándares de seguridad que una aplicación financiera en producción.",
          ]}
        />
      </Section>

      <Section title="6. Tus derechos">
        <P>Podés solicitar en cualquier momento:</P>
        <List
          items={[
            "Acceso a los datos que tenemos registrados sobre tu cuenta.",
            "La corrección o eliminación de tu cuenta y sus datos asociados.",
          ]}
        />
        <P>
          Para ejercer estos derechos, escribinos a: <code>nexot.solutions@gmail.com</code>
        </P>
      </Section>

      <Section title="7. Cookies y almacenamiento local">
        <P>
          La Aplicación puede utilizar almacenamiento local del navegador (por ejemplo, para mantener tu
          sesión iniciada) exclusivamente con fines funcionales, no de rastreo ni publicidad.
        </P>
      </Section>

      <Section title="8. Edad mínima">
        <P>
          La Aplicación es exclusivamente para mayores de 18 años. No recopilamos intencionalmente datos de
          menores de edad; si detectamos una cuenta perteneciente a un menor, será eliminada.
        </P>
      </Section>

      <Section title="9. Cambios en esta política">
        <P>
          Podemos actualizar esta Política de Privacidad mientras el proyecto esté en desarrollo. Los
          cambios se reflejarán en la fecha de última actualización de este documento.
        </P>
      </Section>

      <Section title="10. Contacto">
        <P>
          Ante cualquier duda sobre esta Política de Privacidad, escribinos a:{" "}
          <code>nexot.solutions@gmail.com</code>
        </P>
      </Section>
    </>
  );
}
