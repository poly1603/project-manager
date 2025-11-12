/**
 * 项目管理器
 * 
 * 提供项目信息检测、依赖管理等功能
 */

import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'node:path'
import type {
  ProjectType,
  PackageManager,
  ProjectConfig,
  ProjectInfo,
  ProjectManagerConfig,
} from './types'

/**
 * 项目管理器类
 */
export class ProjectManager {
  private config: ProjectManagerConfig

  constructor(config: ProjectManagerConfig = {}) {
    this.config = {
      verbose: config.verbose ?? false,
      ...config,
    }
  }

  /**
   * 检测项目类型
   */
  async detectProjectType(projectRoot: string): Promise<ProjectType> {
    try {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      
      if (!await fs.pathExists(packageJsonPath)) {
        return 'unknown'
      }

      const packageJson = await fs.readJson(packageJsonPath)
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      // 按优先级检测框架
      if (deps['nuxt'] || deps['nuxt3']) return 'nuxt'
      if (deps['next']) return 'next'
      if (deps['@remix-run/react']) return 'remix'
      if (deps['astro']) return 'astro'
      if (deps['vue'] || deps['@vue/cli-service']) return 'vue'
      if (deps['react'] || deps['react-dom']) return 'react'
      if (deps['@angular/core']) return 'angular'
      if (deps['svelte']) return 'svelte'
      if (deps['solid-js']) return 'solid'
      if (deps['@builder.io/qwik']) return 'qwik'
      if (deps['lit']) return 'lit'
      if (deps['preact']) return 'preact'

      return 'unknown'
    } catch (error) {
      this.log(`Failed to detect project type: ${error}`)
      return 'unknown'
    }
  }

  /**
   * 检测包管理器
   */
  async detectPackageManager(projectRoot: string): Promise<PackageManager> {
    try {
      // 检查 lock 文件
      if (await fs.pathExists(path.join(projectRoot, 'pnpm-lock.yaml'))) {
        return 'pnpm'
      }
      if (await fs.pathExists(path.join(projectRoot, 'yarn.lock'))) {
        return 'yarn'
      }
      if (await fs.pathExists(path.join(projectRoot, 'bun.lockb'))) {
        return 'bun'
      }
      if (await fs.pathExists(path.join(projectRoot, 'package-lock.json'))) {
        return 'npm'
      }

      // 检查 package.json 中的 packageManager 字段
      const packageJsonPath = path.join(projectRoot, 'package.json')
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath)
        if (packageJson.packageManager) {
          const pm = packageJson.packageManager.split('@')[0]
          return pm as PackageManager
        }
      }

      // 默认返回 npm
      return 'npm'
    } catch (error) {
      this.log(`Failed to detect package manager: ${error}`)
      return 'npm'
    }
  }

  /**
   * 检测是否为 monorepo
   */
  async isMonorepo(projectRoot: string): Promise<boolean> {
    try {
      const packageJsonPath = path.join(projectRoot, 'package.json')
      
      if (!await fs.pathExists(packageJsonPath)) {
        return false
      }

      const packageJson = await fs.readJson(packageJsonPath)
      
      // 检查是否有 workspaces 字段
      if (packageJson.workspaces) {
        return true
      }

      // 检查是否有 pnpm-workspace.yaml
      if (await fs.pathExists(path.join(projectRoot, 'pnpm-workspace.yaml'))) {
        return true
      }

      // 检查是否有 lerna.json
      if (await fs.pathExists(path.join(projectRoot, 'lerna.json'))) {
        return true
      }

      return false
    } catch (error) {
      this.log(`Failed to check monorepo: ${error}`)
      return false
    }
  }

  /**
   * 获取项目配置
   */
  async getProjectConfig(projectRoot: string): Promise<ProjectConfig> {
    const packageJsonPath = path.join(projectRoot, 'package.json')
    const packageJson = await fs.readJson(packageJsonPath)

    const type = await this.detectProjectType(projectRoot)
    const packageManager = await this.detectPackageManager(projectRoot)
    const isMonorepo = await this.isMonorepo(projectRoot)

    const config: ProjectConfig = {
      name: packageJson.name || path.basename(projectRoot),
      type,
      root: projectRoot,
      packageManager,
      packageJson,
      isMonorepo,
    }

    if (isMonorepo && packageJson.workspaces) {
      config.workspaces = Array.isArray(packageJson.workspaces)
        ? packageJson.workspaces
        : packageJson.workspaces.packages || []
    }

    return config
  }

  /**
   * 获取项目信息
   */
  async getProjectInfo(projectRoot: string): Promise<ProjectInfo> {
    const config = await this.getProjectConfig(projectRoot)

    return {
      config,
      dependencies: {
        prod: config.packageJson.dependencies || {},
        dev: config.packageJson.devDependencies || {},
      },
      scripts: config.packageJson.scripts || {},
    }
  }

  /**
   * 运行脚本命令
   */
  async runScript(projectRoot: string, scriptName: string): Promise<void> {
    const config = await this.getProjectConfig(projectRoot)
    const pm = config.packageManager

    this.log(`Running script "${scriptName}" with ${pm}...`)

    await execa(pm, ['run', scriptName], {
      cwd: projectRoot,
      stdio: 'inherit',
    })
  }

  /**
   * 安装依赖
   */
  async install(projectRoot: string): Promise<void> {
    const config = await this.getProjectConfig(projectRoot)
    const pm = config.packageManager

    this.log(`Installing dependencies with ${pm}...`)

    await execa(pm, ['install'], {
      cwd: projectRoot,
      stdio: 'inherit',
    })
  }

  /**
   * 日志输出
   */
  private log(message: string): void {
    if (this.config.verbose) {
      console.log(`[ProjectManager] ${message}`)
    }
  }
}

/**
 * 创建项目管理器实例
 */
export function createProjectManager(config?: ProjectManagerConfig): ProjectManager {
  return new ProjectManager(config)
}
