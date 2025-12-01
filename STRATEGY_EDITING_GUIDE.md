# How to Edit the Visory Strategy Page

The Visory 3-Month SEO & Conversion Strategy page now **automatically reads from the markdown file**. You don't need to edit any code files!

## Quick Start

### To Update Strategy Content:

1. **Open the file**: `/Users/Shared/GIT/EarnedMedia-SEO-Agent/strategy.md`
2. **Edit the content** using standard markdown syntax
3. **Save the file**
4. **Refresh the page** in your browser - changes appear immediately!

That's it! The page at `/strategy/visory-strategy` will automatically display your updated content.

---

## Markdown Formatting Guide

The `strategy.md` file uses standard markdown syntax. Here's what you can use:

### Headings

```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection Title (H3)
```

**Example:**
```markdown
## **Month 1: Foundation & Trust Building**
*Goal: Fix critical trust and credibility issues*

### Week 1-2: Immediate Trust Signals
```

### Lists

```markdown
- Bullet point item 1
- Bullet point item 2
- Bullet point item 3
```

**Example:**
```markdown
- Google Business Profile setup
- Review management strategy
- Testimonials overhaul
```

### Emphasis

```markdown
*Italic text*
**Bold text**
```

**Example:**
```markdown
*Goal: Improve organic visibility*
**Trust & Credibility**
```

### Horizontal Rules (Section Dividers)

```markdown
---
```

This creates a visual separator between sections.

---

## Page Structure

The `strategy.md` file follows this structure:

```
# Page Title

## Section 1
*Goal: Description*

### Subsection 1-1
- Item 1
- Item 2

### Subsection 1-2
- Item 1
- Item 2

---

## Section 2
*Goal: Description*

[... and so on]
```

---

## Tips for Editing

1. **Keep the structure**: The page looks best when you maintain the same heading hierarchy (H2 for main sections, H3 for subsections)

2. **Use Goals**: The italic text starting with "Goal:" gets special styling with a blue background box

3. **Bold keywords**: Use `**text**` to make important terms stand out

4. **Lists are your friend**: Use bullet points for action items and deliverables

5. **Section dividers**: Use `---` to visually separate major sections

---

## What NOT to Edit

You generally **should not need to edit** these files unless you want to change the visual design:

- `/pages/strategy/visory-strategy.js` - The React component that renders the page
- `/pages/strategy.js` - The main strategy tool page

---

## Advanced: Customizing the Page Design

If you want to change colors, fonts, or layout, you'll need to edit:

### File: `/pages/strategy/visory-strategy.js`

**Common customizations:**

#### Change the header color:
Look for line ~26:
```javascript
backgroundColor: "#1E40AF",  // Change this hex color
```

#### Change section styling:
Look for lines ~154-169 in the `htmlContent.replace()` chains:
```javascript
.replace(/<h2>/g, '<h2 style="color: #111; font-size: 24px; ...">')
```

#### Change the goal box styling:
Look for line ~158:
```javascript
.replace(/<em>Goal: (.*?)<\/em>/g,
  '<div style="background-color: #EFF6FF; padding: 12px; ...">')
```

---

## File Locations Quick Reference

| What to Edit | File Path |
|-------------|-----------|
| **Strategy content** (text, sections, lists) | `/strategy.md` |
| **Page design** (colors, fonts, layout) | `/pages/strategy/visory-strategy.js` |
| **Link to strategy page** | `/pages/strategy.js` |

---

## Testing Your Changes

1. Make sure the dev server is running:
   ```bash
   npm run dev
   ```

2. Open your browser to:
   ```
   http://localhost:3000/strategy/visory-strategy
   ```

3. Edit `strategy.md` and save

4. Refresh the page - you should see your changes immediately!

---

## Common Issues

### Changes don't appear?

- **Hard refresh**: Press `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows) to force reload
- **Check the file**: Make sure you saved `strategy.md`
- **Restart dev server**: Stop the server (Ctrl+C) and run `npm run dev` again

### Formatting looks wrong?

- Check your markdown syntax (headings need space after #)
- Make sure you're using standard markdown
- Lists need a space after the dash: `- Item` not `-Item`

---

## Need Help?

If you have questions about:
- **Markdown syntax**: https://www.markdownguide.org/basic-syntax/
- **React/Next.js customization**: Check the Next.js docs or ask for help
- **Specific styling changes**: Feel free to ask!
