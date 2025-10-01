# 📚 Smart Study Planner

A comprehensive web-based study planning application designed to help students organize their academic tasks, manage deadlines, and boost productivity through effective time management.

![Smart Study Planner](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🌟 Features

### 📊 Dashboard Overview
- **Task Statistics**: Visual overview of total, completed, pending, and overdue tasks
- **Progress Tracking**: Real-time progress bar showing completion percentage
- **Today's Tasks**: Quick access to tasks due today
- **Upcoming Deadlines**: Preview of the next 5 upcoming deadlines
- **Subject Distribution Chart**: Visual representation of tasks by subject

### ✅ Task Management
- **Create Tasks**: Add new tasks with detailed information
- **Edit & Update**: Modify existing tasks as needed
- **Delete Tasks**: Remove completed or unnecessary tasks
- **Status Tracking**: Track task progress (Not Started, In Progress, Completed)
- **Priority Levels**: Set task priorities (High, Medium, Low)
- **Subject Organization**: Categorize tasks by academic subjects
- **Time Estimation**: Set estimated hours for task completion

### 🔍 Advanced Filtering & Search
- **Text Search**: Search across task titles, descriptions, and subjects
- **Subject Filter**: Filter tasks by specific subjects
- **Priority Filter**: Sort tasks by priority level
- **Status Filter**: View tasks by completion status

### 📅 Calendar Integration
- **Month View**: Traditional calendar layout with task visualization
- **Week View**: Focused weekly perspective for detailed planning
- **Task Display**: Tasks appear directly on calendar dates
- **Interactive Navigation**: Easy navigation between months and dates
- **Today Button**: Quick jump to current date

### ⏱️ Pomodoro Timer
- **Customizable Timer**: Set study sessions with preset durations
- **Timer Presets**: Quick access to 15, 25, and 45-minute sessions
- **Start/Pause/Reset**: Full timer control
- **Completion Notifications**: Visual feedback when timer completes

### 🎨 User Experience
- **Light/Dark Theme**: Toggle between light and dark modes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Intuitive Navigation**: Clean, modern interface with easy navigation
- **Real-time Updates**: Live date and time display
- **Notifications**: User feedback for all actions

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhinav12004/Smart-Study-Planner.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd Smart-Study-Planner
   ```

3. **Open the application**
   - Open `index.html` in your web browser
   - Or use a local server (recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have live-server installed)
   npx live-server
   ```

4. **Access the application**
   - If using a local server: `http://localhost:8000`
   - Or simply double-click `index.html`

## 💻 Usage Guide

### Creating Your First Task

1. **Navigate to Tasks**: Click on the "Tasks" tab in the navigation menu
2. **Add New Task**: Click the "Add New Task" button
3. **Fill Task Details**:
   - **Title**: Enter a descriptive task name
   - **Subject**: Specify the academic subject
   - **Description**: Add detailed task description
   - **Priority**: Select High, Medium, or Low
   - **Due Date & Time**: Set when the task is due
   - **Estimated Hours**: How long you expect the task to take
   - **Status**: Current progress (Not Started, In Progress, Completed)
4. **Save**: Click "Add Task" to save

### Using the Dashboard

The dashboard provides a comprehensive overview of your study progress:

- **Statistics Cards**: View total tasks, completed tasks, pending tasks, and overdue tasks
- **Progress Bar**: Visual representation of overall completion
- **Today's Tasks**: Focus on what's due today
- **Upcoming Deadlines**: Plan for the next few days
- **Subject Chart**: Understand your workload distribution

### Calendar Planning

1. **Switch to Calendar View**: Click the "Calendar" tab
2. **View Options**: Choose between Month and Week views
3. **Task Visualization**: Tasks appear as colored blocks on their due dates
4. **Quick Access**: Click on any task in the calendar to view details
5. **Navigation**: Use arrow buttons or "Today" to navigate dates

### Productivity Timer

1. **Access Timer**: Click on the "Timer" tab
2. **Set Duration**: Choose from presets (15, 25, 45 minutes) or set custom time
3. **Start Session**: Click "Start" to begin your study session
4. **Manage Session**: Use Pause/Resume as needed
5. **Complete Session**: Timer will notify you when the session ends

### Search and Filtering

- **Search Bar**: Type keywords to find specific tasks
- **Subject Filter**: Select a specific subject to view related tasks
- **Priority Filter**: Focus on high, medium, or low priority tasks
- **Status Filter**: View tasks by completion status

## 🏗️ Project Structure

```
Smart-Study-Planner/
│
├── index.html              # Main HTML file
├── style.css              # Stylesheet with responsive design
├── app.js                 # Main JavaScript application logic
└── README.md              # Project documentation
```

### Key Components

#### HTML Structure (`index.html`)
- Semantic HTML5 structure
- Responsive layout containers
- Modal dialogs for task details
- Form elements for task creation/editing

#### Styling (`style.css`)
- CSS Grid and Flexbox layouts
- CSS Variables for theme management
- Responsive design with media queries
- Modern UI components and animations

#### Application Logic (`app.js`)
- ES6+ JavaScript with class-based architecture
- Event-driven programming
- Local data management
- Dynamic DOM manipulation

## 🔧 Technical Implementation

### Architecture
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: Browser localStorage (data persists between sessions)
- **Design Pattern**: Object-oriented programming with class-based structure
- **State Management**: Centralized application state in StudyPlanner class

### Key Classes and Methods

#### StudyPlanner Class
```javascript
class StudyPlanner {
    constructor()           // Initialize application
    init()                 // Setup event listeners and load data
    loadSampleData()       // Load demo tasks
    setupEventListeners()  // Bind UI events
    renderCurrentView()    // Update active view
    // ... additional methods
}
```

### Data Model
```javascript
// Task Object Structure
{
    id: Number,              // Unique identifier
    title: String,           // Task name
    subject: String,         // Academic subject
    description: String,     // Detailed description
    priority: String,        // 'high', 'medium', 'low'
    dueDate: String,         // ISO date string
    dueTime: String,         // Time in HH:MM format
    estimatedHours: Number,  // Expected completion time
    status: String,          // 'not-started', 'in-progress', 'completed'
    createdAt: String,       // ISO timestamp
    completedAt: String      // ISO timestamp (null if not completed)
}
```

## 🎨 Customization

### Themes
The application supports light and dark themes:
- Toggle using the theme button in the header
- Preference saved in localStorage
- CSS variables enable easy color customization

### Adding Custom Subjects
Subjects are automatically populated based on existing tasks:
- Add a task with a new subject
- The subject filter will automatically include the new option

### Modifying Timer Presets
Edit the preset buttons in `app.js`:
```javascript
// Timer presets (in minutes)
[15, 25, 45]  // Modify these values as needed
```

## 🌐 Browser Compatibility

- **Chrome**: 70+ ✅
- **Firefox**: 65+ ✅
- **Safari**: 12+ ✅
- **Edge**: 79+ ✅
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 70+ ✅

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted layout with touch-friendly interfaces
- **Mobile**: Compact design with essential features accessible

## 🚧 Future Enhancements

### Planned Features
- [ ] **Data Export/Import**: Backup and restore task data
- [ ] **Task Categories**: Additional organization beyond subjects
- [ ] **Reminders**: Email/push notifications for upcoming deadlines
- [ ] **Study Analytics**: Detailed productivity insights
- [ ] **Collaboration**: Share tasks with study groups
- [ ] **Calendar Sync**: Integration with Google Calendar, Outlook
- [ ] **Progress Photos**: Attach images to track visual progress
- [ ] **Study Resources**: Link tasks to online resources and materials

### Technical Improvements
- [ ] **Progressive Web App**: Offline functionality and app-like experience
- [ ] **Database Integration**: Cloud storage for data synchronization
- [ ] **User Authentication**: Personal accounts and data security
- [ ] **API Integration**: Connect with educational platforms

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation for new features

## 🐛 Known Issues

- Sample data includes past dates (intentional for demonstration)
- Timer audio notifications not implemented
- Bulk task operations not available

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abhinav Pandey**
- GitHub: [@Abhinav12004](https://github.com/Abhinav12004)
- Project Link: [Smart Study Planner](https://github.com/Abhinav12004/Smart-Study-Planner)

## 🙏 Acknowledgments

- Inspired by productivity methodologies like Getting Things Done (GTD)
- UI design influenced by modern productivity applications
- Pomodoro Technique implementation for time management
- Community feedback and suggestions for feature improvements

## 📞 Support

If you encounter any issues or have questions:

1. **Check the Issues**: Review existing [GitHub Issues](https://github.com/Abhinav12004/Smart-Study-Planner/issues)
2. **Create New Issue**: Submit a detailed bug report or feature request
3. **Contact**: Reach out through GitHub for additional support

---

**Made with ❤️ for students who want to achieve their academic goals through better organization and time management.**