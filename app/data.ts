export type School = {
  id: string;
  shortName: string;
  name: string;
  discipline: string;
  locality: string;
  address: string;
  lat: number;
  lng: number;
  color: string;
  workshops: string[];
  schedule: string;
  teachers: string[];
  source: string;
  status?: "verified" | "review";
  note?: string;
};

export const schools: School[] = [
  { id: "musica", shortName: "Música", name: "Escuela Municipal de Música Hermanos Rossi", discipline: "Música", locality: "Olavarría", address: "Coronel Suárez 2924", lat: -36.8960449, lng: -60.3230691, color: "#6d3df5", workshops: ["Guitarra", "Canto", "Piano", "Batería", "Violín", "Flauta", "Saxo", "Bajo", "Ensamble"], schedule: "Lunes a viernes, turnos de mañana y tarde", teachers: ["Tito Catani", "Inés Maddio", "José Saez", "Ulises Merlos", "Ruth Angeletti"], source: "Música Listado Talleres y Horarios Profesores Sede (1).xlsx", status: "verified" },
  { id: "plastica-olavarria", shortName: "Plástica Olavarría", name: "Escuela Municipal de Artes Plásticas Leopoldo Boccazzi", discipline: "Artes visuales", locality: "Olavarría", address: "Avenida Pringles 3045", lat: -36.8961444, lng: -60.3154449, color: "#e54b4b", workshops: ["Dibujo", "Pintura artística", "Escultura", "Grabado", "Plástica infantil", "Ilustración y cómic"], schedule: "Lunes a viernes, de 15 a 20 h según taller", teachers: ["Mónica Zanazzi", "Natalia Peralta", "Aldo Fernández", "Fernando García", "Alfredo Puertas"], source: "Horarios Plástica Olavarría.jpeg", status: "review", note: "El archivo 2026 indica Pringles 3045; una ficha web municipal anterior conserva otra sede." },
  { id: "ceramica-olavarria", shortName: "Cerámica Olavarría", name: "Escuela Municipal de Cerámica Víctor Portarrieu", discipline: "Cerámica", locality: "Olavarría", address: "Necochea 3328", lat: -36.8954357, lng: -60.315581, color: "#c66a2b", workshops: ["Cerámica inicial", "Cerámica adultos"], schedule: "Miércoles y jueves de 14 a 19 h; viernes de 14 a 19 h", teachers: ["Karina García", "Gisele Gaitero"], source: "Horario 2026 Cerámica Olavarría.pdf", status: "verified" },
  { id: "plastica-sierras", shortName: "Plástica Sierras Bayas", name: "Escuela Municipal de Artes Plásticas de Sierras Bayas", discipline: "Artes visuales", locality: "Sierras Bayas", address: "Alsina entre Roca y Almirante Brown", lat: -36.93345, lng: -60.1598, color: "#e54b4b", workshops: ["Taller infantil", "Taller adolescentes", "Taller adultos"], schedule: "Lunes a viernes, actividades de 15 a 22 h según taller", teachers: ["Elizabeth Taraborrelli", "Martí Othasegui", "Santiago Rey", "Daniel Fitte"], source: "ok Plástica S Bayas HORARIOS TALLERES 2026.docx", status: "verified" },
  { id: "ceramica-sierras", shortName: "Cerámica Sierras Bayas", name: "Escuela Municipal de Cerámica de Sierras Bayas", discipline: "Cerámica", locality: "Sierras Bayas", address: "Alsina entre Roca y Almirante Brown", lat: -36.93336, lng: -60.15964, color: "#c66a2b", workshops: ["Adultos inicial", "Adultos avanzados", "Infancias"], schedule: "Lunes, martes, miércoles y viernes", teachers: [], source: "Escuela Cerámica S Bayas.docx", status: "review", note: "El archivo no informa docentes." },
  { id: "danza", shortName: "Danza", name: "Escuela Municipal de Danza", discipline: "Danza y movimiento", locality: "Olavarría", address: "Casa del Bicentenario, Bolívar y Cerrito", lat: -36.8929228, lng: -60.3306353, color: "#ed3f86", workshops: ["Folklore", "Árabe", "Danzas alemanas", "Tap", "Tango", "Salsa y bachata", "Danza urbana", "Yoga"], schedule: "Propuestas de lunes a sábado en Olavarría y localidades", teachers: ["Delia Ortega", "Esteban Salguero", "Denisa Laborde", "Aldana Espelet", "Juan José Rivas"], source: "PROPUESTAS DANZA actualizada 05 2026.pdf", status: "verified" },
  { id: "teatro", shortName: "Teatro", name: "Escuela Municipal de Teatro Olavarría", discipline: "Teatro", locality: "Olavarría", address: "Teatro Municipal, Rivadavia y San Martín", lat: -36.8940717, lng: -60.3223747, color: "#1667cf", workshops: ["Teatro infancias", "Teatro adolescentes", "Teatro adultos", "Impro teatral", "Clown", "Risoterapia"], schedule: "Lunes a viernes de 15 a 22 h; extensiones en localidades", teachers: ["Clara Chirino", "Beatriz Peralta", "Flavia Salto", "Victoria Reyes", "Julio Sarrat"], source: "ETO.pdf", status: "verified" },
  { id: "literaria", shortName: "Literaria Alfonsina", name: "Escuela Literaria Municipal Alfonsina", discipline: "Literatura", locality: "Olavarría y localidades", address: "Biblioteca Helios Eseverri, Balcarce 3620", lat: -36.9048586, lng: -60.3223235, color: "#0b8a70", workshops: ["Narrativa", "Poesía", "Literatura para niños", "Literatura para adolescentes"], schedule: "Lunes a viernes en bibliotecas, museos y centros comunitarios", teachers: ["Ceferino Lascano", "Mónica Pezzino", "Nora Sollé", "Marité Dillón", "Lucrecia Luna"], source: "ok Horarios Escuela Literaria Alfonsina 2026.docx", status: "verified" },
  { id: "orfebreria", shortName: "Orfebrería", name: "Escuela de Orfebrería y Artesanías Tradicionales Maestro Armando Ferreira", discipline: "Artesanías", locality: "Olavarría", address: "Bolívar 3332", lat: -36.9000702, lng: -60.3213664, color: "#697380", workshops: ["Orfebrería", "Tallado en madera", "Marroquinería", "Cestería", "Telar", "Soguería"], schedule: "Lunes a viernes, turnos de mañana, tarde y noche", teachers: ["Juan Ángel Chasman", "Ezequiel Burnet", "Martín Rossi", "Alicia Frías", "Raúl Elizaga"], source: "ok horarios 2026 Escuela de Orfebrería.docx", status: "verified" },
  { id: "integrada", shortName: "Artística Integrada", name: "Escuela Municipal Artística Integrada", discipline: "Arte integrado", locality: "Olavarría", address: "Centro Cultural San José, Riobamba 2949", lat: -36.8893485, lng: -60.3254393, color: "#1d83a5", workshops: ["Danza", "Teatro", "Plástica", "Tridimensión", "Música"], schedule: "Actividades semanales en instituciones y espacios culturales", teachers: ["Lorena Torres", "Javier Magnani", "Mauricio Gogorza", "Valeria González", "Antonella Spinolla"], source: "Horarios Esc Artistica Integrada 2025.xls", status: "review", note: "El único cronograma del ZIP corresponde a 2025 y necesita actualización." },
  { id: "ajedrez", shortName: "Ajedrez", name: "Escuela Municipal de Ajedrez", discipline: "Ajedrez", locality: "Olavarría y localidades", address: "Museo de las Ciencias, avenida Pellegrini 4200", lat: -36.8976482, lng: -60.2960112, color: "#203354", workshops: ["Ajedrez inicial", "Ajedrez adultos", "Ajedrez en escuelas", "Ajedrez en clubes"], schedule: "Actividades de lunes a sábado en más de 20 sedes", teachers: ["Darío Maidana", "Paola Nievas", "Omar Navarro", "Juan Rodríguez", "Lautaro Sampaoli"], source: "horario Ajedrez 2026 (1).xlsx", status: "verified" },
];

