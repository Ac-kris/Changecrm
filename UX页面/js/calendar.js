/**
 * 日历组件JavaScript功能
 */

// 全局状态变量
let currentDate = new Date();
let currentView = 'month'; // 'month', 'week', 'list'
let events = []; // 用于存储当前加载的事件数据
let calendarEventType = ''; // 用于存储当前日历的类型 ('outbound' or 'treatment')

// 初始化日历组件
async function initCalendar(containerId, eventType) { 
    calendarEventType = eventType; 
    console.log(`Initializing calendar for type: ${calendarEventType}`);

    // 1. 先加载事件数据
    await loadEvents(calendarEventType); 
    console.log('Initial events loaded:', events);

    // 2. 将日历导航到有示例数据的月份 (例如 2025年4月)
    // 检查是否有事件数据，如果有，将currentDate设置为第一个事件的月份
    if (events.length > 0) {
        try {
            const firstEventDate = new Date(events[0].date);
            if (!isNaN(firstEventDate.getTime())) {
                currentDate = new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1);
                console.log(`Set currentDate to the month of the first event: ${currentDate.toISOString().split('T')[0]}`);
            } else {
                console.warn('First event has invalid date, keeping default currentDate.');
            }
        } catch (e) {
            console.error('Error setting currentDate from first event:', e);
        }
    }

    // 3. 更新标题并生成初始视图 (现在基于正确的月份和已加载的数据)
    updateCalendarTitle();
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

    // 不再需要在这里调用 loadEvents，因为它已在前面await
    // loadEvents(calendarEventType);
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
        dateCell.querySelector('.date-header').setAttribute('data-day', day);
        calendarGrid.appendChild(dateCell);
    }

    // 生成当月的日期格子
    for (let i = 1; i <= daysInMonth; i++) {
        const dateCell = createDateCell(i, false);

        // 如果是今天，添加today类
        if (isCurrentMonth && i === todayDate) {
            dateCell.classList.add('today');
        }

        const dayEvents = getEventsForDate(new Date(year, month, i));
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-events';
            dayEvents.forEach(event => {
                const displayPhase = event.phase ? ` - ${event.phase}` : '';
                const displayNeedle = event.needleCount ? ` - ${event.needleCount}针` : '';
                const displayText = `${event.customerName}${event.projectName ? ' - ' + event.projectName : ''}${displayPhase}${displayNeedle}`;
                const displayTitle = `${displayText} (${getStatusText(event.status)}) ${event.time || ''}`;

                const eventElement = document.createElement('div');
                const badgeClass = getStatusBadgeClass(event.status);
                eventElement.className = `calendar-event p-1 mb-1 rounded small ${badgeClass}`;
                if (badgeClass.includes('warning') || badgeClass.includes('light') || badgeClass.includes('info')) {
                    eventElement.classList.add('text-dark');
                } else {
                    eventElement.classList.add('text-white');
                }

                eventElement.textContent = displayText;
                eventElement.dataset.eventId = event.id;

                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const clickedEvent = events.find(ev => ev.id == event.id);
                    if (clickedEvent) {
                        navigateToDetail(clickedEvent.id, calendarEventType);
                    }
                });
                eventsContainer.appendChild(eventElement);
            });
            dateCell.appendChild(eventsContainer);
        }

        calendarGrid.appendChild(dateCell);
    }

    // 计算需要显示的下个月天数
    const totalCells = 42; // 6行7列
    const remainingCells = totalCells - (firstDayOfWeek + daysInMonth);

    // 生成下个月的日期格子
    for (let i = 1; i <= remainingCells; i++) {
        const dateCell = createDateCell(i, true);
        dateCell.querySelector('.date-header').setAttribute('data-day', i);
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
    dateHeader.setAttribute('data-day', day);

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
        dateHeader.setAttribute('data-day', cellDate.getDate());

        const dateContent = document.createElement('div');
        dateContent.className = 'date-content';

        const dayEvents = getEventsForDate(cellDate);
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'calendar-events';
            dayEvents.forEach(event => {
                const displayPhase = event.phase ? ` - ${event.phase}` : '';
                const displayNeedle = event.needleCount ? ` - ${event.needleCount}针` : '';
                const displayText = `${event.customerName}${event.projectName ? ' - ' + event.projectName : ''}${displayPhase}${displayNeedle}`;
                const displayTitle = `${displayText} (${getStatusText(event.status)}) ${event.time || ''}`;

                const eventElement = document.createElement('div');
                const badgeClass = getStatusBadgeClass(event.status);
                eventElement.className = `calendar-event p-1 mb-1 rounded small ${badgeClass}`;
                if (badgeClass.includes('warning') || badgeClass.includes('light') || badgeClass.includes('info')) {
                    eventElement.classList.add('text-dark');
                } else {
                    eventElement.classList.add('text-white');
                }

                eventElement.textContent = displayText;
                eventElement.dataset.eventId = event.id;

                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const clickedEvent = events.find(ev => ev.id == event.id);
                    if (clickedEvent) {
                        navigateToDetail(clickedEvent.id, calendarEventType);
                    }
                });
                eventsContainer.appendChild(eventElement);
            });
            dateContent.appendChild(eventsContainer);
        }

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
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

    console.log("Generating List View (Table). Current events:", events);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    console.log(`Filtering list view for: ${year}-${month + 1}`);

    // 在实际应用中，这里应该从后端获取数据
    // 此处为演示，使用模拟数据

    // 确保 events 是数组并且有数据
    if (!Array.isArray(events) || events.length === 0) {
        calendarBody.innerHTML = '<div class="p-3">当前月份无事件数据</div>';
        console.log("List View: No events data available.");
        return;
    }

    const monthEvents = events.filter(event => {
        try {
            const eventDate = new Date(event.date);
            // 检查日期是否有效
            if (isNaN(eventDate.getTime())) {
                console.warn(`Invalid date format for event id ${event.id}: ${event.date}`);
                return false;
            }
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        } catch (e) {
            console.error(`Error parsing date for event id ${event.id}: ${event.date}`, e);
            return false;
        }
    });
    console.log(`List View: Filtered ${events.length} total events down to ${monthEvents.length} for ${year}-${month + 1}`);

    monthEvents.sort((a, b) => {
        // 优先按日期排序，然后按时间排序
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
            return dateComparison;
        } else {
            // 如果日期相同，比较时间 (处理可能没有时间的情况)
            const timeA = a.time || '00:00';
            const timeB = b.time || '00:00';
            return timeA.localeCompare(timeB);
        } 
    });

    // --- 生成表格 HTML ---
    let tableHtml = `<table class="table table-striped table-hover calendar-list-table"> 
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>时间</th>
                                <th>客户姓名</th>
                                <th>项目名称</th>
                                <th>阶段</th>
                                <th>针数</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>`;

    if (monthEvents.length === 0) {
        tableHtml += `<tr><td colspan="8" class="text-center">当前月份无事件</td></tr>`;
    } else {
        monthEvents.forEach(event => {
            // 处理可能缺失的字段
            const dateDisplay = event.date || '-';
            const timeDisplay = event.time || '-';
            const customerNameDisplay = event.customerName || '-';
            const projectNameDisplay = event.projectName || '-';
            const phaseDisplay = event.phase || '-';
            const needleCountDisplay = event.needleCount !== undefined ? event.needleCount : '-'; // Check for undefined
            const statusDisplay = getStatusText(event.status);
            const statusBadgeClass = getStatusBadgeClass(event.status);

            tableHtml += `<tr>
                            <td>${dateDisplay}</td>
                            <td>${timeDisplay}</td>
                            <td>${customerNameDisplay}</td>
                            <td>${projectNameDisplay}</td>
                            <td>${phaseDisplay}</td>
                            <td>${needleCountDisplay}</td>
                            <td><span class="badge ${statusBadgeClass} rounded-pill">${statusDisplay}</span></td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary view-detail-btn" 
                                        onclick="navigateToDetail(${event.id}, '${calendarEventType}')">
                                    查看详情
                                </button>
                            </td>
                        </tr>`;
        });
    }

    tableHtml += `   </tbody>
                    </table>`;

    calendarBody.innerHTML = tableHtml;
    console.log("List View: Rendered HTML Table.");

    // 表格行内的按钮已经绑定了 onclick, 无需额外绑定
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
async function loadEvents(eventType) {
    console.log(`Loading events for type: ${eventType}`);
    try {
        let sampleEvents = [];

        if (eventType === 'outbound') {
            sampleEvents = [
                { id: 1, date: '2025-04-15', time: '10:00', customerName: '张三', projectName: '项目A', phase: '阶段1', needleCount: null, status: '未出库' },
                { id: 2, date: '2025-04-16', time: '14:00', customerName: '李四', projectName: '项目B', phase: '阶段2', needleCount: null, status: '已出库' },
                { id: 3, date: '2025-04-17', time: '09:30', customerName: '王五', projectName: '项目C', phase: '阶段1', needleCount: null, status: '未出库' },
                { id: 4, date: '2025-04-17', time: '11:00', customerName: '赵六', projectName: '项目D', phase: '阶段3', needleCount: null, status: '已出库' },
                { id: 5, date: '2025-04-18', time: '16:00', customerName: '孙七', projectName: '项目E', phase: '阶段2', needleCount: null, status: '已完成' }, // Added completed status
            ];
        } else if (eventType === 'treatment') {
            sampleEvents = [
                { id: 101, date: '2025-04-20', time: '09:00', customerName: '周八', projectName: '', phase: '疗程1', needleCount: 5, status: '未出库' }, // Use '未出库' for initial?
                { id: 102, date: '2025-04-21', time: '14:30', customerName: '吴九', projectName: '', phase: '疗程2', needleCount: 8, status: '待治疗' },
                { id: 103, date: '2025-04-22', time: '10:00', customerName: '郑十', projectName: '', phase: '疗程1', needleCount: 6, status: '已治疗' },
                { id: 104, date: '2025-04-22', time: '15:00', customerName: '周八', projectName: '', phase: '疗程2', needleCount: 7, status: '待治疗' },
                { id: 105, date: '2025-04-23', time: '11:00', customerName: '吴九', projectName: '', phase: '疗程3', needleCount: 9, status: '已完成' }, // Added completed status
            ];
        }

        // 清空现有事件
        events = [];

        // 模拟异步加载
        await new Promise(resolve => setTimeout(resolve, 100));

        events = sampleEvents;
        console.log('Events loaded:', events);

        // 生成或刷新日历视图以显示新事件
        generateCalendarView();

    } catch (error) {
        console.error('Error loading events:', error);
        const calendarBody = document.querySelector('.calendar-body');
        if (calendarBody) {
            calendarBody.innerHTML = '<div>加载事件数据时出错，请稍后重试。</div>';
        }
    }
}

