/**
 * Catálogo de códigos DEC poblado con las fotografías reales de Big Bang
 * en `public/decoraciones/<categoria>/<archivo>`. Cliente entregó 54 fotos
 * organizadas en 6 categorías nuevas:
 *
 *   01 infantiles  · Para los más chicos (princesas, superhéroes, granja…)
 *   02 elegantes   · Cumpleaños con clase (metalizados, oro, plata, rose gold)
 *   03 tematicos   · Hobbies, deportes y temáticas a medida
 *   04 romanticos  · Aniversarios, amor y propuestas
 *   05 anchetas    · Cajas y anchetas sorpresa (peluches, dulces, snacks)
 *   06 minis       · Minis y centros de mesa (arreglos pequeños / express)
 */

export type Categoria =
  | "infantiles"
  | "elegantes"
  | "tematicos"
  | "romanticos"
  | "anchetas"
  | "minis";

export interface CodigoDec {
  codigo: string;
  titulo: string;
  emocion: string;
  categoria: Categoria;
  /** Ruta pública absoluta (servida desde /public). */
  img: string;
  /** Alt SEO accesible. */
  alt: string;
}

const BASE = "/decoraciones";

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  infantiles: "Cumples infantiles",
  elegantes: "Cumpleaños elegantes",
  tematicos: "Temáticos & hobbies",
  romanticos: "Amor & aniversarios",
  anchetas: "Anchetas & cajas sorpresa",
  minis: "Minis & centros de mesa",
};

/** Microcopy de marketing por categoría (se muestra debajo del nombre). */
export const CATEGORIA_MICROCOPY: Record<Categoria, string> = {
  infantiles: "el más pedido",
  elegantes: "metalizados, oro y rose gold",
  tematicos: "su pasión, su tema",
  romanticos: "el favorito de las parejas",
  anchetas: "peluches, dulces y sorpresas",
  minis: "rápido y a domicilio",
};

