# 转化销售管理系统 v1.1 HTML前端设计文档

## 文档概述

本文档是转化销售管理系统 v1.1 版本的HTML前端详细设计方案，基于需求变更文档进行设计。

## 一、页面结构变更

### 1. 客户管理列表页 (customer-list.html)

```html
<!-- 原表格列变更 -->
<thead>
    <tr>
        <th scope="col">客户编号</th>
        <th scope="col">客户姓名</th>
        <th scope="col">手机号码</th>
        <!-- 移除: 服务项目 -->
        <th scope="col">销售人员</th>
        <th scope="col">创建时间</th>
        <!-- 移除: 客户状态 -->
        <th scope="col">操作</th>
    </tr>
</thead>

<!-- 操作栏变更 -->
<td>
    <!-- 简化为单个操作按钮 -->
    <a href="customer-detail.html?id=CUS20250312001" class="btn btn-sm btn-outline-primary">查看详情</a>
</td>
```

### 2. 客户详情页 (customer-detail.html)

```html
<!-- 客户基本信息变更 -->
<div class="card-body">
    <div class="row">
        <div class="col-md-5">
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <th scope="row" width="30%">客户ID：</th>
                        <td>C10086</td>
                    </tr>
                    <tr>
                        <th scope="row">姓名：</th>
                        <td>张三</td>
                    </tr>
                    <tr>
                        <th scope="row">隐私编号：</th>
                        <td>张**</td> <!-- 新增 -->
                    </tr>
                    <tr>
                        <th scope="row">性别：</th>
                        <td>男</td>
                    </tr>
                    <tr>
                        <th scope="row">年龄：</th>
                        <td>35岁</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-md-5">
            <table class="table table-borderless">
                <tbody>
                    <tr>
                        <th scope="row" width="30%">手机号码：</th>
                        <td>138****5678</td>
                    </tr>
                    <tr>
                        <th scope="row">销售人员：</th>
                        <td>李四</td>
                    </tr>
                    <tr>
                        <th scope="row">客户来源：</th>
                        <td>线上推广</td>
                    </tr>
                    <tr>
                        <th scope="row">代理人：</th>
                        <td>王某</td> <!-- 新增 -->
                    </tr>
                    <tr>
                        <th scope="row">是否储户：</th>
                        <td>是</td>
                    </tr>
                    <tr>
                        <th scope="row">创建时间：</th>
                        <td>2025-02-15 10:30</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- 选项卡变更 - 移除客户档案 -->
<ul class="nav nav-tabs card-header-tabs" id="customerTabs" role="tablist">
    <!-- 客户档案选项卡已移除 -->
    <li class="nav-item" role="presentation">
        <button class="nav-link active" id="documents-tab" data-bs-toggle="tab" data-bs-target="#documents" type="button" role="tab" aria-controls="documents" aria-selected="true">
            <i class="bi bi-file-earmark-text"></i> 相关文书
        </button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link" id="orders-tab" data-bs-toggle="tab" data-bs-target="#orders" type="button" role="tab" aria-controls="orders" aria-selected="false">
            <i class="bi bi-cart"></i> 订单记录
        </button>
    </li>
</ul>
```

### 3. 文书管理列表页 (document-list.html)

