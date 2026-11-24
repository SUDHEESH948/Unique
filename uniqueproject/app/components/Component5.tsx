"use client";

// The supplied remote images render without a Next.js image-host configuration.
/* eslint-disable @next/next/no-img-element */
import "./component5.css";

import { useEffect, useState } from "react";
import ConstructionSection from "./construction/ConstructionSection";

const images = {
  hero: "https://images.unsplash.com/photo-1760570273485-13d949dd3c98?auto=format&fit=crop&w=2200&q=90",
  about:
    "https://images.unsplash.com/photo-1553700477-0ff02310c76f?auto=format&fit=crop&w=1800&q=88",
  signature:
    "https://images.unsplash.com/photo-1783497607905-2ad168af9b4b?auto=format&fit=crop&w=2200&q=90",
  interior:
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1800&q=88",
  glass:
    "https://images.unsplash.com/photo-1656593545232-07ee53c63624?auto=format&fit=crop&w=1800&q=88",
  entry:
    "https://images.unsplash.com/photo-1758448756362-e323282ccbcc?auto=format&fit=crop&w=1800&q=88",
  balcony:
    "https://images.unsplash.com/photo-1768765170694-9df20303257f?auto=format&fit=crop&w=1800&q=88",
  room: "https://images.unsplash.com/photo-1694990600401-dac57c87ed45?auto=format&fit=crop&w=1800&q=88",
};

const projects = [
  {
    title: "The Modern Residence",
    type: "Luxury Residential Architecture",
    image: images.hero,
    place: "Cape Town · 2024",
  },
  {
    title: "The Garden Room",
    type: "Contemporary Interior Design",
    image: images.interior,
    place: "London · 2023",
  },
  {
    title: "The Private Villa",
    type: "Premium Residential Construction",
    image: images.glass,
    place: "Dubai · 2024",
  },
  {
    title: "The Grand Living",
    type: "Luxury Interior Architecture",
    image: images.room,
    place: "Milan · 2023",
  },
];

const services = [
  ["01", "Architectural Design", images.glass],
  ["02", "Residential Construction", images.hero],
  ["03", "Commercial Construction", images.entry],
  ["04", "Interior Design", images.interior],
  ["05", "Renovation & Remodeling", images.room],
  ["06", "Project Management", images.balcony],
];

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={down ? "arrow down" : "arrow"}>
      <path d={down ? "M12 3v17m0 0 6-6m-6 6-6-6" : "M5 19 19 5m0 0H8m11 0v11"} />
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className={`logo ${light ? "light" : ""}`} href="#home" aria-label="Forma home">
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <path d="M5 34V8h28L18 34V17" />
      </svg>
      <span>
        FORMA<small>ARCHITECTURE + BUILD</small>
      </span>
    </a>
  );
}