export const CODIGOS_DEC: CodigoDec[] = [
  /* ─── 01 · Infantiles ──────────────────────────────────────── */
  {
    codigo: "DEC-001",
    titulo: "Princesa neón",
    emocion: "Magia",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hija-cumpleanos-burbuja-princesa-neon.png`,
    alt: "Burbuja de princesa con luces neón para cumpleaños de niña",
  },
  {
    codigo: "DEC-002",
    titulo: "9 años en fucsia",
    emocion: "Ternura",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hija-cumpleanos-numero-9-flores-fucsia.jpg`,
    alt: "Decoración número 9 con flores fucsia para cumpleaños",
  },
  {
    codigo: "DEC-003",
    titulo: "Primer cumple",
    emocion: "Ternura",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hijo-cumpleanos-baby-eithan-1.png`,
    alt: "Decoración primer cumpleaños con globos pastel",
  },
  {
    codigo: "DEC-004",
    titulo: "La granja feliz",
    emocion: "Aventura",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hijo-cumpleanos-granja-vaca-gallo.jpg`,
    alt: "Decoración de granja con vaca y gallo para cumpleaños infantil",
  },
  {
    codigo: "DEC-005",
    titulo: "Plaza Sésamo",
    emocion: "Diversión",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hijo-cumpleanos-plaza-sesamo-david.jpg`,
    alt: "Decoración temática Plaza Sésamo para cumpleaños",
  },
  {
    codigo: "DEC-006",
    titulo: "Spider-Man",
    emocion: "Aventura",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hijo-cumpleanos-spiderman-3.jpg`,
    alt: "Bouquet temático de Spider-Man para cumpleaños de niño",
  },
  {
    codigo: "DEC-007",
    titulo: "Harry Potter",
    emocion: "Magia",
    categoria: "infantiles",
    img: `${BASE}/infantiles/hijo-hija-cumpleanos-harry-potter-lechuza.jpg`,
    alt: "Decoración Harry Potter con lechuza para cumpleaños",
  },

  /* ─── 02 · Elegantes ───────────────────────────────────────── */
  {
    codigo: "DEC-008",
    titulo: "HBD corona plata",
    emocion: "Sofisticación",
    categoria: "elegantes",
    img: `${BASE}/elegantes/alguien-especial-cumpleanos-hbd-negro-corona-plata.jpg`,
    alt: "Bouquet HBD en negro y plata con corona",
  },
  {
    codigo: "DEC-009",
    titulo: "Rojo y plata helio",
    emocion: "Pasión",
    categoria: "elegantes",
    img: `${BASE}/elegantes/alguien-especial-cumpleanos-hbd-rojo-plata-helio.jpg`,
    alt: "Decoración rojo y plata con globos de helio",
  },
  {
    codigo: "DEC-010",
    titulo: "Rojo y oro",
    emocion: "Elegancia",
    categoria: "elegantes",
    img: `${BASE}/elegantes/alguien-especial-cumpleanos-migue-rojo-oro.jpg`,
    alt: "Bouquet personalizado en rojo y oro",
  },
  {
    codigo: "DEC-011",
    titulo: "20 con corona",
    emocion: "Elegancia",
    categoria: "elegantes",
    img: `${BASE}/elegantes/alguien-especial-cumpleanos-numero-20-corona.jpg`,
    alt: "Bouquet número 20 con corona dorada",
  },
  {
    codigo: "DEC-012",
    titulo: "Corona fucsia",
    emocion: "Sorpresa",
    categoria: "elegantes",
    img: `${BASE}/elegantes/alguien-especial-sorprender-sin-motivo-corona-fucsia.jpg`,
    alt: "Bouquet con corona fucsia para sorpresa sin motivo",
  },
  {
    codigo: "DEC-013",
    titulo: "24 rose gold",
    emocion: "Modernidad",
    categoria: "elegantes",
    img: `${BASE}/elegantes/hijo-hija-cumpleanos-numero-24-rose-gold.jpg`,
    alt: "Bouquet número 24 en rose gold",
  },
  {
    codigo: "DEC-014",
    titulo: "Corona rosa para mamá",
    emocion: "Cariño",
    categoria: "elegantes",
    img: `${BASE}/elegantes/mama-cumpleanos-hbd-corona-rosa.jpg`,
    alt: "Decoración HBD con corona rosa para mamá",
  },
  {
    codigo: "DEC-015",
    titulo: "99 años de leyenda",
    emocion: "Legado",
    categoria: "elegantes",
    img: `${BASE}/elegantes/mama-papa-cumpleanos-abuela-99-oro-rosa.png`,
    alt: "Bouquet 99 años en oro rosa para abuela",
  },
  {
    codigo: "DEC-016",
    titulo: "57 plata y azul",
    emocion: "Sofisticación",
    categoria: "elegantes",
    img: `${BASE}/elegantes/mama-papa-cumpleanos-don-carlos-57-plata-azul.png`,
    alt: "Bouquet 57 en plata y azul para papá",
  },
  {
    codigo: "DEC-017",
    titulo: "Mariposas rose gold",
    emocion: "Ternura",
    categoria: "elegantes",
    img: `${BASE}/elegantes/mama-papa-cumpleanos-tia-rosa-rose-gold-mariposas.jpg`,
    alt: "Bouquet con mariposas rose gold para cumpleaños",
  },
  {
    codigo: "DEC-018",
    titulo: "Treinta elegante",
    emocion: "Modernidad",
    categoria: "elegantes",
    img: `${BASE}/elegantes/pareja-alguien-especial-cumpleanos-elegante-30.png`,
    alt: "Bouquet elegante para 30 años",
  },
  {
    codigo: "DEC-019",
    titulo: "Graduación 25",
    emocion: "Orgullo",
    categoria: "elegantes",
    img: `${BASE}/elegantes/pareja-alguien-especial-cumpleanos-graduacion-25.png`,
    alt: "Bouquet de graduación y 25 años",
  },
  {
    codigo: "DEC-020",
    titulo: "35 oro rosa burbuja",
    emocion: "Elegancia",
    categoria: "elegantes",
    img: `${BASE}/elegantes/pareja-cumpleanos-35-oro-rosa-burbuja.jpg`,
    alt: "Burbuja para 35 años en oro rosa",
  },
  {
    codigo: "DEC-021",
    titulo: "Plata y rojo",
    emocion: "Sofisticación",
    categoria: "elegantes",
    img: `${BASE}/elegantes/pareja-cumpleanos-hbd-plata-rojo.jpg`,
    alt: "Bouquet HBD plata y rojo para pareja",
  },

  /* ─── 03 · Temáticos ───────────────────────────────────────── */
  {
    codigo: "DEC-022",
    titulo: "Casino night",
    emocion: "Diversión",
    categoria: "tematicos",
    img: `${BASE}/tematicos/alguien-especial-cumpleanos-tematica-casino.jpg`,
    alt: "Decoración temática casino con cartas y fichas",
  },
  {
    codigo: "DEC-023",
    titulo: "Fiesta mexicana",
    emocion: "Energía",
    categoria: "tematicos",
    img: `${BASE}/tematicos/alguien-especial-cumpleanos-tematica-fiesta-mexicana.png`,
    alt: "Decoración fiesta mexicana con sombreros y colores vivos",
  },
  {
    codigo: "DEC-024",
    titulo: "Grado negro y dorado",
    emocion: "Orgullo",
    categoria: "tematicos",
    img: `${BASE}/tematicos/alguien-especial-graduacion-birrete-negro-dorado.png`,
    alt: "Decoración de grado en negro y dorado con birrete",
  },
  {
    codigo: "DEC-025",
    titulo: "Fútbol América",
    emocion: "Pasión",
    categoria: "tematicos",
    img: `${BASE}/tematicos/hijo-cumpleanos-futbol-america-pepsi-9.jpg`,
    alt: "Decoración temática fútbol América de Cali",
  },
  {
    codigo: "DEC-026",
    titulo: "Sus hobbies favoritos",
    emocion: "Personalidad",
    categoria: "tematicos",
    img: `${BASE}/tematicos/pareja-alguien-especial-cumpleanos-hobbies.png`,
    alt: "Decoración personalizada con hobbies favoritos",
  },

  /* ─── 04 · Románticos ──────────────────────────────────────── */
  {
    codigo: "DEC-027",
    titulo: "Oso Ruby de amor",
    emocion: "Amor",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-aniversario-amor-oso-ruby.png`,
    alt: "Decoración romántica con oso Ruby y globos de amor",
  },
  {
    codigo: "DEC-028",
    titulo: "Aniversario 35",
    emocion: "Legado",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-aniversario-cumple-35-rose-gold-amor.jpg`,
    alt: "Decoración aniversario 35 en rose gold con tema amor",
  },
  {
    codigo: "DEC-029",
    titulo: "Dúo verde y blanco",
    emocion: "Calma",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-aniversario-duo-burbujas-verde-blanco.png`,
    alt: "Dúo de burbujas verdes y blancas para aniversario",
  },
  {
    codigo: "DEC-030",
    titulo: "Burbuja caja negra",
    emocion: "Sorpresa",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-cumpleanos-burbuja-caja-negra.jpg`,
    alt: "Burbuja sorpresa en caja negra para pareja",
  },
  {
    codigo: "DEC-031",
    titulo: "Anillo de compromiso",
    emocion: "Promesa",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-otra-ocasion-anillo-compromiso-plata.jpg`,
    alt: "Decoración para propuesta de compromiso con tema anillo",
  },
  {
    codigo: "DEC-032",
    titulo: "Bride helio rosa",
    emocion: "Romance",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-otra-ocasion-bride-helio-rosa.jpg`,
    alt: "Decoración para novia con globos de helio rosa",
  },
  {
    codigo: "DEC-033",
    titulo: "Propuesta rojo intenso",
    emocion: "Pasión",
    categoria: "romanticos",
    img: `${BASE}/romanticos/pareja-otra-ocasion-propuesta-matrimonio-rojo.jpg`,
    alt: "Decoración para propuesta de matrimonio en rojo intenso",
  },

  /* ─── 05 · Anchetas ────────────────────────────────────────── */
  {
    codigo: "DEC-034",
    titulo: "Caja peluches bosque",
    emocion: "Ternura",
    categoria: "anchetas",
    img: `${BASE}/anchetas/alguien-especial-sorprender-sin-motivo-caja-peluches-bosque.png`,
    alt: "Caja sorpresa con peluches y tema bosque",
  },
  {
    codigo: "DEC-035",
    titulo: "Peluche y chocolates",
    emocion: "Cariño",
    categoria: "anchetas",
    img: `${BASE}/anchetas/hijo-cumpleanos-peluche-chocolates-burbuja.jpg`,
    alt: "Ancheta con peluche, chocolates y burbuja",
  },
  {
    codigo: "DEC-036",
    titulo: "Mono arcoíris",
    emocion: "Diversión",
    categoria: "anchetas",
    img: `${BASE}/anchetas/hijo-hija-cumpleanos-caja-regalo-mono-arcoiris.png`,
    alt: "Caja regalo con mono arcoíris para cumpleaños infantil",
  },
  {
    codigo: "DEC-037",
    titulo: "Ancheta sorpresa",
    emocion: "Sorpresa",
    categoria: "anchetas",
    img: `${BASE}/anchetas/mama-papa-pareja-cumpleanos-sorpresa-ancheta.jpg`,
    alt: "Ancheta sorpresa para cumpleaños familiar",
  },
  {
    codigo: "DEC-038",
    titulo: "Ancheta cervecera",
    emocion: "Complicidad",
    categoria: "anchetas",
    img: `${BASE}/anchetas/pareja-aniversario-ancheta-cerveza-heineken.jpg`,
    alt: "Ancheta de aniversario con cerveza Heineken",
  },

  /* ─── 06 · Minis & centros ─────────────────────────────────── */
  {
    codigo: "DEC-039",
    titulo: "Burbuja rosa y oro",
    emocion: "Ternura",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-cami-rosa-oro.png`,
    alt: "Mini burbuja personalizada en rosa y oro",
  },
  {
    codigo: "DEC-040",
    titulo: "Burbuja dorada",
    emocion: "Elegancia",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-elegante-dorado.jpg`,
    alt: "Mini burbuja elegante dorada",
  },
  {
    codigo: "DEC-041",
    titulo: "Negra y dorada",
    emocion: "Sofisticación",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-elegante-negro-dorado.jpg`,
    alt: "Mini burbuja elegante en negro y dorado",
  },
  {
    codigo: "DEC-042",
    titulo: "Burbuja Isabel",
    emocion: "Cariño",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-isabel-dorada.jpg`,
    alt: "Mini burbuja Isabel en dorado",
  },
  {
    codigo: "DEC-043",
    titulo: "Lila con estrellas",
    emocion: "Sueños",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-lila-estrellas.jpg`,
    alt: "Mini burbuja lila con estrellas",
  },
  {
    codigo: "DEC-044",
    titulo: "Mariposas rose gold",
    emocion: "Ternura",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-mariposas-rose-gold.jpg`,
    alt: "Mini burbuja con mariposas en rose gold",
  },
  {
    codigo: "DEC-045",
    titulo: "Rosa Daniela",
    emocion: "Cariño",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-rosa-daniela.jpg`,
    alt: "Mini burbuja rosa personalizada Daniela",
  },
  {
    codigo: "DEC-046",
    titulo: "Rosa con lettering",
    emocion: "Detalle",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-rosa-lettering.png`,
    alt: "Mini burbuja rosa con lettering personalizado",
  },
  {
    codigo: "DEC-047",
    titulo: "Verde metalizado",
    emocion: "Frescura",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-verde-metalizado.jpg`,
    alt: "Mini burbuja en verde metalizado",
  },
  {
    codigo: "DEC-048",
    titulo: "Centro de mesa 42",
    emocion: "Elegancia",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-centro-mesa-42.png`,
    alt: "Centro de mesa para cumpleaños 42",
  },
  {
    codigo: "DEC-049",
    titulo: "Dúo personalizado",
    emocion: "Detalle",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-duo-burbujas-personalizadas.jpg`,
    alt: "Dúo de burbujas personalizadas",
  },
  {
    codigo: "DEC-050",
    titulo: "Estrella lila",
    emocion: "Magia",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-cumpleanos-estrella-lila.jpg`,
    alt: "Mini decoración con estrella lila",
  },
  {
    codigo: "DEC-051",
    titulo: "Burbuja despedida",
    emocion: "Emoción",
    categoria: "minis",
    img: `${BASE}/minis/alguien-especial-otra-ocasion-burbuja-despedida-pao.png`,
    alt: "Mini burbuja para despedida personalizada",
  },
  {
    codigo: "DEC-052",
    titulo: "Burbuja morada Sofi",
    emocion: "Sorpresa",
    categoria: "minis",
    img: `${BASE}/minis/hija-sorprender-sin-motivo-burbuja-morada-sofi.jpg`,
    alt: "Mini burbuja morada personalizada Sofi",
  },
  {
    codigo: "DEC-053",
    titulo: "Mini infantil",
    emocion: "Diversión",
    categoria: "minis",
    img: `${BASE}/minis/hijo-cumpleanos-mini-infantil-3.png`,
    alt: "Mini decoración infantil para 3 años",
  },
  {
    codigo: "DEC-054",
    titulo: "Mini express",
    emocion: "Rapidez",
    categoria: "minis",
    img: `${BASE}/minis/pareja-alguien-especial-cumpleanos-mini-express.png`,
    alt: "Mini decoración express para cumpleaños",
  },
];

