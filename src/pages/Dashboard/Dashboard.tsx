import { useEffect, useRef, useState } from "react";
import { CardDisplay } from "../../shared/components/CardDisplay/CardDisplay";
import { Toast } from "../../shared/components/Toast/Toast";
import { useToast } from "../../shared/components/Toast/useToast";
import styles from "./Dashboard.module.css";

type CurrencyCode = "USD" | "EUR" | "ARS";
type TxTone = "pos" | "neg" | "gold";

interface BalanceEntry {
  code: CurrencyCode;
  prefix: string;
  label: string;
  flagChar: string;
  value: number;
}

interface TransactionEntry {
  id: string;
  title: string;
  date: string;
  amount: string;
  currency: string;
  glyph: string;
  tone: TxTone;
}

interface NavEntry {
  id: string;
  label: string;
  icon: string;
}

const RATES: Record<CurrencyCode, number> = { USD: 1, EUR: 0.92, ARS: 1350 };
const CURRENCY_OPTIONS: CurrencyCode[] = ["USD", "EUR", "ARS"];

const BALANCES: BalanceEntry[] = [
  { code: "USD", prefix: "USD", label: "Dólares", flagChar: "US", value: 8200 },
  { code: "EUR", prefix: "EUR", label: "Euros", flagChar: "EU", value: 3540 },
  { code: "ARS", prefix: "ARS", label: "Pesos AR", flagChar: "AR", value: 710400 },
];

// Antes era un número hardcodeado aparte que no coincidía con la suma real de
// BALANCES — ahora se deriva de ahí, así no se pueden desincronizar.
const TOTAL_USD = BALANCES.reduce((sum, bal) => sum + bal.value / RATES[bal.code], 0);

const TRANSACTIONS: TransactionEntry[] = [
  { id: "1", title: "Venta de EUR", date: "12 Oct", amount: "+$150.00", currency: "EUR", glyph: "arrow_downward", tone: "pos" },
  { id: "2", title: "Compra de USD", date: "11 Oct", amount: "-$200.00", currency: "USD", glyph: "arrow_upward", tone: "neg" },
  { id: "3", title: "Intercambio ARS → USD", date: "9 Oct", amount: "$85.000", currency: "ARS", glyph: "sync_alt", tone: "gold" },
  { id: "4", title: "Depósito recibido", date: "7 Oct", amount: "+$500.00", currency: "USD", glyph: "arrow_downward", tone: "pos" },
  { id: "5", title: "Retiro a cuenta bancaria", date: "5 Oct", amount: "-$300.00", currency: "USD", glyph: "arrow_upward", tone: "neg" },
];

const NAV_ITEMS: NavEntry[] = [
  { id: "home", label: "Inicio", icon: "account_balance_wallet" },
  { id: "cards", label: "Tarjetas", icon: "credit_card" },
  { id: "swap", label: "Intercambio", icon: "swap_horiz" },
  { id: "activity", label: "Actividad", icon: "receipt_long" },
];

const toneClass: Record<TxTone, string> = {
  pos: styles.tonePos,
  neg: styles.toneNeg,
  gold: styles.toneGold,
};

