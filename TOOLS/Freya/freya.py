#!/usr/bin/env python3
"""
Freya - Game Development Documentation and Planning Tool
A simple web-based tool for managing game development ideas, tasks, and documentation.
"""

import os
import json
import uuid
import time
import glob
import frontmatter
import markdown
import webbrowser
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

# Configuration
APP_NAME = "Freya"
APP_VERSION = "0.1.0"
DATA_DIR = os.path.abspath("../docs")
IDEAS_DIR = os.path.join(DATA_DIR, "Ideas")
TASKS_DIR = os.path.join(DATA_DIR, "Development/Tasks")
PRD_DIR = os.path.join(DATA_DIR, "PRD")

# Ensure directories exist
def ensure_dirs():
    for directory in [IDEAS_DIR] + [os.path.join(IDEAS_DIR, cat) for cat in 
                     ["Gameplay", "UI", "Graphics", "Sound", "Economy", "Story", "Technical", "Meta"]]:
        os.makedirs(directory, exist_ok=True)
    
    for directory in [TASKS_DIR] + [os.path.join(TASKS_DIR, status) for status in 
                     ["Backlog", "NextUp", "InProgress", "Review", "Done"]]:
        os.makedirs(directory, exist_ok=True)

# Initialize Flask
app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# File change handler for auto-reload
class FileChangeHandler(FileSystemEventHandler):
    def on_any_event(self, event):
        if event.is_directory or event.event_type == 'closed':
            return
        print(f"Detected change in {event.src_path}, reloading data...")

# -------------------- Idea Management --------------------

def get_ideas():
    """Get all ideas from the Ideas directory"""
    ideas = []
    for category in ["Gameplay", "UI", "Graphics", "Sound", "Economy", "Story", "Technical", "Meta"]:
        category_dir = os.path.join(IDEAS_DIR, category)
        if not os.path.exists(category_dir):
            continue
            
        for idea_file in glob.glob(os.path.join(category_dir, "*.md")):
            try:
                with open(idea_file, 'r', encoding='utf-8') as f:
                    post = frontmatter.load(f)
                    
                    # Extract metadata
                    title = os.path.basename(idea_file).replace(".md", "").replace("-", " ").title()
                    if 'title' in post.metadata:
                        title = post.metadata['title']
                    
                    # Parse content to find sections and tags
                    content = post.content
                    sections = {}
                    current_section = "content"
                    sections[current_section] = []
                    
                    status = "Brainstorming"
                    score = {"impact": 0, "feasibility": 0, "originality": 0, "player_value": 0, "alignment": 0, "total": 0}
                    tags = []
                    summary = ""
                    
                    for line in content.split('\n'):
                        if line.startswith('# '):
                            title = line[2:].strip()
                        elif line.startswith('## '):
                            current_section = line[3:].strip().lower()
                            sections[current_section] = []
                        elif line.startswith('- **Total Score**:'):
                            try:
                                score["total"] = int(line.split(':')[1].strip())
                            except:
                                pass
                        elif line.startswith('- Impact:'):
                            try:
                                score["impact"] = int(line.split(':')[1].strip())
                            except:
                                pass
                        elif line.startswith('- Feasibility:'):
                            try:
                                score["feasibility"] = int(line.split(':')[1].strip())
                            except:
                                pass
                        elif line.startswith('- Originality:'):
                            try:
                                score["originality"] = int(line.split(':')[1].strip())
                            except:
                                pass
                        elif line.startswith('- Player Value:'):
                            try:
                                score["player_value"] = int(line.split(':')[1].strip())
                            except:
                                pass
                        elif line.startswith('- Alignment with Game Vision:'):
                            try:
                                score["alignment"] = int(line.split(':')[1].strip())
                            except:
                                pass
                        elif current_section == "status":
                            status = line.strip()
                        elif current_section == "summary":
                            summary += line.strip() + " "
                        elif current_section == "tags":
                            tags = [tag.strip() for tag in line.split('#') if tag.strip()]
                        else:
                            sections[current_section].append(line)
                    
                    # Build idea object
                    idea = {
                        "id": str(uuid.uuid4()),
                        "title": title,
                        "category": category,
                        "status": status,
                        "summary": summary.strip(),
                        "score": score,
                        "tags": tags,
                        "file_path": idea_file,
                        "created": datetime.fromtimestamp(os.path.getctime(idea_file)).strftime("%Y-%m-%d"),
                        "modified": datetime.fromtimestamp(os.path.getmtime(idea_file)).strftime("%Y-%m-%d")
                    }
                    
                    ideas.append(idea)
            except Exception as e:
                print(f"Error processing idea file {idea_file}: {e}")
    
    return sorted(ideas, key=lambda i: i.get('score', {}).get('total', 0), reverse=True)

