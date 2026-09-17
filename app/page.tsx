"use client";

import dynamic from "next/dynamic";
import {
  AlertTriangle, BookOpen, CalendarDays, ChevronRight, Clock3, Crown,
  Database, Drama, FileText, Filter, GraduationCap, Grid2X2, Hammer,
  ListFilter, LogIn, LogOut, Map, MapPin, Menu, Music2, Palette, Pencil,
  Plus, Search, Shapes, Sparkles, Trash2, Users, X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { schools, sourceDocuments, type School } from "./data";
import AuthModal from "./components/AuthModal";
import SchoolFormModal from "./components/SchoolFormModal";
import { fromSchoolRow, toSchoolRow, type SchoolRow } from "@/lib/school-db";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const SchoolMap = dynamic(() => import("./components/SchoolMap"), { ssr: false });
type Section = "resumen" | "mapa" | "escuelas" | "talleres" | "horarios" | "docentes" | "documentos";

const nav: { id: Section; label: string; icon: typeof Grid2X2 }[] = [
  { id: "resumen", label: "Resumen", icon: Grid2X2 }, { id: "mapa", label: "Mapa", icon: Map },
  { id: "escuelas", label: "Escuelas", icon: GraduationCap }, { id: "talleres", label: "Talleres", icon: Shapes },
  { id: "horarios", label: "Horarios", icon: CalendarDays }, { id: "docentes", label: "Docentes", icon: Users },
  { id: "documentos", label: "Documentos", icon: FileText },
];

const disciplineIcons: Record<string, typeof Music2> = {
  Música: Music2, "Artes visuales": Palette, Cerámica: Sparkles, "Danza y movimiento": Sparkles,
  Teatro: Drama, Literatura: BookOpen, Artesanías: Hammer, "Arte integrado": Shapes, Ajedrez: Crown,
};

export default function Home() {
  const [schoolData, setSchoolData] = useState<School[]>(schools);
  const [section, setSection] = useState<Section>("resumen");
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("Todas");
  const [locality, setLocality] = useState("Todas");
  const [selected, setSelected] = useState<School | null>(schools[0]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [notice, setNotice] = useState("");
  const canManage = Boolean(user?.email?.toLowerCase().endsWith("@olavarria.gov.ar"));
  const disciplines = useMemo(() => ["Todas", ...Array.from(new Set(schoolData.map((s) => s.discipline)))], [schoolData]);
  const localities = useMemo(() => ["Todas", ...Array.from(new Set(schoolData.map((s) => s.locality)))], [schoolData]);
  const filtered = useMemo(() => schoolData.filter((school) => {
    const haystack = `${school.name} ${school.discipline} ${school.locality} ${school.workshops.join(" ")} ${school.teachers.join(" ")}`.toLowerCase();
    const disciplineOk = discipline === "Todas" || school.discipline === discipline;
    const localityOk = locality === "Todas" || school.locality === locality || (locality === "Olavarría" && school.locality === "Olavarría y localidades");
    return disciplineOk && localityOk && haystack.includes(query.toLowerCase().trim());
  }), [discipline, locality, query, schoolData]);
  const selectSchool = useCallback((school: School) => setSelected(school), []);
  const workshops = useMemo(() => schoolData.flatMap((school) => school.workshops.map((name) => ({ name, school }))), [schoolData]);
  const teachers = useMemo(() => schoolData.flatMap((school) => school.teachers.map((name) => ({ name, school }))), [schoolData]);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    void client.auth.getUser().then(({ data }) => setUser(data.user));
    void client.from("education_schools").select("*").order("short_name").then(({ data, error }) => {
      if (error) { setNotice("No se pudo leer Supabase. Se muestran los datos incluidos en la aplicación."); return; }
      if (data) {
        const next = (data as SchoolRow[]).map(fromSchoolRow);
        setSchoolData(next);
        setSelected((current) => next.find((school) => school.id === current?.id) ?? next[0] ?? null);
      }
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function saveSchool(school: School) {
    if (!supabase) throw new Error("Falta configurar Supabase. Revisá el archivo README antes de publicar.");
    if (!user) throw new Error("Tenés que ingresar para guardar cambios.");
    const { data, error } = await supabase.from("education_schools").upsert(toSchoolRow(school)).select().single();
    if (error) throw new Error(error.message.includes("row-level security") ? "Tu cuenta no tiene permiso para modificar escuelas." : error.message);
    const saved = fromSchoolRow(data as SchoolRow);
    setSchoolData((current) => [...current.filter((item) => item.id !== saved.id), saved].sort((a, b) => a.shortName.localeCompare(b.shortName)));
    setSelected(saved);
    setQuery("");
    setDiscipline("Todas");
    setLocality("Todas");
    setSection("mapa");
    setNotice(`${saved.shortName} se guardó y ya aparece en el mapa.`);
  }

  async function deleteSchool(school: School) {
    if (!supabase || !user) return;
    if (!window.confirm(`¿Eliminar ${school.shortName}? Esta acción también quitará su marcador del mapa.`)) return;
    const { error } = await supabase.from("education_schools").delete().eq("id", school.id);
    if (error) { setNotice("No se pudo eliminar la escuela."); return; }
    const next = schoolData.filter((item) => item.id !== school.id);
    setSchoolData(next); setSelected(next[0] ?? null); setNotice(`${school.shortName} fue eliminada.`);
  }

  function startNewSchool() {
    if (!isSupabaseConfigured) { setNotice("Primero configurá Supabase con las instrucciones incluidas en el ZIP."); return; }
    if (!user) { setAuthOpen(true); return; }
    if (!canManage) { setNotice("La cuenta ingresada no tiene permiso para administrar escuelas."); return; }
    setEditingSchool(null); setFormOpen(true);
  }

  function startEditSchool(school: School) {
    if (!canManage) { setNotice("La cuenta ingresada no tiene permiso para administrar escuelas."); return; }
    setEditingSchool(school); setFormOpen(true);
  }

  async function logout() {
    await supabase?.auth.signOut();
    setNotice("Sesión cerrada. El mapa continúa disponible para consulta.");
  }

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool?: (tool: unknown, options?: unknown) => void } }).modelContext;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    try {
      context.registerTool({ name: "buscar_escuelas_artisticas", title: "Buscar escuelas artísticas", description: "Filtra la aplicación por nombre, disciplina, taller, docente o localidad.", inputSchema: { type: "object", properties: { consulta: { type: "string" } }, required: ["consulta"], additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: (input: { consulta: string }) => { setQuery(input.consulta); setSection("escuelas"); return { consulta: input.consulta, coincidencias: schoolData.filter((s) => `${s.name} ${s.workshops.join(" ")} ${s.teachers.join(" ")}`.toLowerCase().includes(input.consulta.toLowerCase())).length }; } }, { signal: controller.signal });
    } catch { /* WebMCP es opcional */ }
    return () => controller.abort();
  }, [schoolData]);

  const changeSection = (next: Section) => { setSection(next); setMobileMenu(false); };

  return <div className="app-shell">
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setMobileMenu((v) => !v)} aria-label="Abrir menú"><Menu size={22} /></button>
      <div className="brand-mark"><span>EA</span></div>
      <div className="brand-copy"><strong>Educación Cultural</strong><span>Escuelas artísticas · Olavarría</span></div>
      <div className="global-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar escuela, taller o docente" aria-label="Buscar" />{query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={16} /></button>}</div>
      <div className="year-pill"><span /> Ciclo 2026</div>
      {user ? <div className="session-actions"><span>{user.email}</span><button onClick={logout} aria-label="Cerrar sesión"><LogOut size={18} /></button></div> : <button className="login-action" onClick={() => setAuthOpen(true)}><LogIn size={18} /> Ingresar</button>}
    </header>
    <div className="workspace">
      <aside className={`sidebar ${mobileMenu ? "is-open" : ""}`}>
        <nav aria-label="Secciones">{nav.map((item) => { const Icon = item.icon; return <button key={item.id} className={section === item.id ? "active" : ""} onClick={() => changeSection(item.id)}><Icon size={20} /><span>{item.label}</span></button>; })}</nav>
        <div className="data-status"><Database size={18} /><div><strong>16 archivos procesados</strong><span>Última base: septiembre 2026</span></div></div>
      </aside>
      <main className="content">
        {notice && <div className="notice-bar"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Cerrar aviso"><X size={16} /></button></div>}
        {section === "resumen" && <>
          <div className="page-heading"><div><span className="eyebrow">Vista general</span><h1>Escuelas artísticas</h1><p>Información integrada de sedes, talleres, docentes y horarios.</p></div><div className="heading-actions"><button className="secondary-action" onClick={() => changeSection("mapa")}><Map size={18} /> Ver mapa</button><button className="primary-action" onClick={startNewSchool}><Plus size={18} /> Nueva escuela</button></div></div>
          <section className="stats-grid">
            <button onClick={() => changeSection("escuelas")}><GraduationCap /><span><strong>{schoolData.length}</strong> escuelas</span><ChevronRight /></button>
            <button onClick={() => changeSection("talleres")}><Shapes /><span><strong>{workshops.length}</strong> propuestas</span><ChevronRight /></button>
            <button onClick={() => changeSection("docentes")}><Users /><span><strong>{teachers.length}</strong> docentes registrados</span><ChevronRight /></button>
            <button onClick={() => changeSection("documentos")} className="warning"><AlertTriangle /><span><strong>4</strong> datos a revisar</span><ChevronRight /></button>
          </section>
          <section className="overview-grid">
            <div className="panel map-panel"><div className="panel-heading"><div><span className="eyebrow">Mapa inteligente</span><h2>Distribución territorial</h2></div><button onClick={() => changeSection("mapa")}>Explorar <ChevronRight size={16} /></button></div><SchoolMap schools={schoolData} selected={selected} onSelect={selectSchool} focusSelected={false} /></div>
            <div className="panel school-focus">{selected && <SchoolDetail school={selected} compact onOpenMap={() => changeSection("mapa")} canEdit={canManage} onEdit={() => startEditSchool(selected)} onDelete={() => void deleteSchool(selected)} />}</div>
          </section>
        </>}

        {section === "mapa" && <>
          <div className="page-heading"><div><span className="eyebrow">Territorio</span><h1>Mapa de escuelas</h1><p>Filtrá por disciplina o localidad y abrí la ficha de cada sede.</p></div><button className="primary-action" onClick={startNewSchool}><Plus size={18} /> Nueva escuela</button></div>
          <FilterBar disciplines={disciplines} localities={localities} discipline={discipline} locality={locality} setDiscipline={setDiscipline} setLocality={setLocality} count={filtered.length} />
          <section className="full-map-layout"><div className="map-list panel">{filtered.map((school) => <SchoolListItem key={school.id} school={school} selected={selected?.id === school.id} onClick={() => setSelected(school)} />)}{!filtered.length && <EmptyState />}</div><div className="panel large-map"><SchoolMap schools={filtered} selected={selected && filtered.some((s) => s.id === selected.id) ? selected : null} onSelect={selectSchool} /></div>{selected && <div className="panel map-detail"><SchoolDetail school={selected} canEdit={canManage} onEdit={() => startEditSchool(selected)} onDelete={() => void deleteSchool(selected)} /></div>}</section>
        </>}

        {section === "escuelas" && <CollectionPage title="Escuelas" subtitle={`${filtered.length} instituciones coinciden con los filtros`} action={<button className="primary-action" onClick={startNewSchool}><Plus size={18} /> Nueva escuela</button>}><FilterBar disciplines={disciplines} localities={localities} discipline={discipline} locality={locality} setDiscipline={setDiscipline} setLocality={setLocality} count={filtered.length} /><div className="school-grid">{filtered.map((school) => <SchoolCard key={school.id} school={school} onClick={() => { setSelected(school); changeSection("mapa"); }} />)}</div></CollectionPage>}
        {section === "talleres" && <CollectionPage title="Talleres" subtitle="Propuestas organizadas por escuela y disciplina"><div className="record-table"><div className="record-head"><span>Taller</span><span>Escuela</span><span>Disciplina</span><span>Localidad</span></div>{workshops.filter((w) => `${w.name} ${w.school.name}`.toLowerCase().includes(query.toLowerCase())).map((w, i) => <button className="record-row" key={`${w.school.id}-${w.name}-${i}`} onClick={() => { setSelected(w.school); changeSection("mapa"); }}><span><strong>{w.name}</strong></span><span>{w.school.shortName}</span><span><i style={{ background: w.school.color }} />{w.school.discipline}</span><span>{w.school.locality}<ChevronRight size={16} /></span></button>)}</div></CollectionPage>}
        {section === "horarios" && <CollectionPage title="Horarios" subtitle="Resumen semanal por escuela"><div className="schedule-grid">{schoolData.filter((s) => `${s.name} ${s.schedule}`.toLowerCase().includes(query.toLowerCase())).map((school) => <button key={school.id} onClick={() => { setSelected(school); changeSection("mapa"); }}><div className="schedule-icon" style={{ color: school.color, background: `${school.color}14` }}><Clock3 /></div><div><strong>{school.shortName}</strong><p>{school.schedule}</p></div><ChevronRight /></button>)}</div></CollectionPage>}
        {section === "docentes" && <CollectionPage title="Docentes" subtitle={`${teachers.length} registros recuperados de los cronogramas`}><div className="teacher-grid">{teachers.filter((t) => `${t.name} ${t.school.name}`.toLowerCase().includes(query.toLowerCase())).map((teacher, i) => <button key={`${teacher.school.id}-${teacher.name}-${i}`} onClick={() => { setSelected(teacher.school); changeSection("mapa"); }}><span className="avatar" style={{ background: teacher.school.color }}>{teacher.name.split(" ").map((p) => p[0]).slice(0,2).join("")}</span><span><strong>{teacher.name}</strong><small>{teacher.school.shortName}</small></span><ChevronRight size={16} /></button>)}</div></CollectionPage>}
        {section === "documentos" && <CollectionPage title="Documentos fuente" subtitle="Inventario del ZIP de horarios y propuestas"><div className="document-summary"><div><Database /><span><strong>16</strong> archivos</span></div><div><FileText /><span><strong>13</strong> del ciclo 2026</span></div><div className="alert"><AlertTriangle /><span><strong>4</strong> revisiones sugeridas</span></div></div><div className="document-list">{sourceDocuments.filter((d) => `${d.name} ${d.school} ${d.state}`.toLowerCase().includes(query.toLowerCase())).map((doc) => <div key={doc.name}><span className={`file-type ${doc.name.split(".").pop()}`}>{doc.name.split(".").pop()?.toUpperCase()}</span><span className="file-main"><strong>{doc.name}</strong><small>{doc.school} · {doc.year}</small></span><span className={`state state-${doc.state.toLowerCase().replaceAll(" ", "-")}`}>{doc.state}</span></div>)}</div></CollectionPage>}
      </main>
    </div>
    <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    {formOpen && <SchoolFormModal school={editingSchool} onClose={() => setFormOpen(false)} onSave={saveSchool} />}
  </div>;
}

