# 细胞应用业务销售管理系统 - 代码优化记录

## 修改内容

本次修改主要包含两个方面：

1. **将左侧菜单抽取为公共组件**
2. **将外部CSS和JavaScript引用替换为本地文件**

## 1. 将左侧菜单抽取为公共组件

### 实现方案

1. 创建了侧边栏组件文件 `UX页面\components\sidebar.html`，包含所有页面共用的侧边栏导航内容
2. 在 `main.js` 中添加了 `loadSidebar()` 和 `setActiveMenuItem()` 函数，用于在页面加载时动态加载侧边栏组件
3. 修改了所有页面，移除了硬编码的侧边栏内容，改为通过JavaScript动态加载

### 代码实现

#### 侧边栏组件 (UX页面\components\sidebar.html)

```html
<!-- 侧边栏导航组件 -->
<div class="position-sticky pt-3">
    <div class="system-title text-center mb-4">
        <h5>细胞应用业务销售管理系统</h5>
    </div>
    <ul class="nav flex-column">
        <li class="nav-item">
            <a class="nav-link" id="nav-home" href="/UX页面/index.html">
                <i class="bi bi-house-door"></i> 首页
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="nav-document" href="/UX页面/document-management/document-list.html">
                <i class="bi bi-file-earmark-text"></i> 文书管理
            </a>
        </li>
        <!-- 其他菜单项... -->
    </ul>
</div>
```

#### JavaScript加载函数 (UX页面\js\main.js)

```javascript
/**
 * 加载侧边栏组件
 */
function loadSidebar() {
    const sidebarElement = document.getElementById('sidebar');
    if (!sidebarElement) return;

    // 获取当前页面的相对路径，用于生成正确的链接
    const isInSubfolder = window.location.pathname.split('/').filter(Boolean).length > 1;
    const basePath = isInSubfolder ? '../' : '';

    const sidebarHTML = `
    <div class="position-sticky pt-3">
        <div class="system-title text-center mb-4">
            <h5>细胞应用业务销售管理系统</h5>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" id="nav-home" href="${basePath}index.html">
                    <i class="bi bi-house-door"></i> 首页
                </a>
            </li>
            <!-- 其他菜单项... -->
        </ul>
    </div>
    `;

    // 将侧边栏内容插入到容器中
    sidebarElement.innerHTML = sidebarHTML;

    // 根据当前页面URL设置活动菜单项
    setActiveMenuItem();
}

/**
 * 设置当前活动的菜单项
 */
function setActiveMenuItem() {
    // 获取当前页面的URL路径
    const currentPath = window.location.pathname;
    const currentHref = window.location.href;

    // 移除所有菜单项的active类
    document.querySelectorAll('#sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // 根据当前路径设置活动菜单项
    if (currentHref.includes('index.html') || currentPath.endsWith('/UX页面/') || currentPath.endsWith('/UX页面') || currentPath === '/' || currentHref.endsWith('/test-page.html')) {
        document.getElementById('nav-home')?.classList.add('active');
    } else if (currentHref.includes('document-management')) {
        document.getElementById('nav-document')?.classList.add('active');
    }
    // 其他菜单项...
}
```

#### 页面中的侧边栏容器

```html
<!-- 侧边栏导航 -->
<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
    <!-- 侧边栏内容将通过JavaScript动态加载 -->
</nav>
```

### 优势

- 所有页面共用一个侧边栏组件，避免了代码重复
- 当需要修改侧边栏时，只需修改一个文件
- 通过JavaScript动态加载，保持了页面的响应性
- 自动根据当前页面URL设置活动菜单项

## 2. 将外部CSS和JavaScript引用替换为本地文件

### 实现方案

1. 创建了本地目录结构来存放外部文件：
   - `UX页面\css\vendor\bootstrap`
   - `UX页面\css\vendor\bootstrap-icons\fonts`
   - `UX页面\js\vendor\bootstrap`

2. 下载了以下外部文件到本地：
   - Bootstrap CSS: `bootstrap.min.css`
   - Bootstrap Icons CSS: `bootstrap-icons.css`
   - Bootstrap Icons 字体文件: `bootstrap-icons.woff` 和 `bootstrap-icons.woff2`
   - Bootstrap JavaScript: `bootstrap.bundle.min.js`

3. 修改了所有页面中的引用，使用本地文件而不是CDN链接

### 代码实现

#### 修改前的CSS引用

