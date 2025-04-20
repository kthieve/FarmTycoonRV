/**
 * Freya - Tailwind UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize mobile sidebar
    initMobileSidebar();
    
    // Initialize drag and drop for tasks
    initDragAndDrop();
    
    // Initialize charts and plots
    initCharts();
    
    // Set up event listeners for the quick create buttons
    setupQuickCreateButtons();
    
    // Initialize modals
    initModals();
});

/**
 * Initialize navigation between sections
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitle = document.getElementById('page-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the section to show
            const sectionId = this.getAttribute('data-section');
            const sectionTitle = this.querySelector('span').textContent;
            
            // Update page title
            pageTitle.textContent = sectionTitle;
            
            // Hide all sections and show the selected one
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('hidden');
            });
            
            document.getElementById(sectionId).classList.remove('hidden');
        });
    });
    
    // Also handle section transitions from other elements
    document.querySelectorAll('[data-section]').forEach(element => {
        if (!element.classList.contains('nav-link')) {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                
                const sectionId = this.getAttribute('data-section');
                
                // Find and click the corresponding nav link
                document.querySelector(`.nav-link[data-section="${sectionId}"]`).click();
            });
        }
    });
}

/**
 * Initialize mobile sidebar toggle
 */
function initMobileSidebar() {
    const menuButton = document.getElementById('mobile-menu-button');
    const sidebar = document.getElementById('sidebar');
    
    menuButton.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
    });
}

/**
 * Initialize drag and drop functionality for tasks
 */
function initDragAndDrop() {
    const taskLists = document.querySelectorAll('.task-list');
    
    // Initialize SortableJS for each task list
    taskLists.forEach(taskList => {
        if (taskList.id) {
            new Sortable(taskList, {
                group: 'tasks',
                animation: 150,
                ghostClass: 'is-dragging',
                dragClass: 'is-dragging',
                onStart: function(evt) {
                    evt.item.classList.add('is-dragging');
                },
                onEnd: function(evt) {
                    evt.item.classList.remove('is-dragging');
                    
                    // Get the task ID and new status
                    const taskId = evt.item.getAttribute('data-id');
                    const newStatus = evt.to.id === 'todo-tasks' ? 'todo' : 
                                     evt.to.id === 'in-progress-tasks' ? 'in_progress' : 'completed';
                    
                    // Update the task status in the backend
                    if (taskId) {
                        updateTaskStatus(taskId, newStatus);
                    }
                    
                    // Update task counts
                    updateTaskCounts();
                }
            });
        }
    });
}

/**
 * Update task status via API
 */
function updateTaskStatus(taskId, status) {
    fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Task status updated', 'success');
        } else {
            showNotification('Failed to update task status', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating task status:', error);
        showNotification('Error updating task status', 'error');
    });
}

/**
 * Update the task counts in each column
 */
function updateTaskCounts() {
    document.getElementById('todo-count').textContent = document.getElementById('todo-tasks').children.length;
    document.getElementById('progress-count').textContent = document.getElementById('in-progress-tasks').children.length;
    document.getElementById('completed-count').textContent = document.getElementById('completed-tasks').children.length;
}

/**
 * Initialize charts and plots
 */
function initCharts() {
    // Only initialize if the container exists
    const progressChartContainer = document.getElementById('progress-chart');
    if (!progressChartContainer) return;
    
    // Get task metrics from API for real data
    fetch('/api/metrics/tasks')
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                createTaskProgressChart(progressChartContainer, result.data);
                updateStatCards(result.data);
            } else {
                // If API fails, use sample data
                createSampleProgressChart(progressChartContainer);
            }
        })
        .catch(error => {
            console.error('Error loading chart data:', error);
            createSampleProgressChart(progressChartContainer);
        });
}

/**
 * Create a task progress chart with real data
 */
