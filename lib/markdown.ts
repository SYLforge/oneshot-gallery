/**
 * Tiny, safe markdown → HTML renderer for the annex's own docs
 * (DESIGN.md, PROMPT.md deviations). Everything is HTML-escaped first;
 * only a small, known subset of markdown is understood:
 * headings, pipe tables, fenced code, lists, paragraphs, and the
 * inline trio `code` / **strong** / *em*.
 *
 * Build-time only — never import from client components.
 */

export function escapeHtml(source: string): string {
  return source
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Escape, then apply inline markdown: `code`, **strong**, *em*. */
export function inlineMarkdown(source: string): string {
  return escapeHtml(source)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?[\s:|-]+\|?$/.test(trimmed) && trimmed.includes("-");
}

function splitRow(line: string): string[] {
  const cells = line.trim().split("|");
  if (cells.length > 0 && cells[0].trim() === "") cells.shift();
  if (cells.length > 0 && cells[cells.length - 1].trim() === "") cells.pop();
  return cells.map((cell) => cell.trim());
}

function renderTable(head: string[], rows: string[][]): string {
  const thead = `<thead><tr>${head
    .map((cell) => `<th scope="col">${inlineMarkdown(cell)}</th>`)
    .join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`,
    )
    .join("")}</tbody>`;
  return `<div class="md-table"><table>${thead}${tbody}</table></div>`;
}

/**
 * Render a markdown document into HTML. Headings are shifted one level
 * down (# → h2) so the result nests under the page's own h1.
 */
export function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let i = 0;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block.
    if (/^```/.test(line)) {
      flushParagraph();
      const buffer: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buffer.push(lines[i]);
        i += 1;
      }
      i += 1; // closing fence
      html.push(`<pre><code>${escapeHtml(buffer.join("\n"))}</code></pre>`);
      continue;
    }

    // Heading.
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    // Blank line.
    if (line.trim() === "") {
      flushParagraph();
      i += 1;
      continue;
    }

    // Pipe table (header row + separator row).
    if (
      line.trimStart().startsWith("|") &&
      i + 1 < lines.length &&
      isTableSeparator(lines[i + 1])
    ) {
      flushParagraph();
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      html.push(renderTable(head, rows));
      continue;
    }

    // Lists (unordered "- " / "* ", ordered "1. "), with wrapped lines.
    const unordered = /^[-*]\s+/.test(line);
    const ordered = /^\d+\.\s+/.test(line);
    if (unordered || ordered) {
      flushParagraph();
      const items: string[] = [];
      const itemStart = unordered ? /^[-*]\s+(.*)$/ : /^\d+\.\s+(.*)$/;
      while (i < lines.length) {
        const start = itemStart.exec(lines[i]);
        if (start) {
          items.push(start[1].trim());
          i += 1;
          // Continuation lines are indented and not new items.
          while (
            i < lines.length &&
            /^\s{2,}\S/.test(lines[i]) &&
            !itemStart.test(lines[i])
          ) {
            items[items.length - 1] += ` ${lines[i].trim()}`;
            i += 1;
          }
        } else {
          break;
        }
      }
      const tag = unordered ? "ul" : "ol";
      html.push(
        `<${tag}>${items
          .map((item) => `<li>${inlineMarkdown(item)}</li>`)
          .join("")}</${tag}>`,
      );
      continue;
    }

    // Paragraph text.
    paragraph.push(line.trim());
    i += 1;
  }

  flushParagraph();
  return html.join("\n");
}
