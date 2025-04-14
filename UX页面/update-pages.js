/**
 * 批量更新HTML页面的脚本
 * 
 * 此脚本用于批量更新HTML页面，将侧边栏导航替换为动态加载的组件，
 * 并将外部CSS和JS引用替换为本地文件。
 */

const fs = require('fs');
const path = require('path');

// 要排除的文件
const excludeFiles = [
    'index.html',
    'test-page.html',
    'document-management/document-list.html',
    'components/sidebar.html'
];

// 递归获取所有HTML文件
function getAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            getAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            // 将路径转换为相对于UX页面的路径
            const relativePath = path.relative(path.join(__dirname), filePath);
            if (!excludeFiles.includes(relativePath)) {
                fileList.push(filePath);
            }
        }
    });
    
    return fileList;
}

// 更新HTML文件
function updateHtmlFile(filePath) {
    console.log(`正在处理: ${filePath}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 获取相对路径前缀
    const depth = path.relative(path.join(__dirname), path.dirname(filePath))
        .split(path.sep).length;
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    
    // 替换CSS引用
    content = content.replace(
        /<link rel="stylesheet" href="(\.\.\/)*css\/style\.css">\s*<!-- 引入字体图标 -->\s*<link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap-icons@1\.10\.0\/font\/bootstrap-icons\.css">\s*<!-- 引入Bootstrap -->\s*<link href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.0\/dist\/css\/bootstrap\.min\.css" rel="stylesheet">/,
        `<!-- 引入Bootstrap -->\n    <link rel="stylesheet" href="${prefix}css/vendor/bootstrap/bootstrap.min.css">\n    <!-- 引入字体图标 -->\n    <link rel="stylesheet" href="${prefix}css/vendor/bootstrap-icons/bootstrap-icons.css">\n    <!-- 自定义样式 -->\n    <link rel="stylesheet" href="${prefix}css/style.css">`
    );
    
    // 替换侧边栏导航
    content = content.replace(
        /<!-- 侧边栏导航 -->\s*<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">\s*<div class="position-sticky pt-3">[\s\S]*?<\/div>\s*<\/nav>/,
        `<!-- 侧边栏导航 -->\n            <nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">\n                <!-- 侧边栏内容将通过JavaScript动态加载 -->\n            </nav>`
    );
    
    // 替换JavaScript引用
    content = content.replace(
        /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.0\/dist\/js\/bootstrap\.bundle\.min\.js"><\/script>\s*<script src="(\.\.\/)*js\/main\.js"><\/script>/,
        `<script src="${prefix}js/vendor/bootstrap/bootstrap.bundle.min.js"></script>\n    <script src="${prefix}js/main.js"></script>`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已更新: ${filePath}`);
}

// 主函数
function main() {
    const htmlFiles = getAllHtmlFiles(path.join(__dirname));
    
    console.log(`找到 ${htmlFiles.length} 个HTML文件需要更新`);
    
    htmlFiles.forEach(file => {
        updateHtmlFile(file);
    });
    
    console.log('所有文件更新完成！');
}

// 执行主函数
main();
