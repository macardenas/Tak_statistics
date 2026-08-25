/* Gráficas de línea en SVG, sin dependencias.
   Devuelven una cadena de markup lista para inyectar.
   Los colores salen de variables CSS, así funcionan en claro y en oscuro. */

const Grafico = (function () {

  var ANCHO = 320, ALTO = 120;
  var M = { arriba: 14, derecha: 10, abajo: 24, izquierda: 30 };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* Escala vertical con un poco de aire arriba y abajo. Cuando todos los
     valores son iguales (muy posible con dos chequeos) se fabrica un rango
     artificial para que la línea quede centrada y no en el borde. */
  function rango(valores) {
    var min = Math.min.apply(null, valores);
    var max = Math.max.apply(null, valores);
    if (min === max) return { min: Math.max(0, min - 2), max: max + 2 };
    var aire = (max - min) * 0.2;
    return { min: Math.max(0, min - aire), max: max + aire };
  }

  /* series: [{ nombre, puntos: [{fecha, valor}], clase }]
     Todas las series comparten eje X (las fechas de la primera que las tenga)
     y eje Y, para que se puedan comparar entre sí. */
  function linea(series, opciones) {
    opciones = opciones || {};
    series = (series || []).filter(function (s) { return s.puntos && s.puntos.length; });
    if (!series.length) return '<p class="sin-datos">Sin datos suficientes</p>';

    // Eje X: la unión ordenada de todas las fechas presentes.
    var fechas = [];
    series.forEach(function (s) {
      s.puntos.forEach(function (p) {
        if (fechas.indexOf(p.fecha) === -1) fechas.push(p.fecha);
      });
    });
    fechas.sort();

    var todos = series.reduce(function (acc, s) {
      return acc.concat(s.puntos.map(function (p) { return p.valor; }));
    }, []);
    var r = rango(todos);

    var anchoUtil = ANCHO - M.izquierda - M.derecha;
    var altoUtil = ALTO - M.arriba - M.abajo;

    function x(fecha) {
      var i = fechas.indexOf(fecha);
      if (fechas.length === 1) return M.izquierda + anchoUtil / 2;
      return M.izquierda + (i / (fechas.length - 1)) * anchoUtil;
    }
    function y(valor) {
      var t = (valor - r.min) / (r.max - r.min);
      return M.arriba + (1 - t) * altoUtil;
    }

    var partes = [];
    partes.push('<svg class="grafico" viewBox="0 0 ' + ANCHO + ' ' + ALTO +
                '" role="img" aria-label="' + esc(opciones.titulo || "Evolución") + '">');

    // Rejilla horizontal con etiquetas en el eje Y. Se descartan las marcas que
    // al redondear darían el mismo número: con rangos chicos (muy habitual en
    // estas pruebas) si no, sale un eje repetido tipo "14 / 14 / 13".
    var vistas = {};
    [r.max, (r.min + r.max) / 2, r.min].forEach(function (v) {
      var etiqueta = Math.round(v);
      if (vistas[etiqueta]) return;
      vistas[etiqueta] = true;
      var py = y(v);
      partes.push('<line class="g-rejilla" x1="' + M.izquierda + '" y1="' + py.toFixed(1) +
                  '" x2="' + (ANCHO - M.derecha) + '" y2="' + py.toFixed(1) + '"/>');
      partes.push('<text class="g-eje" x="' + (M.izquierda - 6) + '" y="' + (py + 3.5).toFixed(1) +
                  '" text-anchor="end">' + etiqueta + '</text>');
    });

    // Etiquetas del eje X: solo las que caben sin pisarse. Se cuenta hacia atrás
    // desde la última para que la fecha más reciente salga siempre rotulada,
    // que es la que se mira primero.
    var ANCHO_ETIQUETA = 34;   // "27 jul" a 8.5px, más separación
    var caben = Math.max(2, Math.floor(anchoUtil / ANCHO_ETIQUETA));
    var paso = Math.ceil(fechas.length / caben);
    fechas.forEach(function (f, i) {
      if ((fechas.length - 1 - i) % paso !== 0) return;
      partes.push('<text class="g-eje" x="' + x(f).toFixed(1) + '" y="' + (ALTO - 8) +
                  '" text-anchor="middle">' + esc(Calc.fechaCorta(f)) + '</text>');
    });

    // Con muchas fechas los puntos se amontonan y tapan la línea: se achican y,
    // pasadas ~24, se dejan solo los extremos.
    var radio = fechas.length > 8 ? 2.4 : 3.5;
    var soloExtremos = fechas.length > 24;

    // Una línea con sus puntos por serie.
    series.forEach(function (s, idx) {
      var clase = s.clase || ("g-serie-" + (idx + 1));
      var d = s.puntos.map(function (p, i) {
        return (i === 0 ? "M" : "L") + x(p.fecha).toFixed(1) + " " + y(p.valor).toFixed(1);
      }).join(" ");
      partes.push('<path class="g-linea ' + clase + '" d="' + d + '"/>');
      s.puntos.forEach(function (p, i) {
        if (soloExtremos && i !== 0 && i !== s.puntos.length - 1) return;
        partes.push('<circle class="g-punto ' + clase + '" cx="' + x(p.fecha).toFixed(1) +
                    '" cy="' + y(p.valor).toFixed(1) + '" r="' + radio + '"><title>' +
                    esc(Calc.fechaCorta(p.fecha) + ": " + p.valor) + '</title></circle>');
      });
      // El último valor se rotula: es el dato que más se mira.
      var ult = s.puntos[s.puntos.length - 1];
      partes.push('<text class="g-valor ' + clase + '" x="' + (x(ult.fecha) + 7).toFixed(1) +
                  '" y="' + (y(ult.valor) - 6).toFixed(1) + '" text-anchor="end">' +
                  ult.valor + '</text>');
    });

    partes.push("</svg>");

    // Leyenda solo cuando hay más de una serie (el caso de doble pie).
    if (series.length > 1) {
      partes.push('<div class="g-leyenda">' + series.map(function (s, idx) {
        return '<span class="' + (s.clase || ("g-serie-" + (idx + 1))) + '">' +
               esc(s.nombre) + "</span>";
      }).join("") + "</div>");
    }

    return partes.join("");
  }

  return { linea: linea };
})();
