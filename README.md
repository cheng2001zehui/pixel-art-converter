# 图片转像素工具

一款功能完整的图片转像素软件，支持多种格式导入、参数调整、实时预览和多种格式导出。

## 功能特性

- ✅ 支持导入常见图片格式（JPG、PNG、GIF等）
- ✅ 自定义像素化参数（像素块大小、颜色数量、输出尺寸）
- ✅ 实时预览功能
- ✅ 支持多种导出格式（PNG、SVG、JSON像素数据）
- ✅ 批量处理功能
- ✅ 响应式设计，用户友好的界面

## 技术栈

- React + Vite
- Canvas API 图像处理
- 响应式 CSS 设计

## 如何运行

1. 克隆仓库
```bash
git clone https://github.com/cheng2001zehui/pixel-art-converter.git
```

2. 安装依赖
```bash
cd pixel-art-converter
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 项目结构

- `index.html` - 主HTML文件
- `vite.config.js` - Vite配置文件
- `package.json` - 项目配置和依赖
- `src/App.jsx` - 主应用组件
- `src/App.css` - 样式文件
- `src/main.jsx` - 应用入口
- `src/index.css` - 基础样式

## 核心功能

### 1. 图片上传
- 支持单张图片上传
- 支持批量上传多张图片

### 2. 像素化处理
- 基于Canvas API实现
- 实时参数调整
- 保持原始图像特征

### 3. 参数调整
- 像素块大小：1-50px
- 颜色数量：2-256色
- 输出尺寸：100-2000px

### 4. 导出功能
- PNG格式
- SVG格式
- JSON像素数据格式

### 5. 批量处理
- 支持同时处理多张图片
- 提高工作效率

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT License