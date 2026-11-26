import { useEffect, useRef, useState } from "react";

const WELCOME = "¡Hola! Soy el asistente de Academia Esparta. Te ayudo con nuestros programas, requisitos e inscripciones.";
const SUGGESTIONS = ["Ver programas", "Consultar requisitos", "Cómo me inscribo"];

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else if (wasOpenRef.current) {
      launcherRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
    if (!isOpen) return undefined;
    function closeOnEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  async function send(text) {
    const message = text.trim();
    if (!message || loading) return;
    setMessages((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error de conexión.");
      setConversationId(data.conversationId);
      setMessages((m) => [...m, { role: "bot", text: data.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "bot", text: e.message, error: true }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-widget">
      {isOpen && (
        <section className="chat" id="esparta-chat" role="dialog" aria-label="Asistente virtual de Academia Esparta">
          <header className="chat__head">
            <span className="chat__avatar" aria-hidden="true">E</span>
            <div>
              <strong>Asistente Esparta</strong>
              <small><span className="chat__dot" aria-hidden="true" />En línea · Listo para ayudarte</small>
            </div>
            <button className="chat__close" type="button" onClick={() => setIsOpen(false)} aria-label="Cerrar asistente">
              &times;
            </button>
          </header>

          <div className="chat__list" ref={listRef} role="log" aria-live="polite">
            {messages.map((m, i) => (
              <p key={i} className={`msg msg--${m.role}${m.error ? " msg--error" : ""}`}>{m.text}</p>
            ))}
            {loading && <p className="msg msg--bot msg--typing" aria-label="Escribiendo"><i /><i /><i /></p>}
          </div>

          {messages.length === 1 && (
            <div className="chat__quick">
              <p>Elige un tema o escribe tu consulta:</p>
              <div className="chat__chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <form className="chat__form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu consulta" maxLength={1000} aria-label="Tu consulta" />
            <button type="submit" disabled={loading || !input.trim()}>Enviar</button>
          </form>
        </section>
      )}

      <button
        ref={launcherRef}
        className={`chat-launcher${isOpen ? " chat-launcher--open" : ""}`}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Cerrar asistente virtual" : "Abrir asistente virtual"}
        aria-expanded={isOpen}
        aria-controls="esparta-chat"
      >
        {isOpen ? (
          <span aria-hidden="true">&times;</span>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.4-.8L4 20l1.3-4.1A7.4 7.4 0 0 1 5 12a7.5 7.5 0 1 1 15 0Z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" />
          </svg>
        )}
      </button>
    </div>
  );
}