// 显示事件数据
function displayEvents() {
    console.warn("displayEvents function was called, but events are now rendered directly during view generation. Check call stack if unexpected.");
    if (!Array.isArray(events) || events.length === 0) return;

    events.forEach(event => {
        try {
            const eventDate = new Date(event.date);
            if (isNaN(eventDate.getTime())) {
                console.warn(`Invalid date for event id ${event.id}: ${event.date}`);
                return; // Skip invalid date
            }
            const day = eventDate.getDate();
            const eventMonth = eventDate.getMonth();
            const eventYear = eventDate.getFullYear();

            if (eventYear === currentDate.getFullYear() && eventMonth === currentDate.getMonth()) {
                const cellSelector = `.date-cell:not(.other-month) .date-header[data-day='${day}']`;
                const dateHeader = document.querySelector(cellSelector);

                if (dateHeader) {
                    const eventsContainer = dateHeader.closest('.date-cell').querySelector('.events-container');
                    if (eventsContainer) {
                        const eventElement = document.createElement('div');
                        eventElement.className = `calendar-event ${getStatusBadgeClass(event.status)}`;
                        eventElement.dataset.eventId = event.id;
                        eventElement.title = `${event.customerName} (${getStatusText(event.status)}) ${event.time || ''}`;
                        eventElement.textContent = `${event.time ? event.time.substring(0, 5) : ''} ${event.customerName}`;
                        eventsContainer.appendChild(eventElement);
                        eventElement.addEventListener('click', (e) => {
                            e.stopPropagation();
                            showEventDetail(event);
                        });
                    } else {
                        console.warn(`Events container not found for day ${day}`);
                    }
                } else {
                    console.log(`Date header not found for day ${day} using selector: ${cellSelector}`);
                }
            }
        } catch (error) {
            console.error(`Error displaying event id ${event.id}:`, error);
        }
    });
}

