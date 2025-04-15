# Batch update HTML pages PowerShell script
# This script updates HTML pages to use dynamic sidebar and local CSS/JS files

# Manually specify files to update
$htmlFiles = @(
    "UX页面\approval-management\approval-detail.html",
    "UX页面\approval-management\approval-list.html",
    "UX页面\customer-management\customer-add.html",
    "UX页面\customer-management\customer-detail.html",
    "UX页面\customer-management\customer-list.html",
    "UX页面\document-management\document-detail.html",
    "UX页面\order-management\order-detail.html",
    "UX页面\order-management\order-list.html",
    "UX页面\permission-management\permission-list.html",
    "UX页面\project-management\project-list.html"
) | ForEach-Object { Get-Item $_ }

Write-Host "Found $($htmlFiles.Count) HTML files to update"

foreach ($file in $htmlFiles) {
    Write-Host "Processing: $($file.FullName)"

    # Read file content
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    # Calculate relative path prefix
    $depth = ($file.DirectoryName -replace [regex]::Escape((Get-Location).Path + "\UX页面"), "").Split("\").Length - 1
    $prefix = "../" * $depth
    if ($depth -eq 0) { $prefix = "./" }

    # Replace CSS references
    $content = $content -replace '<link rel="stylesheet" href="(?:\.\./)*css/style\.css">', "<!-- Custom styles -->`n    <link rel=`"stylesheet`" href=`"${prefix}css/style.css`">"
    $content = $content -replace '<link rel="stylesheet" href="https://cdn\.jsdelivr\.net/npm/bootstrap-icons@1\.10\.0/font/bootstrap-icons\.css">', "<!-- Bootstrap Icons -->`n    <link rel=`"stylesheet`" href=`"${prefix}css/vendor/bootstrap-icons/bootstrap-icons.css`">"
    $content = $content -replace '<link href="https://cdn\.jsdelivr\.net/npm/bootstrap@5\.3\.0/dist/css/bootstrap\.min\.css" rel="stylesheet">', "<!-- Bootstrap CSS -->`n    <link rel=`"stylesheet`" href=`"${prefix}css/vendor/bootstrap/bootstrap.min.css`">"

    # Replace sidebar navigation
    $content = $content -replace '(?s)<nav id="sidebar" class="col-md-3 col-lg-2 d-md-block bg-light sidebar">.*?<ul class="nav flex-column">.*?</ul>.*?</nav>', "<nav id=`"sidebar`" class=`"col-md-3 col-lg-2 d-md-block bg-light sidebar`">`n                <!-- Sidebar content will be loaded dynamically -->`n            </nav>"

    # Replace JavaScript references
    $content = $content -replace '<script src="https://cdn\.jsdelivr\.net/npm/bootstrap@5\.3\.0/dist/js/bootstrap\.bundle\.min\.js"></script>', "<script src=`"${prefix}js/vendor/bootstrap/bootstrap.bundle.min.js`"></script>"

    # Save file
    $content | Set-Content -Path $file.FullName -Encoding UTF8
    Write-Host "Updated: $($file.FullName)"
}

Write-Host "All files updated successfully!"
