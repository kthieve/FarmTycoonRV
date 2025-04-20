/**
 * Alice - Story Development Tool for Game Development
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', () => {
    // Global state
    const state = {
        characters: [],
        locations: [],
        dialogues: [],
        quests: [],
        storyArcs: [],
        activeSection: 'story-dashboard'
    };

    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Action buttons
    const createCharacterBtn = document.getElementById('create-character-btn');
    const createLocationBtn = document.getElementById('create-location-btn'); 
    const createDialogueBtn = document.getElementById('create-dialogue-btn');
    const createQuestBtn = document.getElementById('create-quest-btn');
    const newCharacterBtn = document.getElementById('new-character-btn');
    
    // Dashboard elements
    const dashboardCharactersList = document.getElementById('dashboard-characters-list');
    const dashboardLocationsList = document.getElementById('dashboard-locations-list');
    const relationshipGraph = document.getElementById('relationship-graph');
    const charactersGrid = document.getElementById('characters-grid');
    const characterSearch = document.getElementById('character-search');
    const characterFilter = document.getElementById('character-filter');

    // Initialize the application
    function init() {
        // Set up event listeners
        setupNavigation();
        setupActionButtons();
        
        // Load initial data
        loadData();
    }

    // Navigation between sections
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
            case 'story-dashboard':
                updateDashboard();
                break;
            case 'characters':
                renderCharacters();
                break;
            case 'locations':
                // Initialize locations section
                break;
            case 'quests':
                // Initialize quests section
                break;
            case 'dialogues':
                // Initialize dialogues section
                break;
            case 'story-arcs':
                // Initialize story arcs section
                break;
        }
    }

    // Set up action buttons
    function setupActionButtons() {
        if (createCharacterBtn) {
            createCharacterBtn.addEventListener('click', () => {
                openCharacterModal();
            });
        }

        if (createLocationBtn) {
            createLocationBtn.addEventListener('click', () => {
                // Open location creation modal
                console.log('Create new location');
            });
        }

        if (createDialogueBtn) {
            createDialogueBtn.addEventListener('click', () => {
                // Open dialogue creation interface
                console.log('Create new dialogue');
            });
        }

        if (createQuestBtn) {
            createQuestBtn.addEventListener('click', () => {
                // Open quest creation modal
                console.log('Create new quest');
            });
        }

        if (newCharacterBtn) {
            newCharacterBtn.addEventListener('click', () => {
                openCharacterModal();
            });
        }

        // Search and filter for characters
        if (characterSearch) {
            characterSearch.addEventListener('input', filterCharacters);
        }

        if (characterFilter) {
            characterFilter.addEventListener('change', filterCharacters);
        }
    }

    // Load data from API
    async function loadData() {
        try {
            // Load characters
            const charactersResponse = await fetch('/alice/api/characters');
            state.characters = await charactersResponse.json();

            // Load locations
            const locationsResponse = await fetch('/alice/api/locations');
            state.locations = await locationsResponse.json();

            // Load dialogues
            const dialoguesResponse = await fetch('/alice/api/dialogues');
            state.dialogues = await dialoguesResponse.json();

            // Load quests
            const questsResponse = await fetch('/alice/api/quests');
            state.quests = await questsResponse.json();

            // Load story arcs
            const storyArcsResponse = await fetch('/alice/api/story-arcs');
            state.storyArcs = await storyArcsResponse.json();

            // Update dashboard with loaded data
            updateDashboard();

            // Initialize relationship graph
            initRelationshipGraph();

        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Update dashboard with current data
    function updateDashboard() {
        // Update characters list
        if (dashboardCharactersList) {
            const recentCharacters = state.characters
                .sort((a, b) => new Date(b.modified) - new Date(a.modified))
                .slice(0, 5);

            if (recentCharacters.length === 0) {
                dashboardCharactersList.innerHTML = '<li>No characters yet. Create your first character!</li>';
            } else {
                dashboardCharactersList.innerHTML = recentCharacters.map(character => `
                    <li class="dashboard-character-item">
                        <div class="item-title">${character.name || 'Unnamed Character'}</div>
                        <div class="item-meta">
                            <span class="item-faction">${character.faction || 'No Faction'}</span>
                            <span class="item-date">${formatDate(character.modified)}</span>
                        </div>
                    </li>
                `).join('');
            }
        }

        // Update locations list
        if (dashboardLocationsList) {
            const recentLocations = state.locations
                .sort((a, b) => new Date(b.modified) - new Date(a.modified))
                .slice(0, 5);

            if (recentLocations.length === 0) {
                dashboardLocationsList.innerHTML = '<li>No locations yet. Create your first location!</li>';
            } else {
                dashboardLocationsList.innerHTML = recentLocations.map(location => `
                    <li class="dashboard-location-item">
                        <div class="item-title">${location.name || 'Unnamed Location'}</div>
                        <div class="item-meta">
                            <span class="item-region">${location.region || 'No Region'}</span>
                            <span class="item-date">${formatDate(location.modified)}</span>
                        </div>
                    </li>
                `).join('');
            }
        }
    }

    // Initialize character relationship graph
    function initRelationshipGraph() {
        if (!relationshipGraph) return;

        // Fetch character relationship data
        fetch('/alice/api/characters/relationship-graph')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.graph) {
                    renderRelationshipGraph(data.graph);
                } else {
                    relationshipGraph.innerHTML = '<div class="error-message">Failed to load relationship data</div>';
                }
            })
            .catch(error => {
                console.error('Error loading relationship graph:', error);
                relationshipGraph.innerHTML = '<div class="error-message">Error loading relationship data</div>';
            });
    }

    // Render the relationship graph using D3.js
    function renderRelationshipGraph(graphData) {
        if (!relationshipGraph || !graphData.nodes || !graphData.edges) return;

        relationshipGraph.innerHTML = '';
        
        // If D3.js is available, render a force-directed graph
        // This is a placeholder - in a real implementation, you would use D3 for visualization
        const graphPlaceholder = document.createElement('div');
        graphPlaceholder.className = 'graph-placeholder';
        graphPlaceholder.innerHTML = `
            <p>Relationship Graph</p>
            <p>${graphData.nodes.length} characters with ${graphData.edges.length} relationships</p>
        `;
        relationshipGraph.appendChild(graphPlaceholder);
    }

    // Render all characters in the characters grid
    function renderCharacters(filteredCharacters = null) {
        if (!charactersGrid) return;

        const characters = filteredCharacters || state.characters;
        
        if (characters.length === 0) {
            charactersGrid.innerHTML = '<div class="empty-state">No characters found. Create a new character to get started!</div>';
            return;
        }

        charactersGrid.innerHTML = characters.map(character => `
            <div class="character-card" data-id="${character.id}">
                <div class="character-avatar" style="background-color: ${stringToColor(character.name || 'Character')}">
                    ${getInitials(character.name || 'Character')}
                </div>
                <div class="character-info">
                    <h3 class="character-name">${character.name || 'Unnamed Character'}</h3>
                    <div class="character-faction">${character.faction || 'No Faction'}</div>
                    <div class="character-description">${character.description ? truncateText(character.description, 100) : 'No description'}</div>
                </div>
                <div class="character-actions">
                    <button class="edit-character-btn" data-id="${character.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-character-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const characterId = button.getAttribute('data-id');
                const character = state.characters.find(c => c.id === characterId);
                if (character) {
                    openCharacterModal(character);
                }
            });
        });

        // Make character cards clickable to view details
        document.querySelectorAll('.character-card').forEach(card => {
            card.addEventListener('click', () => {
                const characterId = card.getAttribute('data-id');
                const character = state.characters.find(c => c.id === characterId);
                if (character) {
                    viewCharacterDetails(character);
                }
            });
        });
    }

    // Filter characters based on search and faction filter
    function filterCharacters() {
        if (!characterSearch || !characterFilter) return;

        const searchTerm = characterSearch.value.toLowerCase();
        const faction = characterFilter.value;

        const filteredCharacters = state.characters.filter(character => {
            const nameMatch = character.name?.toLowerCase().includes(searchTerm) || false;
            const descriptionMatch = character.description?.toLowerCase().includes(searchTerm) || false;
            const factionMatch = faction === 'all' || character.faction === faction;
            
            return (nameMatch || descriptionMatch) && factionMatch;
        });

        renderCharacters(filteredCharacters);
    }

    // Open character modal for creation or editing
    function openCharacterModal(character = null) {
        console.log('Opening character modal', character ? `for ${character.name}` : 'for new character');
        
        // This is a placeholder - in a real implementation, you would create and display a modal
        if (character) {
            // Edit existing character
            console.log('Edit character:', character);
        } else {
            // Create new character
            console.log('Create new character');
        }
    }

    // View character details
    function viewCharacterDetails(character) {
        console.log('View character details:', character);
        
        // This is a placeholder - in a real implementation, you would display character details
    }

    // Utility function - Convert string to color
    function stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        
        return color;
    }

    // Utility function - Get initials from name
    function getInitials(name) {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    // Utility function - Truncate text with ellipsis
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Utility function to format dates
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Initialize the application
    init();
}); 