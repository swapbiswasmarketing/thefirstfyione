/* Markdown tables, wrapped and marked at build time.

   html and body clip horizontal overflow (global.css), so a table wider than a
   phone loses its right-hand columns with no way to reach them. Every markdown
   table is wrapped in a focusable scroll region instead:

     <div class="table-wrap" role="region" tabindex="0" aria-label="Table: Year">

   tabindex lets a keyboard user scroll it, and the label names the region for a
   screen reader. It is the first header cell; a comparison table often leaves
   that corner cell empty, so the other headers stand in, then "data".

   A figure is a number, money, a percentage, a date or a range, with or without
   a unit or a qualifier such as "about". A cell that only starts with a number
   and then runs on as prose ("17-metre sperm whale burst in a city street") is
   not one, and a capitalised word that is not a unit or a month reads as a name
   ("1896 Athens"), not a figure. When every filled cell in a column is a figure,
   those cells and the column's header cell get class "num", so the stylesheet
   can set the column in tabular figures, in line with its heading. A column
   that mixes figures with prose stays plain throughout: right-aligning only its
   figure cells would zigzag the column, worst in comparison tables, where one
   column holds "0.4 AU" in one row and "thin exosphere" in the next.

   The class names are a contract with the entry template's CSS: do not rename
   them. Doing this here instead of in a page script means no DOM write after
   first paint and nothing to re-measure.

   Only markdown tables are elements at this point. Astro runs user rehype
   plugins before rehype-raw, so a table typed as raw HTML is still a string; it
   is left as it is and named in a build warning, so it can be rewritten as a
   markdown table. */

/* Kept as \u escapes so this file stays plain ASCII: minus sign, plus-minus,
   en and em dashes, pound, euro, yen, degree sign. */
const LEAD = "~<>+\\-\\u2212\\u00b1$\\u00a3\\u20ac\\u00a5";
const JOIN = "\\-\\u2013\\u2014/:";
const FIGURE = new RegExp(
  `^(?:mid-)?[${LEAD}]*\\d[\\d,.]*(?:[${JOIN}][${LEAD}]*\\d[\\d,.]*)*(?:%|st|nd|rd|th|s|k|m|bn|\\u00b0?[cf])?$`,
  "i"
);

/* Words a figure may carry with it. Matched lowercased, with dots removed, so
   "a.m.", "Sept." and "c." all match. Units and date words may sit anywhere in
   the cell ("Days 1-5 and 14"); the connecting words only join figures. */
const UNITS = new Set(
  (
    "% percent pc mm cm m km in inch inches ft foot feet yd yard yards mi mile miles nm um au " +
    "mg g kg t tonne tonnes ton tons lb lbs pound pounds oz ounce ounces ml l litre litres liter liters " +
    "gallon gallons pint pints cup cups tsp tbsp sq square acre acres hectare hectares ha " +
    "ms s sec secs second seconds min mins minute minutes h hr hrs hour hours day days week weeks " +
    "month months year years yr yrs decade decades century centuries millennium millennia ago " +
    "mph kph km/h m/s knot knots psi bar bars pa kpa mpa gpa atm db hz khz mhz ghz " +
    "c f k deg degree degrees cal kcal kj j kwh w kw mw usd gbp eur dollar dollars cent cents pence p " +
    "million billion trillion thousand hundred dozen mn bn bit bits byte bytes kb mb gb tb x " +
    "jan january feb february mar march apr april may jun june jul july aug august sep sept september " +
    "oct october nov november dec december bc bce ad ce am pm noon midnight spring summer autumn fall winter"
  ).split(" ")
);
const JOINERS = new Set([
  ...(
    "about around roughly approx approximately nearly almost under over above below up to from and or " +
    "of per a an each c ca circa by at least most more less than close some just only the early late mid " +
    "between average avg max min plus minus vs versus - / & + ~ ="
  ).split(" "),
  /* en dash, em dash, almost-equal sign */
  ...String.fromCharCode(0x2013, 0x2014, 0x2248),
]);

/* Quotes and brackets around a token, curly quotes included (smartypants turns
   straight quotes curly before this plugin runs). */
const PUNCT = new RegExp("^[\\s\"'([{\\u201c\\u2018]+|[\\s\"')\\]},;:!?\\u201d\\u2019]+$", "g");

/* A cell is a figure when it holds at least one number, every other word is a
   unit, a date word or a joiner, and at most one plain lowercase word follows
   a number ("118 reeds", "1984 edition"). Parentheses that hold a number are a
   conversion or a count and are set aside first: "11 mph (5.02 m/s)",
   "17% (85 of 484)". */
