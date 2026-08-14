export interface ToolPlugin {
  id: string
  name: string
  description: string
  icon: string
  category: string
  tags: string[]
  component: React.LazyExoticComponent<React.ComponentType<unknown>>
  featured?: boolean
}

export type ToolId =
  | 'json'
  | 'base64'
  | 'regex'
  | 'jwt'
  | 'uuid'
  | 'timestamp'
  | 'url'
  | 'color'
  | 'diff'
  | 'password'
  | 'hash'

export const TOOL_REGISTRY: Record<ToolId, ToolPlugin> = {} as Record<ToolId, ToolPlugin>

export function registerTool(tool: ToolPlugin) {
  TOOL_REGISTRY[tool.id as ToolId] = tool
}

export function getTool(id: ToolId): ToolPlugin | undefined {
  return TOOL_REGISTRY[id]
}

export function getAllTools(): ToolPlugin[] {
  return Object.values(TOOL_REGISTRY)
}

export function getToolsByCategory(category: string): ToolPlugin[] {
  return getAllTools().filter((t) => t.category === category)
}
