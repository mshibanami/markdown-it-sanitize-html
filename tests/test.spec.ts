import { describe, it, expect } from 'vitest';
import markdownIt from 'markdown-it';
import markdownItSanitizeHtml from '../src/index';

describe('markdown-it-sanitize-html', () => {
  it('should sanitize basic XSS attempts', () => {
    const md = markdownIt().use(markdownItSanitizeHtml);
    const unsafeMarkdown = '<b onclick="alert(\'XSS\')">bold</b>';
    const expectedHtml = '<p><b>bold</b></p>\n';
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });

  it('should sanitize image with onerror attribute', () => {
    const md = markdownIt().use(markdownItSanitizeHtml, {
      allowedTags: ['img'],
    });
    const unsafeMarkdown = '<img src="x" onerror="alert(\'XSS\')">';
    const expectedHtml = '<img src="x" />';
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });

  it('should sanitize inline and block HTML', () => {
    const md = markdownIt().use(markdownItSanitizeHtml);
    const unsafeMarkdown = '<div>A div</div> and <span onmouseover="alert(1)">a span</span>';
    const expectedHtml = '<div>A div</div> and <span>a span</span>';
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });
});
