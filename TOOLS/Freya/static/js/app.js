/**
 * Freya - Game Development Documentation Tool
 * Main JavaScript file for the web interface
 */

// Global variables
let ideas = [];
let tasks = [];
let prdDocs = [];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Global state
    const state = {
        ideas: [],
        tasks: [],
        images: [],
        diagrams: [],
        activeSection: 'dashboard'
    };

    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Action buttons
    const createIdeaBtn = document.getElementById('create-idea-btn');
    const createTaskBtn = document.getElementById('create-task-btn');
    const createDiagramBtn = document.getElementById('create-diagram-btn');
    const aliceBtn = document.getElementById('alice-btn');

    // Dashboard elements
    const dashboardIdeasList = document.getElementById('dashboard-ideas-list');
    const dashboardTasksList = document.getElementById('dashboard-tasks-list');
    const totalIdeasCount = document.getElementById('total-ideas-count');
    const totalTasksCount = document.getElementById('total-tasks-count');
    const completedTasksCount = document.getElementById('completed-tasks-count');
    const overallProgress = document.getElementById('overall-progress');
    const progressPercentage = document.getElementById('progress-percentage');

    // Initialize the application
    function init() {
        // Set up event listeners
        setupNavigation();
        setupActionButtons();
        
        // Load initial data
        loadData();
    }

    // Navigation
    function setupNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                if (targetSection) {
                    changeSection(targetSection);
                }
            });
        });
    }

    // Change active section
    function changeSection(sectionId) {
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Update active content section
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });

        // Update state
        state.activeSection = sectionId;

        // Perform any section-specific initialization
        switch (sectionId) {
            case 'dashboard':
                updateDashboard();
                break;
            case 'ideas':
                // Initialize ideas section
                break;
            case 'tasks':
                // Initialize tasks section
                break;
            case 'docs':
                // Initialize docs section
                break;
            case 'diagrams':
                // Initialize diagrams section
                break;
        }
    }

    // Set up action buttons
    function setupActionButtons() {
        if (createIdeaBtn) {
            createIdeaBtn.addEventListener('click', () => {
                // Open new idea modal or navigate to idea creation
                console.log('Create new idea');
            });
        }

        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => {
                // Open new task modal or navigate to task creation
                console.log('Create new task');
            });
        }

        if (createDiagramBtn) {
            createDiagramBtn.addEventListener('click', () => {
                // Open diagram editor
                console.log('Create new diagram');
            });
        }

        if (aliceBtn) {
            aliceBtn.addEventListener('click', () => {
                // Navigate to Alice
                window.location.href = '/alice';
            });
        }
    }

    // Load data from API
    async function loadData() {
        try {
            // Load ideas
            const ideasResponse = await fetch('/api/ideas');
            state.ideas = await ideasResponse.json();

            // Load tasks
            const tasksResponse = await fetch('/api/tasks');
            state.tasks = await tasksResponse.json();

            // Load images
            const imagesResponse = await fetch('/api/images');
            state.images = await imagesResponse.json();

            // Load diagrams
            const diagramsResponse = await fetch('/api/diagrams');
            state.diagrams = await diagramsResponse.json();

            // Update dashboard with loaded data
            updateDashboard();

        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Update dashboard with current data
    function updateDashboard() {
        // Update idea list
        if (dashboardIdeasList) {
            const recentIdeas = state.ideas
                .sort((a, b) => new Date(b.modified) - new Date(a.modified))
                .slice(0, 5);

            if (recentIdeas.length === 0) {
                dashboardIdeasList.innerHTML = '<li>No ideas yet. Create your first idea!</li>';
            } else {
                dashboardIdeasList.innerHTML = recentIdeas.map(idea => `
                    <li class="dashboard-idea-item">
                        <div class="item-title">${idea.title}</div>
                        <div class="item-meta">
                            <span class="item-category">${idea.category || 'Uncategorized'}</span>
                            <span class="item-date">${formatDate(idea.modified)}</span>
                        </div>
                    </li>
                `).join('');
            }
        }

        // Update tasks list
        if (dashboardTasksList) {
            const inProgressTasks = state.tasks
                .filter(task => task.status === 'InProgress')
                .sort((a, b) => new Date(b.modified) - new Date(a.modified))
                .slice(0, 5);

            if (inProgressTasks.length === 0) {
                dashboardTasksList.innerHTML = '<li>No tasks in progress.</li>';
            } else {
                dashboardTasksList.innerHTML = inProgressTasks.map(task => `
                    <li class="dashboard-task-item">
                        <div class="item-title">${task.title}</div>
                        <div class="item-meta">
                            <span class="item-type ${task.type}">${task.type || 'Task'}</span>
                            <span class="item-date">${formatDate(task.modified)}</span>
                        </div>
                    </li>
                `).join('');
            }
        }

        // Update statistics
        if (totalIdeasCount) {
            totalIdeasCount.textContent = state.ideas.length;
        }

        if (totalTasksCount) {
            totalTasksCount.textContent = state.tasks.length;
        }

        if (completedTasksCount) {
            const completedCount = state.tasks.filter(task => task.status === 'Done').length;
            completedTasksCount.textContent = completedCount;
        }

        // Update progress bar
        updateProgressBar();
    }

    // Update the overall progress bar
    function updateProgressBar() {
        if (!overallProgress || !progressPercentage) return;

        const totalTasks = state.tasks.length;
        let completedTasks = 0;
        let progress = 0;

        if (totalTasks > 0) {
            completedTasks = state.tasks.filter(task => task.status === 'Done').length;
            progress = Math.round((completedTasks / totalTasks) * 100);
        }

        overallProgress.style.width = `${progress}%`;
        progressPercentage.textContent = `${progress}%`;
    }

    // Utility function to format dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Initialize the application
    init();
});

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            link.classList.add('active');
            const sectionId = link.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // Load section data if needed
            if (sectionId === 'ideas' && ideas.length === 0) {
                loadIdeas();
            } else if (sectionId === 'tasks' && tasks.length === 0) {
                loadTasks();
            } else if (sectionId === 'docs' && prdDocs.length === 0) {
                loadPRDDocs();
            } else if (sectionId === 'gantt') {
                initGanttChart();
            }
        });
    });
    
    // Dashboard card actions
    document.querySelectorAll('.card-action').forEach(action => {
        action.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Find and click the corresponding nav link
            const sectionId = action.getAttribute('data-section');
            document.querySelector(`.nav-link[data-section="${sectionId}"]`).click();
        });
    });
}