function CollectionPage({ title, subtitle, children, action }: { title: string; subtitle: string; children: React.ReactNode; action?: React.ReactNode }) { return <><div className="page-heading"><div><span className="eyebrow">Base integrada</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>{children}</>; }

function FilterBar({ disciplines, localities, discipline, locality, setDiscipline, setLocality, count }: { disciplines: string[]; localities: string[]; discipline: string; locality: string; setDiscipline: (v: string) => void; setLocality: (v: string) => void; count: number }) {
  return <div className="filter-bar"><span><ListFilter size={17} /> Filtros</span><div className="filter-scroll">{disciplines.map((item) => <button key={item} className={discipline === item ? "active" : ""} onClick={() => setDiscipline(item)}>{item}</button>)}</div><div className="locality-filter"><Filter size={15} /><select value={locality} onChange={(e) => setLocality(e.target.value)} aria-label="Filtrar por localidad">{localities.map((item) => <option key={item}>{item}</option>)}</select></div><strong>{count} resultados</strong></div>;
}

function SchoolListItem({ school, selected, onClick }: { school: School; selected: boolean; onClick: () => void }) { const Icon = disciplineIcons[school.discipline] ?? Shapes; return <button className={selected ? "selected" : ""} onClick={onClick}><span className="school-icon" style={{ color: school.color, background: `${school.color}14` }}><Icon size={20} /></span><span><strong>{school.shortName}</strong><small><MapPin size={13} /> {school.locality}</small></span>{school.status === "review" && <AlertTriangle className="review-icon" size={17} />}<ChevronRight size={17} /></button>; }

