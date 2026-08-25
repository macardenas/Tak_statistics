/* Funciones puras sobre DATOS y CONFIG.
   Todas toleran valores nulos y planteles que cambian de una fecha a otra. */

const Calc = (function () {

  /* --- helpers de valores --------------------------------------------- */

  function esBilateral(ejercicioId) {
    return !!(CONFIG.ejercicios[ejercicioId] && CONFIG.ejercicios[ejercicioId].bilateral);
  }

  /* Un número comparable para cualquier ejercicio. En los bilaterales es la
     suma de las dos piernas, que es lo que representa el esfuerzo total.
     Devuelve null si no hay dato: nunca 0, para no ensuciar los promedios. */
  function valorNumerico(valor) {
    if (valor === null || valor === undefined) return null;
    if (typeof valor === "number") return valor;
    var der = typeof valor.der === "number" ? valor.der : null;
    var izq = typeof valor.izq === "number" ? valor.izq : null;
    if (der === null && izq === null) return null;
    return (der || 0) + (izq || 0);
  }

  function valorDe(resultado, ejercicioId) {
    if (!resultado || !resultado.valores) return null;
    var v = resultado.valores[ejercicioId];
    return v === undefined ? null : v;
  }

  function numeroDe(resultado, ejercicioId) {
    return valorNumerico(valorDe(resultado, ejercicioId));
  }

  /* --- acceso a chequeos ------------------------------------------------ */

  /* Fechas de más reciente a más antigua. */
  function fechasOrdenadas() {
    return DATOS.chequeos
      .map(function (c) { return c.fecha; })
      .sort()
      .reverse();
  }

  function chequeoDeFecha(fecha) {
    return DATOS.chequeos.find(function (c) { return c.fecha === fecha; }) || null;
  }

  function alumno(alumnoId) {
    return DATOS.alumnos.find(function (a) { return a.id === alumnoId; }) || null;
  }

  /* Historial de un alumno, del más antiguo al más reciente.
     Solo incluye las fechas en las que efectivamente asistió. */
  function historial(alumnoId) {
    return DATOS.chequeos
      .slice()
      .sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; })
      .map(function (c) {
        var r = c.resultados.find(function (x) { return x.alumnoId === alumnoId; });
        return r ? { fecha: c.fecha, resultado: r } : null;
      })
      .filter(Boolean);
  }

  /* Último chequeo del alumno y el inmediatamente anterior (o null). */
  function ultimoYPrevio(alumnoId) {
    var h = historial(alumnoId);
    return {
      ultimo: h.length ? h[h.length - 1] : null,
      previo: h.length > 1 ? h[h.length - 2] : null,
      totalChequeos: h.length
    };
  }

  /* Alumnos que tienen al menos un chequeo, ordenados por nombre. */
  function alumnosConDatos() {
    var conDatos = new Set();
    DATOS.chequeos.forEach(function (c) {
      c.resultados.forEach(function (r) { conDatos.add(r.alumnoId); });
    });
    return DATOS.alumnos
      .filter(function (a) { return conDatos.has(a.id); })
      .sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
  }

  /* --- variación -------------------------------------------------------- */

  /* Diferencia de un ejercicio entre el último chequeo y el anterior.
     null cuando falta cualquiera de los dos datos: no hay con qué comparar. */
  function delta(resultadoActual, resultadoPrevio, ejercicioId) {
    var a = numeroDe(resultadoActual, ejercicioId);
    var b = numeroDe(resultadoPrevio, ejercicioId);
    if (a === null || b === null) return null;
    return a - b;
  }

  /* --- agregados por grupo --------------------------------------------- */

  /* Suma de un bloque (tronco / puños / patadas) para un resultado.
     Informa sobre cuántos ejercicios entraron, para poder avisar cuando el
     total es parcial porque faltaron mediciones. */
  function totalGrupo(resultado, grupoId) {
    var grupo = CONFIG.grupos.find(function (g) { return g.id === grupoId; });
    if (!grupo) return { total: null, contados: 0, esperados: 0 };
    var total = 0, contados = 0;
    grupo.ejercicios.forEach(function (e) {
      var n = numeroDe(resultado, e);
      if (n !== null) { total += n; contados++; }
    });
    return {
      total: contados ? total : null,
      contados: contados,
      esperados: grupo.ejercicios.length,
      parcial: contados > 0 && contados < grupo.ejercicios.length
    };
  }

  /* --- estadística del grupo en una fecha ------------------------------- */

  /* Promedio de un ejercicio entre los presentes de esa fecha. */
  function promedioFecha(fecha, ejercicioId) {
    var chequeo = chequeoDeFecha(fecha);
    if (!chequeo) return null;
    var suma = 0, n = 0;
    chequeo.resultados.forEach(function (r) {
      var v = numeroDe(r, ejercicioId);
      if (v !== null) { suma += v; n++; }
    });
    return n ? suma / n : null;
  }

  /* El valor más alto de un ejercicio en esa fecha, para resaltarlo. */
  function maximoFecha(fecha, ejercicioId) {
    var chequeo = chequeoDeFecha(fecha);
    if (!chequeo) return null;
    var max = null;
    chequeo.resultados.forEach(function (r) {
      var v = numeroDe(r, ejercicioId);
      if (v !== null && (max === null || v > max)) max = v;
    });
    return max;
  }

  /* --- series para las gráficas ----------------------------------------- */

  /* [{fecha, valor}] de un ejercicio a lo largo del historial del alumno.
     Los puntos sin dato se omiten en vez de dibujarse como 0. */
  function serie(alumnoId, ejercicioId) {
    return historial(alumnoId)
      .map(function (h) {
        return { fecha: h.fecha, valor: numeroDe(h.resultado, ejercicioId) };
      })
      .filter(function (p) { return p.valor !== null; });
  }

  /* Serie separada por pierna, para los ejercicios bilaterales. */
  function serieBilateral(alumnoId, ejercicioId) {
    var h = historial(alumnoId);
    function lado(cual) {
      return h.map(function (x) {
        var v = valorDe(x.resultado, ejercicioId);
        var n = v && typeof v[cual] === "number" ? v[cual] : null;
        return { fecha: x.fecha, valor: n };
      }).filter(function (p) { return p.valor !== null; });
    }
    return { der: lado("der"), izq: lado("izq") };
  }

  /* --- formato ---------------------------------------------------------- */

  var MESES = ["ene", "feb", "mar", "abr", "may", "jun",
               "jul", "ago", "sep", "oct", "nov", "dic"];

  /* Formatea "2026-07-27" sin pasar por Date, que interpretaría la cadena
     como UTC y podría restar un día según la zona horaria. */
  function fechaCorta(iso) {
    var p = iso.split("-");
    return parseInt(p[2], 10) + " " + MESES[parseInt(p[1], 10) - 1];
  }

  function fechaLarga(iso) {
    var p = iso.split("-");
    return parseInt(p[2], 10) + " de " + MESES[parseInt(p[1], 10) - 1] + " de " + p[0];
  }

  function kupTexto(kup) {
    if (kup === null || kup === undefined) return null;
    return CONFIG.kupRomano[kup] || String(kup);
  }

  /* Texto de una celda: "11 / 8" en bilaterales, el número en el resto. */
  function textoValor(valor, ejercicioId) {
    if (valor === null || valor === undefined) return "—";
    if (esBilateral(ejercicioId) && typeof valor === "object") {
      var d = typeof valor.der === "number" ? valor.der : "—";
      var i = typeof valor.izq === "number" ? valor.izq : "—";
      return d + " / " + i;
    }
    return String(valor);
  }

  return {
    esBilateral: esBilateral,
    valorNumerico: valorNumerico,
    valorDe: valorDe,
    numeroDe: numeroDe,
    fechasOrdenadas: fechasOrdenadas,
    chequeoDeFecha: chequeoDeFecha,
    alumno: alumno,
    historial: historial,
    ultimoYPrevio: ultimoYPrevio,
    alumnosConDatos: alumnosConDatos,
    delta: delta,
    totalGrupo: totalGrupo,
    promedioFecha: promedioFecha,
    maximoFecha: maximoFecha,
    serie: serie,
    serieBilateral: serieBilateral,
    fechaCorta: fechaCorta,
    fechaLarga: fechaLarga,
    kupTexto: kupTexto,
    textoValor: textoValor
  };
})();