// Dashboard Data
function loadDashboardData() {
    // Load basic stats for dashboard
    Promise.all([
        fetch('/api/ideas').then(response => response.json()),
        fetch('/api/tasks').then(response => response.json()),
        fetch('/api/prd').then(response => response.json())
    ])
    .then(([ideasData, tasksData, prdDocsData]) => {
        ideas = ideasData;
        tasks = tasksData;
        prdDocs = prdDocsData;
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Update dashboard lists
        updateDashboardLists();
    })
    .catch(error => {
        console.error('Error loading dashboard data:', error);
    });
}

function updateDashboardStats() {
    // Update idea count
    document.getElementById('total-ideas-count').textContent = ideas.length;
    
    // Update task counts
    document.getElementById('total-tasks-count').textContent = tasks.length;
    
    const completedTasks = tasks.filter(task => task.status === 'Done').length;
    document.getElementById('completed-tasks-count').textContent = completedTasks;
    
    // Update progress
    let progressPercentage = 0;
    if (tasks.length > 0) {
        progressPercentage = Math.round((completedTasks / tasks.length) * 100);
    }
    
    document.getElementById('overall-progress').style.width = `${progressPercentage}%`;
    document.getElementById('progress-percentage').textContent = `${progressPercentage}%`;
}

function updateDashboardLists() {
    // Update recent ideas list
    const ideasList = document.getElementById('dashboard-ideas-list');
    ideasList.innerHTML = '';
    
    // Sort ideas by modified date, newest first
    const recentIdeas = [...ideas].sort((a, b) => {
        return new Date(b.modified) - new Date(a.modified);
    }).slice(0, 5);
    
    if (recentIdeas.length === 0) {
        ideasList.innerHTML = '<li>No ideas yet. Create your first idea!</li>';
    } else {
        recentIdeas.forEach(idea => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${idea.title}</strong>
                <span class="item-meta">${idea.category} | Score: ${idea.score.total}</span>
            `;
            ideasList.appendChild(li);
        });
    }
    
    // Update in-progress tasks list
    const tasksList = document.getElementById('dashboard-tasks-list');
    tasksList.innerHTML = '';
    
    const inProgressTasks = tasks.filter(task => task.status === 'InProgress').slice(0, 5);
    
    if (inProgressTasks.length === 0) {
        tasksList.innerHTML = '<li>No tasks in progress</li>';
    } else {
        inProgressTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${task.title}</strong>
                <span class="item-meta">${task.type} | ${task.priority} Priority</span>
            `;
            tasksList.appendChild(li);
        });
    }
}

