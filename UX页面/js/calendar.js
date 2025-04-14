/**
 * 日历组件JavaScript功能
 */

// 当前日期和视图状态
let currentDate = new Date();
let currentView = 'month'; // 'month', 'week', 'list'

// 初始化日历组件
function initCalendar(containerId, eventType) {
    // 设置日历标题
    updateCalendarTitle();

    // 生成日历视图
    generateCalendarView();

    // 绑定导航按钮事件
    document.getElementById('prev-month').addEventListener('click', function() {
        navigateCalendar(-1);
    });

    document.getElementById('next-month').addEventListener('click', function() {
        navigateCalendar(1);
    });

    document.getElementById('today-btn').addEventListener('click', function() {
        currentDate = new Date();
        updateCalendarTitle();
        generateCalendarView();
    });

    // 绑定视图切换按钮事件
    document.getElementById('month-view-btn').addEventListener('click', function() {
        switchView('month');
    });

    document.getElementById('week-view-btn').addEventListener('click', function() {
        switchView('week');
    });

    document.getElementById('list-view-btn').addEventListener('click', function() {
        switchView('list');
    });

    // 加载事件数据
    loadEvents(eventType);
}

// 更新日历标题
function updateCalendarTitle() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    let titleText = `${year}年${month}月`;

    if (currentView === 'week') {
        const weekStart = getWeekStartDate(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const weekStartMonth = weekStart.getMonth() + 1;
        const weekEndMonth = weekEnd.getMonth() + 1;

        if (weekStartMonth === weekEndMonth) {
            titleText = `${year}年${weekStartMonth}月${weekStart.getDate()}-${weekEnd.getDate()}日`;
        } else {
            titleText = `${year}年${weekStartMonth}月${weekStart.getDate()}日-${weekEndMonth}月${weekEnd.getDate()}日`;
        }
    }

    document.getElementById('calendar-title').textContent = titleText;
}

// 生成日历视图
function generateCalendarView() {
    if (currentView === 'month') {
        generateMonthView();
    } else if (currentView === 'week') {
        generateWeekView();
    } else {
        generateListView();
    }
}

// 生成月视图
function generateMonthView() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    // 获取当月最后一天
    const lastDay = new Date(year, month + 1, 0);

    // 获取当月第一天是星期几（0-6，0表示星期日）
    const firstDayOfWeek = firstDay.getDay();

    // 获取上个月的最后几天
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // 获取当月的总天数
    const daysInMonth = lastDay.getDate();

    // 获取今天的日期
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    // 生成上个月的日期格子
    for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthLastDay - firstDayOfWeek + i + 1;
        const dateCell = createDateCell(day, true);
        calendarGrid.appendChild(dateCell);
    }

    // 生成当月的日期格子
    for (let i = 1; i <= daysInMonth; i++) {
        const dateCell = createDateCell(i, false);

        // 如果是今天，添加today类
        if (isCurrentMonth && i === todayDate) {
            dateCell.classList.add('today');
        }

        calendarGrid.appendChild(dateCell);
    }

    // 计算需要显示的下个月天数
    const totalCells = 42; // 6行7列
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);

    // 生成下个月的日期格子
    for (let i = 1; i <= remainingCells; i++) {
        const dateCell = createDateCell(i, true);
        calendarGrid.appendChild(dateCell);
    }
}

// 创建日期格子
function createDateCell(day, isOtherMonth) {
    const dateCell = document.createElement('div');
    dateCell.className = 'date-cell';

    if (isOtherMonth) {
        dateCell.classList.add('other-month');
    }

    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = day;

    const dateContent = document.createElement('div');
    dateContent.className = 'date-content';

    dateCell.appendChild(dateHeader);
    dateCell.appendChild(dateContent);

    return dateCell;
}

