/**
 * 细胞应用业务销售管理系统 - 主要JavaScript功能
 */

// 文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 加载侧边栏组件
    loadSidebar();

    // 初始化Bootstrap工具提示
    initTooltips();

    // 初始化表格排序功能
    initTableSorting();

    // 初始化表单验证
    initFormValidation();

    // 初始化文书状态样式
    initStatusBadges();

    // 获取URL参数，用于详情页面
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('id');

    // 如果在详情页面，加载文书详情
    if (documentId && window.location.href.includes('document-detail.html')) {
        loadDocumentDetails(documentId);
    }

    // 初始化省份选择器
    initProvinces();

    // 为身高和体重输入框添加事件监听器
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');

    if (heightInput && weightInput) {
        heightInput.addEventListener('input', calculateBMI);
        weightInput.addEventListener('input', calculateBMI);
    }

    // 为省份选择器添加事件监听器
    const provinceSelect = document.getElementById('province');
    if (provinceSelect) {
        provinceSelect.addEventListener('change', updateCities);
    }
});

/**
 * 初始化Bootstrap工具提示
 */
function initTooltips() {
    // 查找所有带有data-bs-toggle="tooltip"属性的元素
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    // 为每个元素创建工具提示
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * 初始化表格排序功能
 */
function initTableSorting() {
    // 获取所有表格中的排序图标
    const sortIcons = document.querySelectorAll('th .bi-arrow-down-up');

    // 为每个排序图标添加点击事件
    sortIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            const th = e.target.closest('th');
            const table = th.closest('table');
            const index = Array.from(th.parentNode.children).indexOf(th);

            // 切换排序方向
            const isAscending = !th.classList.contains('sort-asc');

            // 重置所有表头的排序状态
            table.querySelectorAll('th').forEach(header => {
                header.classList.remove('sort-asc', 'sort-desc');
            });

            // 设置当前表头的排序状态
            th.classList.add(isAscending ? 'sort-asc' : 'sort-desc');

            // 更新排序图标
            th.querySelector('.bi').className = isAscending ?
                'bi bi-arrow-up ms-1' : 'bi bi-arrow-down ms-1';

            // 排序表格行
            sortTableByColumn(table, index, isAscending);
        });
    });
}

/**
 * 按列排序表格
 * @param {HTMLElement} table - 表格元素
 * @param {number} column - 列索引
 * @param {boolean} asc - 是否升序
 */
function sortTableByColumn(table, column, asc = true) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // 排序行
    const sortedRows = rows.sort((a, b) => {
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

        return asc ? aColText.localeCompare(bColText) : bColText.localeCompare(aColText);
    });

    // 移除现有行
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // 添加排序后的行
    tbody.append(...sortedRows);
}

/**
 * 初始化表单验证
 */
function initFormValidation() {
    // 获取所有需要验证的表单
    const forms = document.querySelectorAll('.needs-validation');

    // 为每个表单添加提交事件监听器
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
}

/**
 * 初始化文书状态样式
 */
function initStatusBadges() {
    // 获取所有状态标签
    const statusBadges = document.querySelectorAll('.status-badge');

    // 为每个状态标签添加适当的样式
    statusBadges.forEach(badge => {
        const text = badge.textContent.trim();

        // 根据状态文本设置样式类
        if (text === '待建档') {
            badge.classList.add('bg-secondary');
        } else if (text === '体检管理中') {
            badge.classList.add('bg-primary');
        } else if (text === '医生评估中') {
            badge.classList.add('bg-info');
        } else if (text === '干预方案洽谈') {
            badge.classList.add('bg-warning', 'text-dark');
        } else if (text === '已成单') {
            badge.classList.add('bg-success');
        } else if (text === '未成单') {
            badge.classList.add('bg-danger');
        }
    });
}

/**
 * 加载文书详情
 * @param {string} documentId - 文书ID
 */