function createTaskProgressChart(container, data) {
    // If timeline data is available, use it
    let timeline = data.timeline_data;
    
    // If no timeline data or it's empty, create sample data
    if (!timeline || timeline.length === 0) {
        return createSampleProgressChart(container);
    }
    
    // Sort timeline data by date
    timeline.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get dates and task counts
    const dates = timeline.map(item => item.date);
    const taskCounts = timeline.map(item => item.count);
    
    // Calculate cumulative task counts
    const cumulativeCounts = [];
    let cum = 0;
    for (let count of taskCounts) {
        cum += count;
        cumulativeCounts.push(cum);
    }
    
    // Create completion percentage (estimate based on status counts)
    const completionPercentages = [];
    const statusCounts = data.status_counts;
    const totalTasks = statusCounts.todo + statusCounts.in_progress + statusCounts.completed;
    
    if (totalTasks > 0) {
        // Create a growth curve for completed tasks
        let completedRatio = statusCounts.completed / totalTasks;
        let progressRatio = statusCounts.in_progress / totalTasks;
        
        // Estimate how completion grew over time 
        for (let i = 0; i < dates.length; i++) {
            let progress = Math.min(100, Math.round((i / (dates.length - 1)) * completedRatio * 100));
            completionPercentages.push(progress);
        }
    } else {
        // If no tasks, just use zeros
        for (let i = 0; i < dates.length; i++) {
            completionPercentages.push(0);
        }
    }
    
    // Create ideal line (linear progress to 100%)
    const idealData = [];
    for (let i = 0; i < dates.length; i++) {
        idealData.push(Math.round((i / (dates.length - 1)) * 100));
    }
    
    // Create the plot
    Plotly.newPlot(container, [
        {
            x: dates,
            y: cumulativeCounts,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Total Tasks',
            line: {
                color: '#3b82f6',
                width: 3
            },
            marker: {
                color: '#2563eb',
                size: 6
            }
        },
        {
            x: dates,
            y: completionPercentages,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Completion %',
            yaxis: 'y2',
            line: {
                color: '#22c55e',
                width: 3
            },
            marker: {
                color: '#16a34a',
                size: 6
            }
        },
        {
            x: dates,
            y: idealData,
            type: 'scatter',
            mode: 'lines',
            name: 'Ideal Progress',
            yaxis: 'y2',
            line: {
                color: '#94a3b8',
                width: 2,
                dash: 'dot'
            }
        }
    ], {
        margin: { t: 10, l: 40, r: 40, b: 40 },
        xaxis: {
            title: '',
            showgrid: false,
            tickformat: '%d %b'
        },
        yaxis: {
            title: 'Tasks',
            titlefont: { color: '#3b82f6' },
            tickfont: { color: '#3b82f6' }
        },
        yaxis2: {
            title: 'Completion %',
            titlefont: { color: '#22c55e' },
            tickfont: { color: '#22c55e' },
            overlaying: 'y',
            side: 'right',
            range: [0, 100]
        },
        legend: {
            orientation: 'h',
            y: -0.2
        },
        font: {
            family: 'Inter, sans-serif'
        },
        autosize: true
    }, {
        responsive: true
    });
    
    // Update overall progress value in the stats card
    const latestProgress = completionPercentages[completionPercentages.length - 1];
    document.getElementById('overall-progress').style.width = `${latestProgress}%`;
    document.getElementById('progress-percentage').textContent = `${latestProgress}%`;
}

/**
 * Create a sample progress chart when no data is available
 */
function createSampleProgressChart(container) {
    // Create sample data for demonstration
    const dates = [];
    const taskData = [];
    const idealData = [];
    
    // Generate 30 days of sample data
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
        
        // Random progress data (normally this would come from your API)
        const progress = i > 20 ? 20 + Math.floor(Math.random() * 10) :
                      i > 10 ? 30 + Math.floor(Math.random() * 20) :
                      50 + Math.floor(Math.random() * 30);
        
        taskData.push(progress);
        idealData.push(Math.min(100, Math.floor(100 * (30 - i) / 30)));
    }
    
    // Create the plot
    Plotly.newPlot(container, [
        {
            x: dates,
            y: taskData,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Actual Progress',
            line: {
                color: '#22c55e',
                width: 3
            },
            marker: {
                color: '#16a34a',
                size: 6
            }
        },
        {
            x: dates,
            y: idealData,
            type: 'scatter',
            mode: 'lines',
            name: 'Ideal Progress',
            line: {
                color: '#94a3b8',
                width: 2,
                dash: 'dot'
            }
        }
    ], {
        margin: { t: 10, l: 40, r: 10, b: 40 },
        xaxis: {
            title: '',
            showgrid: false,
            tickformat: '%d %b'
        },
        yaxis: {
            title: 'Completion %',
            range: [0, 100]
        },
        legend: {
            orientation: 'h',
            y: -0.2
        },
        font: {
            family: 'Inter, sans-serif'
        },
        autosize: true
    }, {
        responsive: true
    });
    
    // Update overall progress value in the stats card
    const latestProgress = taskData[taskData.length - 1];
    document.getElementById('overall-progress').style.width = `${latestProgress}%`;
    document.getElementById('progress-percentage').textContent = `${latestProgress}%`;
}