// 生成周视图
function generateWeekView() {
    const weekGrid = document.getElementById('week-grid');
    weekGrid.innerHTML = '';

    // 获取当前周的起始日期（周日）
    const weekStart = getWeekStartDate(currentDate);

    // 获取今天的日期
    const today = new Date();

    // 生成一周的日期格子
    for (let i = 0; i < 7; i++) {
        const cellDate = new Date(weekStart);
        cellDate.setDate(weekStart.getDate() + i);

        const weekCell = document.createElement('div');
        weekCell.className = 'week-cell';

        // 如果是今天，添加today类
        if (cellDate.getFullYear() === today.getFullYear() &&
            cellDate.getMonth() === today.getMonth() &&
            cellDate.getDate() === today.getDate()) {
            weekCell.classList.add('today');
        }

        const dateHeader = document.createElement('div');
        dateHeader.className = 'date-header';
        dateHeader.textContent = `${cellDate.getMonth() + 1}月${cellDate.getDate()}日`;

        const dateContent = document.createElement('div');
        dateContent.className = 'date-content';

        weekCell.appendChild(dateHeader);
        weekCell.appendChild(dateContent);

        weekGrid.appendChild(weekCell);
    }
}

// 获取周的起始日期（周日）
function getWeekStartDate(date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
}

// 生成列表视图
function generateListView() {
    const listViewBody = document.getElementById('list-view-body');
    listViewBody.innerHTML = '';

    // 在实际应用中，这里应该从后端获取数据
    // 此处为演示，使用模拟数据
}

// 切换视图
function switchView(view) {
    currentView = view;

    // 更新按钮状态
    document.getElementById('month-view-btn').classList.remove('active');
    document.getElementById('week-view-btn').classList.remove('active');
    document.getElementById('list-view-btn').classList.remove('active');

    document.getElementById(`${view}-view-btn`).classList.add('active');

    // 隐藏所有视图
    document.getElementById('month-view').classList.add('d-none');
    document.getElementById('week-view').classList.add('d-none');
    document.getElementById('list-view').classList.add('d-none');

    // 显示选中的视图
    document.getElementById(`${view}-view`).classList.remove('d-none');

    // 更新日历标题
    updateCalendarTitle();

    // 生成视图
    generateCalendarView();
}

// 导航日历（上一个/下一个月或周）
function navigateCalendar(direction) {
    if (currentView === 'month') {
        currentDate.setMonth(currentDate.getMonth() + direction);
    } else if (currentView === 'week') {
        currentDate.setDate(currentDate.getDate() + direction * 7);
    }

    updateCalendarTitle();
    generateCalendarView();
}

// 加载事件数据
function loadEvents(eventType) {
    // 在实际应用中，这里应该从后端获取数据
    // 此处为演示，使用模拟数据
    const events = getEventData(eventType);

    // 将事件数据添加到日历中
    displayEvents(events, eventType);
}

// 获取事件数据
function getEventData(eventType) {
    // 模拟数据
    if (eventType === 'outbound') {
        return [
            {
                id: 1,
                date: '2025-04-15',
                time: '09:00',
                customerName: '张三',
                projectName: '美白针',
                phase: '第一阶段',
                quantity: '3针',
                status: 'pending'
            },
            {
                id: 2,
                date: '2025-04-16',
                time: '14:30',
                customerName: '李四',
                projectName: '玻尿酸',
                phase: '第二阶段',
                quantity: '2ml',
                status: 'confirmed'
            },
            {
                id: 3,
                date: '2025-04-18',
                time: '10:00',
                customerName: '王五',
                projectName: '肉毒素',
                phase: '第一阶段',
                quantity: '100单位',
                status: 'pending'
            },
            {
                id: 4,
                date: '2025-04-20',
                time: '11:30',
                customerName: '赵六',
                projectName: '美白针',
                phase: '第一阶段',
                quantity: '3针',
                status: 'completed'
            }
        ];
    } else if (eventType === 'treatment') {
        return [
            {
                id: 1,
                date: '2025-04-15',
                time: '10:00',
                customerName: '张三',
                projectName: '美白针',
                phase: '第一阶段',
                quantity: '3针',
                nurse: '李护士',
                status: 'pending'
            },
            {
                id: 2,
                date: '2025-04-16',
                time: '14:30',
                customerName: '李四',
                projectName: '玻尿酸',
                phase: '第一阶段',
                quantity: '2ml',
                nurse: '王护士',
                status: 'confirmed'
            },
            {
                id: 3,
                date: '2025-04-20',
                time: '11:30',
                customerName: '赵六',
                projectName: '肉毒素',
                phase: '第二阶段',
                quantity: '100单位',
                nurse: '赵护士',
                status: 'completed'
            }
        ];
    }

    return [];
}

