import MarkdownIt from 'markdown-it'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { createHighlighter } from 'shiki'

// Custom plugin for KaTeX
const markdownItKatex = (md: MarkdownIt) => {
  const defaultRender = md.renderer.rules.math_inline || ((tokens, idx) => tokens[idx].content)
  
  md.inline.ruler.after('escape', 'math_inline', (state, silent) => {
    let start, match, token, res
    if (state.src[state.pos] !== '$') return false
    
    res = state.src.slice(state.pos).match(/^\$((?:[^\$]|\\\$)+)\$/);
    if (!res) return false;
    
    if (!silent) {
      token = state.push('math_inline', 'math', 0);
      token.content = res[1];
    }
    state.pos += res[0].length;
    return true;
  });

  md.renderer.rules.math_inline = (tokens, idx) => {
    try {
      return katex.renderToString(tokens[idx].content, { displayMode: false });
    } catch (e) {
      return tokens[idx].content;
    }
  };

  md.renderer.rules.math_block = (tokens, idx) => {
    try {
      return `<div class="math-block">${katex.renderToString(tokens[idx].content, { displayMode: true })}</div>`;
    } catch (e) {
      return `<pre>${tokens[idx].content}</pre>`;
    }
  };
}

let highlighter: any = null

export async function initMarkdown() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['javascript', 'typescript', 'vue', 'css', 'html', 'bash', 'json', 'markdown', 'python', 'sql']
    })
  }
}

export async function renderMarkdown(content: string) {
  await initMarkdown()
  
  const md: MarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: (code: string, lang: string): string => {
      if (lang === 'mermaid') {
        return `<pre class="mermaid">${code}</pre>`
      }
      try {
        return highlighter.codeToHtml(code, { 
          lang: highlighter.getLoadedLanguages().includes(lang) ? lang : 'text',
          theme: document.documentElement.classList.contains('dark') ? 'github-dark' : 'github-light'
        })
      } catch (e) {
        return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`
      }
    }
  })

  md.use(markdownItKatex)

  return md.render(content)
}
