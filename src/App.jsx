import { useEffect } from "react";
import Chat from "./components/Chat.jsx";

// EDITA aquí los textos con la información oficial de la academia.
const PROGRAMAS = [
  { titulo: "Academia Militar", texto: "Preparación académica y física para el ingreso a escuelas militares, con formación en disciplina y valores." },
  { titulo: "Pre Policial", texto: "Preparación para el ingreso a escuelas de formación policial: conocimientos, entrenamiento y orden." },
];
const VALORES = [
  { titulo: "Disciplina", texto: "Constancia y orden como hábito diario de estudio y entrenamiento." },
  { titulo: "Respeto", texto: "Trato firme y cordial entre instructores y alumnos." },
  { titulo: "Honor", texto: "Compromiso con el esfuerzo propio y con el equipo." },
  { titulo: "Superación", texto: "Metas claras y seguimiento del avance de cada alumno." },
];

export default function App() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    const targets = document.querySelectorAll("[data-reveal]");
    targets.forEach((target) => {
      target.setAttribute("data-reveal-ready", "");
      observer.observe(target);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="nav">
        <a className="brand" href="#inicio"><span className="brand__mark" aria-hidden="true" />Academia Esparta</a>
        <nav aria-label="Principal">
          <a href="#programas">Programas</a>
          <a href="#valores">Valores</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <a className="nav__cta" href="#contacto">Conversemos <span aria-hidden="true">↗</span></a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero__content" data-reveal>
            <div className="hero__text">
              <p className="eyebrow"><span /> Academia Militar y Pre Policial</p>
              <h1>Prepárate para servir. <span>Fórmate para destacar.</span></h1>
              <p className="hero__intro">En Esparta te acompañamos a construir una preparación académica y física sólida, con disciplina, carácter y propósito.</p>
              <div className="hero__cta">
                <a className="btn btn--solid" href="#contacto">Quiero información <span aria-hidden="true">→</span></a>
                <a className="btn btn--line" href="#programas">Explorar programas</a>
              </div>
              <p className="hero__note"><span aria-hidden="true">✦</span> Un paso firme hacia tu próximo objetivo</p>
            </div>
            <aside className="hero-card" aria-label="Formación integral Esparta">
              <div className="hero-card__top">
                <span className="hero-card__label">FORMACIÓN INTEGRAL</span>
                <span className="hero-card__index">01 / 02</span>
              </div>
              <div className="hero-card__seal" aria-hidden="true"><span>E</span></div>
              <p className="hero-card__overline">TU META, NUESTRA MISIÓN</p>
              <h2>Carácter para avanzar.<br />Preparación para lograrlo.</h2>
              <div className="hero-card__divider" />
              <div className="hero-card__features">
                <span><i aria-hidden="true">✓</i> Formación académica</span>
                <span><i aria-hidden="true">✓</i> Entrenamiento físico</span>
              </div>
            </aside>
          </div>
          <div className="hero__stats" aria-label="Enfoque de la academia" data-reveal>
            <div><strong>02</strong><span>programas de preparación</span></div>
            <div><strong>04</strong><span>valores que nos guían</span></div>
            <div><strong>01</strong><span>meta: tu mejor versión</span></div>
          </div>
        </section>

        <section className="section section--programs" id="programas">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow eyebrow--light">ELIGE TU CAMINO</p>
              <h2>Programas de preparación</h2>
            </div>
            <p>Entrenamiento y orientación para avanzar con confianza hacia tu objetivo.</p>
          </div>
          <div className="grid grid--2">
            {PROGRAMAS.map((p, index) => (
              <article className={`program-card program-card--${index + 1}`} key={p.titulo} data-reveal style={{ "--reveal-delay": `${index * 100}ms` }}>
                <div className="program-card__top"><span>RUTA 0{index + 1}</span><span aria-hidden="true">↗</span></div>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
                <a href="#contacto">Conoce más <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
        </section>

        <section className="section section--values" id="valores">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow eyebrow--light">NUESTRA ESENCIA</p>
              <h2>Formación con propósito</h2>
            </div>
            <p>Una preparación que va más allá del aula: hábitos, valores y trabajo en equipo.</p>
          </div>
          <ul className="values">
            {VALORES.map((v, index) => (
              <li key={v.titulo} data-reveal style={{ "--reveal-delay": `${index * 70}ms` }}>
                <span className="values__number">0{index + 1}</span>
                <h3>{v.titulo}</h3>
                <p>{v.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="faq-section" aria-labelledby="faq-title">
          <div className="section__heading" data-reveal>
            <div>
              <p className="eyebrow eyebrow--light">RESPUESTAS RÁPIDAS</p>
              <h2 id="faq-title">¿Tienes alguna duda?</h2>
            </div>
            <p>Encuentra orientación inicial y, si necesitas más información, conversemos.</p>
          </div>
          <div className="faq-list" data-reveal>
            <details>
              <summary>¿Qué programas ofrece Academia Esparta?<span aria-hidden="true">+</span></summary>
              <p>Ofrecemos preparación para Academia Militar y Pre Policial. Revisa la sección de programas para conocer el enfoque de cada uno.</p>
            </details>
            <details>
              <summary>¿Dónde consulto los requisitos y horarios?<span aria-hidden="true">+</span></summary>
              <p>Los requisitos y horarios pueden variar. Escríbenos para recibir la información actualizada directamente de la academia.</p>
            </details>
            <details>
              <summary>¿Puedo hacer una consulta ahora?<span aria-hidden="true">+</span></summary>
              <p>Sí. Pulsa la burbuja del asistente en la esquina inferior para iniciar una conversación.</p>
            </details>
          </div>
        </section>

        <section className="contact-section" id="contacto" data-reveal>
          <div className="contact-section__intro">
            <p className="eyebrow">DA EL SIGUIENTE PASO</p>
            <h2>Tu objetivo empieza con una conversación.</h2>
            <p>Escríbenos o consulta al asistente virtual. Estamos aquí para orientarte.</p>
            <a className="btn btn--solid" href="mailto:contacto@academiaesparta.pe">Contáctanos <span aria-hidden="true">↗</span></a>
          </div>
          <dl className="contact">
            <div><dt>Teléfono / WhatsApp</dt><dd>+51 000 000 000</dd></div>
            <div><dt>Correo</dt><dd>contacto@academiaesparta.pe</dd></div>
            <div><dt>Dirección</dt><dd>Completa con la dirección oficial</dd></div>
          </dl>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#inicio"><span className="brand__mark" aria-hidden="true" />Academia Esparta</a>
        <span>© {new Date().getFullYear()} Academia Militar y Pre Policial Esparta</span>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
      <Chat />
    </>
  );
}
