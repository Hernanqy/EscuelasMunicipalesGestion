"use client";

import { FormEvent, useState } from "react";
import { Crosshair, Loader2, MapPin, Save, X } from "lucide-react";
import type { School } from "../data";

type FormState = {
  shortName: string; name: string; discipline: string; locality: string; address: string;
  schedule: string; color: string; lat: string; lng: string; workshops: string; teachers: string; note: string;
};

const empty: FormState = { shortName: "", name: "", discipline: "", locality: "Olavarría", address: "", schedule: "", color: "#155eef", lat: "", lng: "", workshops: "", teachers: "", note: "" };

function initialForm(school: School | null): FormState {
  return school ? {
    shortName: school.shortName, name: school.name, discipline: school.discipline, locality: school.locality,
    address: school.address, schedule: school.schedule, color: school.color, lat: String(school.lat), lng: String(school.lng),
    workshops: school.workshops.join(", "), teachers: school.teachers.join(", "), note: school.note ?? "",
  } : empty;
}

export default function SchoolFormModal({ school, onClose, onSave }: { school: School | null; onClose: () => void; onSave: (school: School) => Promise<void> }) {
  const [form, setForm] = useState<FormState>(() => initialForm(school));
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function locate() {
    if (!form.address.trim()) { setMessage("Escribí una dirección antes de buscarla."); return; }
    setLocating(true); setMessage("");
    try {
      const query = `${form.address}, ${form.locality}, Partido de Olavarría, Buenos Aires, Argentina`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, { headers: { "Accept-Language": "es" } });
      const results = await response.json() as Array<{ lat: string; lon: string }>;
      if (!results.length) { setMessage("No encontré esa dirección. Podés completar latitud y longitud manualmente."); return; }
      update("lat", results[0].lat); update("lng", results[0].lon); setMessage("Ubicación encontrada. Al guardar aparecerá en el mapa.");
    } catch { setMessage("No se pudo consultar la ubicación. Completá las coordenadas manualmente."); }
    finally { setLocating(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const lat = Number(form.lat); const lng = Number(form.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) { setMessage("La escuela necesita una ubicación válida para aparecer en el mapa."); return; }
    setSaving(true); setMessage("");
    try {
      await onSave({
        id: school?.id ?? crypto.randomUUID(), shortName: form.shortName.trim(), name: form.name.trim(), discipline: form.discipline.trim(), locality: form.locality.trim(), address: form.address.trim(),
        schedule: form.schedule.trim(), color: form.color, lat, lng,
        workshops: form.workshops.split(",").map((v) => v.trim()).filter(Boolean), teachers: form.teachers.split(",").map((v) => v.trim()).filter(Boolean),
        source: school?.source ?? "Carga manual desde la aplicación", status: form.note ? "review" : "verified", note: form.note.trim() || undefined,
      });
      onClose();
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar la escuela."); }
    finally { setSaving(false); }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="modal-card school-form-card" role="dialog" aria-modal="true" aria-labelledby="school-form-title">
      <header><div><span className="eyebrow">Administración</span><h2 id="school-form-title">{school ? "Editar escuela" : "Nueva escuela"}</h2><p>La ubicación guardada se mostrará automáticamente en el mapa.</p></div><button className="modal-close" onClick={onClose} aria-label="Cerrar"><X /></button></header>
      <form onSubmit={submit}>
        <div className="form-grid two"><label><span>Nombre corto</span><input required value={form.shortName} onChange={(e) => update("shortName", e.target.value)} placeholder="Ej. Música" /></label><label><span>Disciplina</span><input required value={form.discipline} onChange={(e) => update("discipline", e.target.value)} placeholder="Ej. Música" /></label></div>
        <label><span>Nombre completo</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
        <div className="form-grid two"><label><span>Localidad</span><input required value={form.locality} onChange={(e) => update("locality", e.target.value)} /></label><label><span>Color del marcador</span><div className="color-field"><input type="color" value={form.color} onChange={(e) => update("color", e.target.value)} /><input value={form.color} onChange={(e) => update("color", e.target.value)} /></div></label></div>
        <label><span>Dirección o sede</span><div className="address-field"><MapPin /><input required value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Calle, número o intersección" /><button type="button" onClick={locate} disabled={locating}>{locating ? <Loader2 className="spin" /> : <Crosshair />} {locating ? "Buscando…" : "Ubicar"}</button></div></label>
        <div className="form-grid two coordinates"><label><span>Latitud</span><input required inputMode="decimal" value={form.lat} onChange={(e) => update("lat", e.target.value)} /></label><label><span>Longitud</span><input required inputMode="decimal" value={form.lng} onChange={(e) => update("lng", e.target.value)} /></label></div>
        <label><span>Horarios</span><input required value={form.schedule} onChange={(e) => update("schedule", e.target.value)} placeholder="Ej. Lunes y miércoles de 17 a 20 h" /></label>
        <label><span>Talleres separados por coma</span><textarea value={form.workshops} onChange={(e) => update("workshops", e.target.value)} placeholder="Guitarra, Canto, Piano" /></label>
        <label><span>Docentes separados por coma</span><textarea value={form.teachers} onChange={(e) => update("teachers", e.target.value)} /></label>
        <label><span>Observación opcional</span><textarea value={form.note} onChange={(e) => update("note", e.target.value)} /></label>
        {message && <div className={message.startsWith("Ubicación encontrada") ? "form-success" : "form-error"}>{message}</div>}
        <footer><button type="button" className="secondary-action" onClick={onClose}>Cancelar</button><button type="submit" className="primary-action" disabled={saving}>{saving ? <Loader2 className="spin" /> : <Save />} {saving ? "Guardando…" : "Guardar escuela"}</button></footer>
      </form>
    </section>
  </div>;
}