/** Búsqueda rápida por código exacto. */
export function getCodigo(codigo: string): CodigoDec | undefined {
  return CODIGOS_DEC.find(
    (c) => c.codigo.toLowerCase() === codigo.toLowerCase()
  );
}

/** Devuelve los códigos de una categoría dada. */
export function getByCategoria(cat: Categoria): CodigoDec[] {
  return CODIGOS_DEC.filter((c) => c.categoria === cat);
}

/** Devuelve la primera foto representativa de cada categoría (para covers). */
export function getCover(cat: Categoria): string {
  const COVERS: Record<Categoria, string> = {
    infantiles: `${BASE}/infantiles/hija-cumpleanos-burbuja-princesa-neon.png`,
    elegantes: `${BASE}/elegantes/pareja-cumpleanos-35-oro-rosa-burbuja.jpg`,
    tematicos: `${BASE}/tematicos/alguien-especial-cumpleanos-tematica-fiesta-mexicana.png`,
    romanticos: `${BASE}/romanticos/pareja-aniversario-amor-oso-ruby.png`,
    anchetas: `${BASE}/anchetas/hijo-hija-cumpleanos-caja-regalo-mono-arcoiris.png`,
    minis: `${BASE}/minis/alguien-especial-cumpleanos-burbuja-mariposas-rose-gold.jpg`,
  };
  return COVERS[cat];
}