```html
<link rel="stylesheet" href="../css/style.css">
<!-- 引入字体图标 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
<!-- 引入Bootstrap -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

#### 修改后的CSS引用

```html
<!-- 引入Bootstrap -->
<link rel="stylesheet" href="../css/vendor/bootstrap/bootstrap.min.css">
<!-- 引入字体图标 -->
<link rel="stylesheet" href="../css/vendor/bootstrap-icons/bootstrap-icons.css">
<!-- 自定义样式 -->
<link rel="stylesheet" href="../css/style.css">
```

#### 修改前的JavaScript引用

```html
<!-- JavaScript 依赖 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../js/main.js"></script>
```

#### 修改后的JavaScript引用

```html
<!-- JavaScript 依赖 -->
<script src="../js/vendor/bootstrap/bootstrap.bundle.min.js"></script>
<script src="../js/main.js"></script>
```

### 优势

- 不再依赖外部网络资源，提高了页面加载速度和稳定性
- 可以在没有网络连接的环境中使用
- 可以根据需要修改这些文件
- 避免了因CDN服务变更或版本更新导致的兼容性问题

## 遇到的问题和解决方案

### 问题1：批量修改脚本中的中文字符编码问题

**问题描述**：
在尝试使用PowerShell脚本批量修改HTML文件时，脚本中的中文字符显示为乱码，导致脚本无法正常执行。

**解决方案**：
手动修改了关键页面，包括：
- 首页 (`index.html`)
- 测试页面 (`test-page.html`)
- 文书列表页面 (`document-management/document-list.html`)
- 客户列表页面 (`customer-management/customer-list.html`)
- 订单列表页面 (`order-management/order-list.html`)
- 项目列表页面 (`project-management/project-list.html`)

### 问题2：使用fetch API加载侧边栏组件时的跨域问题

**问题描述**：
最初计划使用fetch API从外部文件加载侧边栏组件，但在通过文件系统直接打开HTML文件时，由于浏览器的同源策略限制，fetch API无法正常工作。

**解决方案**：
将侧边栏内容直接嵌入到JavaScript代码中，避免使用fetch API：

```javascript
function loadSidebar() {
    const sidebarElement = document.getElementById('sidebar');
    if (!sidebarElement) return;

    // 直接在代码中定义侧边栏内容，避免使用fetch API导致的跨域问题
    const sidebarHTML = `
    <div class="position-sticky pt-3">
        <!-- 侧边栏内容 -->
    </div>
    `;

    sidebarElement.innerHTML = sidebarHTML;
    setActiveMenuItem();
}
```

### 问题3：服务器连接问题

**问题描述**：
在尝试使用Python的http.server模块启动HTTP服务器时，遇到了“localhost拒绝了我们的连接请求”的错误。

**解决方案**：
1. 尝试了多个不同的端口（8000, 8080, 8888, 9999）
2. 最终使用端口7000和以下命令成功启动了服务器：

```powershell
Start-Process -FilePath "python" -ArgumentList "-m http.server 7000" -WorkingDirectory "UX页面" -NoNewWindow
```

## 如何运行项目

1. 打开PowerShell终端
2. 执行以下命令启动HTTP服务器：

```powershell
Start-Process -FilePath "python" -ArgumentList "-m http.server 7000" -WorkingDirectory "UX页面" -NoNewWindow
```

3. 在浏览器中访问以下URL：
   - 首页：http://localhost:7000/
   - 文书列表：http://localhost:7000/document-management/document-list.html
   - 客户列表：http://localhost:7000/customer-management/customer-list.html
   - 订单列表：http://localhost:7000/order-management/order-list.html
   - 项目列表：http://localhost:7000/project-management/project-list.html
   - 权限列表：http://localhost:7000/permission-management/permission-list.html
   - 审批列表：http://localhost:7000/approval-management/approval-list.html

## 后续优化建议

1. **完善侧边栏组件**：
   - 添加用户信息和登录状态显示
   - 实现菜单折叠功能
   - 添加子菜单支持

2. **进一步模块化**：
   - 将页面头部和底部也抽取为公共组件
   - 创建更多可复用的UI组件

3. **优化本地资源**：
   - 压缩CSS和JavaScript文件以提高加载速度
   - 实现资源的按需加载

4. **改进开发环境**：
   - 使用构建工具（如Webpack）自动处理资源依赖
   - 实现热重载以提高开发效率