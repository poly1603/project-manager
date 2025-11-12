/**
 * 项目类型
 */
export type ProjectType = 'vue' | 'react' | 'angular' | 'svelte' | 'solid' | 'qwik' | 'lit' | 'preact' | 'nuxt' | 'next' | 'remix' | 'astro' | 'unknown'

/**
 * 包管理器类型
 */
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun'

/**
 * 项目配置
 */
export interface ProjectConfig {
  /** 项目名称 */
  name: string
  /** 项目类型 */
  type: ProjectType
  /** 项目根目录 */
  root: string
  /** 包管理器 */
  packageManager: PackageManager
  /** package.json 内容 */
  packageJson: any
  /** 是否为 monorepo */
  isMonorepo: boolean
  /** 工作空间包列表（如果是 monorepo） */
  workspaces?: string[]
}

/**
 * 项目信息
 */
export interface ProjectInfo {
  /** 项目配置 */
  config: ProjectConfig
  /** 依赖信息 */
  dependencies: {
    /** 生产依赖 */
    prod: Record<string, string>
    /** 开发依赖 */
    dev: Record<string, string>
  }
  /** 脚本命令 */
  scripts: Record<string, string>
}

/**
 * 项目管理器配置
 */
export interface ProjectManagerConfig {
  /** 是否显示详细日志 */
  verbose?: boolean
}
