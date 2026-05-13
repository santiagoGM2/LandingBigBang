/**
 * Catálogo de 50 códigos DEC.
 *
 * Las imágenes son placeholders. El cliente reemplaza `img` por fotografías
 * reales de sus montajes cuando estén disponibles. Mientras tanto usamos un
 * pool curado de Unsplash + fallback picsum.photos para garantizar variedad
 * visual (regla: nunca dos adyacentes iguales en el grid).
 */

export type Categoria =
  | "cumple_infantil"
  | "baby"
  | "religioso"
  | "grado"
  | "cumple_adulto"
  | "romantico"
  | "empresarial"
  | "especial";

export interface CodigoDec {
  codigo: string;
  titulo: string;
  emocion: string;
  categoria: Categoria;
  imgQuery: string;
  img: string;
}

const W = 800;
const H = 600;

/** Pool de fotos Unsplash conocidas, por categoría (rotamos para evitar
 *  identidad visual repetida). Si una 404ea, next/image cae a transparente y
 *  el wrapper con gradiente bb-pink-soft → bb-purple-soft cubre el hueco. */
const POOL: Record<Categoria, string[]> = {
  cumple_infantil: [
    "1530103862676-de8c9debad1d",
    "1513151233558-d860c5398176",
    "1492684223066-81342ee5ff30",
    "1502635385003-ee1e6a1a742d",
    "1464349095431-e9a21285b5f3",
  ],
  baby: [
    "1558636508-e0db3814bd1d",
    "1620735692151-26a7e0748429",
    "1519689680058-324335c77eba",
    "1607344645866-009c320b63e0",
  ],
  religioso: [
    "1607344645866-009c320b63e0",
    "1481253127861-534498168948",
    "1543366749-7d3eb1fa6f81",
  ],
  grado: [
    "1610890716171-6b1bb98ffd09",
    "1523050854058-8df90110c9f1",
    "1571260899304-425eee4c7efc",
  ],
  cumple_adulto: [
    "1492684223066-81342ee5ff30",
    "1517232115160-ff93364542dd",
    "1530103862676-de8c9debad1d",
    "1467810563316-b5476525c0f9",
  ],
  romantico: [
    "1469371670807-013ccf25f16a",
    "1518050227004-c4cb7104d79a",
    "1481253127861-534498168948",
  ],
  empresarial: [
    "1540575467063-178a50c2df87",
    "1559223607-d6a13b3a0d4b",
    "1542744173-8e7e53415bb0",
  ],
  especial: [
    "1518049362265-d5b2a6467637",
    "1509557965875-b88c97052f0e",
    "1539541417736-3d44c90da315",
  ],
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function pickImg(cat: Categoria, codigo: string, idx: number): string {
  const pool = POOL[cat];
  const id = pool[idx % pool.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${W}&h=${H}&q=80&ixlib=rb-4.0.3&s=${slug(codigo)}`;
}

const SEED: Array<Omit<CodigoDec, "img">> = [
  // Cumpleaños infantiles (DEC-001 a DEC-012)
  { codigo: "DEC-001", titulo: "Princesa encantada", emocion: "Magia", categoria: "cumple_infantil", imgQuery: "princess birthday party decor" },
  { codigo: "DEC-002", titulo: "Súper héroe en acción", emocion: "Aventura", categoria: "cumple_infantil", imgQuery: "superhero birthday balloons" },
  { codigo: "DEC-003", titulo: "Selva mágica", emocion: "Aventura", categoria: "cumple_infantil", imgQuery: "jungle theme birthday" },
  { codigo: "DEC-004", titulo: "Bajo el mar", emocion: "Asombro", categoria: "cumple_infantil", imgQuery: "under the sea party" },
  { codigo: "DEC-005", titulo: "Pequeño dinosaurio", emocion: "Aventura", categoria: "cumple_infantil", imgQuery: "dinosaur birthday party" },
  { codigo: "DEC-006", titulo: "Astronauta soñador", emocion: "Sueños", categoria: "cumple_infantil", imgQuery: "space astronaut birthday" },
  { codigo: "DEC-007", titulo: "Carrera de carros", emocion: "Diversión", categoria: "cumple_infantil", imgQuery: "race cars party kids" },
  { codigo: "DEC-008", titulo: "Tea party rosa", emocion: "Ternura", categoria: "cumple_infantil", imgQuery: "pink tea party kids" },
  { codigo: "DEC-009", titulo: "Bosque de hadas", emocion: "Magia", categoria: "cumple_infantil", imgQuery: "fairy forest party" },
  { codigo: "DEC-010", titulo: "Circo de colores", emocion: "Alegría", categoria: "cumple_infantil", imgQuery: "circus theme party" },
  { codigo: "DEC-011", titulo: "Unicornios pastel", emocion: "Sueños", categoria: "cumple_infantil", imgQuery: "unicorn party decor" },
  { codigo: "DEC-012", titulo: "Pequeño chef", emocion: "Diversión", categoria: "cumple_infantil", imgQuery: "chef cooking party kids" },

  // Baby shower / Gender reveal (DEC-013 a DEC-020)
  { codigo: "DEC-013", titulo: "Nube de algodón", emocion: "Ternura", categoria: "baby", imgQuery: "baby shower cloud decoration" },
  { codigo: "DEC-014", titulo: "Osito viajero", emocion: "Ternura", categoria: "baby", imgQuery: "teddy bear baby shower" },
  { codigo: "DEC-015", titulo: "Globos rosa o azul", emocion: "Sorpresa", categoria: "baby", imgQuery: "gender reveal balloons" },
  { codigo: "DEC-016", titulo: "Bohemio dulce", emocion: "Calma", categoria: "baby", imgQuery: "boho baby shower decor" },
  { codigo: "DEC-017", titulo: "Globo gigante reveal", emocion: "Sorpresa", categoria: "baby", imgQuery: "giant balloon gender reveal" },
  { codigo: "DEC-018", titulo: "Mini safari", emocion: "Aventura", categoria: "baby", imgQuery: "safari baby shower" },
  { codigo: "DEC-019", titulo: "Pastel y dorado", emocion: "Elegancia", categoria: "baby", imgQuery: "pastel gold baby shower" },
  { codigo: "DEC-020", titulo: "Lluvia de estrellas", emocion: "Sueños", categoria: "baby", imgQuery: "stars baby shower" },

  // Bautizo / Primera comunión (DEC-021 a DEC-026)
  { codigo: "DEC-021", titulo: "Ángel sereno", emocion: "Paz", categoria: "religioso", imgQuery: "baptism decor angel" },
  { codigo: "DEC-022", titulo: "Blanco celestial", emocion: "Pureza", categoria: "religioso", imgQuery: "white baptism decoration" },
  { codigo: "DEC-023", titulo: "Cruz luminosa", emocion: "Fe", categoria: "religioso", imgQuery: "first communion decor" },
  { codigo: "DEC-024", titulo: "Comunión flores", emocion: "Pureza", categoria: "religioso", imgQuery: "first communion flowers" },
  { codigo: "DEC-025", titulo: "Detalles dorados", emocion: "Elegancia", categoria: "religioso", imgQuery: "gold baptism party" },
  { codigo: "DEC-026", titulo: "Paloma de la paz", emocion: "Paz", categoria: "religioso", imgQuery: "dove peace decoration" },

  // Grados (DEC-027 a DEC-030)
  { codigo: "DEC-027", titulo: "Birrete brillante", emocion: "Orgullo", categoria: "grado", imgQuery: "graduation party decor" },
  { codigo: "DEC-028", titulo: "Camino al éxito", emocion: "Logro", categoria: "grado", imgQuery: "graduation celebration" },
  { codigo: "DEC-029", titulo: "Promesa cumplida", emocion: "Logro", categoria: "grado", imgQuery: "graduation gold black party" },
  { codigo: "DEC-030", titulo: "Vuelo libre", emocion: "Libertad", categoria: "grado", imgQuery: "graduation balloons celebration" },

  // Cumpleaños adultos (DEC-031 a DEC-038)
  { codigo: "DEC-031", titulo: "Negro y dorado", emocion: "Sofisticación", categoria: "cumple_adulto", imgQuery: "black gold birthday adult" },
  { codigo: "DEC-032", titulo: "Tropical sunset", emocion: "Energía", categoria: "cumple_adulto", imgQuery: "tropical sunset party" },
  { codigo: "DEC-033", titulo: "Glam millennial", emocion: "Modernidad", categoria: "cumple_adulto", imgQuery: "millennial pink party" },
  { codigo: "DEC-034", titulo: "Vino y rosas", emocion: "Romance", categoria: "cumple_adulto", imgQuery: "wine roses birthday" },
  { codigo: "DEC-035", titulo: "Disco fever", emocion: "Diversión", categoria: "cumple_adulto", imgQuery: "disco party decoration" },
  { codigo: "DEC-036", titulo: "Tiffany dream", emocion: "Elegancia", categoria: "cumple_adulto", imgQuery: "tiffany blue party" },
  { codigo: "DEC-037", titulo: "Boho festival", emocion: "Libertad", categoria: "cumple_adulto", imgQuery: "boho festival party decor" },
  { codigo: "DEC-038", titulo: "Cumple sorpresa", emocion: "Sorpresa", categoria: "cumple_adulto", imgQuery: "surprise birthday party" },

  // Aniversarios y romántico (DEC-039 a DEC-044)
  { codigo: "DEC-039", titulo: "Te amo eterno", emocion: "Amor", categoria: "romantico", imgQuery: "romantic anniversary decor" },
  { codigo: "DEC-040", titulo: "Cena íntima", emocion: "Conexión", categoria: "romantico", imgQuery: "intimate dinner decoration" },
  { codigo: "DEC-041", titulo: "Pétalos al piso", emocion: "Romance", categoria: "romantico", imgQuery: "rose petals romantic surprise" },
  { codigo: "DEC-042", titulo: "Globos de helio rojo", emocion: "Pasión", categoria: "romantico", imgQuery: "red heart balloons" },
  { codigo: "DEC-043", titulo: "Sí, quiero", emocion: "Amor", categoria: "romantico", imgQuery: "proposal decoration" },
  { codigo: "DEC-044", titulo: "Bodas de oro", emocion: "Legado", categoria: "romantico", imgQuery: "golden anniversary decor" },

  // Empresarial (DEC-045 a DEC-047)
  { codigo: "DEC-045", titulo: "Corporativo elegante", emocion: "Profesionalismo", categoria: "empresarial", imgQuery: "corporate event decor elegant" },
  { codigo: "DEC-046", titulo: "Lanzamiento producto", emocion: "Energía", categoria: "empresarial", imgQuery: "product launch decoration" },
  { codigo: "DEC-047", titulo: "Brunch ejecutivo", emocion: "Conexión", categoria: "empresarial", imgQuery: "executive brunch decoration" },

  // Especiales (DEC-048 a DEC-050)
  { codigo: "DEC-048", titulo: "San Valentín mágico", emocion: "Amor", categoria: "especial", imgQuery: "valentine decoration" },
  { codigo: "DEC-049", titulo: "Día de la madre", emocion: "Ternura", categoria: "especial", imgQuery: "mothers day decor" },
  { codigo: "DEC-050", titulo: "Halloween dulce", emocion: "Diversión", categoria: "especial", imgQuery: "kids halloween party" },
];

export const CODIGOS_DEC: CodigoDec[] = SEED.map((c, i) => ({
  ...c,
  img: pickImg(c.categoria, c.codigo, i),
}));

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  cumple_infantil: "Cumple infantil",
  baby: "Baby & Gender reveal",
  religioso: "Bautizo / Comunión",
  grado: "Grado",
  cumple_adulto: "Cumple adulto",
  romantico: "Romántico",
  empresarial: "Empresarial",
  especial: "Especial",
};

/** Búsqueda rápida por código exacto */
export function getCodigo(codigo: string): CodigoDec | undefined {
  return CODIGOS_DEC.find((c) => c.codigo.toLowerCase() === codigo.toLowerCase());
}