// Ideas
function loadIdeas() {
    fetch('/api/ideas')
        .then(response => response.json())
        .then(data => {
            ideas = data;
            renderIdeas();
        })
        .catch(error => {
            console.error('Error loading ideas:', error);
        });
}

function renderIdeas(filteredIdeas = null) {
    const ideasGrid = document.getElementById('ideas-grid');
    ideasGrid.innerHTML = '';
    
    const ideaList = filteredIdeas || ideas;
    
    if (ideaList.length === 0) {
        ideasGrid.innerHTML = '<div class="no-items">No ideas found. Create your first idea!</div>';
        return;
    }
    
    ideaList.forEach(idea => {
        const card = document.createElement('div');
        card.className = 'idea-card';
        card.setAttribute('data-idea-id', idea.id);
        
        // Prepare tags display
        const tagsHtml = idea.tags.map(tag => `<span class="idea-tag">${tag}</span>`).join('');
        
        // Format status class
        const statusClass = `status-${idea.status.toLowerCase().replace(/\s+/g, '-')}`;
        
        card.innerHTML = `
            <div class="idea-header">
                <div class="idea-title">${idea.title}</div>
                <span class="idea-category">${idea.category}</span>
            </div>
            <div class="idea-summary">${idea.summary}</div>
            <div class="idea-tags">${tagsHtml}</div>
            <span class="idea-status ${statusClass}">${idea.status}</span>
            <div class="idea-meta">
                <span>${idea.modified}</span>
            </div>
            <div class="idea-score">${idea.score.total}</div>
        `;
        
        // Add click event to open idea details
        card.addEventListener('click', () => openIdeaModal(idea));
        
        ideasGrid.appendChild(card);
    });
}

function openIdeaModal(idea = null) {
    // Set modal title
    const modalTitle = document.getElementById('idea-modal-title');
    modalTitle.textContent = idea ? 'Edit Idea' : 'New Idea';
    
    // Fill form with idea data if editing
    if (idea) {
        document.getElementById('idea-title').value = idea.title;
        document.getElementById('idea-summary').value = idea.summary;
        document.getElementById('idea-description').value = idea.description || '';
        document.getElementById('idea-category').value = idea.category;
        document.getElementById('idea-tags').value = idea.tags.join(', ');
        document.getElementById('idea-status').value = idea.status;
        document.getElementById('idea-notes').value = idea.notes || '';
        
        // Set score sliders
        document.getElementById('impact-score').value = idea.score.impact;
        document.getElementById('feasibility-score').value = idea.score.feasibility;
        document.getElementById('originality-score').value = idea.score.originality;
        document.getElementById('player-value-score').value = idea.score.player_value;
        document.getElementById('alignment-score').value = idea.score.alignment;
        
        // Update score display
        updateScoreValues();
    } else {
        // Reset form for new idea
        document.getElementById('idea-form').reset();
        updateScoreValues();
    }
    
    // Show modal
    document.getElementById('idea-modal').style.display = 'block';
}

function updateScoreValues() {
    // Update individual score values
    document.getElementById('impact-value').textContent = document.getElementById('impact-score').value;
    document.getElementById('feasibility-value').textContent = document.getElementById('feasibility-score').value;
    document.getElementById('originality-value').textContent = document.getElementById('originality-score').value;
    document.getElementById('player-value').textContent = document.getElementById('player-value-score').value;
    document.getElementById('alignment-value').textContent = document.getElementById('alignment-score').value;
    
    // Calculate and update total score
    const impact = parseInt(document.getElementById('impact-score').value);
    const feasibility = parseInt(document.getElementById('feasibility-score').value);
    const originality = parseInt(document.getElementById('originality-score').value);
    const playerValue = parseInt(document.getElementById('player-value-score').value);
    const alignment = parseInt(document.getElementById('alignment-score').value);
    
    const totalScore = impact + feasibility + originality + playerValue + alignment;
    document.getElementById('total-score').textContent = totalScore;
    
    // Update priority label
    const priorityLabel = document.getElementById('priority-label');
    priorityLabel.className = '';
    
    if (totalScore >= 20) {
        priorityLabel.textContent = 'High Priority';
        priorityLabel.classList.add('high-priority');
    } else if (totalScore >= 15) {
        priorityLabel.textContent = 'Medium Priority';
        priorityLabel.classList.add('medium-priority');
    } else {
        priorityLabel.textContent = 'Low Priority';
        priorityLabel.classList.add('low-priority');
    }
}

