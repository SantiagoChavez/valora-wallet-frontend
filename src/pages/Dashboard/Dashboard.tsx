import { useEffect, useRef, useState } from "react";
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
  label: string;
  icon: string;
}

const TOTAL_USD = 12451;
const RATES: Record<CurrencyCode, number> = { USD: 1, EUR: 0.92, ARS: 1350 };
const CURRENCY_OPTIONS: CurrencyCode[] = ["USD", "EUR", "ARS"];

const BALANCES: BalanceEntry[] = [
  { code: "USD", prefix: "USD", label: "Dólares", flagChar: "US", value: 8200 },
  { code: "EUR", prefix: "EUR", label: "Euros", flagChar: "EU", value: 3540 },
  { code: "ARS", prefix: "ARS", label: "Pesos AR", flagChar: "AR", value: 710400 },
];

const TRANSACTIONS: TransactionEntry[] = [
  { id: "1", title: "Venta de EUR", date: "12 Oct", amount: "+$150.00", currency: "EUR", glyph: "arrow_downward", tone: "pos" },
  { id: "2", title: "Compra de USD", date: "11 Oct", amount: "-$200.00", currency: "USD", glyph: "arrow_upward", tone: "neg" },
  { id: "3", title: "Intercambio ARS → USD", date: "9 Oct", amount: "$85.000", currency: "ARS", glyph: "sync_alt", tone: "gold" },
  { id: "4", title: "Depósito recibido", date: "7 Oct", amount: "+$500.00", currency: "USD", glyph: "arrow_downward", tone: "pos" },
  { id: "5", title: "Retiro a cuenta bancaria", date: "5 Oct", amount: "-$300.00", currency: "USD", glyph: "arrow_upward", tone: "neg" },
];

const NAV_ITEMS: NavEntry[] = [
  { label: "Home", icon: "account_balance_wallet" },
  { label: "Cards", icon: "credit_card" },
  { label: "Swap", icon: "swap_horiz" },
  { label: "Activity", icon: "receipt_long" },
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
  const [activeNav, setActiveNav] = useState("Home");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(message: string) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

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
                  <span className={`msym ${styles.eyeIcon} ${totalHidden ? "" : styles.eyeIconActive}`}>
                    {totalHidden ? "visibility_off" : "visibility"}
                  </span>
                </button>
                <div className={styles.currencyMenuAnchor}>
                  <button
                    type="button"
                    className={styles.currencySelect}
                    onClick={() => setCurrencyMenuOpen((v) => !v)}
                  >
                    {totalCurrency}
                    <span className="msym" style={{ fontSize: 16 }}>expand_more</span>
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
            <div className={styles.trendChip}>
              <span className={styles.trendDot} />
              <span className={styles.trendLabel}>+2.4%</span>
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
                      <span className={`msym ${styles.eyeIconSmall} ${isHidden ? "" : styles.eyeIconActive}`}>
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
              <span className="msym" style={{ fontSize: 18 }}>add</span>
              Comprar
            </button>
            <button type="button" className={styles.sellButton} onClick={() => showToast("Venta iniciada — elegí la moneda a vender.")}>
              <span className="msym" style={{ fontSize: 18 }}>remove</span>
              Vender
            </button>
          </div>
        </div>

        <div className={styles.aiPromo}>
          <div className={styles.aiPromoText}>
            <div className={styles.aiPromoHeading}>
              <span className="msym" style={{ fontSize: 22, color: "var(--accent)" }}>auto_awesome</span>
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
                    <span className={`msym ${styles.txIcon}`}>{tx.glyph}</span>
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
        <div className={styles.cardView}>
          <div className={styles.cardGlow} />
          <div className={styles.cardTop}>
            <span className="msym" style={{ fontSize: 22, color: "var(--accent)" }}>contactless</span>
            <span className={styles.cardBrand}>VALORA PLATINUM</span>
          </div>
          <div className={styles.cardBottom}>
            <div className={styles.cardNumber}>•••• •••• •••• 8829</div>
            <div className={styles.cardHolderRow}>
              <span className={styles.cardHolder}>USUARIO VALORA</span>
              <div className={styles.cardNetwork}>
                <div className={styles.networkDotRed} />
                <div className={styles.networkDotGold} />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === activeNav;
          return (
            <button
              key={item.label}
              type="button"
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              onClick={() => setActiveNav(item.label)}
            >
              <span className={`msym ${styles.navIcon}`}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}