def save_idea(idea_data):
    """Save an idea to a markdown file"""
    category = idea_data.get('category', 'Gameplay')
    title = idea_data.get('title', 'New Idea')
    
    # Create filename from title
    filename = title.lower().replace(' ', '-') + '.md'
    category_dir = os.path.join(IDEAS_DIR, category)
    os.makedirs(category_dir, exist_ok=True)
    file_path = os.path.join(category_dir, filename)
    
    # Format tags
    tags = idea_data.get('tags', [])
    if isinstance(tags, str):
        tags = [tag.strip() for tag in tags.split(',') if tag.strip()]
    
    tag_line = ' '.join([f"#{tag}" for tag in tags]) if tags else "#core"
    
    # Calculate score
    score = idea_data.get('score', {})
    impact = int(score.get('impact', 3))
    feasibility = int(score.get('feasibility', 3))
    originality = int(score.get('originality', 3))
    player_value = int(score.get('player_value', 3))
    alignment = int(score.get('alignment', 3))
    total = impact + feasibility + originality + player_value + alignment
    
    # Format content
    today = datetime.now().strftime("%Y-%m-%d")
    
    content = f"""# {title}

## Summary
{idea_data.get('summary', 'Brief one-sentence description of the idea.')}

## Description
{idea_data.get('description', 'Detailed description of the idea, including how it would work in the game.')}

## Category
{category}

## Tags
{tag_line}

## Status
{idea_data.get('status', 'Brainstorming')}

## Score
- Impact: {impact}
- Feasibility: {feasibility}
- Originality: {originality}
- Player Value: {player_value}
- Alignment with Game Vision: {alignment}
- **Total Score**: {total}

## Notes
{idea_data.get('notes', '- Add any additional notes or considerations here\n- Links to related ideas or research')}

## Created: {today}
## Last Updated: {today}
"""
    
    # Write to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return {"success": True, "file_path": file_path}

# -------------------- Task Management --------------------

