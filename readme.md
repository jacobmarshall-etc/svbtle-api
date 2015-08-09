# Svbtle API (svbtle-api.herokuapp.com)

## Data Structure

### Article

- `title` (String)
- `content` (String)
- `markdown` (String)
- `author` (String)
- `timestamp` (Number)
- `url` (String)

Example:

```json
{
  "title": "August 3, 2015",
  "content": "<p>I should really change my domain for this blog. It’d be nice if Svbtle still...",
  "markdown": "I should really change my domain for this blog. It’d be nice if Svbtle still...",
  "author": "Josh Trommel",
  "timestamp": 1438671094000,
  "url": "http://nulljosh.svbtle.com/august-3-2015"
}
```

## API Endpoints

### `/:username/latest`

Gets the latest article from a user's blog - where `:username` is the user's username.

### `/:username/latest/:count`

Gets the latest x amount of articles from a user's blog - where `:username` is the user's username, and `:count` is the amount of articles to return. The maximum amount of articles is `10`.