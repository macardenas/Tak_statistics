/* Catálogo de ejercicios, agrupación y metas.
   Esto casi nunca cambia. Los datos de cada chequeo van en datos.js. */

const CONFIG = {
  titulo: "Chequeo físico",
  duracionSegundos: 10,

  // Objetivos de práctica diaria. Son informativos: NO son la meta del test
  // de 10 segundos, así que no se usan para calcular porcentajes de logro.
  metas: { cintura: 200, punos: 50, patadas: 50 },

  /* Dentro de cada bloque se respeta el orden en que aparecen en la planilla,
     para que cotejar contra el papel siga siendo fácil. */
  grupos: [
    { id: "tronco",  nombre: "Tronco",  ejercicios: ["cintura", "silla"] },
    { id: "punos",   nombre: "Puños",   ejercicios: ["palma", "flecha", "sierra", "martillo", "horizontal", "vertical", "gancho"] },
    { id: "patadas", nombre: "Patadas", ejercicios: ["recta", "punta", "de_lado", "barredor", "doble_pie"] }
  ],

  ejercicios: {
    cintura:    { nombre: "Cintura",    corto: "Cintura" },
    silla:      { nombre: "Silla",      corto: "Silla" },
    palma:      { nombre: "Palma",      corto: "Palma" },
    flecha:     { nombre: "Flecha",     corto: "Flecha" },
    recta:      { nombre: "Recta",      corto: "Recta" },
    sierra:     { nombre: "Sierra",     corto: "Sierra" },
    punta:      { nombre: "Punta",      corto: "Punta" },
    martillo:   { nombre: "Martillo",   corto: "Martillo" },
    de_lado:    { nombre: "De lado",    corto: "De lado" },
    horizontal: { nombre: "Horizontal", corto: "Horiz." },
    barredor:   { nombre: "Barredor",   corto: "Barred." },
    vertical:   { nombre: "Vertical",   corto: "Vert." },
    doble_pie:  { nombre: "Doble pie",  corto: "Doble pie", bilateral: true },
    gancho:     { nombre: "Gancho",     corto: "Gancho" }
  },

  // El KIP se registra en romanos en la planilla. 0 = "O".
  kupRomano: ["O", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
};

/* Orden de análisis: los 14 ejercicios agrupados por bloque. Se deriva de
   CONFIG.grupos para que no haya dos listas que puedan desincronizarse. */
CONFIG.ordenEjercicios = CONFIG.grupos.flatMap(function (g) { return g.ejercicios; });

/* Orden físico de las columnas en la planilla de papel. Los bloques están
   intercalados en el papel, así que este orden NO coincide con el de análisis.
   Se usa solo en la pantalla de captura: al transcribir de la hoja conviene ir
   de izquierda a derecha en el mismo orden que el papel, o se cuelan errores. */
CONFIG.ordenPlanilla = [
  "cintura", "silla", "palma", "flecha", "recta", "sierra", "punta",
  "martillo", "de_lado", "horizontal", "barredor", "vertical", "doble_pie", "gancho"
];

/* A qué bloque pertenece un ejercicio. */
CONFIG.grupoDe = function (ejercicioId) {
  return CONFIG.grupos.find(function (g) {
    return g.ejercicios.indexOf(ejercicioId) !== -1;
  }) || null;
};