```html
<!-- 表格列变更 -->
<thead>
    <tr>
        <th scope="col">
            <div class="d-flex align-items-center">
                文书ID
                <i class="bi bi-arrow-down-up ms-1"></i>
            </div>
        </th>
        <th scope="col">
            <div class="d-flex align-items-center">
                客户姓名
                <i class="bi bi-arrow-down-up ms-1"></i>
            </div>
        </th>
        <th scope="col">
            <div class="d-flex align-items-center">
                隐私编号
                <i class="bi bi-arrow-down-up ms-1"></i>
            </div>
        </th>
        <th scope="col">
            <div class="d-flex align-items-center">
                销售人员
                <i class="bi bi-arrow-down-up ms-1"></i>
            </div>
        </th>
        <th scope="col">文书状态</th>
        <th scope="col">创建时间</th>
        <th scope="col">操作</th>
    </tr>
</thead>

<!-- 新建客户弹窗 -->
<div class="modal fade" id="newCustomerModal" tabindex="-1" aria-labelledby="newCustomerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="newCustomerModalLabel">新建客户</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- 客户基本信息表单 -->
                <form id="newCustomerForm">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="name" class="form-label">姓名</label>
                            <input type="text" class="form-control" id="name" required>
                        </div>
                        <div class="col-md-6">
                            <label for="privacyNumber" class="form-label">隐私编号</label>
                            <input type="text" class="form-control" id="privacyNumber">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">性别</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="genderMale" value="male" checked>
                                    <label class="form-check-label" for="genderMale">男</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="gender" id="genderFemale" value="female">
                                    <label class="form-check-label" for="genderFemale">女</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label for="age" class="form-label">年龄</label>
                            <input type="number" class="form-control" id="age" min="0" max="150">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="phone" class="form-label">手机号码</label>
                            <input type="tel" class="form-control" id="phone" required pattern="^1[3-9]\d{9}$">
                        </div>
                        <div class="col-md-6">
                            <label for="salesPerson" class="form-label">销售人员</label>
                            <select class="form-select" id="salesPerson">
                                <option selected disabled>请选择...</option>
                                <option value="1">张三</option>
                                <option value="2">李四</option>
                                <option value="3">王五</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="source" class="form-label">客户来源</label>
                            <select class="form-select" id="source">
                                <option selected disabled>请选择...</option>
                                <option value="1">线上推广</option>
                                <option value="2">朋友推荐</option>
                                <option value="3">医院合作</option>
                                <option value="4">其他渠道</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="agent" class="form-label">代理人</label>
                            <input type="text" class="form-control" id="agent">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">是否储户</label>
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="isDepositor" id="isDepositorYes" value="yes">
                                    <label class="form-check-label" for="isDepositorYes">是</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="isDepositor" id="isDepositorNo" value="no" checked>
                                    <label class="form-check-label" for="isDepositorNo">否</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" id="submitNewCustomer">提交</button>
            </div>
        </div>
    </div>
</div>
```

### 4. 文书详情页 (document-detail.html)

#### 4.1 文书状态流程变更

```html
<!-- 进度条变更 -->
<div class="progress-tracker mb-4">
    <div class="progress-step completed">
        <div class="progress-step-icon">
            <i class="bi bi-check-lg"></i>
        </div>
        <div class="progress-step-label">待建档</div>
    </div>
    <div class="progress-step active">
        <div class="progress-step-icon">
            <i class="bi bi-activity"></i>
        </div>
        <div class="progress-step-label">体检管理中</div>
    </div>
    <div class="progress-step">
        <div class="progress-step-icon">
            <i class="bi bi-clipboard2-pulse"></i>
        </div>
        <div class="progress-step-label">医生评估中</div>
    </div>
    <div class="progress-step">
        <div class="progress-step-icon">
            <i class="bi bi-gear"></i>
        </div>
        <div class="progress-step-label">方案制定</div> <!-- 新增状态 -->
    </div>
    <div class="progress-step">
        <div class="progress-step-icon">
            <i class="bi bi-chat-dots"></i>
        </div>
        <div class="progress-step-label">方案洽谈</div> <!-- 替换原"干预方案洽谈" -->
    </div>
    <div class="progress-step">
        <div class="progress-step-icon">
            <i class="bi bi-flag"></i>
        </div>
        <div class="progress-step-label">已成单/未成单</div>
    </div>
</div>
```

#### 4.2 客户档案标签页

```html
<!-- 客户基本信息与客户详情页保持一致 -->
<div class="card mb-4">
    <div class="card-header">
        <i class="bi bi-person"></i> 基本信息
    </div>
    <div class="card-body">
        <form>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="customerId" class="form-label">客户ID</label>
                    <input type="text" class="form-control" id="customerId" value="C10086" readonly>
                </div>
                <div class="col-md-4">
                    <label for="customerName" class="form-label">姓名</label>
                    <input type="text" class="form-control" id="customerName" value="张三">
                </div>
                <div class="col-md-4">
                    <label for="privacyNumber" class="form-label">隐私编号</label>
                    <input type="text" class="form-control" id="privacyNumber" value="张**">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label">性别</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="genderMale" value="male" checked>
                            <label class="form-check-label" for="genderMale">男</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="gender" id="genderFemale" value="female">
                            <label class="form-check-label" for="genderFemale">女</label>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="age" class="form-label">年龄</label>
                    <input type="number" class="form-control" id="age" value="35">
                </div>
                <div class="col-md-4">
                    <label for="phoneNumber" class="form-label">手机号码</label>
                    <input type="tel" class="form-control" id="phoneNumber" value="138****5678">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label for="salesPerson" class="form-label">销售人员</label>
                    <select class="form-select" id="salesPerson">
                        <option>李四</option>
                        <option>张三</option>
                        <option>王五</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="customerSource" class="form-label">客户来源</label>
                    <select class="form-select" id="customerSource">
                        <option selected>线上推广</option>
                        <option>朋友推荐</option>
                        <option>医院合作</option>
                        <option>其他渠道</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="agent" class="form-label">代理人</label>
                    <input type="text" class="form-control" id="agent" value="王某">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-4">
                    <label class="form-label">是否储户</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="isDepositor" id="isDepositorYes" value="yes" checked>
                            <label class="form-check-label" for="isDepositorYes">是</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="isDepositor" id="isDepositorNo" value="no">
                            <label class="form-check-label" for="isDepositorNo">否</label>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <label for="createTime" class="form-label">创建时间</label>
                    <input type="text" class="form-control" id="createTime" value="2025-02-15 10:30" readonly>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 text-end">
                    <button type="button" class="btn btn-primary">
                        <i class="bi bi-save"></i> 保存更改
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>
```

