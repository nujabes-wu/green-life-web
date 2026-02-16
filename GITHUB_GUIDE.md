# 将项目保存至 GitHub 仓库完整流程

## 准备工作

1. **安装 Git**
   - 访问 [Git 官网](https://git-scm.com/downloads) 下载并安装
   - 安装完成后，在命令行输入 `git --version` 验证安装成功

2. **GitHub 账号**
   - 确保您已拥有 GitHub 账号：`nujabes-wu`
   - 登录 GitHub 官网：[https://github.com/](https://github.com/)

## 步骤 1：初始化本地 Git 仓库

1. **进入项目目录**
   ```bash
   cd E:\greenlife-web\03_project_11\green-life-web
   ```

2. **初始化 Git 仓库**
   ```bash
   git init
   ```

3. **添加 .gitignore 文件**
   如果项目中没有 `.gitignore` 文件，创建一个：
   ```bash
   echo "# 依赖项\nnode_modules/\n\n# 构建产物\n.next/\nout/\n\n# 环境变量\n.env.local\n.env.development.local\n.env.test.local\n.env.production.local\n\n# 日志\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\n\n# IDE\n.vscode/\n.idea/\n*.swp\n*.swo\n*~" > .gitignore
   ```

## 步骤 2：创建 GitHub 远程仓库

1. **登录 GitHub**
   - 访问 [GitHub 官网](https://github.com/)
   - 登录账号 `nujabes-wu`

2. **创建新仓库**
   - 点击右上角的 "+" 图标
   - 选择 "New repository"
   - **Repository name**: `green-life-web`
   - **Description**: 可选，填写项目描述
   - **Visibility**: 选择 "Public" 或 "Private"
   - **Initialize this repository with**: 不要勾选任何选项
   - 点击 "Create repository"

3. **复制远程仓库 URL**
   创建完成后，复制仓库的 HTTPS 或 SSH URL，例如：
   ```
   https://github.com/nujabes-wu/green-life-web.git
   ```

## 步骤 3：关联本地仓库与远程仓库

1. **添加远程仓库**
   ```bash
   git remote add origin https://github.com/nujabes-wu/green-life-web.git
   ```

2. **验证远程仓库**
   ```bash
   git remote -v
   ```
   输出应显示：
   ```
   origin  https://github.com/nujabes-wu/green-life-web.git (fetch)
   origin  https://github.com/nujabes-wu/green-life-web.git (push)
   ```

## 步骤 4：提交并推送代码

1. **添加文件到暂存区**
   ```bash
   git add .
   ```

2. **提交代码**
   ```bash
   git commit -m "Initial commit: 绿色生活网站项目"
   ```

3. **推送代码到远程仓库**
   ```bash
   git push -u origin main
   ```

   **注意**：如果默认分支是 `master`，使用：
   ```bash
   git push -u origin master
   ```

## 步骤 5：验证推送成功

1. **访问 GitHub 仓库**
   - 打开浏览器，访问：`https://github.com/nujabes-wu/green-life-web`
   - 检查文件是否已成功上传

## 后续操作

### 推送新更改

当您对项目进行修改后，可通过以下步骤推送：

1. **添加更改**
   ```bash
   git add .
   ```

2. **提交更改**
   ```bash
   git commit -m "描述您的更改"
   ```

3. **推送更改**
   ```bash
   git push
   ```

### 分支管理（可选）

如果需要创建新分支：

1. **创建并切换分支**
   ```bash
   git checkout -b feature-branch
   ```

2. **推送分支**
   ```bash
   git push -u origin feature-branch
   ```

## 常见问题

1. **推送失败 - 权限错误**
   - 检查 GitHub 账号是否正确
   - 确保您对仓库有写入权限
   - 考虑使用 SSH 密钥认证（见下方）

2. **SSH 密钥配置**
   为避免每次推送输入密码，可配置 SSH 密钥：
   ```bash
   # 生成 SSH 密钥
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # 复制公钥到 GitHub
   clip < ~/.ssh/id_ed25519.pub
   ```
   然后在 GitHub 个人设置中添加 SSH 密钥。

3. **远程仓库不存在**
   - 确保 GitHub 仓库已正确创建
   - 检查远程仓库 URL 是否正确

## 完成

项目已成功保存至 GitHub 仓库 `https://github.com/nujabes-wu/green-life-web`，可通过该 URL 访问和管理。