/**
 * Update stat cards with real data
 */
function updateStatCards(data) {
    // Update task counts
    const statusCounts = data.status_counts;
    const totalTasks = statusCounts.todo + statusCounts.in_progress + statusCounts.completed;
    const completedTasks = statusCounts.completed;
    
    document.getElementById('total-tasks-count').textContent = totalTasks;
    document.getElementById('completed-tasks-count').textContent = completedTasks;
    
    // Fetch ideas count
    fetch('/api/ideas')
        .then(response => response.json())
        .then(ideas => {
            document.getElementById('total-ideas-count').textContent = ideas.length;
        })
        .catch(error => {
            console.error('Error loading ideas count:', error);
        });
    
    // Get story elements count (from Alice)
    fetch('/alice/api/characters')
        .then(response => response.json())
        .then(characters => {
            const count = characters.length || 0;
            document.getElementById('story-elements-count').textContent = count;
        })
        .catch(error => {
            console.error('Error loading story elements count:', error);
            document.getElementById('story-elements-count').textContent = '0';
        });
}

/**
 * Set up event listeners for quick create buttons
 */
function setupQuickCreateButtons() {
    const createIdeaBtn = document.getElementById('create-idea-btn');
    const createTaskBtn = document.getElementById('create-task-btn');
    const createDiagramBtn = document.getElementById('create-diagram-btn');
    const aliceBtn = document.getElementById('alice-btn');
    
    if (createIdeaBtn) {
        createIdeaBtn.addEventListener('click', function() {
            showCreateModal('idea');
        });
    }
    
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', function() {
            showCreateModal('task');
        });
    }
    
    if (createDiagramBtn) {
        createDiagramBtn.addEventListener('click', function() {
            showCreateModal('diagram');
        });
    }
    
    if (aliceBtn) {
        aliceBtn.addEventListener('click', function() {
            window.location.href = '/alice';
        });
    }
    
    // Handle dropdown in the create button
    const createBtn = document.getElementById('create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            const dropdown = document.createElement('div');
            dropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20';
            dropdown.innerHTML = `
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-idea">New Idea</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-task">New Task</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-diagram">New Diagram</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-character">New Character</a>
            `;
            
            // Position the dropdown
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.right = '0';
            
            // Add click listeners
            dropdown.querySelector('#create-idea').addEventListener('click', e => {
                e.preventDefault();
                showCreateModal('idea');
                document.body.removeChild(dropdown);
            });
            
            dropdown.querySelector('#create-task').addEventListener('click', e => {
                e.preventDefault();
                showCreateModal('task');
                document.body.removeChild(dropdown);
            });
            
            dropdown.querySelector('#create-diagram').addEventListener('click', e => {
                e.preventDefault();
                showCreateModal('diagram');
                document.body.removeChild(dropdown);
            });
            
            dropdown.querySelector('#create-character').addEventListener('click', e => {
                e.preventDefault();
                window.location.href = '/alice';
                document.body.removeChild(dropdown);
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== createBtn) {
                    if (document.body.contains(dropdown)) {
                        document.body.removeChild(dropdown);
                    }
                    document.removeEventListener('click', closeDropdown);
                }
            });
            
            // Add the dropdown to the body
            document.body.appendChild(dropdown);
        });
    }
}

/**
 * Show a modal for creating new items
 */