#### 4.3 检测报告标签页

```html
<!-- 移除原有的医学检测报告和医学影像学检查栏目 -->
<!-- 添加检测报告富文本编辑器 -->
<div class="card mb-4">
    <div class="card-header">
        <i class="bi bi-file-medical-fill"></i> 检测报告
    </div>
    <div class="card-body">
        <div class="mb-3">
            <textarea class="form-control rich-editor" id="testReportContent" rows="10" placeholder="请输入检测报告内容..."></textarea>
        </div>
    </div>
</div>

<!-- 保留选择医生栏目 -->
<div class="card mb-4">
    <div class="card-header">
        <i class="bi bi-person-badge"></i> 选择医生
    </div>
    <div class="card-body">
        <form>
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="doctorName" class="form-label">选择医生</label>
                    <select class="form-select" id="doctorName">
                        <option selected disabled>请选择医生...</option>
                        <option value="1">张医生（专家）</option>
                        <option value="2">李医生（主任医师）</option>
                        <option value="3">王医生（副主任医师）</option>
                        <option value="4">赵医生（主治医师）</option>
                    </select>
                </div>
        </form>
    </div>
</div>
```

#### 4.4 干预方案标签页

```html
<!-- 产品疗程生成器改造 -->
<div class="card mb-4">
    <div class="card-header">
        <i class="bi bi-gear"></i> 产品疗程生成器
    </div>
    <div class="card-body">
        <form>
            <div class="row mb-3 align-items-end">
                <div class="col-md-3 mb-2 mb-md-0">
                    <label for="recommendedProduct" class="form-label">方案建议产品</label>
                    <select class="form-select" id="recommendedProduct">
                        <option selected disabled>请选择产品...</option>
                        <option value="1">NK细胞</option>
                        <option value="2">DC-CIK细胞</option>
                        <option value="3">CAR-T细胞</option>
                        <option value="4">TCR-T细胞</option>
                        <option value="5">TIL细胞</option>
                    </select>
                </div>
                <div class="col-md-2 mb-2 mb-md-0">
                    <label for="stageNumber" class="form-label">疗程阶段</label> <!-- 新增 -->
                    <select class="form-select" id="stageNumber">
                        <option value="1">第1阶段</option>
                        <option value="2">第2阶段</option>
                        <option value="3">第3阶段</option>
                        <option value="4">第4阶段</option>
                        <option value="5">第5阶段</option>
                        <option value="6">第6阶段</option>
                        <option value="7">第7阶段</option>
                        <option value="8">第8阶段</option>
                        <option value="9">第9阶段</option>
                        <option value="10">第10阶段</option>
                    </select>
                </div>
                <div class="col-md-2 mb-2 mb-md-0">
                    <label for="dosage" class="form-label">每次剂量</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="dosage" placeholder="请输入剂量">
                        <span class="input-group-text">亿</span>
                    </div>
                </div>
                <div class="col-md-2 mb-2 mb-md-0">
                    <label for="courseNumber" class="form-label">疗程数</label> <!-- 新增 -->
                    <select class="form-select" id="courseNumber">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>
                <div class="col-md-2 mb-2 mb-md-0">
                    <label for="cyclePeriod" class="form-label">疗程周期</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="cyclePeriod" placeholder="请输入周期">
                        <span class="input-group-text">天</span>
                    </div>
                </div>
                <div class="col-md-1 mb-2 mb-md-0">
                    <button type="button" class="btn btn-primary w-100">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- 管理方案建议（原干预方案信息） -->
<div class="card mb-4">
    <div class="card-header">
        <i class="bi bi-clipboard-check"></i> 管理方案建议
    </div>
    <div class="card-body">
        <div class="mb-3">
            <label for="doctorName" class="form-label">方案医生</label>
            <select class="form-select" id="doctorName">
                <option selected disabled>请选择医生...</option>
                <option value="1">张医生</option>
                <option value="2">李医生</option>
                <option value="3">王医生</option>
            </select>
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-primary" id="addStageBtn">
                <i class="bi bi-plus"></i> 添加阶段方案
            </button>
        </div>
        <div id="stagePlansContainer">
            <!-- 阶段方案模板会动态添加到这里 -->
        </div>
    </div>
</div>

<!-- 阶段方案模板 -->
<template id="stagePlanTemplate">
    <div class="stage-plan mb-4 p-3 border rounded">
        <h5>第<span class="stage-number">1</span>阶段</h5>
        <div class="mb-3">
            <label class="form-label">产品+项目列表</label>
            <select class="form-select product-project">
                <option value="">请选择产品/项目...</option>
                <!-- 选项从项目管理获取 -->
            </select>
        </div>
        <div class="mb-3">
            <label class="form-label">给药方法</label>
            <textarea class="form-control administration-method" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">建议周期</label>
            <textarea class="form-control suggested-cycle" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">机理作用</label>
            <textarea class="form-control mechanism" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">复查项目</label>
            <textarea class="form-control review-items" rows="3"></textarea>
        </div>
        <div class="mb-3">
            <label class="form-label">注意事项</label>
            <textarea class="form-control precautions" rows="3"></textarea>
        </div>
        <div class="text-end">
            <button type="button" class="btn btn-danger delete-stage-btn">
                <i class="bi bi-trash"></i> 删除
            </button>
        </div>
    </div>
</template>
```

