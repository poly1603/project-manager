# @ldesign/project-manager

项目管理工具，提供项目信息检测、依赖管理等功能。

## 功能特性

- ✅ 检测项目类型（Vue、React、Angular 等）
- ✅ 检测包管理器（npm、yarn、pnpm、bun）
- ✅ 检测 monorepo 项目
- ✅ 获取项目配置和信息
- ✅ 运行项目脚本
- ✅ 安装项目依赖

## 安装

```bash
pnpm add @ldesign/project-manager
```

## 使用方法

### 基本用法

```typescript
import { createProjectManager } from '@ldesign/project-manager'

const manager = createProjectManager({
  verbose: true
})

// 获取项目信息
const info = await manager.getProjectInfo('/path/to/project')
console.log('Project:', info.config.name)
console.log('Type:', info.config.type)
console.log('Package Manager:', info.config.packageManager)
```

### 检测项目类型

```typescript
const manager = createProjectManager()

const type = await manager.detectProjectType('/path/to/project')
console.log('Project type:', type) // 'vue', 'react', 'angular', etc.
```

### 检测包管理器

```typescript
const manager = createProjectManager()

const pm = await manager.detectPackageManager('/path/to/project')
console.log('Package manager:', pm) // 'npm', 'yarn', 'pnpm', 'bun'
```

### 运行脚本

```typescript
const manager = createProjectManager()

// 运行 dev 脚本
await manager.runScript('/path/to/project', 'dev')

// 运行 build 脚本
await manager.runScript('/path/to/project', 'build')
```

### 安装依赖

```typescript
const manager = createProjectManager()

await manager.install('/path/to/project')
```

## API 文档

### ProjectManager

主要的项目管理器类。

#### 方法

- `detectProjectType(projectRoot)`: 检测项目类型
- `detectPackageManager(projectRoot)`: 检测包管理器
- `isMonorepo(projectRoot)`: 检测是否为 monorepo
- `getProjectConfig(projectRoot)`: 获取项目配置
- `getProjectInfo(projectRoot)`: 获取项目信息
- `runScript(projectRoot, scriptName)`: 运行脚本
- `install(projectRoot)`: 安装依赖

### 工具函数

- `createProjectManager(config?)`: 创建管理器实例

## License

MIT
