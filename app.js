// Smart Study Planner Application
class StudyPlanner {
    constructor() {
        this.tasks = [];
        this.currentView = 'dashboard';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.calendarView = 'month'; // 'month' or 'week'
        this.editingTaskId = null;
        this.timer = {
            minutes: 25,
            seconds: 0,
            isRunning: false,
            intervalId: null
        };
        this.theme = 'light';
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.updateDateTime();
        this.renderCurrentView();
        this.startDateTimeUpdater();
        
        // Set default date for task form
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').value = today;
    }

    loadSampleData() {
        const sampleTasks = [
            {
                id: 1,
                title: "Complete TOC Assignment ",
                subject: "Theory of Computation",
                description: "Complete the assignment on the topic of Turing Machines",
                priority: "high",
                dueDate: "2025-09-12",
                dueTime: "23:59",
                estimatedHours: 3,
                status: "in-progress",
                createdAt: "2025-09-08T10:00:00.000Z",
                completedAt: null
            },
            {
                id: 2,
                title: "Study for TOC Quiz",
                subject: "Theory of Computation",
                description: "Review the topic of Turing Machines",
                priority: "medium",
                dueDate: "2025-09-11",
                dueTime: "09:00",
                estimatedHours: 2,
                status: "not-started",
                createdAt: "2025-09-08T14:30:00.000Z",
                completedAt: null
            },
            {
                id: 3,
                title: "Prepare TOC Presentation",
                subject: "Theory of Computation",
                description: "Create presentation on Turing Machines",
                priority: "high",
                dueDate: "2025-09-13",
                dueTime: "15:30",
                estimatedHours: 4,
                status: "not-started",
                createdAt: "2025-09-08T16:45:00.000Z",
                completedAt: null
            }
        ];
        
        this.tasks = sampleTasks;
        this.populateSubjectFilter();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Task form
        document.getElementById('showTaskForm').addEventListener('click', () => this.showTaskForm());
        document.getElementById('taskFormElement').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        document.getElementById('cancelForm').addEventListener('click', () => this.hideTaskForm());

        // Quick add buttons - these should switch to tasks view and show form
        document.getElementById('quickAddBtn').addEventListener('click', () => this.quickAddTask());
        document.getElementById('fabBtn').addEventListener('click', () => this.quickAddTask());

        // Search and filters
        document.getElementById('searchTasks').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('filterSubject').addEventListener('change', (e) => this.handleFilter());
        document.getElementById('filterPriority').addEventListener('change', (e) => this.handleFilter());
        document.getElementById('filterStatus').addEventListener('change', (e) => this.handleFilter());

        // Calendar navigation
        document.getElementById('prevMonth').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => this.navigateMonth(1));
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
        
        // Calendar view options
        document.getElementById('monthView').addEventListener('click', () => this.setCalendarView('month'));
        document.getElementById('weekView').addEventListener('click', () => this.setCalendarView('week'));

