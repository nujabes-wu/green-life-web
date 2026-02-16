# 网站部署至 Vercel 完整流程

## 项目准备

1. **确保项目可构建**
   - 本地运行 `npm run build` 确保无错误
   - 检查 `src/components/Footer.tsx` 中的 GitHub 链接已更新为 `https://github.com/nujabes-wu`

2. **必要的环境变量**
   - `NEXT_PUBLIC_SUPABASE_URL` (可选)
   - `NEXT_PUBLIC_SILICONFLOW_API_KEY`

## 部署步骤

### 步骤 1：创建 Vercel 账号

如果您还没有 Vercel 账号：
1. 访问 [Vercel 官网](https://vercel.com/)
2. 点击 "Sign Up"
3. 使用 GitHub/邮箱注册

### 步骤 2：导入项目

1. 登录 Vercel 控制台
2. 点击 "Add New Project"
3. 选择 "Import Project"
4. 选择 "From Git Repository"
5. 粘贴您的 GitHub 仓库 URL：
   ```
   https://github.com/nujabes-wu/green-life-web
   ```
6. 点击 "Continue"

### 步骤 3：配置项目

1. **Project Name**: 保持默认或自定义
2. **Framework Preset**: Next.js
3. **Root Directory**: 保持默认
4. **Build Command**: 保持默认 (`npm run build`)
5. **Output Directory**: 保持默认

### 步骤 4：添加环境变量

在 "Environment Variables" 部分添加：

| 变量名 | 值 |
|--------|----|
| NEXT_PUBLIC_SUPABASE_URL | https://github.com/nujabes-wu |
| NEXT_PUBLIC_SILICONFLOW_API_KEY | [您的 API Key] |
| NEXT_PUBLIC_SUPABASE_URL | [您的 Supabase URL] |

### 步骤 5：部署

1. 点击 "Deploy"
2. Vercel 将自动构建和部署您的项目
3. 部署完成后，您将获得一个 Vercel 域名，例如：`your-project.vercel.app`

## 后续配置

### 自定义域名 (可选)

1. 在 Vercel 项目设置中，进入 "Domains"
2. 添加您的自定义域名
3. 按照提示完成域名验证

### 环境变量管理

对于生产环境，建议在 Vercel 项目设置中配置所有必要的环境变量，而不是硬编码在代码中。

## 常见问题

- **构建失败**: 检查 `npm run build` 是否在本地成功
- **环境变量未生效**: 在 Vercel 控制台中重新部署并清除缓存
- **域名访问问题**: 确保 GitHub 仓库存在且可访问

## 部署成功！

您的网站已成功部署至 Vercel，可通过分配的域名访问。