def get_tasks():
    """Get all tasks from the Tasks directory"""
    tasks = []
    for status in ["Backlog", "NextUp", "InProgress", "Review", "Done"]:
        status_dir = os.path.join(TASKS_DIR, status)
        if not os.path.exists(status_dir):
            continue
            
        for task_file in glob.glob(os.path.join(status_dir, "*.md")):
            try:
                with open(task_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Extract task information
                    task_id = ""
                    task_type = ""
                    estimated_time = ""
                    milestone = ""
                    priority = "Medium"
                    description = ""
                    title = os.path.basename(task_file).split('-', 3)[-1].replace(".md", "").replace("-", " ").title()
                    
                    # Parse basic info section
                    if "## Basic Information" in content:
                        info_section = content.split("## Basic Information")[1].split("##")[0]
                        for line in info_section.split("\n"):
                            if "**ID**:" in line:
                                task_id = line.split("**ID**:")[1].strip()
                            elif "**Type**:" in line:
                                task_type = line.split("**Type**:")[1].strip()
                            elif "**Estimated Time**:" in line:
                                estimated_time = line.split("**Estimated Time**:")[1].strip()
                            elif "**Milestone**:" in line:
                                milestone = line.split("**Milestone**:")[1].strip()
                            elif "**Priority**:" in line:
                                priority = line.split("**Priority**:")[1].strip()
                    
                    # Get description
                    if "## Description" in content:
                        description = content.split("## Description")[1].split("##")[0].strip()
                    
                    # Build task object
                    task = {
                        "id": task_id,
                        "title": title,
                        "type": task_type,
                        "status": status,
                        "estimated_time": estimated_time,
                        "milestone": milestone,
                        "priority": priority,
                        "description": description,
                        "file_path": task_file,
                        "created": datetime.fromtimestamp(os.path.getctime(task_file)).strftime("%Y-%m-%d"),
                        "modified": datetime.fromtimestamp(os.path.getmtime(task_file)).strftime("%Y-%m-%d")
                    }
                    
                    tasks.append(task)
            except Exception as e:
                print(f"Error processing task file {task_file}: {e}")
    
    return sorted(tasks, key=lambda t: t.get('modified', ''), reverse=True)

def save_task(task_data):
    """Save a task to a markdown file"""
    status = task_data.get('status', 'Backlog')
    title = task_data.get('title', 'New Task')
    task_type = task_data.get('type', 'Feature')
    estimated_time = task_data.get('estimated_time', '30 minutes')
    milestone = task_data.get('milestone', 'Phase 1')
    priority = task_data.get('priority', 'Medium')
    description = task_data.get('description', '')
    objective = task_data.get('objective', '')
    
    # Create task ID and filename
    today = datetime.now().strftime("%Y-%m-%d")
    # Get the number of tasks created today to create a sequence number
    status_dir = os.path.join(TASKS_DIR, status)
    existing_tasks = glob.glob(os.path.join(status_dir, f"{today}-*.md"))
    sequence = len(existing_tasks) + 1
    
    task_id = f"{today}-{sequence:02d}"
    filename = f"{task_id}-{title.lower().replace(' ', '-')}.md"
    
    os.makedirs(status_dir, exist_ok=True)
    file_path = os.path.join(status_dir, filename)
    
    # Format acceptance criteria
    acceptance_criteria = task_data.get('acceptance_criteria', '')
    if isinstance(acceptance_criteria, list):
        acceptance_criteria = "\n".join([f"- {criterion}" for criterion in acceptance_criteria])
    
    # Format implementation notes
    implementation_notes = task_data.get('implementation_notes', '')
    if isinstance(implementation_notes, list):
        implementation_notes = "\n".join([f"- {note}" for note in implementation_notes])
    
    # Format dependencies
    dependencies = task_data.get('dependencies', '')
    if isinstance(dependencies, list):
        dependencies = "\n".join([f"- {dep}" for dep in dependencies])
    
    # Format testing plan
    testing_plan = task_data.get('testing_plan', '')
    if isinstance(testing_plan, list):
        testing_plan = "\n".join([f"- {test}" for test in testing_plan])
    
    # Format next steps
    next_steps = task_data.get('next_steps', '')
    if isinstance(next_steps, list):
        next_steps = "\n".join([f"- {step}" for step in next_steps])
    
    content = f"""# Task: {title}

## Basic Information
- **ID**: {task_id}
- **Type**: {task_type}
- **Estimated Time**: {estimated_time}
- **Milestone**: {milestone}
- **Priority**: {priority}

## Description
{description}

## Objective
{objective}

## Acceptance Criteria
{acceptance_criteria}

## Implementation Notes
{implementation_notes}

## Dependencies
{dependencies}

## Testing Plan
{testing_plan}

## Next Steps
{next_steps}
"""
    
    # Write to file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return {"success": True, "file_path": file_path, "task_id": task_id}

def update_task_status(task_id, new_status):
    """Move a task file to a new status directory"""
    task_files = []
    for status in ["Backlog", "NextUp", "InProgress", "Review", "Done"]:
        status_dir = os.path.join(TASKS_DIR, status)
        if os.path.exists(status_dir):
            for task_file in glob.glob(os.path.join(status_dir, f"*{task_id}*.md")):
                task_files.append((task_file, status))
    
    if not task_files:
        return {"success": False, "error": f"Task with ID {task_id} not found"}
    
    task_file, current_status = task_files[0]
    if current_status == new_status:
        return {"success": True, "message": "Task already in this status"}
    
    new_status_dir = os.path.join(TASKS_DIR, new_status)
    os.makedirs(new_status_dir, exist_ok=True)
    
    filename = os.path.basename(task_file)
    new_file_path = os.path.join(new_status_dir, filename)
    
    # Move the file
    os.rename(task_file, new_file_path)
    
    return {"success": True, "file_path": new_file_path}

# -------------------- PRD Management --------------------

def get_prd_docs():
    """Get all PRD documents"""
    prd_docs = []
    
    if os.path.exists(PRD_DIR):
        for doc_file in glob.glob(os.path.join(PRD_DIR, "*.md")):
            try:
                with open(doc_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Extract title (first h1)
                    title = os.path.basename(doc_file).replace(".md", "").replace("-", " ").title()
                    if content.startswith('# '):
                        title = content.split('\n')[0][2:].strip()
                    
                    # Get a summary (first paragraph after title)
                    summary = ""
                    in_summary = False
                    for line in content.split('\n')[1:]:
                        if line.strip() and not line.startswith('#') and not in_summary:
                            in_summary = True
                            summary += line.strip() + " "
                        elif in_summary and (not line.strip() or line.startswith('#')):
                            break
                        elif in_summary:
                            summary += line.strip() + " "
                    
                    # Build PRD doc object
                    prd_doc = {
                        "id": str(uuid.uuid4()),
                        "title": title,
                        "summary": summary.strip(),
                        "file_path": doc_file,
                        "created": datetime.fromtimestamp(os.path.getctime(doc_file)).strftime("%Y-%m-%d"),
                        "modified": datetime.fromtimestamp(os.path.getmtime(doc_file)).strftime("%Y-%m-%d")
                    }
                    
                    prd_docs.append(prd_doc)
            except Exception as e:
                print(f"Error processing PRD file {doc_file}: {e}")
    
    return sorted(prd_docs, key=lambda d: d.get('modified', ''), reverse=True)

# -------------------- Flask Routes --------------------

# Index route
@app.route('/')
def index():
    return render_template('index.html')

# Static files
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

# API Routes
@app.route('/api/ideas', methods=['GET'])
def api_get_ideas():
    return jsonify(get_ideas())

@app.route('/api/ideas', methods=['POST'])
def api_save_idea():
    idea_data = request.json
    result = save_idea(idea_data)
    return jsonify(result)

@app.route('/api/tasks', methods=['GET'])
def api_get_tasks():
    return jsonify(get_tasks())

@app.route('/api/tasks', methods=['POST'])
def api_save_task():
    task_data = request.json
    result = save_task(task_data)
    return jsonify(result)

@app.route('/api/tasks/<task_id>/status', methods=['PUT'])
def api_update_task_status(task_id):
    new_status = request.json.get('status')
    result = update_task_status(task_id, new_status)
    return jsonify(result)

@app.route('/api/prd', methods=['GET'])
def api_get_prd():
    return jsonify(get_prd_docs())

@app.route('/api/file/<path:filepath>', methods=['GET'])
def api_get_file_content(filepath):
    try:
        full_path = os.path.join(DATA_DIR, filepath)
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # For Markdown files, convert to HTML for preview
            if filepath.endswith('.md'):
                html_content = markdown.markdown(content)
                return jsonify({
                    "content": content,
                    "html": html_content,
                    "success": True
                })
            
            return jsonify({
                "content": content,
                "success": True
            })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })

if __name__ == '__main__':
    ensure_dirs()
    print(f"Starting {APP_NAME} v{APP_VERSION}...")
    print(f"Data directory: {DATA_DIR}")
    
    # Watch for file changes
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, DATA_DIR, recursive=True)
    observer.start()
    
    # Open browser
    port = 5000
    url = f"http://localhost:{port}"
    webbrowser.open(url)
    
    try:
        app.run(port=port, debug=True, use_reloader=False)
    except KeyboardInterrupt:
        observer.stop()
    observer.join() 