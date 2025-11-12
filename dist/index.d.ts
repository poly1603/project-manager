/**
 * 项目类型
 */
type ProjectType = 'vue' | 'react' | 'angular' | 'svelte' | 'solid' | 'qwik' | 'lit' | 'preact' | 'nuxt' | 'next' | 'remix' | 'astro' | 'unknown';
/**
 * 包管理器类型
 */
type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
/**
 * 项目配置
 */
interface ProjectConfig {
    /** 项目名称 */
    name: string;
    /** 项目类型 */
    type: ProjectType;
    /** 项目根目录 */
    root: string;
    /** 包管理器 */
    packageManager: PackageManager;
    /** package.json 内容 */
    packageJson: any;
    /** 是否为 monorepo */
    isMonorepo: boolean;
    /** 工作空间包列表（如果是 monorepo） */
    workspaces?: string[];
}
/**
 * 项目信息
 */
interface ProjectInfo {
    /** 项目配置 */
    config: ProjectConfig;
    /** 依赖信息 */
    dependencies: {
        /** 生产依赖 */
        prod: Record<string, string>;
        /** 开发依赖 */
        dev: Record<string, string>;
    };
    /** 脚本命令 */
    scripts: Record<string, string>;
}
/**
 * 项目管理器配置
 */
interface ProjectManagerConfig {
    /** 是否显示详细日志 */
    verbose?: boolean;
}

/**
 * 项目管理器
 *
 * 提供项目信息检测、依赖管理等功能
 */

/**
 * 项目管理器类
 */
declare class ProjectManager {
    private config;
    constructor(config?: ProjectManagerConfig);
    /**
     * 检测项目类型
     */
    detectProjectType(projectRoot: string): Promise<ProjectType>;
    /**
     * 检测包管理器
     */
    detectPackageManager(projectRoot: string): Promise<PackageManager>;
    /**
     * 检测是否为 monorepo
     */
    isMonorepo(projectRoot: string): Promise<boolean>;
    /**
     * 获取项目配置
     */
    getProjectConfig(projectRoot: string): Promise<ProjectConfig>;
    /**
     * 获取项目信息
     */
    getProjectInfo(projectRoot: string): Promise<ProjectInfo>;
    /**
     * 运行脚本命令
     */
    runScript(projectRoot: string, scriptName: string): Promise<void>;
    /**
     * 安装依赖
     */
    install(projectRoot: string): Promise<void>;
    /**
     * 日志输出
     */
    private log;
}
/**
 * 创建项目管理器实例
 */
declare function createProjectManager(config?: ProjectManagerConfig): ProjectManager;

export { type PackageManager, type ProjectConfig, type ProjectInfo, ProjectManager, type ProjectManagerConfig, type ProjectType, createProjectManager, createProjectManager as default };
