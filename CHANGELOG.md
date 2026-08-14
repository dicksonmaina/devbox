# Changelog

All notable changes to DevBox will be documented here.

## [0.2.0] - 2026-08-14

### Added
- 5 new tools: URL Encoder, Color Converter, Text Diff, Password Generator, Hash Generator
- Plugin architecture for easy tool addition
- PWA support (offline mode, install prompt)
- Search and category filtering
- Privacy-first local analytics
- Automated CI/CD via GitHub Actions
- Autonomous management system

### Changed
- Migrated all tools to `src/plugins/` directory
- Improved UI with sticky header and search bar
- Lazy loading for all tool components

### Security
- Content Security Policy ready
- All processing client-side only
- Added security.txt, robots.txt, sitemap.xml

## [0.1.0] - 2026-08-14

### Added
- Initial release with 6 tools: JSON, Base64, Regex, JWT, UUID, Timestamp
- GitHub Pages deployment
- Basic UI with tool switching