export function Dashboard() {
  const [totalHidden, setTotalHidden] = useState(true);
  const [totalCurrency, setTotalCurrency] = useState<CurrencyCode>("USD");
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [hidden, setHidden] = useState<Record<CurrencyCode, boolean>>({ USD: true, EUR: true, ARS: true });
  const [activeNav, setActiveNav] = useState("home");
  const { message: toast, showToast } = useToast();
  const currencyMenuAnchorRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú de moneda con click/tap afuera o Escape — mismo patrón que los
  // popovers de DashboardLayout (pointerdown para cubrir mouse, touch y pen).
  useEffect(() => {
    if (!currencyMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (currencyMenuAnchorRef.current && !currencyMenuAnchorRef.current.contains(event.target as Node)) {
        setCurrencyMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setCurrencyMenuOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currencyMenuOpen]);

  function toggleBalanceHidden(code: CurrencyCode) {
    setHidden((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  const totalConverted = Math.round(TOTAL_USD * RATES[totalCurrency]);
  const totalDisplayValue = totalHidden
    ? "••••••"
    : `${totalCurrency} ${totalConverted.toLocaleString("es-AR")}`;

  return (
    <div className={styles.page}>
      <section className={styles.balanceSection}>
        <div className={styles.balanceCard}>
          <div className={styles.balanceCardTop}>
            <div>
              <div className={styles.label}>Balance total</div>
              <div className={styles.totalRow}>
                <span className={styles.totalValue}>{totalDisplayValue}</span>
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setTotalHidden((v) => !v)}
                  aria-label={totalHidden ? "Mostrar balance" : "Ocultar balance"}
                >
                  <span
                    className={`msym ${styles.eyeIcon} ${totalHidden ? "" : styles.eyeIconActive}`}
                    aria-hidden="true"
                  >
                    {totalHidden ? "visibility_off" : "visibility"}
                  </span>
                </button>
                <div className={styles.currencyMenuAnchor} ref={currencyMenuAnchorRef}>
                  <button
                    type="button"
                    className={styles.currencySelect}
                    onClick={() => setCurrencyMenuOpen((v) => !v)}
                  >
                    {totalCurrency}
                    <span className="msym" style={{ fontSize: 16 }} aria-hidden="true">expand_more</span>
                  </button>
                  {currencyMenuOpen && (
                    <div className={styles.currencyMenu}>
                      {CURRENCY_OPTIONS.map((code) => (
                        <button
                          key={code}
                          type="button"
                          className={`${styles.currencyMenuItem} ${code === totalCurrency ? styles.currencyMenuItemActive : ""}`}
                          onClick={() => {
                            setTotalCurrency(code);
                            setCurrencyMenuOpen(false);
                          }}
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.currencyGrid}>
            {BALANCES.map((bal) => {
              const isHidden = hidden[bal.code];
              return (
                <div key={bal.code} className={styles.currencyCard}>
                  <div className={styles.currencyCardTop}>
                    <div className={styles.currencyCardLabel}>
                      <div className={styles.flagBadge}>{bal.flagChar}</div>
                      <span className={styles.currencyLabelText}>{bal.label}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => toggleBalanceHidden(bal.code)}
                      aria-label={isHidden ? "Mostrar saldo" : "Ocultar saldo"}
                    >
                      <span
                        className={`msym ${styles.eyeIconSmall} ${isHidden ? "" : styles.eyeIconActive}`}
                        aria-hidden="true"
                      >
                        {isHidden ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                  <span className={styles.currencyCardValue}>
                    {isHidden ? "••••••" : `${bal.prefix} ${bal.value.toLocaleString("es-AR")}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.buySellRow}>
            <button type="button" className={styles.buyButton} onClick={() => showToast("Compra iniciada — elegí la moneda a comprar.")}>
              <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">add</span>
              Comprar
            </button>
            <button type="button" className={styles.sellButton} onClick={() => showToast("Venta iniciada — elegí la moneda a vender.")}>
              <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">remove</span>
              Vender
            </button>
          </div>
        </div>

        <div className={styles.aiPromo}>
          <div className={styles.aiPromoText}>
            <div className={styles.aiPromoHeading}>
              <span className="msym" style={{ fontSize: 22, color: "var(--accent)" }} aria-hidden="true">auto_awesome</span>
              <span className={styles.aiPromoTitle}>Asistente Valora AI</span>
            </div>
            <p className={styles.aiPromoBody}>
              Optimizá tus finanzas con IA. Analizamos tus patrones de gasto para ofrecerte mejores rendimientos.
            </p>
          </div>
          <button type="button" className={styles.aiButton}>Consultar ahora</button>
        </div>
      </section>

      <aside className={styles.aside}>
        <div className={styles.txCard}>
          <div className={styles.txCardHeader}>
            <span className={styles.label}>Últimas transacciones</span>
            {/* TODO: cambiar a <Link to="/historial"> cuando el historial se conecte al routing */}
            <button type="button" className={styles.txLink}>Ver todas</button>
          </div>
          <div className={styles.txList}>
            {TRANSACTIONS.map((tx) => (
              <div key={tx.id} className={styles.txRow}>
                <div className={styles.txRowLeft}>
                  <div className={`${styles.txIconWrap} ${toneClass[tx.tone]}`}>
                    <span className={`msym ${styles.txIcon}`} aria-hidden="true">{tx.glyph}</span>
                  </div>
                  <div className={styles.txTextGroup}>
                    <span className={styles.txTitle}>{tx.title}</span>
                    <span className={styles.txDate}>{tx.date}</span>
                  </div>
                </div>
                <div className={styles.txRight}>
                  <div className={`${styles.txAmount} ${toneClass[tx.tone]}`}>{tx.amount}</div>
                  <div className={styles.txCurrency}>{tx.currency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vista de tarjeta física: no estaba en el checklist original, se sumó al traer el mock del diseño Geist */}
        <CardDisplay />
      </aside>

      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeNav;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className={`msym ${styles.navIcon}`} aria-hidden="true">{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <Toast message={toast} />
    </div>
  );
}
