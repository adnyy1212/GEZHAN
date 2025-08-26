# 基础 Web 网站示例

本项目依据 `cursor rules` 要求创建：语义化 HTML、响应式设计（Bootstrap）、模块化样式与脚本、可访问性与表单校验。

## 功能
- 响应式导航与首页英雄区
- 功能卡片与优势展示
- 联系我们表单（前端校验）
- 统一页脚与返回顶部

## 技术栈
- HTML5 语义化结构
- Bootstrap 5（CDN）
- 自定义 CSS（`assets/css/styles.css`）
- 原生 JavaScript（`assets/js/main.js`）

## 目录结构
```
.
├─ index.html
├─ assets
│  ├─ css
│  │  └─ styles.css
│  └─ js
│     └─ main.js
└─ README.md
```

## 开发指南
- 直接使用浏览器打开 `index.html` 进行预览
- 如需本地静态服务器，可使用 `npx serve` 或 VSCode Live Server

## 代码规范与最佳实践
- 遵循组件化与模块化思维，将样式与脚本拆分
- 语义化标签与 ARIA 属性，提升可访问性
- 表单使用约束 API 与自定义校验
- 保持样式可配置（CSS 变量），便于主题调整

## 后续规划
- 增加更多页面（关于/博客/隐私）
- 进阶性能优化（资源压缩、缓存策略）
- 简单单元测试（表单校验逻辑）


