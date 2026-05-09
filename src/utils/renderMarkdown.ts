import React from 'react';

/**
 * Tiny safe-ish markdown renderer for notes & comments.
 * Supports: bold (**), italic (*), inline code (`), headings (#, ##), lists (- / *),
 * links [text](url), block quotes (> ), fenced code blocks (```).
 * Escapes HTML to prevent XSS.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(line: string): string {
  let out = escapeHtml(line);
  // inline code
  out = out.replace(/`([^`]+)`/g, '<code class="px-1 rounded font-mono text-[12px]" style="background-color:rgba(236,230,216,0.10);color:#ece6d8">$1</code>');
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // links
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="underline underline-offset-2" style="color:#ece6d8">$1</a>');
  return out;
}

export function renderMarkdownToHtml(md: string): string {
  if (!md) return '';
  const lines = md.split('\n');
  const out: string[] = [];
  let inList = false;
  let inCode = false;
  let codeLang = '';
  let codeBuffer: string[] = [];

  const closeList = () => { if (inList) { out.push('</ul>'); inList = false; } };
  const closeCode = () => {
    if (inCode) {
      const code = escapeHtml(codeBuffer.join('\n'));
      out.push(`<pre class="my-2 px-3 py-2 rounded font-mono text-xs overflow-x-auto" style="background-color:rgba(255,255,255,0.04);color:#ece6d8;border:1px solid rgba(236,230,216,0.10)"><code data-lang="${escapeHtml(codeLang)}">${code}</code></pre>`);
      codeBuffer = []; inCode = false; codeLang = '';
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, '');
    const fence = line.match(/^```(\w+)?$/);
    if (fence) {
      if (inCode) { closeCode(); }
      else { closeList(); inCode = true; codeLang = fence[1] ?? ''; }
      continue;
    }
    if (inCode) { codeBuffer.push(line); continue; }

    if (/^#\s+/.test(line)) {
      closeList();
      out.push(`<h3 class="font-display text-base mt-3 mb-1" style="color:#ece6d8">${renderInline(line.replace(/^#\s+/, ''))}</h3>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      closeList();
      out.push(`<h4 class="font-display text-sm mt-3 mb-1" style="color:#ece6d8">${renderInline(line.replace(/^##\s+/, ''))}</h4>`);
      continue;
    }
    if (/^>\s?/.test(line)) {
      closeList();
      out.push(`<blockquote class="pl-3 my-2 italic" style="border-left:2px solid rgba(236,230,216,0.30);color:#b8b3a7">${renderInline(line.replace(/^>\s?/, ''))}</blockquote>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { out.push('<ul class="list-disc pl-5 my-1 space-y-0.5">'); inList = true; }
      out.push(`<li>${renderInline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }
    if (line.trim() === '') {
      closeList();
      out.push('<br/>');
      continue;
    }
    closeList();
    out.push(`<p class="my-1">${renderInline(line)}</p>`);
  }
  closeList();
  closeCode();
  return out.join('\n');
}

export function MarkdownPreview({ source, className }: { source: string; className?: string }): React.ReactElement {
  return React.createElement('div', {
    className,
    dangerouslySetInnerHTML: { __html: renderMarkdownToHtml(source) },
  });
}