function showCreateModal(type) {
    const modalContainer = document.getElementById('modal-container');
    let modalContent = '';
    
    switch (type) {
        case 'idea':
            modalContent = `
                <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-800">Create New Idea</h3>
                        <button class="text-gray-500 hover:text-gray-700 close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6">
                        <form id="idea-form">
                            <div class="mb-4">
                                <label for="idea-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" id="idea-title" name="title" required 
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div class="mb-4">
                                <label for="idea-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="idea-description" name="description" rows="4" required
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                            </div>
                            <div class="mb-4">
                                <label for="idea-category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select id="idea-category" name="category" required
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select a category</option>
                                    <option value="gameplay">Gameplay</option>
                                    <option value="feature">Feature</option>
                                    <option value="ui">UI/UX</option>
                                    <option value="story">Story</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label for="idea-tags" class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                                <input type="text" id="idea-tags" name="tags" 
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div class="flex justify-end mt-6">
                                <button type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 close-modal">Cancel</button>
                                <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Create Idea</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            break;
        
        case 'task':
            modalContent = `
                <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-800">Create New Task</h3>
                        <button class="text-gray-500 hover:text-gray-700 close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6">
                        <form id="task-form">
                            <div class="mb-4">
                                <label for="task-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" id="task-title" name="title" required 
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div class="mb-4">
                                <label for="task-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="task-description" name="description" rows="4" required
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                            </div>
                            <div class="mb-4">
                                <label for="task-priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                <select id="task-priority" name="priority" required
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select a priority</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label for="task-due-date" class="block text-sm font-medium text-gray-700 mb-1">Due Date (optional)</label>
                                <input type="date" id="task-due-date" name="due_date" 
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div class="flex justify-end mt-6">
                                <button type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 close-modal">Cancel</button>
                                <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            break;
        
        case 'diagram':
            modalContent = `
                <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
                    <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 class="text-lg font-semibold text-gray-800">Create New Diagram</h3>
                        <button class="text-gray-500 hover:text-gray-700 close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="p-6">
                        <form id="diagram-form">
                            <div class="mb-4">
                                <label for="diagram-name" class="block text-sm font-medium text-gray-700 mb-1">Diagram Name</label>
                                <input type="text" id="diagram-name" name="name" required 
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                            </div>
                            <div class="mb-4">
                                <label for="diagram-type" class="block text-sm font-medium text-gray-700 mb-1">Diagram Type</label>
                                <select id="diagram-type" name="type" required
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option value="">Select a type</option>
                                    <option value="flowchart">Flowchart</option>
                                    <option value="sequence">Sequence</option>
                                    <option value="class">Class Diagram</option>
                                    <option value="state">State Diagram</option>
                                    <option value="gantt">Gantt Chart</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label for="diagram-code" class="block text-sm font-medium text-gray-700 mb-1">Mermaid Code</label>
                                <textarea id="diagram-code" name="code" rows="10" required placeholder="e.g. graph TD; A-->B; B-->C;"
                                    class="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                            </div>
                            <div class="flex justify-end mt-6">
                                <button type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 close-modal">Cancel</button>
                                <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Create Diagram</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            break;
    }
    
    // Show the modal
    modalContainer.innerHTML = modalContent;
    modalContainer.classList.remove('hidden');
    
    // Set up form submission and close buttons
    setupModalEvents(modalContainer, type);
}

/**
 * Set up modal events for form submission and closing
 */
function setupModalEvents(modalContainer, type) {
    // Set up close buttons
    modalContainer.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.classList.add('hidden');
        });
    });
    
    // Close when clicking outside the modal content
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.classList.add('hidden');
        }
    });
    
    // Set up form submission
    const form = modalContainer.querySelector(`#${type}-form`);
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Special handling for tags
            if (data.tags) {
                data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
            
            // Submit to the appropriate API endpoint
            const endpoint = type === 'idea' ? '/api/ideas' : 
                             type === 'task' ? '/api/tasks' : 
                             '/api/diagram/create';
            
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Close the modal
                    modalContainer.classList.add('hidden');
                    
                    // Show success notification
                    showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully`, 'success');
                    
                    // Reload the relevant content
                    if (type === 'idea') {
                        loadIdeas();
                    } else if (type === 'task') {
                        loadTasks();
                    } else if (type === 'diagram') {
                        document.querySelector('.nav-link[data-section="diagrams"]').click();
                    }
                } else {
                    showNotification(`Failed to create ${type}: ${result.error || 'Unknown error'}`, 'error');
                }
            })
            .catch(error => {
                console.error(`Error creating ${type}:`, error);
                showNotification(`Error creating ${type}`, 'error');
            });
        });
    }
}

/**
 * Initialize modal functionality
 */
function initModals() {
    const modalContainer = document.getElementById('modal-container');
    
    // Close modal when pressing escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
            modalContainer.classList.add('hidden');
        }
    });
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'info') icon = 'info-circle';
    if (type === 'warn') icon = 'exclamation-triangle';
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${icon} mr-3 ${type === 'success' ? 'text-green-500' : 
                                           type === 'error' ? 'text-red-500' : 
                                           type === 'warn' ? 'text-amber-500' : 'text-blue-500'}"></i>
            <div>${message}</div>
        </div>
        <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add close button functionality
    notification.querySelector('button').addEventListener('click', function() {
        document.body.removeChild(notification);
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            notification.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
} 