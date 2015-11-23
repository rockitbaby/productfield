# productfield.com

The Product Field Website

---

## Development

### Prerequisites

- node
- npm
- bower

### Frontend-Stack

Markdown, Handlebars, Stylus

### Setup

- `npm install`
- `bower install`

### Daily

- `gulp dev`
- visit http://localhost:8080

Write content blocks in src/content/example.md as markdown file. Content is than included in .hbs files using `{{> content-example}}`.

### Deployment

`gulp deploy-beta`

#### Live

```
gulp build
gulp dist
gulp deploy-production
```
