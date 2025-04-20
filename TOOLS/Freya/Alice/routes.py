"""
Alice - Storytelling and Dialogue Development Tool for Games
Routes file to handle API endpoints and page rendering
"""

import os
import json
import uuid
from datetime import datetime
from flask import Blueprint, render_template, jsonify, request, current_app

# Create a Blueprint for Alice
alice_bp = Blueprint('alice', __name__, 
                     template_folder='templates',
                     static_folder='static')

# Define the paths
BASE_DOCS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'docs')
STORY_PATH = os.path.join(BASE_DOCS_PATH, 'Story')
DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')

# Make sure the necessary directories exist
if not os.path.exists(STORY_PATH):
    os.makedirs(STORY_PATH)

# Data files
CHARACTERS_FILE = os.path.join(DATA_PATH, 'characters.json')
LOCATIONS_FILE = os.path.join(DATA_PATH, 'locations.json')
QUESTS_FILE = os.path.join(DATA_PATH, 'quests.json')
DIALOGUES_FILE = os.path.join(DATA_PATH, 'dialogues.json')
STORY_ARCS_FILE = os.path.join(DATA_PATH, 'story_arcs.json')

# Initialize data files if they don't exist
data_files = {
    CHARACTERS_FILE: [],
    LOCATIONS_FILE: [],
    QUESTS_FILE: [],
    DIALOGUES_FILE: [],
    STORY_ARCS_FILE: []
}

for file_path, default_data in data_files.items():
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump(default_data, f)

# Routes
@alice_bp.route('/')
def index():
    return render_template('alice_index.html')