export function isFigure(text) {
  const flat = String(text ?? "")
    .replace(/\([^()]*\d[^()]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!flat || !/\d/.test(flat)) return false;
  let figures = 0;
  let words = 0;
  let other = 0;
  for (const raw of flat.split(" ")) {
    const token = raw.replace(PUNCT, "");
    if (!token) continue;
    if (FIGURE.test(token)) { figures++; continue; }
    const word = token.toLowerCase().replace(/\./g, "");
    other++;
    if (UNITS.has(word) || JOINERS.has(word)) continue;
    if (/^[A-Z]/.test(token) || figures === 0) return false;
    words++;
  }
  return figures > 0 && words <= 1 && other <= 6;
}

const isEl = (node, tag) => node && node.type === "element" && (!tag || node.tagName === tag);
const kids = (node, tag) => (node.children ?? []).filter((c) => isEl(c, tag));
const textOf = (node) =>
  node.type === "text" ? node.value : (node.children ?? []).map(textOf).join("");
const clean = (s) => s.replace(/\s+/g, " ").trim();

function addClass(node, name) {
  const list = Array.isArray(node.properties.className) ? node.properties.className : [];
  if (!list.includes(name)) node.properties.className = [...list, name];
}

/* The newline text nodes between rows and cells mean nothing inside a table, and
   rehype-raw's HTML parser moves them out in front of it, which would leave a
   run of blank lines inside the wrapper. Dropping them keeps it to the table. */
const STRUCTURE = new Set(["table", "thead", "tbody", "tfoot", "tr"]);
function tidy(node) {
  if (!isEl(node) || !STRUCTURE.has(node.tagName)) return;
  node.children = node.children.filter((c) => !(c.type === "text" && !c.value.trim()));
  node.children.forEach(tidy);
}

/* Marks the figure columns of one table and returns its accessible name. */
function markTable(table) {
  const sections = kids(table).filter((c) => c.tagName === "thead" || c.tagName === "tbody");
  const headRows = sections.filter((s) => s.tagName === "thead").flatMap((s) => kids(s, "tr"));
  /* A table without thead/tbody is not what remark-gfm emits, but read it anyway. */
  const bodyRows = sections.length
    ? sections.filter((s) => s.tagName === "tbody").flatMap((s) => kids(s, "tr"))
    : kids(table, "tr");
  const cellsOf = (tr) => kids(tr).filter((c) => c.tagName === "td" || c.tagName === "th");

  /* Column by column: every filled body cell a figure, and at least one filled. */
  const columns = [];
  for (const tr of bodyRows) {
    cellsOf(tr).forEach((cell, i) => {
      if (cell.tagName !== "td") return;
      const text = clean(textOf(cell));
      if (!text) return;
      const col = (columns[i] ??= { filled: [], figures: true });
      col.filled.push(cell);
      if (col.figures && !isFigure(text)) col.figures = false;
    });
  }
  columns.forEach((col, i) => {
    if (!col || !col.figures) return;
    for (const cell of col.filled) addClass(cell, "num");
    for (const tr of headRows) {
      const th = cellsOf(tr)[i];
      if (th) addClass(th, "num");
    }
  });

  const header = (headRows[0] ? cellsOf(headRows[0]) : []).map((th) => clean(textOf(th)));
  const name = header[0] || header.filter(Boolean).join(", ") || "data";
  return name.length > 100 ? `${name.slice(0, 97).trimEnd()}...` : name;
}

export default function rehypeTables() {
  /* Options are ignored here. astro.config.mjs passes a hash of this file as one,
     only so that editing it changes the config digest and re-renders the entries. */
  return (tree, file) => {
    let rawTables = 0;
    const walk = (node) => {
      const children = node.children;
      if (!children) return;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.type === "raw" && /<table[\s>]/i.test(child.value)) rawTables++;
        if (isEl(child, "table")) {
          const cls = node.properties?.className;
          const inWrap = isEl(node, "div") && Array.isArray(cls) && cls.includes("table-wrap");
          tidy(child);
          const label = markTable(child);
          if (!inWrap) {
            children[i] = {
              type: "element",
              tagName: "div",
              properties: { className: ["table-wrap"], role: "region", tabIndex: 0, ariaLabel: `Table: ${label}` },
              children: [child],
            };
          }
          continue;
        }
        walk(child);
      }
    };
    walk(tree);
    if (rawTables) {
      const name = String(file?.path ?? "a markdown file").split(/[\\/]/).pop();
      console.warn(
        `[rehype-tables] ${name}: ${rawTables} raw HTML table(s) left unwrapped and unmarked; write them as markdown tables so they scroll on phones`
      );
    }
  };
}
