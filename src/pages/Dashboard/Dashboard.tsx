import { useCallback, useEffect, useRef, useState, type SubmitEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../shared/auth/useAuth";
import { Button } from "../../shared/components/Button/Button";
import { CardDisplay } from "../../shared/components/CardDisplay/CardDisplay";
import { Input } from "../../shared/components/Input/Input";
import { Modal } from "../../shared/components/Modal/Modal";
import { Toast } from "../../shared/components/Toast/Toast";
import { useToast } from "../../shared/components/Toast/useToast";
import { TransactionRow } from "../../shared/components/TransactionRow/TransactionRow";
import { getApiErrorMessage } from "../../shared/services/apiClient";
import { getBalances } from "../../shared/services/balanceService";
import { deposit, getTransactions } from "../../shared/services/transactionService";
import type { Balance, CurrencyCode, Transaction } from "../../shared/types/models";
import styles from "./Dashboard.module.css";

const CURRENCY_OPTIONS: CurrencyCode[] = ["USD", "EUR", "ARS"];

const CURRENCY_META: Record<CurrencyCode, { label: string; flagChar: string }> = {
  USD: { label: "Dólares", flagChar: "US" },
  EUR: { label: "Euros", flagChar: "EU" },
  ARS: { label: "Pesos AR", flagChar: "AR" },
};

// No hay endpoint de cotización pública todavía (el backend solo calcula la tasa
// real al confirmar un /transactions/exchange) — esto es una aproximación de
// cliente únicamente para poder mostrar "Balance total" convertido a otra
// moneda. No es la tasa que se aplica en una operación real.
const APPROX_RATES: Record<CurrencyCode, number> = { USD: 1, EUR: 0.92, ARS: 1350 };

const LATEST_TRANSACTIONS_LIMIT = 5;

export function Dashboard() {
  const { token } = useAuth();
  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalHidden, setTotalHidden] = useState(true);
  const [totalCurrency, setTotalCurrency] = useState<CurrencyCode>("USD");
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [hidden, setHidden] = useState<Record<CurrencyCode, boolean>>({ USD: true, EUR: true, ARS: true });
  const { message: toast, showToast } = useToast();
  const currencyMenuAnchorRef = useRef<HTMLDivElement>(null);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositCurrency, setDepositCurrency] = useState<CurrencyCode>("USD");
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async (cancelled: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const [balancesData, transactionsResult] = await Promise.all([
        getBalances(token as string),
        getTransactions(token as string, { limit: LATEST_TRANSACTIONS_LIMIT }),
      ]);
      if (cancelled) return;
      setBalances(balancesData);
      setTransactions(transactionsResult.transactions);
    } catch (err) {
      if (cancelled) return;
      setError(getApiErrorMessage(err));
    } finally {
      if (!cancelled) setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    loadDashboardData(cancelled);
    return () => {
      cancelled = true;
    };
  }, [token, loadDashboardData]);

  function openDepositModal() {
    setDepositCurrency("USD");
    setDepositAmount("");
    setDepositError(null);
    setIsDepositOpen(true);
  }

  async function handleDepositSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setDepositError(null);

    const parsedAmount = Number(depositAmount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setDepositError("Ingresá un monto válido, mayor a cero.");
      return;
    }

    setIsDepositing(true);
    try {
      await deposit(token as string, depositCurrency, parsedAmount);
      setIsDepositOpen(false);
      showToast(`Depositaste ${parsedAmount.toLocaleString("es-AR")} ${depositCurrency}.`);
      await loadDashboardData(false);
    } catch (err) {
      setDepositError(getApiErrorMessage(err));
    } finally {
      setIsDepositing(false);
    }
  }

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

  function balanceFor(code: CurrencyCode): number {
    return balances?.find((bal) => bal.currencyCode === code)?.amount ?? 0;
  }

  const totalUsd = CURRENCY_OPTIONS.reduce((sum, code) => sum + balanceFor(code) / APPROX_RATES[code], 0);
  const totalConverted = Math.round(totalUsd * APPROX_RATES[totalCurrency]);
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
                    aria-expanded={currencyMenuOpen}
                    aria-controls="currency-menu"
                  >
                    {totalCurrency}
                    <span className="msym" style={{ fontSize: 16 }} aria-hidden="true">expand_more</span>
                  </button>
                  <div id="currency-menu" className={styles.currencyMenu} hidden={!currencyMenuOpen}>
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
                </div>
              </div>
            </div>
          </div>

          <div className={styles.currencyGrid}>
            {CURRENCY_OPTIONS.map((code) => {
              const isHidden = hidden[code];
              const meta = CURRENCY_META[code];
              return (
                <div key={code} className={styles.currencyCard}>
                  <div className={styles.currencyCardTop}>
                    <div className={styles.currencyCardLabel}>
                      <div className={styles.flagBadge}>{meta.flagChar}</div>
                      <span className={styles.currencyLabelText}>{meta.label}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => toggleBalanceHidden(code)}
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
                    {isHidden ? "••••••" : `${code} ${balanceFor(code).toLocaleString("es-AR")}`}
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
            <button type="button" className={styles.sellButton} onClick={openDepositModal}>
              <span className="msym" style={{ fontSize: 18 }} aria-hidden="true">arrow_downward</span>
              Depositar
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
            <Link to="/actividad" className={styles.txLink}>Ver todas</Link>
          </div>
          <div className={styles.txList}>
            {isLoading && <p className={styles.txEmptyState}>Cargando...</p>}
            {!isLoading && error && <p className={styles.txEmptyState}>{error}</p>}
            {!isLoading && !error && transactions?.length === 0 && (
              <p className={styles.txEmptyState}>Todavía no hiciste ninguna operación.</p>
            )}
            {!isLoading && !error && transactions?.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)}
          </div>
        </div>

        {/* Vista de tarjeta física: no estaba en el checklist original, se sumó al traer el mock del diseño Geist */}
        <CardDisplay />
      </aside>

      <Toast message={toast} />

      <Modal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} ariaLabel="Depositar fondos">
        <form onSubmit={handleDepositSubmit} className={styles.depositForm}>
          <h2 className={styles.depositTitle}>Depositar fondos</h2>
          <p className={styles.depositSubtitle}>Simulá recibir dinero en tu cuenta — no es dinero real.</p>

          <div className={styles.depositField}>
            <label className={styles.label} htmlFor="depositCurrency">Moneda</label>
            <select
              id="depositCurrency"
              className={styles.depositSelect}
              value={depositCurrency}
              onChange={(event) => setDepositCurrency(event.target.value as CurrencyCode)}
            >
              {CURRENCY_OPTIONS.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <Input
            label="Monto"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={depositAmount}
            onChange={(event) => setDepositAmount(event.target.value)}
            required
          />

          {depositError && (
            <p className={styles.depositError} role="alert">{depositError}</p>
          )}

          <Button type="submit" disabled={isDepositing}>
            {isDepositing ? "Depositando..." : "Confirmar depósito"}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
