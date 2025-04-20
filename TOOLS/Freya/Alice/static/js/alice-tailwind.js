/**
 * Alice - Tailwind UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize mobile sidebar
    initMobileSidebar();
    
    // Initialize character relationship graph
    initRelationshipGraph();
    
    // Set up event listeners for the quick create buttons
    setupQuickCreateButtons();
    
    // Initialize modals
    initModals();
    
    // Load story elements counts
    loadCounts();
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
    
    if (menuButton && sidebar) {
        menuButton.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
        });
    }
}

/**
 * Initialize character relationship graph using vis.js
 */
function initRelationshipGraph() {
    const container = document.getElementById('relationship-graph');
    if (!container) return;
    
    // Sample data for demonstration
    const nodes = [
        { id: 1, label: 'Mayor Thompson', group: 'Townspeople', image: '/uploads/images/avatar_default.png' },
        { id: 2, label: 'Farmer Joe', group: 'Farmers', image: '/uploads/images/avatar_default.png' },
        { id: 3, label: 'Merchant Sarah', group: 'Merchants', image: '/uploads/images/avatar_default.png' },
        { id: 4, label: 'Visitor Emma', group: 'Visitors', image: '/uploads/images/avatar_default.png' },
        { id: 5, label: 'Blacksmith Mike', group: 'Townspeople', image: '/uploads/images/avatar_default.png' }
    ];
    
    const edges = [
        { from: 1, to: 2, label: 'Friend', color: { color: '#4ade80' } },
        { from: 1, to: 3, label: 'Business', color: { color: '#3b82f6' } },
        { from: 2, to: 4, label: 'Romantic', color: { color: '#f472b6' } },
        { from: 3, to: 5, label: 'Rival', color: { color: '#ef4444' } },
        { from: 4, to: 5, label: 'Family', color: { color: '#f59e0b' } }
    ];
    
    // Create nodes data set
    const nodeDataSet = new vis.DataSet(nodes.map(node => ({
        id: node.id,
        label: node.label,
        group: node.group,
        image: node.image,
        shape: 'circularImage',
        size: 30,
        font: { 
            size: 14,
            color: '#374151',
            face: 'Inter'
        },
        borderWidth: 3,
        borderWidthSelected: 5
    })));
    
    // Create edges data set
    const edgeDataSet = new vis.DataSet(edges.map(edge => ({
        from: edge.from,
        to: edge.to,
        label: edge.label,
        color: edge.color,
        width: 2,
        selectionWidth: 3,
        arrows: {
            to: { enabled: false },
            from: { enabled: false }
        },
        font: {
            size: 12,
            color: '#4b5563',
            face: 'Inter',
            align: 'middle',
            background: 'white'
        },
        smooth: {
            enabled: true,
            type: 'continuous'
        }
    })));
    
    // Create a network
    const data = {
        nodes: nodeDataSet,
        edges: edgeDataSet
    };
    
    const options = {
        physics: {
            stabilization: {
                enabled: true,
                iterations: 100
            },
            barnesHut: {
                gravitationalConstant: -5000,
                springLength: 150,
                springConstant: 0.04
            }
        },
        interaction: {
            navigationButtons: true,
            hover: true
        },
        groups: {
            Townspeople: { color: { background: '#c4b5fd', border: '#8b5cf6' } },
            Farmers: { color: { background: '#a7f3d0', border: '#10b981' } },
            Merchants: { color: { background: '#93c5fd', border: '#3b82f6' } },
            Visitors: { color: { background: '#fcd34d', border: '#f59e0b' } }
        },
        layout: {
            improvedLayout: true
        }
    };
    
    // Initialize the network
    new vis.Network(container, data, options);
}

/**
 * Set up event listeners for quick create buttons
 */