// 显示事件数据
function displayEvents(events, eventType) {
    // 清空所有日期格子中的事件
    document.querySelectorAll('.date-content').forEach(content => {
        content.innerHTML = '';
    });

    // 按日期分组事件
    const eventsByDate = {};

    events.forEach(event => {
        const date = event.date;
        if (!eventsByDate[date]) {
            eventsByDate[date] = [];
        }
        eventsByDate[date].push(event);
    });

    // 将事件添加到对应的日期格子中
    for (const date in eventsByDate) {
        const events = eventsByDate[date];
        const dateObj = new Date(date);

        // 如果日期在当前月份内
        if (dateObj.getMonth() === currentDate.getMonth() &&
            dateObj.getFullYear() === currentDate.getFullYear()) {

            const day = dateObj.getDate();
            const dateCell = document.querySelector(`.date-cell:not(.other-month) .date-header:contains('${day}')`).parentNode;
            const dateContent = dateCell.querySelector('.date-content');

            // 添加事件
            events.forEach((event, index) => {
                if (index < 3) { // 最多显示3个事件
                    const planItem = document.createElement('div');
                    planItem.className = `plan-item ${eventType}`;
                    planItem.dataset.eventId = event.id;

                    let itemContent = `<span class="customer-name">${event.customerName}</span>`;
                    itemContent += ` - <span class="project-name">${event.projectName}</span>`;

                    planItem.innerHTML = itemContent;

                    // 添加点击事件
                    planItem.addEventListener('click', function() {
                        showEventDetail(event, eventType);
                    });

                    dateContent.appendChild(planItem);
                }
            });

            // 如果事件数量超过3个，显示"更多"指示器
            if (events.length > 3) {
                const moreIndicator = document.createElement('div');
                moreIndicator.className = 'more-indicator';
                moreIndicator.textContent = `+${events.length - 3} 更多`;

                // 添加点击事件
                moreIndicator.addEventListener('click', function() {
                    showDateEvents(date, events, eventType);
                });

                dateContent.appendChild(moreIndicator);
            }
        }
    }

    // 更新列表视图
    updateListView(events, eventType);
}

// 更新列表视图
function updateListView(events, eventType) {
    const listViewBody = document.getElementById('list-view-body');
    listViewBody.innerHTML = '';

    // 按日期排序事件
    events.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.time);
        const dateB = new Date(b.date + 'T' + b.time);
        return dateA - dateB;
    });

    // 添加事件到列表
    events.forEach(event => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        const dateParts = event.date.split('-');
        dateCell.textContent = `${dateParts[1]}月${dateParts[2]}日`;

        const timeCell = document.createElement('td');
        timeCell.textContent = event.time;

        const customerCell = document.createElement('td');
        customerCell.textContent = event.customerName;

        const projectCell = document.createElement('td');
        projectCell.textContent = event.projectName;

        const phaseCell = document.createElement('td');
        phaseCell.textContent = event.phase;

        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = 'badge';

        if (eventType === 'outbound') {
            if (event.status === 'pending') {
                statusBadge.classList.add('bg-warning', 'text-dark');
                statusBadge.textContent = '未出库';
            } else if (event.status === 'confirmed') {
                statusBadge.classList.add('bg-primary');
                statusBadge.textContent = '已出库';
            } else if (event.status === 'completed') {
                statusBadge.classList.add('bg-success');
                statusBadge.textContent = '已完成';
            }
        } else if (eventType === 'treatment') {
            if (event.status === 'pending') {
                statusBadge.classList.add('bg-warning', 'text-dark');
                statusBadge.textContent = '未出库';
            } else if (event.status === 'confirmed') {
                statusBadge.classList.add('bg-primary');
                statusBadge.textContent = '待治疗';
            } else if (event.status === 'completed') {
                statusBadge.classList.add('bg-success');
                statusBadge.textContent = '已治疗';
            }
        }

        statusCell.appendChild(statusBadge);

        const actionCell = document.createElement('td');
        const detailButton = document.createElement('button');
        detailButton.className = 'btn btn-sm btn-outline-primary';
        detailButton.textContent = '查看详情';

        // 添加点击事件
        detailButton.addEventListener('click', function() {
            navigateToDetail(event.id, eventType);
        });

        actionCell.appendChild(detailButton);

        row.appendChild(dateCell);
        row.appendChild(timeCell);
        row.appendChild(customerCell);
        row.appendChild(projectCell);
        row.appendChild(phaseCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        listViewBody.appendChild(row);
    });
}

