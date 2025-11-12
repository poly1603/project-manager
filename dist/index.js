import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';

// src/project-manager.ts
var ProjectManager = class {
  config;
  constructor(config = {}) {
    this.config = {
      verbose: config.verbose ?? false,
      ...config
    };
  }
  /**
   * 检测项目类型
   */
  async detectProjectType(projectRoot) {
    try {
      const packageJsonPath = path.join(projectRoot, "package.json");
      if (!await fs.pathExists(packageJsonPath)) {
        return "unknown";
      }
      const packageJson = await fs.readJson(packageJsonPath);
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      if (deps["nuxt"] || deps["nuxt3"]) return "nuxt";
      if (deps["next"]) return "next";
      if (deps["@remix-run/react"]) return "remix";
      if (deps["astro"]) return "astro";
      if (deps["vue"] || deps["@vue/cli-service"]) return "vue";
      if (deps["react"] || deps["react-dom"]) return "react";
      if (deps["@angular/core"]) return "angular";
      if (deps["svelte"]) return "svelte";
      if (deps["solid-js"]) return "solid";
      if (deps["@builder.io/qwik"]) return "qwik";
      if (deps["lit"]) return "lit";
      if (deps["preact"]) return "preact";
      return "unknown";
    } catch (error) {
      this.log(`Failed to detect project type: ${error}`);
      return "unknown";
    }
  }
  /**
   * 检测包管理器
   */
  async detectPackageManager(projectRoot) {
    try {
      if (await fs.pathExists(path.join(projectRoot, "pnpm-lock.yaml"))) {
        return "pnpm";
      }
      if (await fs.pathExists(path.join(projectRoot, "yarn.lock"))) {
        return "yarn";
      }
      if (await fs.pathExists(path.join(projectRoot, "bun.lockb"))) {
        return "bun";
      }
      if (await fs.pathExists(path.join(projectRoot, "package-lock.json"))) {
        return "npm";
      }
      const packageJsonPath = path.join(projectRoot, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        if (packageJson.packageManager) {
          const pm = packageJson.packageManager.split("@")[0];
          return pm;
        }
      }
      return "npm";
    } catch (error) {
      this.log(`Failed to detect package manager: ${error}`);
      return "npm";
    }
  }
  /**
   * 检测是否为 monorepo
   */
  async isMonorepo(projectRoot) {
    try {
      const packageJsonPath = path.join(projectRoot, "package.json");
      if (!await fs.pathExists(packageJsonPath)) {
        return false;
      }
      const packageJson = await fs.readJson(packageJsonPath);
      if (packageJson.workspaces) {
        return true;
      }
      if (await fs.pathExists(path.join(projectRoot, "pnpm-workspace.yaml"))) {
        return true;
      }
      if (await fs.pathExists(path.join(projectRoot, "lerna.json"))) {
        return true;
      }
      return false;
    } catch (error) {
      this.log(`Failed to check monorepo: ${error}`);
      return false;
    }
  }
  /**
   * 获取项目配置
   */
  async getProjectConfig(projectRoot) {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = await fs.readJson(packageJsonPath);
    const type = await this.detectProjectType(projectRoot);
    const packageManager = await this.detectPackageManager(projectRoot);
    const isMonorepo = await this.isMonorepo(projectRoot);
    const config = {
      name: packageJson.name || path.basename(projectRoot),
      type,
      root: projectRoot,
      packageManager,
      packageJson,
      isMonorepo
    };
    if (isMonorepo && packageJson.workspaces) {
      config.workspaces = Array.isArray(packageJson.workspaces) ? packageJson.workspaces : packageJson.workspaces.packages || [];
    }
    return config;
  }
  /**
   * 获取项目信息
   */
  async getProjectInfo(projectRoot) {
    const config = await this.getProjectConfig(projectRoot);
    return {
      config,
      dependencies: {
        prod: config.packageJson.dependencies || {},
        dev: config.packageJson.devDependencies || {}
      },
      scripts: config.packageJson.scripts || {}
    };
  }
  /**
   * 运行脚本命令
   */
  async runScript(projectRoot, scriptName) {
    const config = await this.getProjectConfig(projectRoot);
    const pm = config.packageManager;
    this.log(`Running script "${scriptName}" with ${pm}...`);
    await execa(pm, ["run", scriptName], {
      cwd: projectRoot,
      stdio: "inherit"
    });
  }
  /**
   * 安装依赖
   */
  async install(projectRoot) {
    const config = await this.getProjectConfig(projectRoot);
    const pm = config.packageManager;
    this.log(`Installing dependencies with ${pm}...`);
    await execa(pm, ["install"], {
      cwd: projectRoot,
      stdio: "inherit"
    });
  }
  /**
   * 日志输出
   */
  log(message) {
    if (this.config.verbose) {
      console.log(`[ProjectManager] ${message}`);
    }
  }
};
function createProjectManager(config) {
  return new ProjectManager(config);
}

export { ProjectManager, createProjectManager, createProjectManager as default };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map