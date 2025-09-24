import { describe, it, expect } from 'vitest';
import markdownIt from 'markdown-it';
import markdownItSanitizeHtml from '../src/index';
import TaskCheckbox from 'markdown-it-task-checkbox';

describe('markdown-it-sanitize-html', () => {
  it('should sanitize basic XSS attempts', () => {
    const md = markdownIt({ html: true }).use(markdownItSanitizeHtml);
    const unsafeMarkdown = '<b onclick="alert(\'XSS\')">bold</b>';
    const expectedHtml = '<p><b>bold</b></p>\n';
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });

  it('should sanitize image with onerror attribute', () => {
    const md = markdownIt({ html: true }).use(markdownItSanitizeHtml, {
      allowedTags: ['img'],
    });
    const unsafeMarkdown = '<img src="x" onerror="alert(\'XSS\')">';
    const expectedHtml = '<img src="x" />';
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });

  it('should sanitize inline and block HTML', () => {
    const md = markdownIt({ html: true }).use(markdownItSanitizeHtml);
    const unsafeMarkdown = '<div>A div</div> and <span onmouseover="alert(1)">a span</span>';
    const expectedHtml = '<div>A div</div> and <span>a span</span>';
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });

  it('should only sanitize user-specified tags in Markdown', () => {
    const md = markdownIt({ html: true })
      .use(TaskCheckbox)
      .use(markdownItSanitizeHtml);

    const unsafeMarkdown = `- [ ] Task 1
- [x] Task 2

<form>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name">
</form>`;

    const expectedHtml = `<ul class="task-list">
<li class="task-list-item"><input type="checkbox" id="cbx_0" disabled="true"><label for="cbx_0"> Task 1</label></li>
<li class="task-list-item"><input type="checkbox" id="cbx_1" checked="true" disabled="true"><label for="cbx_1"> Task 2</label></li>
</ul>

  Name:
  
`;
    const actualHtml = md.render(unsafeMarkdown);
    expect(actualHtml).toBe(expectedHtml);
  });
});
