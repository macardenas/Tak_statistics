/* Render de las tres vistas y navegación por hash.
   El hash es la única fuente de verdad del estado, así cualquier pantalla
   se puede compartir por enlace y el botón atrás del navegador funciona. */

(function () {

  var $vista = null;
  var $pestanas = null;

  /* --- utilidades ------------------------------------------------------- */

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  /* Marca de variación: ▲ +3 / ▼ -2 / = sin cambio / nada si no hay con qué
     comparar. Es la información que la planilla de papel no puede dar. */
  function marcaDelta(d) {
    if (d === null) return '<span class="delta delta-nulo"></span>';
    if (d === 0) return '<span class="delta delta-igual" title="Sin cambio">=</span>';
    var signo = d > 0 ? "+" : "";
    var clase = d > 0 ? "delta-sube" : "delta-baja";
    var flecha = d > 0 ? "▲" : "▼";
    return '<span class="delta ' + clase + '">' + flecha + " " + signo + d + "</span>";
  }

  /* --- navegación ------------------------------------------------------- */

  /* #/general | #/fecha/2026-08-24 | #/individual/michel-cardenas */
  function rutaActual() {
    var h = location.hash.replace(/^#\/?/, "");
    if (!h) return { vista: "general" };
    var p = h.split("/");
    if (p[0] === "fecha") return { vista: "fecha", fecha: p[1] || Calc.fechasOrdenadas()[0] };
    if (p[0] === "individual") return { vista: "individual", alumnoId: p[1] || null };
    return { vista: "general" };
  }

  function ir(hash) { location.hash = hash; }

  /* --- vista 1: general por alumno (la que abre por defecto) ------------- */

  function vistaGeneral() {
    var alumnos = Calc.alumnosConDatos();

    var tarjetas = alumnos.map(function (a) {
      var h = Calc.ultimoYPrevio(a.id);
      if (!h.ultimo) return "";

      var res = h.ultimo.resultado;
      var prev = h.previo ? h.previo.resultado : null;
      var kup = Calc.kupTexto(res.kup);

      var filas = CONFIG.grupos.map(function (g) {
        var tot = Calc.totalGrupo(res, g.id);
        var totPrev = prev ? Calc.totalGrupo(prev, g.id) : null;
        // Solo se comparan totales medidos sobre los mismos ejercicios;
        // si en una fecha faltó una medición, la resta no significaría nada.
        var deltaTot = (tot.total !== null && totPrev && totPrev.total !== null &&
                        tot.contados === totPrev.contados)
          ? tot.total - totPrev.total : null;

        var celdas = g.ejercicios.map(function (e) {
          var v = Calc.valorDe(res, e);
          var d = prev ? Calc.delta(res, prev, e) : null;
          var claseEj = "ejercicio" + (Calc.esBilateral(e) ? " ejercicio-doble" : "");
          return '<div class="' + claseEj + '">' +
                   '<span class="ej-nombre">' + esc(CONFIG.ejercicios[e].nombre) + "</span>" +
                   '<span class="ej-valor">' + esc(Calc.textoValor(v, e)) + "</span>" +
                   marcaDelta(d) +
                 "</div>";
        }).join("");

        return '<div class="grupo grupo-' + g.id + '">' +
                 '<div class="grupo-cab">' +
                   "<h4>" + esc(g.nombre) + "</h4>" +
                   '<span class="grupo-total">' +
                     (tot.total === null ? "—" : tot.total) +
                     (tot.parcial ? '<span class="parcial" title="Faltan mediciones">*</span>' : "") +
                     " " + marcaDelta(deltaTot) +
                   "</span>" +
                 "</div>" +
                 '<div class="ejercicios">' + celdas + "</div>" +
               "</div>";
      }).join("");

      var pie = h.totalChequeos === 1
        ? '<span class="etiqueta etiqueta-nuevo">primer chequeo</span>'
        : '<span class="comparado">vs. ' + esc(Calc.fechaCorta(h.previo.fecha)) + "</span>";

      return '<article class="tarjeta" data-alumno="' + esc(a.id) + '" tabindex="0" role="link">' +
               '<header class="tarjeta-cab">' +
                 "<h3>" + esc(a.nombre) + "</h3>" +
                 '<div class="tarjeta-meta">' +
                   (kup ? '<span class="kup" title="Grado">KIP ' + esc(kup) + "</span>" : "") +
                   '<span class="fecha">' + esc(Calc.fechaCorta(h.ultimo.fecha)) + "</span>" +
                 "</div>" +
               "</header>" +
               filas +
               '<footer class="tarjeta-pie">' + pie +
                 '<span class="ver-mas">Ver evolución →</span></footer>' +
             "</article>";
    }).join("");

    return '<div class="intro">' +
             "<p>Último chequeo de cada alumno y cuánto cambió respecto al anterior. " +
             "Todas las pruebas son de <strong>" + CONFIG.duracionSegundos + " segundos</strong>. " +
             "Toca una tarjeta para ver la evolución completa.</p>" +
           "</div>" +
           '<div class="rejilla-tarjetas">' + tarjetas + "</div>";
  }

  /* --- vista 2: por fecha ------------------------------------------------ */

  function vistaFecha(fecha) {
    var fechas = Calc.fechasOrdenadas();
    if (fechas.indexOf(fecha) === -1) fecha = fechas[0];
    var chequeo = Calc.chequeoDeFecha(fecha);

    var selector = '<div class="controles">' +
        '<label for="sel-fecha">Fecha del chequeo</label>' +
        '<select id="sel-fecha">' +
          fechas.map(function (f) {
            return '<option value="' + esc(f) + '"' + (f === fecha ? " selected" : "") + ">" +
                   esc(Calc.fechaLarga(f)) + "</option>";
          }).join("") +
        "</select>" +
        '<span class="conteo">' + chequeo.resultados.length + " alumnos presentes</span>" +
      "</div>";

    // Máximo de cada columna, para resaltar al mejor del día.
    var maximos = {};
    CONFIG.ordenEjercicios.forEach(function (e) { maximos[e] = Calc.maximoFecha(fecha, e); });

    var cabGrupos = CONFIG.grupos.map(function (g) {
      return '<th class="th-grupo grupo-' + g.id + '" colspan="' + g.ejercicios.length + '">' +
             esc(g.nombre) + "</th>";
    }).join("");

    var cabEjercicios = CONFIG.grupos.map(function (g) {
      return g.ejercicios.map(function (e) {
        return '<th class="grupo-' + g.id + '" title="' + esc(CONFIG.ejercicios[e].nombre) + '">' +
               esc(CONFIG.ejercicios[e].corto) + "</th>";
      }).join("");
    }).join("");

    var filas = chequeo.resultados.map(function (r) {
      var a = Calc.alumno(r.alumnoId);
      var nombre = a ? a.nombre : r.alumnoId;
      var kup = Calc.kupTexto(r.kup);
      var celdas = CONFIG.ordenEjercicios.map(function (e) {
        var v = Calc.valorDe(r, e);
        var n = Calc.numeroDe(r, e);
        var mejor = n !== null && maximos[e] !== null && n === maximos[e];
        return '<td class="' + (mejor ? "mejor" : "") + (v === null ? " vacio" : "") + '">' +
               esc(Calc.textoValor(v, e)) + "</td>";
      }).join("");
      return '<tr><th scope="row" class="col-alumno">' +
               '<a href="#/individual/' + esc(r.alumnoId) + '">' + esc(nombre) + "</a>" +
               (kup ? '<span class="kup-mini">' + esc(kup) + "</span>" : "") +
             "</th>" + celdas + "</tr>";
    }).join("");

    var promedios = CONFIG.ordenEjercicios.map(function (e) {
      var p = Calc.promedioFecha(fecha, e);
      return "<td>" + (p === null ? "—" : p.toFixed(1)) + "</td>";
    }).join("");

    return selector +
      '<div class="tabla-scroll">' +
        '<table class="planilla">' +
          "<thead>" +
            '<tr><th class="col-alumno" rowspan="2">Alumno</th>' + cabGrupos + "</tr>" +
            "<tr>" + cabEjercicios + "</tr>" +
          "</thead>" +
          "<tbody>" + filas + "</tbody>" +
          '<tfoot><tr><th scope="row" class="col-alumno">Promedio</th>' + promedios + "</tr></tfoot>" +
        "</table>" +
      "</div>" +
      '<p class="nota">Se resalta el valor más alto de cada columna. ' +
      "El promedio ignora las casillas sin medición. " +
      'En <strong>doble pie</strong> el primer número es la pierna derecha.</p>';
  }

  /* --- vista 3: individual ----------------------------------------------- */

  function vistaIndividual(alumnoId) {
    var alumnos = Calc.alumnosConDatos();
    if (!alumnos.length) return "<p>No hay datos cargados.</p>";
    if (!alumnoId || !alumnos.some(function (a) { return a.id === alumnoId; })) {
      alumnoId = alumnos[0].id;
    }

    var a = Calc.alumno(alumnoId);
    var h = Calc.historial(alumnoId);

    var selector = '<div class="controles">' +
        '<label for="sel-alumno">Alumno</label>' +
        '<select id="sel-alumno">' +
          alumnos.map(function (x) {
            return '<option value="' + esc(x.id) + '"' + (x.id === alumnoId ? " selected" : "") + ">" +
                   esc(x.nombre) + "</option>";
          }).join("") +
        "</select>" +
        '<span class="conteo">' + h.length + (h.length === 1 ? " chequeo" : " chequeos") + "</span>" +
      "</div>";

    if (!h.length) return selector + "<p>Este alumno todavía no tiene chequeos.</p>";

    var ultimo = h[h.length - 1];
    var kup = Calc.kupTexto(ultimo.resultado.kup);

    // Tabla histórica: una columna por fecha.
    var cabFechas = h.map(function (x) {
      return "<th>" + esc(Calc.fechaCorta(x.fecha)) + "</th>";
    }).join("");

    var cuerpo = CONFIG.grupos.map(function (g) {
      var filasGrupo = g.ejercicios.map(function (e) {
        var celdas = h.map(function (x) {
          return "<td>" + esc(Calc.textoValor(Calc.valorDe(x.resultado, e), e)) + "</td>";
        }).join("");
        var d = h.length > 1
          ? Calc.delta(ultimo.resultado, h[h.length - 2].resultado, e)
          : null;
        return '<tr><th scope="row">' + esc(CONFIG.ejercicios[e].nombre) + "</th>" +
               celdas + "<td>" + marcaDelta(d) + "</td></tr>";
      }).join("");

      var celdasTotal = h.map(function (x) {
        var t = Calc.totalGrupo(x.resultado, g.id);
        return "<td>" + (t.total === null ? "—" : t.total) +
               (t.parcial ? '<span class="parcial">*</span>' : "") + "</td>";
      }).join("");

      // Variación del total, solo si en ambas fechas se midió lo mismo:
      // restar totales con distinta cantidad de ejercicios no diría nada.
      var deltaTotal = null;
      if (h.length > 1) {
        var tUlt = Calc.totalGrupo(ultimo.resultado, g.id);
        var tPre = Calc.totalGrupo(h[h.length - 2].resultado, g.id);
        if (tUlt.total !== null && tPre.total !== null && tUlt.contados === tPre.contados) {
          deltaTotal = tUlt.total - tPre.total;
        }
      }

      return '<tbody class="grupo-' + g.id + '">' +
               '<tr class="fila-grupo"><th scope="rowgroup" colspan="' + (h.length + 2) + '">' +
                 esc(g.nombre) + "</th></tr>" +
               filasGrupo +
               '<tr class="fila-total"><th scope="row">Total ' + esc(g.nombre.toLowerCase()) +
                 "</th>" + celdasTotal + "<td>" + marcaDelta(deltaTotal) + "</td></tr>" +
             "</tbody>";
    }).join("");

    var tabla = '<div class="tabla-scroll">' +
        '<table class="historico">' +
          '<thead><tr><th class="col-ejercicio">Ejercicio</th>' + cabFechas +
            "<th>Cambio</th></tr></thead>" +
          cuerpo +
        "</table>" +
      "</div>";

    // Gráficas: una por ejercicio, agrupadas por bloque.
    var graficas = CONFIG.grupos.map(function (g) {
      var tarjetas = g.ejercicios.map(function (e) {
        var svg;
        if (Calc.esBilateral(e)) {
          var b = Calc.serieBilateral(alumnoId, e);
          svg = Grafico.linea([
            { nombre: "Derecha", puntos: b.der, clase: "g-der" },
            { nombre: "Izquierda", puntos: b.izq, clase: "g-izq" }
          ], { titulo: CONFIG.ejercicios[e].nombre });
        } else {
          svg = Grafico.linea(
            [{ nombre: CONFIG.ejercicios[e].nombre, puntos: Calc.serie(alumnoId, e) }],
            { titulo: CONFIG.ejercicios[e].nombre }
          );
        }
        return '<figure class="grafico-caja">' +
                 "<figcaption>" + esc(CONFIG.ejercicios[e].nombre) + "</figcaption>" +
                 svg +
               "</figure>";
      }).join("");
      return '<section class="bloque-graficas grupo-' + g.id + '">' +
               "<h3>" + esc(g.nombre) + "</h3>" +
               '<div class="rejilla-graficas">' + tarjetas + "</div>" +
             "</section>";
    }).join("");

    var aviso = h.length === 1
      ? '<p class="nota">Con un solo chequeo todavía no hay evolución que mostrar. ' +
        "Las gráficas se van a llenar solas a medida que se carguen más fechas.</p>"
      : "";

    return selector +
      '<header class="ficha">' +
        "<h2>" + esc(a.nombre) + "</h2>" +
        '<div class="ficha-meta">' +
          (kup ? '<span class="kup">KIP ' + esc(kup) + "</span>" : "") +
          "<span>Último chequeo: " + esc(Calc.fechaLarga(ultimo.fecha)) + "</span>" +
        "</div>" +
      "</header>" +
      aviso + tabla + graficas;
  }

  /* --- render ------------------------------------------------------------ */

  function render() {
    var ruta = rutaSegura();

    $pestanas.querySelectorAll("a").forEach(function (a) {
      var activa = a.dataset.vista === ruta.vista;
      a.classList.toggle("activa", activa);
      if (activa) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    var html;
    if (ruta.vista === "fecha") html = vistaFecha(ruta.fecha);
    else if (ruta.vista === "individual") html = vistaIndividual(ruta.alumnoId);
    else html = vistaGeneral();

    $vista.innerHTML = "";
    $vista.appendChild(el(html));
    conectarEventos(ruta);
    window.scrollTo(0, 0);
  }

  function rutaSegura() {
    try { return rutaActual(); } catch (e) { return { vista: "general" }; }
  }

  function conectarEventos(ruta) {
    var selFecha = document.getElementById("sel-fecha");
    if (selFecha) {
      selFecha.addEventListener("change", function () { ir("#/fecha/" + this.value); });
    }

    var selAlumno = document.getElementById("sel-alumno");
    if (selAlumno) {
      selAlumno.addEventListener("change", function () { ir("#/individual/" + this.value); });
    }

    // El histórico crece hacia la derecha una columna por fecha. Cuando ya no
    // cabe, se abre mostrando el final: el chequeo más reciente es el que
    // interesa, no el de hace un año.
    if (ruta.vista === "individual") {
      $vista.querySelectorAll(".tabla-scroll").forEach(function (caja) {
        if (caja.scrollWidth > caja.clientWidth) caja.scrollLeft = caja.scrollWidth;
      });
    }

    $vista.querySelectorAll(".tarjeta[data-alumno]").forEach(function (t) {
      function abrir() { ir("#/individual/" + t.dataset.alumno); }
      t.addEventListener("click", abrir);
      t.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(); }
      });
    });
  }

  /* --- arranque ---------------------------------------------------------- */

  document.addEventListener("DOMContentLoaded", function () {
    $vista = document.getElementById("vista");
    $pestanas = document.getElementById("pestanas");

    // La cabecera es decorativa: si falta alguno de estos huecos no debe
    // impedir que se dibujen las estadísticas, que es lo que importa.
    function rellenar(id, valor) {
      var e = document.getElementById(id);
      if (e) e.textContent = valor;
    }
    rellenar("meta-duracion", CONFIG.duracionSegundos + " seg");
    rellenar("meta-cintura", CONFIG.metas.cintura);
    rellenar("meta-punos", CONFIG.metas.punos);
    rellenar("meta-patadas", CONFIG.metas.patadas);

    window.addEventListener("hashchange", render);
    render();
  });

})();
