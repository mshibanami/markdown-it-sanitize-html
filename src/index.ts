import MarkdownIt, { PluginWithOptions } from 'markdown-it';
import Token from 'markdown-it/lib/token.mjs';
import sanitizeHtml, { IOptions } from 'sanitize-html';

const markdownItSanitizeHtml: PluginWithOptions<IOptions> = (
  md: MarkdownIt,
  options?: IOptions
) => {
  md.inline.ruler.disable('html_inline');

  const sanitize = (html: string): string => {
    try {
      const result = sanitizeHtml(html, options);
      return result;
    } catch (error) {
      return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  };

  const HTML_TAG_REGEX = /<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?\s*\/?>/;

  const containsHtmlTags = (text: string): boolean => {
    return HTML_TAG_REGEX.test(text);
  };

  const defaultTextRenderer = md.renderer.rules.text || function (tokens: Token[], idx: number): string {
    return tokens[idx].content;
  };

  md.renderer.rules.text = (tokens: Token[], idx: number, options, env, self): string => {
    const token = tokens[idx];
    const content = token.content;

    if (containsHtmlTags(content)) {
      return sanitize(content);
    }

    return defaultTextRenderer(tokens, idx, options, env, self);
  };

  md.renderer.rules.html_block = (tokens: Token[], idx: number): string => {
    const token = tokens[idx];
    return sanitize(token.content);
  };
};

export default markdownItSanitizeHtml;