function SchoolCard({ school, onClick }: { school: School; onClick: () => void }) { const Icon = disciplineIcons[school.discipline] ?? Shapes; return <button className="school-card" onClick={onClick}><div className="school-card-top"><span className="school-icon large" style={{ color: school.color, background: `${school.color}14` }}><Icon /></span>{school.status === "review" && <span className="needs-review"><AlertTriangle size={14} /> Revisar</span>}</div><strong>{school.shortName}</strong><p>{school.name}</p><span><MapPin size={15} /> {school.address}</span><div className="tag-row">{school.workshops.slice(0,3).map((w) => <i key={w}>{w}</i>)}{school.workshops.length > 3 && <i>+{school.workshops.length - 3}</i>}</div></button>; }

function SchoolDetail({ school, compact = false, onOpenMap, canEdit = false, onEdit, onDelete }: { school: School; compact?: boolean; onOpenMap?: () => void; canEdit?: boolean; onEdit?: () => void; onDelete?: () => void }) { const Icon = disciplineIcons[school.discipline] ?? Shapes; return <div className="school-detail"><div className="detail-title"><span className="school-icon large" style={{ color: school.color, background: `${school.color}14` }}><Icon /></span><div><span className="eyebrow">{school.discipline}</span><h2>{school.shortName}</h2></div></div><p className="full-name">{school.name}</p><div className="detail-address"><MapPin size={18} /><div><strong>{school.address}</strong><span>{school.locality}</span></div></div><div className="detail-schedule"><Clock3 size={18} /><span>{school.schedule}</span></div>{school.note && <div className="detail-warning"><AlertTriangle size={18} /><span>{school.note}</span></div>}<div className="detail-section"><strong>Talleres</strong><div className="tag-row">{school.workshops.slice(0, compact ? 5 : 8).map((w) => <i key={w}>{w}</i>)}</div></div>{!compact && <div className="detail-section"><strong>Docentes</strong><p>{school.teachers.length ? school.teachers.join(" · ") : "Sin docentes informados en el archivo"}</p></div>}<small className="source-line"><FileText size={14} /> {school.source}</small>{canEdit && <div className="detail-admin-actions"><button onClick={onEdit}><Pencil size={15} /> Editar</button><button className="danger" onClick={onDelete}><Trash2 size={15} /> Eliminar</button></div>}{compact && onOpenMap && <button className="detail-link" onClick={onOpenMap}>Abrir en el mapa <ChevronRight size={16} /></button>}</div>; }

function EmptyState() { return <div className="empty-state"><Search size={30} /><strong>No hay coincidencias</strong><span>Probá quitando algún filtro.</span></div>; }