export const sourceDocuments = [
  { name: "Música Listado Talleres y Horarios Profesores Sede (1).xlsx", school: "Música", year: 2026, state: "Vigente" },
  { name: "Horario 2026 Cerámica Olavarría.pdf", school: "Cerámica Olavarría", year: 2026, state: "Vigente" },
  { name: "Escuela Cerámica S Bayas.docx", school: "Cerámica Sierras Bayas", year: 2026, state: "Incompleto" },
  { name: "ETO.pdf", school: "Teatro", year: 2026, state: "Vigente" },
  { name: "PROPUESTAS DANZA actualizada 05 2026.pdf", school: "Danza", year: 2026, state: "Vigente" },
  { name: "PROPUESTAS DANZA POR PROFESOR 2026.pdf", school: "Danza", year: 2026, state: "Posible duplicado" },
  { name: "Horarios Plástica Olavarría.jpeg", school: "Plástica Olavarría", year: 2026, state: "Vigente" },
  { name: "Horario Escuela Plastica Olavarria.jpeg", school: "Plástica Olavarría", year: 2026, state: "Posible duplicado" },
  { name: "ok Plástica S Bayas HORARIOS TALLERES 2026.docx", school: "Plástica Sierras Bayas", year: 2026, state: "Vigente" },
  { name: "ok horarios 2026 Escuela de Orfebrería.docx", school: "Orfebrería", year: 2026, state: "Vigente" },
  { name: "OJOO 2025 Cronograma ESCUELA DE ORFEBRERÍA 2025 (1).pdf", school: "Orfebrería", year: 2025, state: "Histórico" },
  { name: "ok Horarios Escuela Literaria Alfonsina 2026.docx", school: "Literaria Alfonsina", year: 2026, state: "Vigente" },
  { name: "horario Ajedrez 2026 (1).xlsx", school: "Ajedrez", year: 2026, state: "Vigente" },
  { name: "Horarios Profesores Ajedrez Club ACTUALIZADO JULIO 2026.docx", school: "Ajedrez", year: 2026, state: "Vigente" },
  { name: "ok Horarios Profesores Ajedrez Club 2026.docx", school: "Ajedrez", year: 2026, state: "Histórico" },
  { name: "Horarios Esc Artistica Integrada 2025.xls", school: "Artística Integrada", year: 2025, state: "Actualizar" },
];