        // Timer controls
        document.getElementById('startTimer').addEventListener('click', () => this.startTimer());
        document.getElementById('pauseTimer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('resetTimer').addEventListener('click', () => this.resetTimer());

        // Timer presets
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setTimerPreset(parseInt(e.target.dataset.minutes)));
        });

        // Modal
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('editTaskBtn').addEventListener('click', () => this.editCurrentTask());
        document.getElementById('deleteTaskBtn').addEventListener('click', () => this.deleteCurrentTask());

        // Click outside modal to close
        document.getElementById('taskModal').addEventListener('click', (e) => {
            if (e.target.id === 'taskModal') {
                this.hideModal();
            }
        });
    }

    // Theme Management
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-color-scheme', this.theme);
        
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.textContent = this.theme === 'light' ? '🌙' : '☀️';
        
        this.showNotification(`Switched to ${this.theme} theme`, 'success');
    }

    // View Management
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        document.getElementById(`${viewName}View`).classList.add('active');

        this.currentView = viewName;
        this.renderCurrentView();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'calendar':
                this.renderCalendar();
                break;
            case 'timer':
                this.renderTimer();
                break;
        }
    }

    // Dashboard
    renderDashboard() {
        this.updateStats();
        this.renderTodaysTasks();
        this.renderUpcomingDeadlines();
        this.renderSubjectChart();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.status === 'completed').length;
        const pending = total - completed;
        const overdue = this.getOverdueTasks().length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('overdueTasks').textContent = overdue;

        // Update progress bar
        const progressPercent = total > 0 ? (completed / total) * 100 : 0;
        document.getElementById('overallProgress').style.width = `${progressPercent}%`;
        document.getElementById('progressText').textContent = `${Math.round(progressPercent)}% Complete`;
    }

    renderTodaysTasks() {
        const today = new Date().toISOString().split('T')[0];
        const todaysTasks = this.tasks.filter(task => task.dueDate === today);
        
        const container = document.getElementById('todaysTasks');
        container.innerHTML = '';

        if (todaysTasks.length === 0) {
            container.innerHTML = '<p class="text-secondary">No tasks due today</p>';
            return;
        }

        todaysTasks.forEach(task => {
            const taskElement = this.createTaskItem(task);
            container.appendChild(taskElement);
        });
    }

    renderUpcomingDeadlines() {
        const upcoming = this.getUpcomingTasks().slice(0, 5);
        const container = document.getElementById('upcomingDeadlines');
        container.innerHTML = '';

        if (upcoming.length === 0) {
            container.innerHTML = '<p class="text-secondary">No upcoming deadlines</p>';
            return;
        }

        upcoming.forEach(task => {
            const deadlineElement = document.createElement('div');
            deadlineElement.className = 'task-item';
            deadlineElement.innerHTML = `
                <div class="task-header">
                    <h4 class="task-title">${task.title}</h4>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
                <div class="task-meta">
                    <span>${task.subject}</span>
                    <span>Due: ${this.formatDate(task.dueDate)} at ${task.dueTime}</span>
                </div>
            `;
            deadlineElement.addEventListener('click', () => this.showTaskModal(task));
            container.appendChild(deadlineElement);
        });
    }

    renderSubjectChart() {
        const canvas = document.getElementById('subjectChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Get subject distribution
        const subjectCounts = {};
        this.tasks.forEach(task => {
            subjectCounts[task.subject] = (subjectCounts[task.subject] || 0) + 1;
        });

        const subjects = Object.keys(subjectCounts);
        const counts = Object.values(subjectCounts);
        
        if (subjects.length === 0) return;

        // Simple bar chart
        const maxCount = Math.max(...counts);
        const barWidth = (canvas.width - 40) / subjects.length;
        const maxBarHeight = canvas.height - 40;

        subjects.forEach((subject, index) => {
            const barHeight = (counts[index] / maxCount) * maxBarHeight;
            const x = 20 + index * barWidth;
            const y = canvas.height - 20 - barHeight;

            // Draw bar
            ctx.fillStyle = '#1FB8CD';
            ctx.fillRect(x, y, barWidth - 10, barHeight);

            // Draw label
            ctx.fillStyle = '#134252';
            ctx.font = '10px Arial';
            ctx.save();
            ctx.translate(x + (barWidth - 10) / 2, canvas.height - 5);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText(subject.substring(0, 8), 0, 0);
            ctx.restore();
        });
    }

    // Task Management
    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const container = document.getElementById('tasksList');
        container.innerHTML = '';

        if (filteredTasks.length === 0) {
            container.innerHTML = '<p class="text-secondary">No tasks found</p>';
            return;
        }

        filteredTasks.forEach(task => {
            const taskCard = this.createTaskCard(task);
            container.appendChild(taskCard);
        });
    }

    createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-card-header">
                <h3 class="task-card-title">${task.title}</h3>
            </div>
            <div class="task-card-subject">${task.subject}</div>
            <p class="task-card-description">${task.description || 'No description'}</p>
            <div class="task-meta">
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                <span class="status-badge status-${task.status}">${task.status.replace('-', ' ')}</span>
            </div>
            <div class="task-meta">
                <span>Due: ${this.formatDate(task.dueDate)} at ${task.dueTime}</span>
                <span>${task.estimatedHours}h estimated</span>
            </div>
            <div class="task-card-footer">
                <div class="task-card-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editTask(${task.id})">Edit</button>
                    <button class="btn btn--sm btn--secondary" onclick="app.toggleTaskStatus(${task.id})">${task.status === 'completed' ? 'Reopen' : 'Complete'}</button>
                    <button class="btn btn--sm btn--outline" style="color: var(--color-error);" onclick="app.deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.showTaskModal(task);
            }
        });
        
        return card;
    }

    createTaskItem(task) {
        const item = document.createElement('div');
        item.className = 'task-item';
        item.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-meta">
                <span>${task.subject}</span>
                <span class="status-badge status-${task.status}">${task.status.replace('-', ' ')}</span>
                <span>Due: ${task.dueTime}</span>
            </div>
        `;
        item.addEventListener('click', () => this.showTaskModal(task));
        return item;
    }

    quickAddTask() {
        // Switch to tasks view first, then show the form
        if (this.currentView !== 'tasks') {
            this.switchView('tasks');
        }
        // Use setTimeout to ensure the view has rendered before showing the form
        setTimeout(() => {
            this.showTaskForm();
        }, 100);
    }

    showTaskForm() {
        document.getElementById('taskForm').classList.remove('hidden');
        document.getElementById('showTaskForm').style.display = 'none';
        document.getElementById('formTitle').textContent = this.editingTaskId ? 'Edit Task' : 'Add New Task';
        
        // Scroll to form if needed
        document.getElementById('taskForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    hideTaskForm() {
        document.getElementById('taskForm').classList.add('hidden');
        document.getElementById('showTaskForm').style.display = 'block';
        document.getElementById('taskFormElement').reset();
        this.editingTaskId = null;
        
        // Reset to default date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('taskDueDate').value = today;
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: document.getElementById('taskTitle').value,
            subject: document.getElementById('taskSubject').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value,
            dueTime: document.getElementById('taskDueTime').value || '23:59',
            estimatedHours: parseFloat(document.getElementById('taskHours').value) || 1,
            status: document.getElementById('taskStatus').value
        };

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskData);
        } else {
            this.createTask(taskData);
        }

        this.hideTaskForm();
        this.renderCurrentView();
    }

    createTask(taskData) {
        const task = {
            id: Date.now(),
            ...taskData,
            createdAt: new Date().toISOString(),
            completedAt: taskData.status === 'completed' ? new Date().toISOString() : null
        };
        
        this.tasks.push(task);
        this.populateSubjectFilter(); // Update subject filter options
        this.showNotification('Task created successfully!', 'success');
    }

    updateTask(id, taskData) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            const existingTask = this.tasks[taskIndex];
            this.tasks[taskIndex] = {
                ...existingTask,
                ...taskData,
                completedAt: taskData.status === 'completed' && existingTask.status !== 'completed' 
                    ? new Date().toISOString() 
                    : existingTask.completedAt
            };
            this.populateSubjectFilter(); // Update subject filter options
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    editTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            this.editingTaskId = id;
            
            // Populate form
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskSubject').value = task.subject;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskDueDate').value = task.dueDate;
            document.getElementById('taskDueTime').value = task.dueTime;
            document.getElementById('taskHours').value = task.estimatedHours;
            document.getElementById('taskStatus').value = task.status;
            
            this.showTaskForm();
            
            if (this.currentView !== 'tasks') {
                this.switchView('tasks');
            }
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.populateSubjectFilter(); // Update subject filter options
            this.showNotification('Task deleted successfully!', 'success');
            this.renderCurrentView();
        }
    }

    toggleTaskStatus(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            if (task.status === 'completed') {
                task.status = 'in-progress';
                task.completedAt = null;
            } else {
                task.status = 'completed';
                task.completedAt = new Date().toISOString();
            }
            this.showNotification(`Task marked as ${task.status}!`, 'success');
            this.renderCurrentView();
        }
    }

    // Search and Filter
    handleSearch(query) {
        this.renderTasks();
    }

    handleFilter() {
        this.renderTasks();
    }

    getFilteredTasks() {
        const search = document.getElementById('searchTasks').value.toLowerCase();
        const subjectFilter = document.getElementById('filterSubject').value;
        const priorityFilter = document.getElementById('filterPriority').value;
        const statusFilter = document.getElementById('filterStatus').value;

        return this.tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(search) ||
                                task.description.toLowerCase().includes(search) ||
                                task.subject.toLowerCase().includes(search);
            const matchesSubject = !subjectFilter || task.subject === subjectFilter;
            const matchesPriority = !priorityFilter || task.priority === priorityFilter;
            const matchesStatus = !statusFilter || task.status === statusFilter;

            return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
        });
    }

    populateSubjectFilter() {
        const subjects = [...new Set(this.tasks.map(task => task.subject))];
        const select = document.getElementById('filterSubject');
        
        // Clear existing options except "All Subjects"
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });
    }

    // Calendar
    renderCalendar() {
        this.updateCalendarHeader();
        this.renderCalendarGrid();
    }

    updateCalendarHeader() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        document.getElementById('currentMonth').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    renderCalendarGrid() {
        const container = document.getElementById('calendar');
        container.innerHTML = '';

        if (this.calendarView === 'week') {
            this.renderWeekView(container);
        } else {
            this.renderMonthView(container);
        }
    }

    renderMonthView(container) {
        // Add day headers
        const dayHeaders = document.createElement('div');
        dayHeaders.className = 'calendar-header-days';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header-day';
            dayHeader.textContent = day;
            dayHeaders.appendChild(dayHeader);
        });
        container.appendChild(dayHeaders);

        // Create calendar grid
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid month-view';

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            
            if (cellDate.getMonth() !== this.currentMonth) {
                dayCell.classList.add('other-month');
            }
            
            if (cellDate.toISOString().split('T')[0] === todayStr) {
                dayCell.classList.add('today');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = cellDate.getDate();
            dayCell.appendChild(dayNumber);

            // Add tasks for this day
            const dayStr = cellDate.toISOString().split('T')[0];
            const dayTasks = this.tasks.filter(task => task.dueDate === dayStr);
            
            dayTasks.slice(0, 3).forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `calendar-task priority-${task.priority}`;
                taskElement.textContent = task.title.substring(0, 20) + (task.title.length > 20 ? '...' : '');
                taskElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showTaskModal(task);
                });
                dayCell.appendChild(taskElement);
            });

            if (dayTasks.length > 3) {
                const moreElement = document.createElement('div');
                moreElement.className = 'calendar-task';
                moreElement.textContent = `+${dayTasks.length - 3} more`;
                moreElement.style.fontSize = '10px';
                dayCell.appendChild(moreElement);
            }

            calendarGrid.appendChild(dayCell);
        }

        container.appendChild(calendarGrid);
    }

    renderWeekView(container) {
        // Add day headers
        const dayHeaders = document.createElement('div');
        dayHeaders.className = 'calendar-header-days week-view';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header-day';
            dayHeader.textContent = day;
            dayHeaders.appendChild(dayHeader);
        });
        container.appendChild(dayHeaders);

        // Create calendar grid
        const calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid week-view';

        // Get the current week (Sunday to Saturday)
        const today = new Date();
        const currentWeekStart = new Date(today);
        currentWeekStart.setDate(today.getDate() - today.getDay());

        for (let i = 0; i < 7; i++) {
            const cellDate = new Date(currentWeekStart);
            cellDate.setDate(currentWeekStart.getDate() + i);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day week-day';
            
            if (cellDate.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
                dayCell.classList.add('today');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = cellDate.getDate();
            dayCell.appendChild(dayNumber);

            // Add tasks for this day
            const dayStr = cellDate.toISOString().split('T')[0];
            const dayTasks = this.tasks.filter(task => task.dueDate === dayStr);
            
            dayTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `calendar-task priority-${task.priority}`;
                taskElement.innerHTML = `
                    <div class="task-time">${task.dueTime}</div>
                    <div class="task-title">${task.title}</div>
                `;
                taskElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showTaskModal(task);
                });
                dayCell.appendChild(taskElement);
            });

            calendarGrid.appendChild(dayCell);
        }

        container.appendChild(calendarGrid);
    }

    navigateMonth(direction) {
        this.currentMonth += direction;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.renderCalendar();
    }

    goToToday() {
        const today = new Date();
        this.currentMonth = today.getMonth();
        this.currentYear = today.getFullYear();
        this.renderCalendar();
        this.showNotification('Navigated to current month', 'info');
    }

    setCalendarView(view) {
        this.calendarView = view;
        
        // Update button states
        document.querySelectorAll('.calendar-view-options .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(view + 'View').classList.add('active');
        
        this.renderCalendar();
        this.showNotification(`Switched to ${view} view`, 'info');
    }

    // Timer
    renderTimer() {
        this.updateTimerDisplay();
    }

    updateTimerDisplay() {
        const display = document.getElementById('timerDisplay');
        const minutes = String(this.timer.minutes).padStart(2, '0');
        const seconds = String(this.timer.seconds).padStart(2, '0');
        display.textContent = `${minutes}:${seconds}`;
    }

    startTimer() {
        if (!this.timer.isRunning) {
            this.timer.isRunning = true;
            this.timer.intervalId = setInterval(() => {
                if (this.timer.seconds === 0) {
                    if (this.timer.minutes === 0) {
                        this.timerComplete();
                        return;
                    }
                    this.timer.minutes--;
                    this.timer.seconds = 59;
                } else {
                    this.timer.seconds--;
                }
                this.updateTimerDisplay();
            }, 1000);
        }
    }

    pauseTimer() {
        if (this.timer.isRunning) {
            this.timer.isRunning = false;
            clearInterval(this.timer.intervalId);
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.timer.minutes = 25;
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }

    setTimerPreset(minutes) {
        this.pauseTimer();
        this.timer.minutes = minutes;
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }

    timerComplete() {
        this.pauseTimer();
        this.showNotification('Timer completed! Great job! 🎉', 'success');
        
        // Reset timer
        this.timer.minutes = 25;
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }

    // Modal
    showTaskModal(task) {
        this.currentModalTask = task;
        document.getElementById('modalTitle').textContent = task.title;
        
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = `
            <div class="task-details">
                <p><strong>Subject:</strong> ${task.subject}</p>
                <p><strong>Priority:</strong> <span class="priority-badge priority-${task.priority}">${task.priority}</span></p>
                <p><strong>Status:</strong> <span class="status-badge status-${task.status}">${task.status.replace('-', ' ')}</span></p>
                <p><strong>Due Date:</strong> ${this.formatDate(task.dueDate)} at ${task.dueTime}</p>
                <p><strong>Estimated Hours:</strong> ${task.estimatedHours}</p>
                ${task.description ? `<p><strong>Description:</strong> ${task.description}</p>` : ''}
                <p><strong>Created:</strong> ${this.formatDateTime(task.createdAt)}</p>
                ${task.completedAt ? `<p><strong>Completed:</strong> ${this.formatDateTime(task.completedAt)}</p>` : ''}
            </div>
        `;
        
        document.getElementById('taskModal').classList.remove('hidden');
    }

    hideModal() {
        document.getElementById('taskModal').classList.add('hidden');
        this.currentModalTask = null;
    }

    editCurrentTask() {
        if (this.currentModalTask) {
            this.editTask(this.currentModalTask.id);
            this.hideModal();
        }
    }

    deleteCurrentTask() {
        if (this.currentModalTask) {
            this.deleteTask(this.currentModalTask.id);
            this.hideModal();
        }
    }

    // Utility Functions
    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('currentDateTime').textContent = now.toLocaleDateString('en-US', options);
    }

    startDateTimeUpdater() {
        setInterval(() => this.updateDateTime(), 60000); // Update every minute
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    }

    formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getUpcomingTasks() {
        const now = new Date();
        return this.tasks
            .filter(task => task.status !== 'completed' && new Date(task.dueDate) >= now)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    getOverdueTasks() {
        const now = new Date();
        return this.tasks.filter(task => 
            task.status !== 'completed' && 
            new Date(task.dueDate) < now
        );
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.getElementById('notifications').appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application
const app = new StudyPlanner();