function saveIdea() {
    const formData = {
        title: document.getElementById('idea-title').value,
        summary: document.getElementById('idea-summary').value,
        description: document.getElementById('idea-description').value,
        category: document.getElementById('idea-category').value,
        tags: document.getElementById('idea-tags').value,
        status: document.getElementById('idea-status').value,
        notes: document.getElementById('idea-notes').value,
        score: {
            impact: parseInt(document.getElementById('impact-score').value),
            feasibility: parseInt(document.getElementById('feasibility-score').value),
            originality: parseInt(document.getElementById('originality-score').value),
            player_value: parseInt(document.getElementById('player-value-score').value),
            alignment: parseInt(document.getElementById('alignment-score').value)
        }
    };
    
    fetch('/api/ideas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            document.getElementById('idea-modal').style.display = 'none';
            
            // Reload ideas
            loadIdeas();
            
            // Update dashboard
            loadDashboardData();
        } else {
            alert('Error saving idea: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error saving idea:', error);
        alert('Error saving idea. Please try again.');
    });
}

function filterIdeas() {
    const searchText = document.getElementById('idea-search').value.toLowerCase();
    const categoryFilter = document.getElementById('idea-filter').value;
    const statusFilter = document.getElementById('idea-status-filter').value;
    
    const filteredIdeas = ideas.filter(idea => {
        // Text search
        const matchesSearch = idea.title.toLowerCase().includes(searchText) || 
                            idea.summary.toLowerCase().includes(searchText) ||
                            idea.tags.some(tag => tag.toLowerCase().includes(searchText));
        
        // Category filter
        const matchesCategory = categoryFilter === 'all' || idea.category === categoryFilter;
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });
    
    renderIdeas(filteredIdeas);
}

// Tasks
function loadTasks() {
    fetch('/api/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            renderTasks();
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
        });
}

function renderTasks(filteredTasks = null) {
    const taskList = filteredTasks || tasks;
    
    // Clear all columns
    document.getElementById('backlog-tasks').innerHTML = '';
    document.getElementById('nextup-tasks').innerHTML = '';
    document.getElementById('inprogress-tasks').innerHTML = '';
    document.getElementById('review-tasks').innerHTML = '';
    document.getElementById('done-tasks').innerHTML = '';
    
    // Reset counters
    document.getElementById('backlog-count').textContent = '0';
    document.getElementById('nextup-count').textContent = '0';
    document.getElementById('inprogress-count').textContent = '0';
    document.getElementById('review-count').textContent = '0';
    document.getElementById('done-count').textContent = '0';
    
    // Group tasks by status
    const tasksByStatus = {
        'Backlog': [],
        'NextUp': [],
        'InProgress': [],
        'Review': [],
        'Done': []
    };
    
    taskList.forEach(task => {
        if (tasksByStatus[task.status]) {
            tasksByStatus[task.status].push(task);
        }
    });
    
    // Render each status column
    Object.keys(tasksByStatus).forEach(status => {
        const columnTasks = tasksByStatus[status];
        const columnElement = document.getElementById(`${status.toLowerCase()}-tasks`);
        const countElement = document.getElementById(`${status.toLowerCase()}-count`);
        
        // Update count
        countElement.textContent = columnTasks.length;
        
        // Render tasks
        columnTasks.forEach(task => {
            const card = document.createElement('div');
            card.className = 'task-card';
            card.setAttribute('data-task-id', task.id);
            
            // Format type class
            const typeClass = task.type.toLowerCase();
            
            // Format priority class
            const priorityClass = `priority-${task.priority.toLowerCase()}`;
            
            card.innerHTML = `
                <div class="task-header">
                    <div class="task-title">${task.title}</div>
                    <div class="task-info">
                        <span>${task.estimated_time}</span>
                        <span>${task.milestone}</span>
                    </div>
                </div>
                <div class="task-description">${task.description.slice(0, 100)}${task.description.length > 100 ? '...' : ''}</div>
                <div class="task-footer">
                    <span class="task-type ${typeClass}">${task.type}</span>
                    <span class="task-priority ${priorityClass}">${task.priority}</span>
                </div>
            `;
            
            // Add click event to open task details
            card.addEventListener('click', () => openTaskModal(task));
            
            // Make tasks draggable for kanban functionality
            card.setAttribute('draggable', 'true');
            card.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', task.id);
            });
            
            columnElement.appendChild(card);
        });
    });
}

