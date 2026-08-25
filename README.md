# Chequeo físico — estadísticas

Web estática para ver las estadísticas de los chequeos: qué logró cada alumno,
cómo va comparado con su chequeo anterior y cómo evoluciona en el tiempo.

Sin build, sin npm, sin servidor. Se abre con doble clic en `index.html`.

## Las tres vistas

- **General** (la que abre por defecto) — una tarjeta por alumno con su último
  chequeo y la variación contra el anterior (▲ / ▼). Toca una tarjeta para ver
  su evolución.
- **Por fecha** — la planilla de un día concreto, con el promedio del grupo y el
  mejor valor de cada columna resaltado.
- **Individual** — el historial completo de un alumno: tabla por fecha y una
  gráfica de evolución por ejercicio.

## Cargar un chequeo nuevo

1. Abre `capturar.html`.
2. Pon la fecha y destilda a quien no asistió.
3. Llena los números. **Lo que no se midió se deja en blanco** — se guarda como
   `null` y no cuenta para los promedios. Poner `0` significa otra cosa: que lo
   intentó y no logró ninguna repetición.
4. En **doble pie**, el primer campo es la pierna **derecha** (igual que en la
   planilla de papel).
5. Pulsa **Generar bloque** y **Copiar**.
6. Pega el bloque en `js/datos.js`, dentro de `chequeos: [ ... ]`, separado por
   coma del anterior. Si el bloque trae una sección de *alumnos nuevos*, pega
   también esas líneas dentro de `alumnos: [ ... ]`.
7. Guarda y recarga `index.html`.

## Archivos

| Archivo | Qué es |
|---|---|
| `js/datos.js` | **Los datos.** Es lo único que se edita cada mes. |
| `js/config.js` | Catálogo de ejercicios, agrupación en bloques y metas. |
| `js/calculos.js` | Promedios, variaciones, series históricas. |
| `js/grafico.js` | Gráficas SVG, sin librerías. |
| `js/app.js` | Las tres vistas y la navegación. |
| `capturar.html` | Planilla para cargar un chequeo nuevo. |

### Por qué `datos.js` y no `datos.json`

El navegador bloquea `fetch()` de un archivo `.json` cuando la página se abre con
doble clic (`file://`). Un `.js` cargado con `<script src>` sí funciona. Gracias a
eso el sitio anda igual desde el escritorio sin conexión que publicado en internet.
Por la misma razón no hay módulos ES ni librerías por CDN.

### Los bloques

Los 14 ejercicios se agrupan en tres bloques, definidos en `CONFIG.grupos`
(`js/config.js`):

| Bloque | Ejercicios |
|---|---|
| Tronco | cintura, silla |
| Puños | palma, flecha, sierra, martillo, horizontal, vertical, gancho |
| Patadas | recta, punta, de lado, barredor, doble pie |

Mover un ejercicio de un bloque a otro es mover un texto en esa lista: no hay que
tocar nada más, ni el render ni los totales.

### Dos órdenes de columnas, a propósito

En el papel los bloques están intercalados: recta, punta y de lado (patadas) caen
entre columnas de puños. De ahí que haya dos órdenes en `js/config.js`:

- **`CONFIG.ordenEjercicios`** — agrupado por bloque. Es el que usan las tres
  vistas de estadísticas, para que puños y patadas se lean juntos.
- **`CONFIG.ordenPlanilla`** — el orden físico de la hoja de papel. Lo usa solo
  `capturar.html`: al transcribir conviene ir de izquierda a derecha en el mismo
  orden que el papel, o se cuelan errores. Ahí el bloque de cada ejercicio se
  indica con color en la cabecera de su columna.

## Publicar

Es una carpeta de archivos estáticos: sirve cualquier hosting.

- **Netlify** — entra a [app.netlify.com/drop](https://app.netlify.com/drop) y
  arrastra la carpeta. Te devuelve un enlace público al instante.
- **GitHub Pages** — sube la carpeta a un repo y activa Pages sobre la rama `main`.

Para probarlo en local como si estuviera publicado:

```
python3 -m http.server 8000
```

y abre <http://localhost:8000>.

## Sobre los datos cargados

Los dos primeros chequeos (27 de julio y 24 de agosto de 2026) están transcritos
a mano desde la planilla en papel. **Conviene cotejarlos contra la foto** antes de
sacar conclusiones: un dígito mal leído se propaga a todas las estadísticas.
