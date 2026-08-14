import { lazy } from 'react'

const JsonTool = lazy(() => import('./JsonTool').then(m => ({ default: m.JsonTool })))
const Base64Tool = lazy(() => import('./Base64Tool').then(m => ({ default: m.Base64Tool })))
const RegexTool = lazy(() => import('./RegexTool').then(m => ({ default: m.RegexTool })))
const JwtTool = lazy(() => import('./JwtTool').then(m => ({ default: m.JwtTool })))
const UuidTool = lazy(() => import('./UuidTool').then(m => ({ default: m.UuidTool })))
const TimestampTool = lazy(() => import('./TimestampTool').then(m => ({ default: m.TimestampTool })))
const UrlTool = lazy(() => import('./UrlTool').then(m => ({ default: m.UrlTool })))
const ColorTool = lazy(() => import('./ColorTool').then(m => ({ default: m.ColorTool })))
const DiffTool = lazy(() => import('./DiffTool').then(m => ({ default: m.DiffTool })))
const PasswordTool = lazy(() => import('./PasswordTool').then(m => ({ default: m.PasswordTool })))
const HashTool = lazy(() => import('./HashTool').then(m => ({ default: m.HashTool })))
const HtmlEntityTool = lazy(() => import('./HtmlEntityTool').then(m => ({ default: m.HtmlEntityTool })))
const TextStatisticsTool = lazy(() => import('./TextStatisticsTool').then(m => ({ default: m.TextStatisticsTool })))

import { registerTool, type ToolPlugin } from '../plugins'

export function registerAllTools() {
  const tools: Omit<ToolPlugin, 'component'>[] = [
    { id: 'json', name: 'JSON Formatter', description: 'Format, validate & minify JSON', icon: 'braces', category: 'data', tags: ['json', 'format', 'validate'], featured: true },
    { id: 'base64', name: 'Base64', description: 'Encode & decode Base64 strings', icon: 'hash', category: 'encoding', tags: ['base64', 'encode', 'decode'], featured: true },
    { id: 'regex', name: 'Regex Tester', description: 'Test patterns with live matching', icon: 'regex', category: 'text', tags: ['regex', 'pattern', 'test'], featured: true },
    { id: 'jwt', name: 'JWT Decoder', description: 'Decode & inspect JSON Web Tokens', icon: 'key', category: 'auth', tags: ['jwt', 'token', 'decode'], featured: true },
    { id: 'uuid', name: 'UUID Generator', description: 'Generate v4 UUIDs instantly', icon: 'fingerprint', category: 'generators', tags: ['uuid', 'id', 'generate'] },
    { id: 'timestamp', name: 'Timestamp', description: 'Convert Unix timestamps to dates', icon: 'clock', category: 'converters', tags: ['timestamp', 'unix', 'date'] },
    { id: 'url', name: 'URL Encoder', description: 'Encode & decode URL components', icon: 'link', category: 'encoding', tags: ['url', 'encode', 'decode', 'query'], featured: true },
    { id: 'color', name: 'Color Converter', description: 'Convert between HEX, RGB, HSL', icon: 'palette', category: 'converters', tags: ['color', 'hex', 'rgb', 'hsl'], featured: true },
    { id: 'diff', name: 'Text Diff', description: 'Compare two texts side by side', icon: 'git-compare', category: 'text', tags: ['diff', 'compare', 'text'], featured: true },
    { id: 'password', name: 'Password Generator', description: 'Generate secure passwords', icon: 'lock', category: 'generators', tags: ['password', 'security', 'generate'], featured: true },
    { id: 'hash', name: 'Hash Generator', description: 'Generate MD5, SHA-1, SHA-256 hashes', icon: 'shield-check', category: 'generators', tags: ['hash', 'md5', 'sha', 'crypto'] },
    { id: 'text-statistics', name: 'Text Statistics', description: 'Count words, characters, sentences, and readability', icon: 'bar-chart', category: 'text', tags: ['text', 'statistics', 'word count', 'readability'], featured: false },
  ]

  const components: Record<string, React.LazyExoticComponent<React.ComponentType<unknown>>> = {
    json: JsonTool,
    base64: Base64Tool,
    regex: RegexTool,
    jwt: JwtTool,
    uuid: UuidTool,
    timestamp: TimestampTool,
    url: UrlTool,
    color: ColorTool,
    diff: DiffTool,
    password: PasswordTool,
    hash: HashTool,
    'html-entity': HtmlEntityTool,
    'text-statistics': TextStatisticsTool,
  }

  for (const tool of tools) {
    registerTool({
      ...tool,
      component: components[tool.id] as ToolPlugin['component'],
    })
  }
}
