import { useEffect, useState } from "react";
import "./Loadingpage.css";

const BACKGROUND = `${process.env.PUBLIC_URL}/assets/error_bg_image.jpg`;

const FACTS = [
  "Alcheringa is the annual cultural festival of IIT Guwahati.",
  " more than 1.5 Lakh people Stepped on the ground of Alcheringa 2025 ?",
  "Alcheringa is a three-day event that features a wide range of cultural activities, including music, dance, drama, and art.",
];

const BAR_COUNT = 4;
const FACT_INTERVAL_MS = 4000;

export default function Loadingpage() {
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * FACTS.length)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setFactIndex((current) => (current + 1) % FACTS.length);
    }, FACT_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <main
      className="loading-page"
      style={{ "--loading-bg": `url(${BACKGROUND})` }}
    >
     <h1 className="loading-brand">ALCHERINGA</h1>

      <p className="loading-title">AWAKEN THE CHAOS</p>

      <p key={factIndex} className="loading-fact">
        Did you know... {FACTS[factIndex]}
      </p>

      <div className="loading-bars" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <span
            key={i}
            className="loading-bar"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      <p className="loading-wait" role="status">
        Please wait, we are loading your page...
      </p>
    </main>
  );
}