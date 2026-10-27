/* ===========================================================================
   DATOS DE LOS CHEQUEOS
   Este es el único archivo que hay que tocar para agregar un chequeo nuevo.

   La forma más cómoda de agregarlo es abrir capturar.html, llenar la planilla
   en pantalla y pegar aquí el bloque que genera.

   Notas del modelo:
   - Un valor que no se tomó va en null (se muestra como "—", no cuenta para
     los promedios). NO poner 0: 0 significa "lo intentó y no logró ninguna".
   - doble_pie es { der, izq } — en la planilla el primer número es la DERECHA.
   - kup: 0..N, donde 0 es la "O" de la planilla. null = no se registró.
   - Cada chequeo lista solo a quien asistió ese día.
   =========================================================================== */

const DATOS = {

  alumnos: [
    { id: "michel-cardenas",  nombre: "Michel Cárdenas" },
    { id: "samuel-ojeda",     nombre: "Samuel Ojeda" },
    { id: "larry-ojeda",      nombre: "Larry Ojeda" },
    { id: "david-ortiz",      nombre: "David Ortiz" },
    { id: "jocelyn-mendez",   nombre: "Jocelyn Méndez" },
    { id: "yasmin-solorzano", nombre: "Yasmin Solórzano" },
    { id: "dylan-usche",      nombre: "Dylan Useche" },
    { id: "alberto",          nombre: "Alberto" },
    { id: "niobe",            nombre: "Niobe" },
    { id: "juliano",          nombre: "Juliano" },
    { id: "maria",            nombre: "María" },
    { id: "juan-lugo",        nombre: "Juan Lugo" },
    { id: "gaudis",           nombre: "Gaudis" }
  ],

  chequeos: [

    {
      fecha: "2026-07-27",
      resultados: [
        { alumnoId: "michel-cardenas", kup: null, valores: {
          cintura: 29, silla: 12, palma: 14, flecha: 30, recta: 15, sierra: 18,
          punta: 20, martillo: 25, de_lado: 14, horizontal: 17, barredor: 13,
          vertical: 19, doble_pie: { der: 11, izq: 11 }, gancho: 27 } },

        { alumnoId: "samuel-ojeda", kup: null, valores: {
          cintura: 33, silla: 11, palma: 21, flecha: 27, recta: 14, sierra: 17,
          punta: 20, martillo: 27, de_lado: 13, horizontal: 18, barredor: 10,
          vertical: 17, doble_pie: { der: 11, izq: 11 }, gancho: 23 } },

        { alumnoId: "larry-ojeda", kup: null, valores: {
          cintura: 27, silla: 11, palma: 16, flecha: 25, recta: 13, sierra: 18,
          punta: 17, martillo: 24, de_lado: 14, horizontal: 16, barredor: 8,
          vertical: 15, doble_pie: { der: 11, izq: 11 }, gancho: 23 } },

        { alumnoId: "david-ortiz", kup: null, valores: {
          cintura: 33, silla: 8, palma: 24, flecha: 29, recta: 14, sierra: 18,
          punta: 19, martillo: 28, de_lado: 10, horizontal: 19, barredor: 10,
          vertical: 20, doble_pie: { der: 11, izq: 11 }, gancho: 26 } },

        { alumnoId: "jocelyn-mendez", kup: null, valores: {
          cintura: 30, silla: 9, palma: 13, flecha: 29, recta: 15, sierra: 19,
          punta: 21, martillo: 26, de_lado: 15, horizontal: 19, barredor: 13,
          vertical: 18, doble_pie: { der: 11, izq: 11 }, gancho: 25 } },

        { alumnoId: "yasmin-solorzano", kup: 0, valores: {
          cintura: 23, silla: 7, palma: 16, flecha: 20, recta: 11, sierra: 13,
          punta: 12, martillo: 27, de_lado: 11, horizontal: 13, barredor: 9,
          vertical: 15, doble_pie: { der: 9, izq: 9 }, gancho: 20 } },

        // Dylan no hizo doble pie ese día (celda tachada en la planilla).
        { alumnoId: "dylan-usche", kup: 2, valores: {
          cintura: 32, silla: 10, palma: 16, flecha: 32, recta: 16, sierra: 18,
          punta: 16, martillo: 28, de_lado: 13, horizontal: 14, barredor: 7,
          vertical: 15, doble_pie: null, gancho: 20 } }
      ]
    },

    {
      fecha: "2026-08-24",
      resultados: [
        { alumnoId: "michel-cardenas", kup: 3, valores: {
          cintura: 29, silla: 12, palma: 13, flecha: 33, recta: 15, sierra: 19,
          punta: 21, martillo: 22, de_lado: 15, horizontal: 18, barredor: 12,
          vertical: 18, doble_pie: { der: 11, izq: 12 }, gancho: 26 } },

        { alumnoId: "alberto", kup: 3, valores: {
          cintura: 28, silla: 9, palma: 15, flecha: 29, recta: 16, sierra: 20,
          punta: 19, martillo: 25, de_lado: 11, horizontal: 20, barredor: 12,
          vertical: 17, doble_pie: { der: 10, izq: 10 }, gancho: 23 } },

        { alumnoId: "jocelyn-mendez", kup: 3, valores: {
          cintura: 29, silla: 9, palma: 12, flecha: 31, recta: 15, sierra: 18,
          punta: 19, martillo: 24, de_lado: 15, horizontal: 20, barredor: 13,
          vertical: 18, doble_pie: { der: 10, izq: 11 }, gancho: 24 } },

        { alumnoId: "niobe", kup: 1, valores: {
          cintura: 31, silla: 10, palma: 18, flecha: 28, recta: 14, sierra: 19,
          punta: 19, martillo: 28, de_lado: 16, horizontal: 17, barredor: 10,
          vertical: 17, doble_pie: { der: 10, izq: 10 }, gancho: 26 } },

        { alumnoId: "samuel-ojeda", kup: 2, valores: {
          cintura: 36, silla: 11, palma: 16, flecha: 29, recta: 13, sierra: 17,
          punta: 18, martillo: 25, de_lado: 13, horizontal: 16, barredor: 11,
          vertical: 18, doble_pie: { der: 11, izq: 8 }, gancho: 22 } },

        { alumnoId: "larry-ojeda", kup: 0, valores: {
          cintura: 30, silla: 11, palma: 15, flecha: 27, recta: 13, sierra: 21,
          punta: 16, martillo: 27, de_lado: 14, horizontal: 17, barredor: 8,
          vertical: 18, doble_pie: { der: 10, izq: 11 }, gancho: 23 } }
      ]
    },

    {
      fecha: "2026-09-28",
      resultados: [
        { alumnoId: "michel-cardenas", kup: 3, valores: {
          cintura: 31, silla: 11, palma: 15, flecha: 32, recta: 15, sierra: 18,
          punta: 18, martillo: 22, de_lado: 13, horizontal: 18, barredor: 13,
          vertical: 19, doble_pie: { der: 11, izq: 11 }, gancho: 25 } },

        { alumnoId: "samuel-ojeda", kup: 2, valores: {
          cintura: 33, silla: 10, palma: 15, flecha: 25, recta: 12, sierra: 16,
          punta: 17, martillo: 23, de_lado: 14, horizontal: 19, barredor: 11,
          vertical: 18, doble_pie: { der: 10, izq: 11 }, gancho: 22 } },

        { alumnoId: "juliano", kup: 2, valores: {
          cintura: 29, silla: 10, palma: 23, flecha: 30, recta: 14, sierra: 16,
          punta: 17, martillo: 21, de_lado: 14, horizontal: 16, barredor: 10,
          vertical: 17, doble_pie: { der: 10, izq: 11 }, gancho: 26 } },

        { alumnoId: "larry-ojeda", kup: 0, valores: {
          cintura: 29, silla: 11, palma: 20, flecha: 25, recta: 12, sierra: 18,
          punta: 15, martillo: 24, de_lado: 14, horizontal: 19, barredor: 10,
          vertical: 18, doble_pie: { der: 10, izq: 10 }, gancho: 24 } },

        { alumnoId: "maria", kup: 3, valores: {
          cintura: 29, silla: 9, palma: 17, flecha: 24, recta: 11, sierra: 15,
          punta: 14, martillo: 20, de_lado: 11, horizontal: 10, barredor: 8,
          vertical: 15, doble_pie: { der: 10, izq: 10 }, gancho: 20 } },

        { alumnoId: "yasmin-solorzano", kup: 0, valores: {
          cintura: 24, silla: 6, palma: 22, flecha: 24, recta: 15, sierra: 13,
          punta: 12, martillo: 23, de_lado: 9, horizontal: 12, barredor: 9,
          vertical: 14, doble_pie: { der: 9, izq: 7 }, gancho: 18 } },

        { alumnoId: "dylan-usche", kup: 2, valores: {
          cintura: 28, silla: 9, palma: 19, flecha: 28, recta: 13, sierra: 16,
          punta: 14, martillo: 23, de_lado: 13, horizontal: 15, barredor: 9,
          vertical: 14, doble_pie: { der: 9, izq: 9 }, gancho: 21 } },

        { alumnoId: "alberto", kup: 3, valores: {
          cintura: 26, silla: 9, palma: 19, flecha: 28, recta: 15, sierra: 17,
          punta: 19, martillo: 23, de_lado: 9, horizontal: 19, barredor: 12,
          vertical: 17, doble_pie: { der: 10, izq: 10 }, gancho: 21 } },

        { alumnoId: "jocelyn-mendez", kup: 3, valores: {
          cintura: 22, silla: 7, palma: 14, flecha: 26, recta: 14, sierra: 16,
          punta: 18, martillo: 20, de_lado: 13, horizontal: 19, barredor: 12,
          vertical: 17, doble_pie: { der: 11, izq: 10 }, gancho: 22 } }
      ]
    },

    {
      fecha: "2026-10-26",
      resultados: [
        { alumnoId: "juan-lugo", kup: 3, valores: {
          cintura: 27, silla: 11, palma: 19, flecha: 29, recta: 12, sierra: 17,
          punta: 16, martillo: 22, de_lado: 11, horizontal: 18, barredor: 12,
          vertical: 16, doble_pie: { der: 10, izq: 10 }, gancho: 21 } },

        { alumnoId: "maria", kup: 3, valores: {
          cintura: 29, silla: 10, palma: 16, flecha: 23, recta: 12, sierra: 15,
          punta: 17, martillo: 26, de_lado: 11, horizontal: 13, barredor: 10,
          vertical: 15, doble_pie: { der: 10, izq: 11 }, gancho: 21 } },

        { alumnoId: "yasmin-solorzano", kup: 0, valores: {
          cintura: 29, silla: 7, palma: 20, flecha: 20, recta: 11, sierra: 14,
          punta: 13, martillo: 24, de_lado: 11, horizontal: 14, barredor: 8,
          vertical: 14, doble_pie: { der: 9, izq: 9 }, gancho: 19 } },

        { alumnoId: "samuel-ojeda", kup: 2, valores: {
          cintura: 31, silla: 10, palma: 18, flecha: 25, recta: 13, sierra: 18,
          punta: 18, martillo: 26, de_lado: 14, horizontal: 20, barredor: 12,
          vertical: 17, doble_pie: { der: 11, izq: 11 }, gancho: 24 } },

        { alumnoId: "michel-cardenas", kup: 3, valores: {
          cintura: 33, silla: 10, palma: 13, flecha: 33, recta: 15, sierra: 18,
          punta: 20, martillo: 24, de_lado: 14, horizontal: 19, barredor: 14,
          vertical: 18, doble_pie: { der: 11, izq: 11 }, gancho: 27 } },

        { alumnoId: "alberto", kup: 3, valores: {
          cintura: 31, silla: 10, palma: 17, flecha: 29, recta: 15, sierra: 18,
          punta: 19, martillo: 24, de_lado: 10, horizontal: 18, barredor: 12,
          vertical: 17, doble_pie: { der: 10, izq: 10 }, gancho: 22 } },

        { alumnoId: "jocelyn-mendez", kup: 3, valores: {
          cintura: 27, silla: 10, palma: 14, flecha: 30, recta: 15, sierra: 17,
          punta: 21, martillo: 23, de_lado: 14, horizontal: 20, barredor: 14,
          vertical: 18, doble_pie: { der: 11, izq: 11 }, gancho: 25 } },

        { alumnoId: "larry-ojeda", kup: 0, valores: {
          cintura: 32, silla: 11, palma: 18, flecha: 29, recta: 14, sierra: 20,
          punta: 17, martillo: 26, de_lado: 14, horizontal: 18, barredor: 11,
          vertical: 19, doble_pie: { der: 11, izq: 11 }, gancho: 26 } },

        { alumnoId: "dylan-usche", kup: 2, valores: {
          cintura: 31, silla: 9, palma: 18, flecha: 30, recta: 14, sierra: 17,
          punta: 16, martillo: 25, de_lado: 13, horizontal: 17, barredor: 9,
          vertical: 12, doble_pie: { der: 10, izq: 9 }, gancho: 22 } },

        // Gaudis no hizo doble pie ni gancho ese día (celdas vacías en la planilla).
        { alumnoId: "gaudis", kup: 0, valores: {
          cintura: 25, silla: 13, palma: 16, flecha: 21, recta: 14, sierra: 14,
          punta: 13, martillo: 21, de_lado: 10, horizontal: 14, barredor: 9,
          vertical: 14, doble_pie: null, gancho: null } }
      ]
    }

  ]
};
