"""
Freya - Game Development Documentation Tool
Main application file
"""

import os
import json
import markdown
import re
import uuid
import shutil
from datetime import datetime
import pandas as pd
import plotly
from flask import Flask, render_template, jsonify, request, send_from_directory, url_for, redirect, flash, session
from werkzeug.utils import secure_filename
from pymdownx.superfences import SuperFencesExtension
from pymdownx.emoji import EmojiExtension
import subprocess
import logging
from dotenv import load_dotenv
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from flask_wtf.csrf import CSRFProtect

# Import Alice blueprint
from Alice.routes import alice_bp

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the main app
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'freya-alice-development-key')
csrf = CSRFProtect(app)

# Register Alice blueprint
app.register_blueprint(alice_bp, url_prefix='/alice')

# Define the base path for documentation
BASE_DOCS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'docs')

# Path for uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
IMAGE_FOLDER = os.path.join(UPLOAD_FOLDER, 'images')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'svg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Create necessary directories if they don't exist
for path in [BASE_DOCS_PATH, UPLOAD_FOLDER, IMAGE_FOLDER]:
    if not os.path.exists(path):
        os.makedirs(path)
    
# Create docs subdirectories if they don't exist
for subdir in ['PRD', 'Development', 'Ideas', 'Player', 'Story']:
    dir_path = os.path.join(BASE_DOCS_PATH, subdir)
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

# Data paths
DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
if not os.path.exists(DATA_PATH):
    os.makedirs(DATA_PATH)

IDEAS_FILE = os.path.join(DATA_PATH, 'ideas.json')
TASKS_FILE = os.path.join(DATA_PATH, 'tasks.json')
IMAGES_FILE = os.path.join(DATA_PATH, 'images.json')
DIAGRAMS_FILE = os.path.join(DATA_PATH, 'diagrams.json')

# Initialize data files if they don't exist
data_files = {
    IDEAS_FILE: [],
    TASKS_FILE: [],
    IMAGES_FILE: [],
    DIAGRAMS_FILE: []
}

for file_path, default_data in data_files.items():
    if not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump(default_data, f)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper function to render markdown with extended features
def render_markdown(content):
    extensions = [
        'tables', 
        'fenced_code', 
        'nl2br',
        'pymdownx.superfences',
        'pymdownx.emoji',
        'pymdownx.tasklist',
        'pymdownx.highlight'
    ]
    return markdown.markdown(content, extensions=extensions)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/uploads/<path:path>')
def send_upload(path):
    return send_from_directory('uploads', path)