function openTaskModal(task = null) {
    // Set modal title
    const modalTitle = document.getElementById('task-modal-title');
    modalTitle.textContent = task ? 'Edit Task' : 'New Task';
    
    // Fill form with task data if editing
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-type').value = task.type;
        document.getElementById('task-estimated-time').value = task.estimated_time;
        document.getElementById('task-milestone').value = task.milestone;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-objective').value = task.objective || '';
        document.getElementById('task-acceptance-criteria').value = task.acceptance_criteria || '';
        document.getElementById('task-implementation-notes').value = task.implementation_notes || '';
        document.getElementById('task-dependencies').value = task.dependencies || '';
        document.getElementById('task-testing-plan').value = task.testing_plan || '';
        document.getElementById('task-next-steps').value = task.next_steps || '';
    } else {
        // Reset form for new task
        document.getElementById('task-form').reset();
    }
    
    // Show modal
    document.getElementById('task-modal').style.display = 'block';
}

function saveTask() {
    const formData = {
        title: document.getElementById('task-title').value,
        type: document.getElementById('task-type').value,
        estimated_time: document.getElementById('task-estimated-time').value,
        milestone: document.getElementById('task-milestone').value,
        priority: document.getElementById('task-priority').value,
        description: document.getElementById('task-description').value,
        objective: document.getElementById('task-objective').value,
        acceptance_criteria: document.getElementById('task-acceptance-criteria').value,
        implementation_notes: document.getElementById('task-implementation-notes').value,
        dependencies: document.getElementById('task-dependencies').value,
        testing_plan: document.getElementById('task-testing-plan').value,
        next_steps: document.getElementById('task-next-steps').value,
        status: 'Backlog' // New tasks always start in Backlog
    };
    
    fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Close modal
            document.getElementById('task-modal').style.display = 'none';
            
            // Reload tasks
            loadTasks();
            
            // Update dashboard
            loadDashboardData();
        } else {
            alert('Error saving task: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error saving task:', error);
        alert('Error saving task. Please try again.');
    });
}

function updateTaskStatus(taskId, newStatus) {
    fetch(`/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload tasks
            loadTasks();
            
            // Update dashboard
            loadDashboardData();
        } else {
            alert('Error updating task status: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error updating task status:', error);
        alert('Error updating task status. Please try again.');
    });
}

function filterTasks() {
    const searchText = document.getElementById('task-search').value.toLowerCase();
    const typeFilter = document.getElementById('task-filter').value;
    const milestoneFilter = document.getElementById('milestone-filter').value;
    
    const filteredTasks = tasks.filter(task => {
        // Text search
        const matchesSearch = task.title.toLowerCase().includes(searchText) || 
                            task.description.toLowerCase().includes(searchText);
        
        // Type filter
        const matchesType = typeFilter === 'all' || task.type === typeFilter;
        
        // Milestone filter (partial match)
        const matchesMilestone = milestoneFilter === 'all' || task.milestone.includes(milestoneFilter);
        
        return matchesSearch && matchesType && matchesMilestone;
    });
    
    renderTasks(filteredTasks);
}

// PRD Docs
function loadPRDDocs() {
    fetch('/api/prd')
        .then(response => response.json())
        .then(data => {
            prdDocs = data;
            renderPRDDocs();
        })
        .catch(error => {
            console.error('Error loading PRD documents:', error);
        });
}

function renderPRDDocs(filteredDocs = null) {
    const docsList = document.getElementById('docs-list');
    docsList.innerHTML = '';
    
    const docList = filteredDocs || prdDocs;
    
    if (docList.length === 0) {
        docsList.innerHTML = '<div class="no-items">No PRD documents found.</div>';
        return;
    }
    
    // Sort docs by modified date, newest first
    const sortedDocs = [...docList].sort((a, b) => {
        return new Date(b.modified) - new Date(a.modified);
    });
    
    sortedDocs.forEach(doc => {
        const item = document.createElement('div');
        item.className = 'doc-item';
        item.setAttribute('data-file-path', doc.file_path);
        
        item.innerHTML = `
            <div class="doc-title">${doc.title}</div>
            <div class="doc-summary">${doc.summary}</div>
            <div class="doc-meta">Last updated: ${doc.modified}</div>
        `;
        
        // Add click event to view document
        item.addEventListener('click', () => viewDocument(doc));
        
        docsList.appendChild(item);
    });
    
    // Add event listener for document search
    document.getElementById('doc-search').addEventListener('input', searchPRDDocs);
}

function viewDocument(doc) {
    // Get relative path from absolute path
    const filePath = doc.file_path.split('/docs/')[1];
    
    // Fetch file content
    fetch(`/api/file/${filePath}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Show document preview
                const docPreview = document.getElementById('doc-preview');
                docPreview.innerHTML = data.html;
                
                // Highlight the selected document in the list
                document.querySelectorAll('.doc-item').forEach(item => {
                    item.classList.remove('active');
                });
                document.querySelector(`.doc-item[data-file-path="${doc.file_path}"]`).classList.add('active');
            } else {
                alert('Error loading document: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error loading document:', error);
            alert('Error loading document. Please try again.');
        });
}