function loadDocumentDetails(documentId) {
    console.log(`加载文书详情: ${documentId}`);
    // 在实际应用中，这里应该是一个AJAX请求来获取文书详情
    // 此处为演示，仅显示ID

    // 更新页面标题中的文书ID
    const titleElement = document.querySelector('h1.h2 small');
    if (titleElement) {
        titleElement.textContent = documentId;
    }
}

/**
 * 计算BMI值
 */
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value) / 100; // 转换为米
    const weight = parseFloat(document.getElementById('weight').value);
    const bmiInput = document.getElementById('bmi');

    if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        bmiInput.value = bmi;
    } else {
        bmiInput.value = '';
    }
}

// 省市数据
const provinces = [
    { id: '11', name: '北京市' },
    { id: '31', name: '上海市' },
    { id: '44', name: '广东省' },
    { id: '33', name: '浙江省' },
    // ... 可以添加更多省份
];

const cities = {
    '11': [{ id: '1101', name: '北京市' }],
    '31': [{ id: '3101', name: '上海市' }],
    '44': [
        { id: '4401', name: '广州市' },
        { id: '4403', name: '深圳市' },
        { id: '4406', name: '佛山市' }
    ],
    '33': [
        { id: '3301', name: '杭州市' },
        { id: '3302', name: '宁波市' },
        { id: '3303', name: '温州市' }
    ],
    // ... 可以添加更多城市
};

// 初始化省份选择器
function initProvinces() {
    const provinceSelect = document.getElementById('province');
    if (!provinceSelect) return;

    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.id;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
    });
}

// 更新城市选择器
function updateCities() {
    const provinceSelect = document.getElementById('province');
    const citySelect = document.getElementById('city');
    if (!provinceSelect || !citySelect) return;

    const provinceId = provinceSelect.value;
    citySelect.innerHTML = '<option value="">请选择城市</option>';

    if (provinceId && cities[provinceId]) {
        cities[provinceId].forEach(city => {
            const option = document.createElement('option');
            option.value = city.id;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    }
}

/**
 * 提交付款信息
 */
function submitPayment() {
    // 获取表单元素
    const paymentAmount = document.getElementById('paymentAmount').value;
    const paymentDate = document.getElementById('paymentDate').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentScreenshot = document.getElementById('paymentScreenshot');
    const paymentRemark = document.getElementById('paymentRemark').value;

    // 验证表单
    if (!paymentAmount || !paymentDate || !paymentMethod || !paymentScreenshot.files[0]) {
        alert('请填写所有必填项并上传付款截图');
        return;
    }

    // 验证金额格式
    if (isNaN(parseFloat(paymentAmount)) || parseFloat(paymentAmount) <= 0) {
        alert('请输入有效的付款金额');
        return;
    }

    // 显示上传中状态
    const submitButton = document.querySelector('#paymentModal .modal-footer .btn-primary');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 提交中...';
    submitButton.disabled = true;

    // 模拟文件上传和表单提交
    setTimeout(() => {
        // TODO: 在实际应用中，这里应该调用后端API上传文件和提交付款信息
        console.log('付款信息：', {
            amount: paymentAmount,
            date: paymentDate,
            method: paymentMethod,
            file: paymentScreenshot.files[0].name,
            remark: paymentRemark
        });

        // 恢复按钮状态
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;

        // 关闭模态框
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        paymentModal.hide();

        // 显示成功消息
        showToast('付款信息提交成功！', 'success');

        // 更新文书状态（在实际应用中，这应该由后端返回的数据决定）
        updateDocumentStatus('已付款');
    }, 1500);
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型（success, warning, danger, info）
 */
function showToast(message, type = 'info') {
    // 创建 toast 元素
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';

    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    const toastFlex = document.createElement('div');
    toastFlex.className = 'd-flex';

    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', '关闭');

    // 组装 toast
    toastFlex.appendChild(toastBody);
    toastFlex.appendChild(closeButton);
    toastElement.appendChild(toastFlex);
    toastContainer.appendChild(toastElement);
    document.body.appendChild(toastContainer);

    // 初始化并显示 toast
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    // 监听 toast 隐藏事件，移除元素
    toastElement.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toastContainer);
    });
}