export default function Component5() {
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [project, setProject] = useState(0);
  const [service, setService] = useState(0);
  const [filter, setFilter] = useState("All");
  const [quote, setQuote] = useState(0);

  useEffect(() => {
    const reveal = () => {
      document.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add("visible");
      });
      setScrolled(window.scrollY > 50);
    };
    reveal();
    window.addEventListener("scroll", reveal, { passive: true });
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setQuote((q) => (q + 1) % 2), 6500);
    return () => clearInterval(timer);
  }, []);

  const moveProject = (delta: number) =>
    setProject((p) => (p + delta + projects.length) % projects.length);
  const filtered = [
    { name: "Cliff House", cat: "Residential", image: images.hero, size: "wide" },
    { name: "Quiet Geometry", cat: "Commercial", image: images.glass, size: "tall" },
    { name: "Garden Pavilion", cat: "Residential", image: images.entry, size: "" },
    { name: "Atelier No. 4", cat: "Interiors", image: images.interior, size: "" },
    { name: "Alpine Room", cat: "Interiors", image: images.balcony, size: "wide" },
  ].filter((item) => filter === "All" || item.cat === filter);

  return (
    <main className="forma">
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <Logo light={!scrolled} />
        <nav className="desktop-nav">
          {["Home", "About", "Expertise", "Projects", "Process", "Contact"].map((item) => (
            <a href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </nav>
        <a className="header-cta" href="#contact">
          Start your project <Arrow />
        </a>
        <button className="menu-button" onClick={() => setMenu(true)} aria-label="Open menu">
          <span />
          <span />
        </button>
      </header>

      <div className={`mobile-menu ${menu ? "open" : ""}`}>
        <button onClick={() => setMenu(false)} aria-label="Close menu">
          Close
        </button>
        <nav>
          {["Home", "About", "Expertise", "Projects", "Process", "Contact"].map((item, i) => (
            <a href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)} key={item}>
              <small>0{i + 1}</small>
              {item}
            </a>
          ))}
        </nav>
      </div>

      <section className="hero" id="home">
        <div className="hero-image sketch" style={{ backgroundImage: `url(${images.hero})` }} />
        <div className="hero-image reality" style={{ backgroundImage: `url(${images.hero})` }} />
        <div className="paper-edge" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-title">
            <div className="eyebrow intro">If you can</div>
            <div className="title-line bronze">
              <span>Dream it...</span>
            </div>
            <div className="eyebrow second">We can</div>
            <div className="title-line">
              <span>Build it.</span>
            </div>
          </div>
          <div className="hero-bottom">
            <p>
              From concept to completion, we transform extraordinary ideas into exceptional spaces.
            </p>
            <div className="hero-actions">
              <a className="button fill" href="#projects">
                Explore our work <Arrow />
              </a>
              <a className="text-link light-link" href="#expertise">
                Discover our expertise <Arrow />
              </a>
            </div>
          </div>
        </div>
        <a className="scroll" href="#about">
          <span>Scroll to discover</span>
          <Arrow down />
        </a>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-label reveal">
          <span>01</span> The studio
        </div>
        <div className="about-copy">
          <h2 className="display reveal">
            Architecture is where <em>imagination</em> becomes reality.
          </h2>
          <div className="about-intro reveal">
            <p>
              We are an integrated architecture, construction, and interiors studio creating spaces
              of enduring beauty and purpose.
            </p>
            <p>
              From the first drawing to the final handover —{" "}
              <strong>One Team. One Vision. One Complete Solution.</strong>
            </p>
            <a className="text-link" href="#contact">
              Discover our story <Arrow />
            </a>
          </div>
        </div>
        <div className="stats reveal">
          {[
            ["15+", "Years of excellence"],
            ["250+", "Projects delivered"],
            ["100%", "Commitment to quality"],
          ].map((s) => (
            <div key={s[1]}>
              <strong>{s[0]}</strong>
              <span>{s[1]}</span>
            </div>
          ))}
        </div>
        <div className="about-image reveal">
          <img src={images.about} alt="Sculptural contemporary architecture" />
        </div>
      </section>

      <section className="expertise section-pad" id="expertise">
        <div className="section-label light-label reveal">
          <span>02</span> Our expertise
        </div>
        <div className="expertise-heading">
          <h2 className="display reveal">
            Every Detail.
            <br />
            Every Discipline.
            <br />
            <em>One Vision.</em>
          </h2>
          <p className="reveal">
            A seamless union of architecture, construction, and interior design — considered from
            every angle.
          </p>
        </div>
        <div className="services">
          <div className="service-preview reveal">
            <img key={service} src={services[service][2]} alt="" />
          </div>
          <div className="service-list">
            {services.map((s, i) => (
              <a
                href="#contact"
                className={service === i ? "active" : ""}
                onMouseEnter={() => setService(i)}
                onFocus={() => setService(i)}
                key={s[1]}
              >
                <span>{s[0]}</span>
                <h3>{s[1]}</h3>
                <Arrow />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="projects" id="projects">
        <div className="project-stage">
          {projects.map((p, i) => (
            <img
              key={p.title}
              className={project === i ? "active" : ""}
              src={p.image}
              alt={p.title}
            />
          ))}
          <div className="project-overlay" />
          <div className="project-top">
            <div className="section-label light-label">
              <span>03</span> Selected projects
            </div>
            <span>{projects[project].place}</span>
          </div>
          <div className="project-content" key={project}>
            <span className="project-number">Project 0{project + 1}</span>
            <h2>{projects[project].title}</h2>
            <p>{projects[project].type}</p>
          </div>
          <div className="project-controls">
            <span>
              0{project + 1} <i /> 0{projects.length}
            </span>
            <button onClick={() => moveProject(-1)} aria-label="Previous project">
              ←
            </button>
            <button onClick={() => moveProject(1)} aria-label="Next project">
              →
            </button>
          </div>
        </div>
      </section>

      <ConstructionSection />

      <section className="signature" style={{ backgroundImage: `url(${images.signature})` }}>
        <div className="signature-inner reveal">
          <span>Signature architecture</span>
          <h2>
            Designed to Inspire.
            <br />
            <em>Built to Last.</em>
          </h2>
          <a className="text-link light-link" href="#gallery">
            Explore architecture <Arrow />
          </a>
        </div>
      </section>

      <section className="values section-pad">
        <div className="section-label light-label reveal">
          <span>05</span> Why choose us
        </div>
        <h2 className="display reveal">
          Built on Trust.
          <br />
          <em>Defined by Excellence.</em>
        </h2>
        <div className="value-grid">
          {[
            [
              "01",
              "Design Excellence",
              "Original thinking, timeless expression, and rigorous attention to context.",
            ],
            [
              "02",
              "Quality Craftsmanship",
              "Exceptional materials shaped by skilled hands and exacting standards.",
            ],
            [
              "03",
              "Transparent Communication",
              "A clear, collaborative partnership from first conversation to final detail.",
            ],
            [
              "04",
              "End-to-End Solutions",
              "One integrated team responsible for every stage of your journey.",
            ],
          ].map((v) => (
            <div className="value reveal" key={v[1]}>
              <span>{v[0]}</span>
              <h3>{v[1]}</h3>
              <p>{v[2]}</p>
              <Arrow />
            </div>
          ))}
        </div>
      </section>

      <section className="gallery section-pad" id="gallery">
        <div className="gallery-head">
          <div>
            <div className="section-label reveal">
              <span>06</span> The portfolio
            </div>
            <h2 className="display reveal">
              Spaces That
              <br />
              <em>Tell Stories.</em>
            </h2>
          </div>
          <div className="filters reveal">
            {["All", "Residential", "Commercial", "Interiors"].map((f) => (
              <button className={filter === f ? "active" : ""} onClick={() => setFilter(f)} key={f}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="bento">
          {filtered.map((item) => (
            <article className={`gallery-item ${item.size} reveal`} key={item.name}>
              <img src={item.image} alt={item.name} />
              <div>
                <span>{item.cat}</span>
                <h3>{item.name}</h3>
                <Arrow />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="testimonials section-pad">
        <div className="section-label reveal">
          <span>07</span> Client stories
        </div>
        <h2 className="display reveal">
          Spaces We Create.
          <br />
          <em>Relationships We Build.</em>
        </h2>
        <div className="quote reveal" key={quote}>
          <span>“</span>
          <blockquote>
            {quote === 0
              ? "They understood not only how we wanted our home to look, but how we wanted to live in it. Every detail feels deeply personal."
              : "From the clarity of the first concept to the precision of the final handover, the entire experience was exceptional."}
          </blockquote>
          <footer>
            {quote === 0
              ? "Sample testimonial — Private Residence"
              : "Sample testimonial — Commercial Client"}
          </footer>
        </div>
        <div className="quote-nav">
          <button onClick={() => setQuote(0)}>←</button>
          <span>0{quote + 1} / 02</span>
          <button onClick={() => setQuote(1)}>→</button>
        </div>
      </section>

      <section
        className="final-cta"
        id="contact"
        style={{ backgroundImage: `url(${images.entry})` }}
      >
        <div className="final-inner reveal">
          <span>Begin a conversation</span>
          <h2>
            Have a vision?
            <br />
            <em>Let’s make it real.</em>
          </h2>
          <p>Your dream deserves exceptional design and craftsmanship.</p>
          <div>
            <a className="button ivory" href="mailto:studio@forma.example">
              Start your project <Arrow />
            </a>
            <a className="text-link light-link" href="tel:+0000000000">
              Contact our team <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-main">
          <div>
            <Logo light />
            <p>Architecture, construction, and interiors — created as one complete vision.</p>
          </div>
          <div>
            <span>Visit</span>
            <p>
              Studio 01, Design District
              <br />
              Your City, Country
            </p>
          </div>
          <div>
            <span>Contact</span>
            <a href="mailto:studio@forma.example">studio@forma.example</a>
            <a href="tel:+0000000000">+00 000 000 000</a>
          </div>
          <div>
            <span>Follow</span>
            <a href="#">Instagram ↗</a>
            <a href="#">LinkedIn ↗</a>
            <a href="#">Facebook ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Forma Architecture + Build</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
      <a className="whatsapp" href="https://wa.me/0000000000" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24">
          <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.7Z" />
          <path d="M8 7.7c.2-.4.4-.4.7-.4h.4c.2 0 .4 0 .5.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.3.4-.1.7.3.6 1.1 1.7 2.4 2.3.3.2.6.2.8 0l.8-1c.2-.3.4-.3.7-.2l1.8.9c.3.1.4.3.4.5 0 .4-.2 1.3-.8 1.8-.5.4-1.2.7-2.1.5-1.1-.2-2.5-.7-4.2-2.2-1.5-1.3-2.5-3-2.8-4.1-.3-1.1 0-1.8.4-2.2Z" />
        </svg>
      </a>
    </main>
  );
}
