import MarkdownIt, { PluginWithOptions } from 'markdown-it';
import Renderer from 'markdown-it/lib/renderer.mjs';
import Token from 'markdown-it/lib/token.mjs';
import sanitizeHtml, { IOptions } from 'sanitize-html';

const markdownItSanitizeHtml: PluginWithOptions<IOptions> = (md: MarkdownIt, options?: IOptions) => {
  // Core rule to merge text and softbreak tokens
  md.core.ruler.after('inline', 'sanitize_html_text_merger', (state) => {
    for (const token of state.tokens) {
      if (token.type === 'inline' && token.children) {
        const newChildren: Token[] = [];
        let textBuffer = '';

        const flushTextBuffer = () => {
          if (textBuffer) {
            const t = new state.Token('text', '', 0);
            t.content = textBuffer;
            newChildren.push(t);
            textBuffer = '';
          }
        };

        for (const child of token.children) {
          if (child.type === 'text') {
            textBuffer += child.content;
          } else if (child.type === 'softbreak' && !md.options.breaks) {
            textBuffer += '\n';
          } else {
            flushTextBuffer();
            newChildren.push(child);
          }
        }
        flushTextBuffer();
        token.children = newChildren;
      }
    }
    return true;
  });

  // Disable built-in HTML processing
  md.inline.ruler.disable('html_inline');

  const sanitize = (html: string): string => {
    return sanitizeHtml(html, options);
  };

  const HTML_PATTERNS = [
    // Comments
    /<!--[\s\S]*?-->/g,
    // Tags
    /<\/?[a-zA-Z][\w:-]*(?:\s[^>]*)?\s*\/?>/g,
    // Entities (e.g., &amp;, &#123;, &#x1F600;)
    /&(?:[a-zA-Z][a-zA-Z0-9]*|#(?:\d+|x[0-9a-fA-F]+));/g
  ];

  const containsHtmlTags = (text: string): boolean => {
    return HTML_PATTERNS.some(pattern => pattern.test(text));
  };

  const originalTextRenderer = md.renderer.rules.text ||
    ((tokens: Token[], idx: number, options: any, env: any, self: Renderer) => {
      return self.renderToken(tokens, idx, options);
    });

  md.renderer.rules.text = (tokens: Token[], idx: number, opts: any, env: any, self: Renderer): string => {
    const token = tokens[idx];
    const content = token.content;

    if (!containsHtmlTags(content)) {
      return originalTextRenderer(tokens, idx, opts, env, self);
    }

    return sanitize(content);
  };

  md.renderer.rules.html_block = (tokens: Token[], idx: number): string => {
    const token = tokens[idx];
    return sanitize(token.content);
  };

  md.renderer.rules.html_inline = (tokens: Token[], idx: number): string => {
    const token = tokens[idx];
    return sanitize(token.content);
  };
};

export default markdownItSanitizeHtml;