/**
 * 更新文书状态
 * @param {string} status - 新状态
 */
function updateDocumentStatus(status) {
    // 在实际应用中，这应该更新UI上的状态显示
    console.log(`文书状态已更新为：${status}`);

    // 可以在这里更新状态标签
    const statusElement = document.querySelector('.document-status');
    if (statusElement) {
        statusElement.textContent = status;

        // 移除所有状态相关的类
        statusElement.classList.remove('status-badge-pending', 'status-badge-processing',
            'status-badge-evaluating', 'status-badge-negotiating', 'status-badge-completed');

        // 添加新的状态类
        if (status === '已付款' || status === '已成单') {
            statusElement.classList.add('status-badge-completed');
        }
    }
}

/**
 * 加载侧边栏组件
 */
function loadSidebar() {
    const sidebarElement = document.getElementById('sidebar');
    if (!sidebarElement) return;

    // 直接在代码中定义侧边栏内容，避免使用fetch API导致的跨域问题
    // 获取当前页面的相对路径，用于生成正确的链接
    const isInSubfolder = window.location.pathname.split('/').filter(Boolean).length > 1;
    const basePath = isInSubfolder ? '../' : '';

    const sidebarHTML = `
    <div class="position-sticky pt-3">
        <div class="system-title text-center mb-4">
            <h5>转化销售管理系统</h5>
        </div>
        <ul class="nav flex-column">
            <li class="nav-item">
                <a class="nav-link" id="nav-home" href="${basePath}index.html">
                    <i class="bi bi-house-door"></i> 首页
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-document" href="${basePath}document-management/document-list.html">
                    <i class="bi bi-file-earmark-text"></i> 文书管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-customer" href="${basePath}customer-management/customer-list.html">
                    <i class="bi bi-people"></i> 客户管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-order" href="${basePath}order-management/order-list.html">
                    <i class="bi bi-cart"></i> 订单管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-project" href="${basePath}project-management/project-list.html">
                    <i class="bi bi-kanban"></i> 项目管理
                </a>
            </li>
            <!-- V1.2新增模块 -->
            <li class="nav-item">
                <a class="nav-link" id="nav-outbound" href="${basePath}outbound-management/outbound-calendar.html">
                    <i class="bi bi-box-seam"></i> 出库管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-treatment" href="${basePath}treatment-management/treatment-calendar.html">
                    <i class="bi bi-clipboard2-pulse"></i> 诊疗管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-review" href="${basePath}review-management/review-list.html">
                    <i class="bi bi-clipboard-check"></i> 复查管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-permission" href="${basePath}permission-management/permission-list.html">
                    <i class="bi bi-shield-lock"></i> 权限管理
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="nav-approval" href="${basePath}approval-management/approval-list.html">
                    <i class="bi bi-check2-square"></i> 审批管理
                </a>
            </li>
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
    } else if (currentHref.includes('customer-management')) {
        document.getElementById('nav-customer')?.classList.add('active');
    } else if (currentHref.includes('order-management')) {
        document.getElementById('nav-order')?.classList.add('active');
    } else if (currentHref.includes('project-management')) {
        document.getElementById('nav-project')?.classList.add('active');
    } else if (currentHref.includes('outbound-management')) {
        document.getElementById('nav-outbound')?.classList.add('active');
    } else if (currentHref.includes('treatment-management')) {
        document.getElementById('nav-treatment')?.classList.add('active');
    } else if (currentHref.includes('review-management')) {
        document.getElementById('nav-review')?.classList.add('active');
    } else if (currentHref.includes('permission-management')) {
        document.getElementById('nav-permission')?.classList.add('active');
    } else if (currentHref.includes('approval-management')) {
        document.getElementById('nav-approval')?.classList.add('active');
    }
}