function searchPRDDocs() {
    const searchText = document.getElementById('doc-search').value.toLowerCase();
    
    const filteredDocs = prdDocs.filter(doc => {
        return doc.title.toLowerCase().includes(searchText) || 
               doc.summary.toLowerCase().includes(searchText);
    });
    
    renderPRDDocs(filteredDocs);
}

// Gantt Chart - Simplified implementation
function initGanttChart() {
    const ganttChart = document.getElementById('gantt-chart');
    ganttChart.innerHTML = '<p>Gantt chart visualization will be implemented in a future update.</p>';
    
    // TODO: Implement actual Gantt chart visualization based on tasks and milestones
}

// Event Listeners
function initEventListeners() {
    // Ideas
    document.getElementById('new-idea-btn').addEventListener('click', () => openIdeaModal());
    document.getElementById('create-idea-btn').addEventListener('click', () => openIdeaModal());
    document.getElementById('save-idea-btn').addEventListener('click', saveIdea);
    document.getElementById('cancel-idea-btn').addEventListener('click', () => {
        document.getElementById('idea-modal').style.display = 'none';
    });
    
    // Score sliders
    document.getElementById('impact-score').addEventListener('input', updateScoreValues);
    document.getElementById('feasibility-score').addEventListener('input', updateScoreValues);
    document.getElementById('originality-score').addEventListener('input', updateScoreValues);
    document.getElementById('player-value-score').addEventListener('input', updateScoreValues);
    document.getElementById('alignment-score').addEventListener('input', updateScoreValues);
    
    // Tasks
    document.getElementById('new-task-btn').addEventListener('click', () => openTaskModal());
    document.getElementById('create-task-btn').addEventListener('click', () => openTaskModal());
    document.getElementById('save-task-btn').addEventListener('click', saveTask);
    document.getElementById('cancel-task-btn').addEventListener('click', () => {
        document.getElementById('task-modal').style.display = 'none';
    });
    
    // Task filtering
    document.getElementById('task-search').addEventListener('input', filterTasks);
    document.getElementById('task-filter').addEventListener('change', filterTasks);
    document.getElementById('milestone-filter').addEventListener('change', filterTasks);
    
    // Idea filtering
    document.getElementById('idea-search').addEventListener('input', filterIdeas);
    document.getElementById('idea-filter').addEventListener('change', filterIdeas);
    document.getElementById('idea-status-filter').addEventListener('change', filterIdeas);
    
    // Document handling
    document.getElementById('view-prd-btn').addEventListener('click', () => {
        document.querySelector('.nav-link[data-section="docs"]').click();
    });
    
    // Close modals when clicking on X or outside of modal content
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });
    
    document.getElementById('close-doc-btn').addEventListener('click', () => {
        document.getElementById('doc-modal').style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Drag and drop for tasks
    document.querySelectorAll('.column-content').forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = column.parentElement.getAttribute('data-status');
            
            updateTaskStatus(taskId, newStatus);
        });
    });
} 