#### 4.5 体检管理标签页

```html
<!-- 添加家族史字段 -->
<div class="card mb-4">
    <div class="card-header">
        <i class="bi bi-clipboard-heart"></i> 体检基础信息
    </div>
    <div class="card-body">
        <form>
            <div class="mb-3">
                <label for="medicalHistory" class="form-label">既往史</label>
                <textarea class="form-control" id="medicalHistory" rows="4" placeholder="请输入患者既往史信息..."></textarea>
            </div>
            <div class="mb-3">
                <label for="familyHistory" class="form-label">家族史</label> <!-- 新增 -->
                <textarea class="form-control" id="familyHistory" rows="4" placeholder="请输入患者家族史信息..."></textarea>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="bloodPressure" class="form-label">血压 (mmHg)</label>
                    <input type="text" class="form-control" id="bloodPressure" placeholder="例如：120/80">
                </div>
                <div class="col-md-6 mb-3">
                    <label for="heartRate" class="form-label">心率 (次/分)</label>
                    <input type="number" class="form-control" id="heartRate" placeholder="例如：75">
                </div>
            </div>
        </form>
    </div>
</div>
```

### 5. 订单管理 - 订单详情页 (order-detail.html)

```html
<!-- 支付信息和发票信息板块 -->
<div class="row mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header bg-success text-white">
                <i class="bi bi-credit-card"></i> 支付信息
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <th scope="row" width="30%">支付方式：</th>
                            <td>银行转账</td>
                        </tr>
                        <tr>
                            <th scope="row">支付时间：</th>
                            <td>2025-03-10 14:45:32</td>
                        </tr>
                        <tr>
                            <th scope="row">交易单号：</th>
                            <td>TRX20250310144532</td>
                        </tr>
                        <tr>
                            <th scope="row">支付金额：</th>
                            <td><strong class="text-danger">¥28,000.00</strong></td>
                        </tr>
                        <tr>
                            <th scope="row">支付状态：</th>
                            <td><span class="badge bg-success">已支付</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card">
            <div class="card-header bg-info text-white">
                <i class="bi bi-receipt"></i> 发票信息
            </div>
            <div class="card-body">
                <table class="table table-borderless">
                    <tbody>
                        <tr>
                            <th scope="row" width="30%">发票抬头：</th>
                            <td>张三</td>
                        </tr>
                        <tr>
                            <th scope="row">纳税人识别号：</th>
                            <td>91310000XXXXXXXXXX</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
```

### 6. 方案报价页面 - 付款提交部分