// 显示事件详情
function showEventDetail(event, eventType) {
    const modalTitle = document.getElementById('event-detail-modal-label');
    const modalContent = document.getElementById('event-detail-content');
    const viewDetailBtn = document.getElementById('view-detail-btn');

    // 设置模态框标题
    modalTitle.textContent = eventType === 'outbound' ? '出库详情' : '诊疗详情';

    // 设置模态框内容
    let content = `
        <div class="event-detail">
            <p><strong>客户：</strong>${event.customerName}</p>
            <p><strong>项目：</strong>${event.projectName}</p>
            <p><strong>阶段：</strong>${event.phase}</p>
            <p><strong>数量：</strong>${event.quantity}</p>
            <p><strong>时间：</strong>${event.date} ${event.time}</p>
    `;

    if (eventType === 'treatment') {
        content += `<p><strong>负责护士：</strong>${event.nurse}</p>`;
    }

    content += `
            <p><strong>状态：</strong>
                <span class="badge ${getStatusBadgeClass(event.status)}">${getStatusText(event.status)}</span>
            </p>
        </div>
    `;

    modalContent.innerHTML = content;

    // 设置查看详情按钮点击事件
    viewDetailBtn.onclick = function() {
        navigateToDetail(event.id, eventType);
    };

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('event-detail-modal'));
    modal.show();
}

// 显示日期事件列表
function showDateEvents(date, events, eventType) {
    const modalTitle = document.getElementById('event-detail-modal-label');
    const modalContent = document.getElementById('event-detail-content');
    const viewDetailBtn = document.getElementById('view-detail-btn');

    // 设置模态框标题
    const dateParts = date.split('-');
    modalTitle.textContent = `${dateParts[1]}月${dateParts[2]}日 ${eventType === 'outbound' ? '出库' : '诊疗'}列表`;

    // 设置模态框内容
    let content = `
        <div class="date-events">
            <ul class="list-group">
    `;

    events.forEach(event => {
        content += `
            <li class="list-group-item" data-event-id="${event.id}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>${event.time}</strong> - ${event.customerName} (${event.projectName})
                    </div>
                    <span class="badge ${getStatusBadgeClass(event.status)}">${getStatusText(event.status)}</span>
                </div>
            </li>
        `;
    });

    content += `
            </ul>
        </div>
    `;

    modalContent.innerHTML = content;

    // 隐藏查看详情按钮
    viewDetailBtn.style.display = 'none';

    // 为列表项添加点击事件
    modalContent.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', function() {
            const eventId = this.dataset.eventId;
            const event = events.find(e => e.id == eventId);
            showEventDetail(event, eventType);
        });
    });

    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('event-detail-modal'));
    modal.show();
}

// 获取状态文本
function getStatusText(status) {
    if (status === 'pending') {
        return '待出库';
    } else if (status === 'confirmed') {
        return '已确认';
    } else if (status === 'completed') {
        return '已完成';
    }
    return status;
}

// 获取状态徽章类
function getStatusBadgeClass(status) {
    if (status === 'pending') {
        return 'bg-warning text-dark';
    } else if (status === 'confirmed') {
        return 'bg-primary';
    } else if (status === 'completed') {
        return 'bg-success';
    }
    return 'bg-secondary';
}

// 跳转到详情页面
function navigateToDetail(id, eventType) {
    if (eventType === 'outbound') {
        window.location.href = `outbound-detail.html?id=${id}`;
    } else if (eventType === 'treatment') {
        window.location.href = `treatment-detail.html?id=${id}`;
    }
}

// 扩展jQuery选择器以支持:contains
if (typeof jQuery !== 'undefined') {
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };
}