# Image Upload Route
@app.route('/api/upload/image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"success": False, "error": "No file part"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"success": False, "error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add unique identifier to avoid name collisions
        base, ext = os.path.splitext(filename)
        unique_filename = f"{base}_{uuid.uuid4().hex[:8]}{ext}"
        
        file_path = os.path.join(IMAGE_FOLDER, unique_filename)
        file.save(file_path)
        
        # Record the image metadata
        image_data = {
            'id': str(uuid.uuid4()),
            'filename': unique_filename,
            'original_name': filename,
            'path': f"uploads/images/{unique_filename}",
            'url': f"/uploads/images/{unique_filename}",
            'created': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'description': request.form.get('description', ''),
            'tags': request.form.get('tags', '').split(',') if request.form.get('tags') else []
        }
        
        # Save to images registry
        images = []
        if os.path.exists(IMAGES_FILE):
            with open(IMAGES_FILE, 'r') as f:
                images = json.load(f)
        
        images.append(image_data)
        
        with open(IMAGES_FILE, 'w') as f:
            json.dump(images, f, indent=2)
        
        return jsonify({
            "success": True, 
            "image": image_data
        })
    
    return jsonify({"success": False, "error": "File type not allowed"}), 400

# Get all images
@app.route('/api/images', methods=['GET'])
def get_images():
    if os.path.exists(IMAGES_FILE):
        with open(IMAGES_FILE, 'r') as f:
            return jsonify(json.load(f))
    return jsonify([])

# Create diagram from Mermaid syntax
@app.route('/api/diagram/create', methods=['POST'])
def create_diagram():
    data = request.json
    diagram_code = data.get('code')
    name = data.get('name', f"diagram_{uuid.uuid4().hex[:8]}")
    
    if not diagram_code:
        return jsonify({"success": False, "error": "No diagram code provided"}), 400
    
    # Create a temporary mermaid file
    diagram_id = str(uuid.uuid4())
    temp_file = os.path.join(DATA_PATH, f"temp_diagram_{diagram_id}.mmd")
    
    try:
        with open(temp_file, 'w') as f:
            f.write(diagram_code)
        
        # Generate SVG output path
        output_filename = f"{secure_filename(name)}_{diagram_id[:8]}.svg"
        output_path = os.path.join(IMAGE_FOLDER, output_filename)
        
        # Call mmdc CLI to render the diagram
        # Note: This requires mermaid-cli to be installed
        result = subprocess.run(
            ['mmdc', '-i', temp_file, '-o', output_path, '-b', 'transparent'],
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            logger.error(f"Mermaid CLI error: {result.stderr}")
            return jsonify({"success": False, "error": "Failed to render diagram"}), 500
        
        # Record the diagram metadata
        diagram_data = {
            'id': diagram_id,
            'name': name,
            'filename': output_filename,
            'path': f"uploads/images/{output_filename}",
            'url': f"/uploads/images/{output_filename}",
            'code': diagram_code,
            'created': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'modified': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'type': data.get('type', 'flowchart'),
            'tags': data.get('tags', [])
        }
        
        # Save to diagrams registry
        diagrams = []
        if os.path.exists(DIAGRAMS_FILE):
            with open(DIAGRAMS_FILE, 'r') as f:
                diagrams = json.load(f)
        
        diagrams.append(diagram_data)
        
        with open(DIAGRAMS_FILE, 'w') as f:
            json.dump(diagrams, f, indent=2)
        
        # Clean up temp file
        if os.path.exists(temp_file):
            os.remove(temp_file)
        
        return jsonify({
            "success": True, 
            "diagram": diagram_data
        })
    
    except Exception as e:
        logger.error(f"Error creating diagram: {str(e)}")
        # Clean up
        if os.path.exists(temp_file):
            os.remove(temp_file)
        return jsonify({"success": False, "error": str(e)}), 500

# Get all diagrams
@app.route('/api/diagrams', methods=['GET'])
def get_diagrams():
    if os.path.exists(DIAGRAMS_FILE):
        with open(DIAGRAMS_FILE, 'r') as f:
            return jsonify(json.load(f))
    return jsonify([])

# API Routes for Ideas
@app.route('/api/ideas', methods=['GET', 'POST'])
def handle_ideas():
    if request.method == 'GET':
        # Get all ideas
        if os.path.exists(IDEAS_FILE):
            with open(IDEAS_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add a new idea
        idea_data = request.json
        
        # Load existing ideas
        ideas = []
        if os.path.exists(IDEAS_FILE):
            with open(IDEAS_FILE, 'r') as f:
                ideas = json.load(f)
        
        # Add new idea with ID and timestamp
        if 'id' in idea_data:
            # Update existing idea
            for i, idea in enumerate(ideas):
                if idea['id'] == idea_data['id']:
                    idea_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    ideas[i] = idea_data
                    break
        else:
            # Create new idea
            idea_data['id'] = str(uuid.uuid4())
            idea_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            idea_data['modified'] = idea_data['created']
            ideas.append(idea_data)
        
        # Save ideas back to file
        with open(IDEAS_FILE, 'w') as f:
            json.dump(ideas, f, indent=2)
        
        return jsonify({"success": True, "id": idea_data['id']})

# API Routes for Tasks
@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    if request.method == 'GET':
        # Get all tasks
        if os.path.exists(TASKS_FILE):
            with open(TASKS_FILE, 'r') as f:
                return jsonify(json.load(f))
        return jsonify([])
    
    elif request.method == 'POST':
        # Add a new task
        task_data = request.json
        
        # Load existing tasks
        tasks = []
        if os.path.exists(TASKS_FILE):
            with open(TASKS_FILE, 'r') as f:
                tasks = json.load(f)
        
        # Add new task with ID and timestamp
        if 'id' in task_data:
            # Update existing task
            for i, task in enumerate(tasks):
                if task['id'] == task_data['id']:
                    task_data['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                    tasks[i] = task_data
                    break
        else:
            # Create new task
            task_data['id'] = str(uuid.uuid4())
            task_data['created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            task_data['modified'] = task_data['created']
            task_data['status'] = task_data.get('status', 'todo')
            tasks.append(task_data)
        
        # Save tasks back to file
        with open(TASKS_FILE, 'w') as f:
            json.dump(tasks, f, indent=2)
        
        return jsonify({"success": True, "id": task_data['id']})

# Update task status
@app.route('/api/tasks/<task_id>/status', methods=['PUT'])
def update_task_status(task_id):
    data = request.json
    new_status = data.get('status')
    
    if not new_status:
        return jsonify({"success": False, "error": "No status provided"}), 400
    
    # Load tasks
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'r') as f:
            tasks = json.load(f)
        
        # Find and update the task
        for i, task in enumerate(tasks):
            if task['id'] == task_id:
                tasks[i]['status'] = new_status
                tasks[i]['modified'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                # Save tasks back to file
                with open(TASKS_FILE, 'w') as f:
                    json.dump(tasks, f, indent=2)
                
                return jsonify({"success": True})
        
        # Task not found
        return jsonify({"success": False, "error": "Task not found"}), 404
    
    return jsonify({"success": False, "error": "Tasks file not found"}), 404

# Get task metrics for charts and plots
@app.route('/api/metrics/tasks', methods=['GET'])
def get_task_metrics():
    try:
        if os.path.exists(TASKS_FILE):
            with open(TASKS_FILE, 'r') as f:
                tasks = json.load(f)
            
            # Create dataframe
            df = pd.DataFrame(tasks)
            if len(df) == 0:
                return jsonify({"success": True, "data": {
                    "status_counts": {"todo": 0, "in_progress": 0, "completed": 0},
                    "priority_counts": {"low": 0, "medium": 0, "high": 0},
                    "timeline_data": []
                }})
            
            # Status counts
            status_counts = df['status'].value_counts().to_dict()
            for status in ['todo', 'in_progress', 'completed']:
                if status not in status_counts:
                    status_counts[status] = 0
            
            # Priority counts if priority exists
            priority_counts = {}
            if 'priority' in df.columns:
                priority_counts = df['priority'].value_counts().to_dict()
                for priority in ['low', 'medium', 'high']:
                    if priority not in priority_counts:
                        priority_counts[priority] = 0
            
            # Timeline data - tasks created per day
            if 'created' in df.columns:
                df['created_date'] = pd.to_datetime(df['created']).dt.date
                timeline_data = df.groupby('created_date').size().reset_index()
                timeline_data.columns = ['date', 'count']
                timeline_data['date'] = timeline_data['date'].astype(str)
                timeline_data = timeline_data.to_dict(orient='records')
            else:
                timeline_data = []
            
            return jsonify({
                "success": True,
                "data": {
                    "status_counts": status_counts,
                    "priority_counts": priority_counts,
                    "timeline_data": timeline_data
                }
            })
                
        return jsonify({"success": False, "error": "Tasks file not found"}), 404
    except Exception as e:
        logger.error(f"Error generating task metrics: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

# Get PRD documents
@app.route('/api/prd', methods=['GET'])
def get_prd_documents():
    prd_path = os.path.join(BASE_DOCS_PATH, 'PRD')
    
    if not os.path.exists(prd_path):
        return jsonify({"success": False, "error": "PRD directory not found"}), 404
    
    documents = []
    
    for root, dirs, files in os.walk(prd_path):
        # Sort directories and files alphabetically
        dirs.sort()
        files.sort()
        
        # Get the relative path from the PRD directory
        rel_path = os.path.relpath(root, prd_path) if root != prd_path else ""
        
        # Skip hidden directories
        if rel_path.startswith('.'):
            continue
        
        # Process markdown files
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                rel_file_path = os.path.join(rel_path, file)
                
                # Read file and extract metadata
                with open(file_path, 'r') as f:
                    content = f.read()
                
                # Extract title from the first line if it's a markdown heading
                lines = content.split('\n')
                title = file[:-3]  # Default title: filename without .md
                if lines and lines[0].startswith('# '):
                    title = lines[0][2:].strip()
                
                # Extract description (use the first paragraph after the title)
                description = ""
                for line in lines[1:]:
                    if line.strip() and not line.startswith('#'):
                        description = line.strip()
                        break
                
                documents.append({
                    "title": title,
                    "description": description[:100] + "..." if len(description) > 100 else description,
                    "path": rel_file_path,
                    "modified": datetime.fromtimestamp(os.path.getmtime(file_path)).strftime('%Y-%m-%d %H:%M:%S')
                })
    
    return jsonify({"success": True, "documents": documents})

# Get file content
@app.route('/api/file/<path:file_path>', methods=['GET'])
def get_file_content(file_path):
    # Prevent directory traversal
    file_path = os.path.normpath(file_path)
    if file_path.startswith('..'):
        return jsonify({"success": False, "error": "Invalid file path"}), 400
    
    # Construct the absolute path
    abs_path = os.path.join(BASE_DOCS_PATH, file_path)
    
    if not os.path.exists(abs_path) or not os.path.isfile(abs_path):
        return jsonify({"success": False, "error": "File not found"}), 404
    
    with open(abs_path, 'r') as f:
        content = f.read()
    
    return jsonify({
        "success": True,
        "content": content,
        "html_content": render_markdown(content) if file_path.endswith('.md') else None
    })

# Save file content
@app.route('/api/file/<path:file_path>', methods=['POST'])
def save_file_content(file_path):
    # Prevent directory traversal
    file_path = os.path.normpath(file_path)
    if file_path.startswith('..'):
        return jsonify({"success": False, "error": "Invalid file path"}), 400
    
    data = request.json
    content = data.get('content', '')
    
    # Construct the absolute path
    abs_path = os.path.join(BASE_DOCS_PATH, file_path)
    
    # Make sure the directory exists
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    
    with open(abs_path, 'w') as f:
        f.write(content)
    
    return jsonify({"success": True})

# API endpoint for plotly data
@app.route('/api/plotly/generate', methods=['POST'])
def generate_plotly():
    data = request.json
    plot_type = data.get('type', 'line')
    
    try:
        # Generate plot based on type
        if plot_type == 'line':
            fig = plot_line_chart(data)
        elif plot_type == 'bar':
            fig = plot_bar_chart(data)
        elif plot_type == 'pie':
            fig = plot_pie_chart(data)
        else:
            return jsonify({"success": False, "error": "Invalid plot type"}), 400
        
        # Convert to JSON
        plot_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        return jsonify({"success": True, "plot": plot_json})
    
    except Exception as e:
        logger.error(f"Error generating plot: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

# Helper functions for generating plots
def plot_line_chart(data):
    x = data.get('x', [])
    y = data.get('y', [])
    title = data.get('title', 'Line Chart')
    
    fig = {
        'data': [{'x': x, 'y': y, 'type': 'scatter', 'mode': 'lines+markers'}],
        'layout': {'title': title}
    }
    return fig

def plot_bar_chart(data):
    x = data.get('x', [])
    y = data.get('y', [])
    title = data.get('title', 'Bar Chart')
    
    fig = {
        'data': [{'x': x, 'y': y, 'type': 'bar'}],
        'layout': {'title': title}
    }
    return fig

def plot_pie_chart(data):
    labels = data.get('labels', [])
    values = data.get('values', [])
    title = data.get('title', 'Pie Chart')
    
    fig = {
        'data': [{'labels': labels, 'values': values, 'type': 'pie'}],
        'layout': {'title': title}
    }
    return fig

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 