# Character Routes
@alice_bp.route('/api/characters', methods=['GET', 'POST'])
def handle_characters():
    if request.method == 'GET':
        # Get all characters
        if os.path.exists(CHARACTERS_FILE):
            with open(CHARACTERS_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add or update a character
        character_data = request.json
        
        # Load existing characters
        characters = []
        if os.path.exists(CHARACTERS_FILE):
            with open(CHARACTERS_FILE, 'r') as f:
                characters = json.load(f)
        
        # Add or update character
        if 'id' in character_data:
            # Update existing character
            for i, character in enumerate(characters):
                if character['id'] == character_data['id']:
                    character_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    characters[i] = character_data
                    break
        else:
            # Create new character
            character_data['id'] = str(uuid.uuid4())
            character_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            character_data['modified'] = character_data['created']
            characters.append(character_data)
        
        # Save characters back to file
        with open(CHARACTERS_FILE, 'w') as f:
            json.dump(characters, f, indent=2)
        
        return jsonify({"success": True, "id": character_data['id']})

# Location Routes
@alice_bp.route('/api/locations', methods=['GET', 'POST'])
def handle_locations():
    if request.method == 'GET':
        # Get all locations
        if os.path.exists(LOCATIONS_FILE):
            with open(LOCATIONS_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add or update a location
        location_data = request.json
        
        # Load existing locations
        locations = []
        if os.path.exists(LOCATIONS_FILE):
            with open(LOCATIONS_FILE, 'r') as f:
                locations = json.load(f)
        
        # Add or update location
        if 'id' in location_data:
            # Update existing location
            for i, location in enumerate(locations):
                if location['id'] == location_data['id']:
                    location_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    locations[i] = location_data
                    break
        else:
            # Create new location
            location_data['id'] = str(uuid.uuid4())
            location_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            location_data['modified'] = location_data['created']
            locations.append(location_data)
        
        # Save locations back to file
        with open(LOCATIONS_FILE, 'w') as f:
            json.dump(locations, f, indent=2)
        
        return jsonify({"success": True, "id": location_data['id']})

# Quest Routes
@alice_bp.route('/api/quests', methods=['GET', 'POST'])
def handle_quests():
    if request.method == 'GET':
        # Get all quests
        if os.path.exists(QUESTS_FILE):
            with open(QUESTS_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add or update a quest
        quest_data = request.json
        
        # Load existing quests
        quests = []
        if os.path.exists(QUESTS_FILE):
            with open(QUESTS_FILE, 'r') as f:
                quests = json.load(f)
        
        # Add or update quest
        if 'id' in quest_data:
            # Update existing quest
            for i, quest in enumerate(quests):
                if quest['id'] == quest_data['id']:
                    quest_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    quests[i] = quest_data
                    break
        else:
            # Create new quest
            quest_data['id'] = str(uuid.uuid4())
            quest_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            quest_data['modified'] = quest_data['created']
            quests.append(quest_data)
        
        # Save quests back to file
        with open(QUESTS_FILE, 'w') as f:
            json.dump(quests, f, indent=2)
        
        return jsonify({"success": True, "id": quest_data['id']})

# Dialogue Routes
@alice_bp.route('/api/dialogues', methods=['GET', 'POST'])
def handle_dialogues():
    if request.method == 'GET':
        # Get all dialogues
        if os.path.exists(DIALOGUES_FILE):
            with open(DIALOGUES_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add or update a dialogue
        dialogue_data = request.json
        
        # Load existing dialogues
        dialogues = []
        if os.path.exists(DIALOGUES_FILE):
            with open(DIALOGUES_FILE, 'r') as f:
                dialogues = json.load(f)
        
        # Add or update dialogue
        if 'id' in dialogue_data:
            # Update existing dialogue
            for i, dialogue in enumerate(dialogues):
                if dialogue['id'] == dialogue_data['id']:
                    dialogue_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    dialogues[i] = dialogue_data
                    break
        else:
            # Create new dialogue
            dialogue_data['id'] = str(uuid.uuid4())
            dialogue_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            dialogue_data['modified'] = dialogue_data['created']
            dialogues.append(dialogue_data)
        
        # Save dialogues back to file
        with open(DIALOGUES_FILE, 'w') as f:
            json.dump(dialogues, f, indent=2)
        
        return jsonify({"success": True, "id": dialogue_data['id']})

# Story Arcs Routes
@alice_bp.route('/api/story-arcs', methods=['GET', 'POST'])
def handle_story_arcs():
    if request.method == 'GET':
        # Get all story arcs
        if os.path.exists(STORY_ARCS_FILE):
            with open(STORY_ARCS_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add or update a story arc
        story_arc_data = request.json
        
        # Load existing story arcs
        story_arcs = []
        if os.path.exists(STORY_ARCS_FILE):
            with open(STORY_ARCS_FILE, 'r') as f:
                story_arcs = json.load(f)
        
        # Add or update story arc
        if 'id' in story_arc_data:
            # Update existing story arc
            for i, story_arc in enumerate(story_arcs):
                if story_arc['id'] == story_arc_data['id']:
                    story_arc_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    story_arcs[i] = story_arc_data
                    break
        else:
            # Create new story arc
            story_arc_data['id'] = str(uuid.uuid4())
            story_arc_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            story_arc_data['modified'] = story_arc_data['created']
            story_arcs.append(story_arc_data)
        
        # Save story arcs back to file
        with open(STORY_ARCS_FILE, 'w') as f:
            json.dump(story_arcs, f, indent=2)
        
        return jsonify({"success": True, "id": story_arc_data['id']})

# Dialogue Tree Export
@alice_bp.route('/api/dialogues/<dialogue_id>/export', methods=['GET'])
def export_dialogue(dialogue_id):
    """
    Export a dialogue to a format suitable for the game engine
    """
    # Load dialogues
    if not os.path.exists(DIALOGUES_FILE):
        return jsonify({"success": False, "error": "Dialogues file not found"}), 404
    
    with open(DIALOGUES_FILE, 'r') as f:
        dialogues = json.load(f)
    
    # Find the requested dialogue
    dialogue = None
    for d in dialogues:
        if d['id'] == dialogue_id:
            dialogue = d
            break
    
    if not dialogue:
        return jsonify({"success": False, "error": "Dialogue not found"}), 404
    
    # Generate the exported format (for Godot or other engine)
    # This can be customized based on the game engine's requirements
    export_data = {
        "dialogueId": dialogue['id'],
        "title": dialogue.get('title', 'Untitled Dialogue'),
        "nodes": dialogue.get('nodes', []),
        "connections": dialogue.get('connections', []),
        "metadata": {
            "characters": dialogue.get('characters', []),
            "location": dialogue.get('location'),
            "conditions": dialogue.get('conditions', []),
            "variables": dialogue.get('variables', {})
        },
        "exportedAt": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    return jsonify({
        "success": True,
        "data": export_data
    })

# Generate Character Relationships Graph
@alice_bp.route('/api/characters/relationship-graph', methods=['GET'])
def generate_character_relationships():
    """
    Generate a visual graph representation of character relationships
    """
    if not os.path.exists(CHARACTERS_FILE):
        return jsonify({"success": False, "error": "Characters file not found"}), 404
    
    with open(CHARACTERS_FILE, 'r') as f:
        characters = json.load(f)
    
    # Generate nodes and edges for the relationship graph
    nodes = []
    edges = []
    
    # Create nodes for each character
    for character in characters:
        nodes.append({
            "id": character['id'],
            "name": character.get('name', 'Unnamed Character'),
            "group": character.get('faction', 'Unknown'),
            "importance": character.get('importance', 1)
        })
        
        # Create edges for relationships
        if 'relationships' in character and isinstance(character['relationships'], list):
            for relationship in character['relationships']:
                if 'targetId' in relationship and 'type' in relationship:
                    edges.append({
                        "source": character['id'],
                        "target": relationship['targetId'],
                        "type": relationship['type'],
                        "strength": relationship.get('strength', 1)
                    })
    
    return jsonify({
        "success": True,
        "graph": {
            "nodes": nodes,
            "edges": edges
        }
    })

# Search across all story elements
@alice_bp.route('/api/search', methods=['GET'])
def search_story_elements():
    """
    Search across all story elements (characters, locations, quests, dialogues, arcs)
    """
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify({"success": False, "error": "Search query not provided"}), 400
    
    results = {
        "characters": [],
        "locations": [],
        "quests": [],
        "dialogues": [],
        "storyArcs": []
    }
    
    # Search in characters
    if os.path.exists(CHARACTERS_FILE):
        with open(CHARACTERS_FILE, 'r') as f:
            characters = json.load(f)
            for character in characters:
                if (query in character.get('name', '').lower() or 
                    query in character.get('description', '').lower() or
                    query in character.get('background', '').lower()):
                    results["characters"].append(character)
    
    # Search in locations
    if os.path.exists(LOCATIONS_FILE):
        with open(LOCATIONS_FILE, 'r') as f:
            locations = json.load(f)
            for location in locations:
                if (query in location.get('name', '').lower() or 
                    query in location.get('description', '').lower()):
                    results["locations"].append(location)
    
    # Search in quests
    if os.path.exists(QUESTS_FILE):
        with open(QUESTS_FILE, 'r') as f:
            quests = json.load(f)
            for quest in quests:
                if (query in quest.get('title', '').lower() or 
                    query in quest.get('description', '').lower()):
                    results["quests"].append(quest)
    
    # Search in dialogues
    if os.path.exists(DIALOGUES_FILE):
        with open(DIALOGUES_FILE, 'r') as f:
            dialogues = json.load(f)
            for dialogue in dialogues:
                if (query in dialogue.get('title', '').lower()):
                    # Also search in dialogue nodes
                    if 'nodes' in dialogue:
                        for node in dialogue['nodes']:
                            if (query in node.get('text', '').lower()):
                                if dialogue not in results["dialogues"]:
                                    results["dialogues"].append(dialogue)
                                break
                    else:
                        results["dialogues"].append(dialogue)
    
    # Search in story arcs
    if os.path.exists(STORY_ARCS_FILE):
        with open(STORY_ARCS_FILE, 'r') as f:
            story_arcs = json.load(f)
            for arc in story_arcs:
                if (query in arc.get('title', '').lower() or 
                    query in arc.get('description', '').lower()):
                    results["storyArcs"].append(arc)
    
    return jsonify({
        "success": True,
        "query": query,
        "results": results
    }) 