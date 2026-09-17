"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Loader2, LockKeyhole, Mail, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!supabase) {
      setError("Primero configurá las variables de Supabase.");
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError("No se pudo ingresar. Revisá el correo y la contraseña.");
      return;
    }
    onClose();
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="modal-card auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X /></button>
      <span className="modal-symbol"><LockKeyhole /></span>
      <h2 id="auth-title">Ingreso de administración</h2>
      <p>Ingresá con tu cuenta autorizada para agregar o modificar escuelas.</p>
      <form onSubmit={submit}>
        <label><span>Correo electrónico</span><div className="field-with-icon"><Mail /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="nombre@olavarria.gov.ar" /></div></label>
        <label><span>Contraseña</span><div className="field-with-icon"><KeyRound /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" /></div></label>
        {error && <div className="form-error">{error}</div>}
        <button className="primary-action modal-submit" type="submit" disabled={loading}>{loading ? <Loader2 className="spin" /> : <LockKeyhole />} {loading ? "Ingresando…" : "Ingresar"}</button>
      </form>
    </section>
  </div>;
}

