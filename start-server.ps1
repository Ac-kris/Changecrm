# 简单的PowerShell HTTP服务器脚本
# 此脚本在指定端口启动一个简单的HTTP服务器，用于提供静态文件

$port = 8888
$path = "UX页面"

# 创建HTTP监听器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "HTTP服务器已启动，正在监听端口 $port"
Write-Host "请访问: http://localhost:$port/"
Write-Host "按Ctrl+C停止服务器"

try {
    while ($listener.IsListening) {
        # 等待请求
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # 获取请求的URL路径
        $requestUrl = $request.Url.LocalPath
        $requestUrl = $requestUrl.TrimStart('/')
        
        # 如果请求的是目录根，则返回index.html
        if ($requestUrl -eq '') {
            $requestUrl = 'index.html'
        }
        
        # 构建文件路径
        $filePath = Join-Path -Path $path -ChildPath $requestUrl
        
        Write-Host "请求: $requestUrl"
        
        # 检查文件是否存在
        if (Test-Path $filePath -PathType Leaf) {
            # 获取文件内容
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $content.Length
            
            # 设置内容类型
            $extension = [System.IO.Path]::GetExtension($filePath)
            switch ($extension) {
                '.html' { $response.ContentType = 'text/html' }
                '.css'  { $response.ContentType = 'text/css' }
                '.js'   { $response.ContentType = 'application/javascript' }
                '.json' { $response.ContentType = 'application/json' }
                '.png'  { $response.ContentType = 'image/png' }
                '.jpg'  { $response.ContentType = 'image/jpeg' }
                '.gif'  { $response.ContentType = 'image/gif' }
                '.svg'  { $response.ContentType = 'image/svg+xml' }
                '.woff' { $response.ContentType = 'font/woff' }
                '.woff2' { $response.ContentType = 'font/woff2' }
                default { $response.ContentType = 'application/octet-stream' }
            }
            
            # 发送响应
            $output = $response.OutputStream
            $output.Write($content, 0, $content.Length)
            $output.Close()
        } else {
            # 文件不存在，返回404
            $response.StatusCode = 404
            $response.Close()
            Write-Host "404: $filePath 不存在"
        }
    }
} finally {
    # 停止监听器
    $listener.Stop()
}