```html
<!-- 付款提交表单增加字段 -->
<div class="row mb-3">
    <div class="col-md-6">
        <label for="paymentMethod" class="form-label">付款方式</label>
        <select class="form-select" id="paymentMethod" required>
            <option value="">请选择...</option>
            <option value="bank">银行转账</option>
            <option value="wechat">微信支付</option>
            <option value="alipay">支付宝</option>
            <option value="cash">现金</option>
        </select>
    </div>
    <div class="col-md-6">
        <label for="invoiceType" class="form-label">发票类型</label>
        <select class="form-select" id="invoiceType" required>
            <option value="">请选择...</option>
            <option value="personal">个人</option>
            <option value="enterprise">企业</option>
        </select>
    </div>
</div>
<div class="row mb-3">
    <div class="col-md-6">
        <label for="invoiceTitle" class="form-label">发票抬头</label>
        <input type="text" class="form-control" id="invoiceTitle" required>
    </div>
    <div class="col-md-6">
        <label for="taxNumber" class="form-label">纳税人识别号</label>
        <input type="text" class="form-control" id="taxNumber">
        <small class="form-text text-muted">企业类型必填，个人类型选填</small>
    </div>
</div>
```

## 二、CSS样式变更

### 1. 阶段方案模板样式

```css
/* 阶段方案样式 */
.stage-plan {
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.stage-plan:hover {
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.stage-plan h5 {
    color: #0d6efd;
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}
```

### 2. 新增状态样式

```css
/* 方案制定状态 */
.status-badge-planning {
    background-color: #cff4fc;
    color: #055160;
}
```

## 三、JavaScript功能变更

### 1. 阶段方案添加功能

```javascript
// 添加阶段方案
document.getElementById('addStageBtn')?.addEventListener('click', function() {
    const container = document.getElementById('stagePlansContainer');
    const template = document.getElementById('stagePlanTemplate');
    const clone = template.content.cloneNode(true);
    
    // 获取当前阶段数量并更新编号
    const stageCount = container.querySelectorAll('.stage-plan').length + 1;
    clone.querySelector('.stage-number').textContent = stageCount;
    
    // 为删除按钮添加事件
    const deleteBtn = clone.querySelector('.delete-stage-btn');
    deleteBtn.addEventListener('click', function() {
        this.closest('.stage-plan').remove();
        // 重新排序阶段编号
        reorderStages();
    });
    
    container.appendChild(clone);
});

// 重新排序阶段编号
function reorderStages() {
    const stages = document.querySelectorAll('.stage-plan');
    stages.forEach((stage, index) => {
        stage.querySelector('.stage-number').textContent = index + 1;
    });
}
```

### 2. 发票类型逻辑

```javascript
// 发票类型联动
document.getElementById('invoiceType')?.addEventListener('change', function() {
    const taxNumberInput = document.getElementById('taxNumber');
    if (this.value === 'enterprise') {
        taxNumberInput.setAttribute('required', 'required');
    } else {
        taxNumberInput.removeAttribute('required');
    }
});
```

### 3. 新建客户流程

```javascript
// 新建文书流程
document.getElementById('createNewDocument')?.addEventListener('click', function() {
    // 显示客户选择对话框
    $('#selectCustomerModal').modal('show');
});

// 选择新建客户
document.getElementById('createNewCustomer')?.addEventListener('click', function() {
    // 关闭客户选择对话框
    $('#selectCustomerModal').modal('hide');
    // 显示新建客户对话框
    $('#newCustomerModal').modal('show');
});

// 提交新建客户并创建文书
document.getElementById('submitNewCustomer')?.addEventListener('click', function() {
    // 验证表单
    const form = document.getElementById('newCustomerForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // 模拟提交成功后直接进入文书详情页
    window.location.href = 'document-detail.html?id=NEW_DOC_ID';
});
```

## 四、注意事项与实施建议

1. 所有页面变更应保持统一的样式和交互体验
2. 富文本编辑器推荐使用 TinyMCE 或 CKEditor 等成熟方案
3. 阶段方案模板的添加/删除操作需注意性能和用户体验
4. 文书状态流程变更需确保在所有相关页面同步更新

## 五、UI预览

各页面主要变更部分的UI设计草图将单独提供。

## 六、参考资源

1. Bootstrap 5 文档: https://getbootstrap.com/docs/5.0/
2. Bootstrap Icons: https://icons.getbootstrap.com/
3. TinyMCE 富文本编辑器: https://www.tiny.cloud/
4. CKEditor 富文本编辑器: https://ckeditor.com/ 