/* Headline typesetting. A browser may break a line at a hard hyphen or at the
   space after a number, which sets "Push- / Ups?" and "68 / mph" in display
   type. keepTogether() returns the text as HTML with each hyphenated compound
   and each number-plus-word pair wrapped in <span class="nb"> (white-space:
   nowrap, in global.css), so those pairs move to the next line together. The
   text is escaped first; render the result with set:html. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function keepTogether(text: string): string {
  return esc(text).replace(/(\d[\d,.]*\s+[A-Za-z%]+|[A-Za-z0-9']+(?:-[A-Za-z0-9']+)+)/g, '<span class="nb">$1</span>');
}
