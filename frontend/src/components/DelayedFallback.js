import { useEffect, useState } from "react";
import Loadingpage from "../pages/Loadingpage";

const DELAY_MS = 300;

export default function DelayedFallback() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  return show ? <Loadingpage /> : <div className="delayed-fallback-blank" />;
}