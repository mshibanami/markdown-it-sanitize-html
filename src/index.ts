import MarkdownIt, { PluginWithOptions } from 'markdown-it';
import sanitizeHtml, { IOptions } from 'sanitize-html';

const markdownItSanitizeHtml: PluginWithOptions<IOptions> = (md: MarkdownIt, options: IOptions | undefined) => {
  const purify = (html: string): string => {
    return sanitizeHtml(html, options);
  };

  const originalRender = md.render.bind(md);
  md.render = (src: string, env: any): string => {
    const originalHtmlOption = md.options.html;
    md.options.html = true;
    const html = originalRender(src, env);
    md.options.html = originalHtmlOption;
    return purify(html);
  };

  const originalRenderInline = md.renderInline.bind(md);
  md.renderInline = (src: string, env: any): string => {
    const originalHtmlOption = md.options.html;
    md.options.html = true;
    const html = originalRenderInline(src, env);
    md.options.html = originalHtmlOption;
    return purify(html);
  };
};

export default markdownItSanitizeHtml;