function setupQuickCreateButtons() {
    const createCharacterBtn = document.getElementById('create-character-btn');
    const createLocationBtn = document.getElementById('create-location-btn');
    const createQuestBtn = document.getElementById('create-quest-btn');
    const createDialogueBtn = document.getElementById('create-dialogue-btn');
    
    if (createCharacterBtn) {
        createCharacterBtn.addEventListener('click', function() {
            showCreateModal('character');
        });
    }
    
    if (createLocationBtn) {
        createLocationBtn.addEventListener('click', function() {
            showCreateModal('location');
        });
    }
    
    if (createQuestBtn) {
        createQuestBtn.addEventListener('click', function() {
            showCreateModal('quest');
        });
    }
    
    if (createDialogueBtn) {
        createDialogueBtn.addEventListener('click', function() {
            showCreateModal('dialogue');
        });
    }
    
    // Create dropdown for the create button
    const createStoryBtn = document.getElementById('create-story-btn');
    if (createStoryBtn) {
        createStoryBtn.addEventListener('click', function() {
            const dropdown = document.createElement('div');
            dropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20';
            dropdown.innerHTML = `
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-character">New Character</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-location">New Location</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-quest">New Quest</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-dialogue">New Dialogue</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" id="create-story-arc">New Story Arc</a>
            `;
            
            // Position the dropdown
            dropdown.style.position = 'absolute';
            dropdown.style.top = '100%';
            dropdown.style.right = '0';
            
            // Add the dropdown to the body
            document.body.appendChild(dropdown);
            
            // Add click listeners
            dropdown.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    const type = link.id.replace('create-', '');
                    showCreateModal(type);
                    document.body.removeChild(dropdown);
                });
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== createStoryBtn) {
                    if (document.body.contains(dropdown)) {
                        document.body.removeChild(dropdown);
                    }
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    }
}

/**
 * Show a modal for creating new story elements
 */
function showCreateModal(type) {
    // Implementation for modals (character, location, quest, dialogue)
    // Similar to Freya's implementation
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    // Show the modal with appropriate form
    modalContainer.innerHTML = getModalContentForType(type);
    modalContainer.classList.remove('hidden');
    
    // Setup modal event handlers
    setupModalEvents(modalContainer, type);
}

/**
 * Get modal content for a specific type
 */
function getModalContentForType(type) {
    // Modal content would be defined here based on type
    // This is just a placeholder
    return `
        <div class="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div class="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-800">Create New ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                <button class="text-gray-500 hover:text-gray-700 close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-6">
                <form id="${type}-form">
                    <div class="mb-4">
                        <label for="${type}-name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" id="${type}-name" name="name" required 
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-alice focus:border-transparent">
                    </div>
                    <div class="mb-4">
                        <label for="${type}-description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea id="${type}-description" name="description" rows="4" required
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-alice focus:border-transparent"></textarea>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 close-modal">Cancel</button>
                        <button type="submit" class="px-4 py-2 bg-alice text-white rounded-md hover:bg-alice-dark">Create ${type.charAt(0).toUpperCase() + type.slice(1)}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

/**
 * Set up modal events
 */
function setupModalEvents(modalContainer, type) {
    // Close modal when clicking the close button
    modalContainer.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            modalContainer.classList.add('hidden');
        });
    });
    
    // Close when clicking outside the modal
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.classList.add('hidden');
        }
    });
    
    // Form submission would be handled here
}

/**
 * Initialize modal functionality
 */
function initModals() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;
    
    // Close modal when pressing escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
            modalContainer.classList.add('hidden');
        }
    });
}

/**
 * Load counts of story elements
 */
function loadCounts() {
    // Sample counts for demonstration
    document.getElementById('characters-count').textContent = '12';
    document.getElementById('locations-count').textContent = '8';
    document.getElementById('quests-count').textContent = '15';
    document.getElementById('dialogues-count').textContent = '42';
    
    // Sample story completion
    const storyCompletion = 65;
    document.getElementById('story-completion').textContent = `${storyCompletion}%`;
    document.getElementById('story-progress').style.width = `${storyCompletion}%`;
} 