// 显示事件详情
function showEventDetail(event) { 
    const modalTitle = document.getElementById('event-detail-modal-title');
    const modalContent = document.getElementById('event-detail-modal-body');
    const viewDetailBtn = document.getElementById('view-detail-btn');

    modalTitle.textContent = `日期: ${event.date}`; 

    let content = `
        <div>
            <p><strong>时间:</strong> ${event.time}</p>
            <p><strong>客户:</strong> ${event.customerName}</p>
    `;
    if (event.projectName) {
        content += `<p><strong>项目:</strong> ${event.projectName}</p>`;
    }
    if (event.phase) {
        content += `<p><strong>阶段:</strong> ${event.phase}</p>`;
    }
    if (event.needleCount !== undefined) {
        content += `<p><strong>针数:</strong> ${event.needleCount}</p>`;
    }
    content += `
            <p><strong>状态:</strong> <span class="badge ${getStatusBadgeClass(event.status)}">${getStatusText(event.status)}</span></p>
        </div>
    `;

    modalContent.innerHTML = content;

    viewDetailBtn.onclick = () => navigateToDetail(event.id, calendarEventType);

    const modal = new bootstrap.Modal(document.getElementById('event-detail-modal'));
    modal.show();
}

// 跳转到详情页面
function navigateToDetail(id, eventType) {
    console.log(`Navigating to detail for event ID: ${id}, type: ${eventType}`); // Log navigation
    const detailPage = eventType === 'outbound' ? 'outbound-detail.html' : 'treatment-detail.html';
    // 确保 ID 存在再跳转
    if (id !== undefined && id !== null) {
        window.location.href = `${detailPage}?id=${id}`;
    } else {
        console.error('Cannot navigate to detail: Event ID is missing.');
    }
}

// 获取指定日期的事件
function getEventsForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
}

// 获取状态文本
function getStatusText(status) {
    switch (status) {
        case 'pending': 
        case '未出库':
            return '未出库';
        case 'confirmed': 
        case '已出库':
            return '已出库';
        case 'completed': 
            return '已完成'; 
        case '待治疗':
            return '待治疗';
        case '已治疗':
            return '已治疗';
        default:
            // 如果状态不是预期的，也返回原始状态，并打印警告
            console.warn(`Unknown event status encountered: ${status}`);
            return status;
    }
}

// 获取状态徽章类
function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending': 
        case '未出库':
            return 'bg-secondary'; 
        case 'confirmed': 
        case '已出库':
            return 'bg-success'; 
        case 'completed': 
            return 'bg-success'; 
        case '待治疗':
            return 'bg-warning text-dark'; 
        case '已治疗':
            return 'bg-info'; 
        default:
            return 'bg-light text-dark'; 
    }
}
