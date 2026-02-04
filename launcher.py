#!/usr/bin/env python3
"""
HulamKo - Production Launcher
Serves the frontend and backend together as a standalone application
"""

import os
import sys
import time
import webbrowser
import threading
from pathlib import Path

# Try to import Flask
try:
    from flask import Flask, send_from_directory, render_template, request, jsonify
    from flask_cors import CORS
except ImportError:
    print("Error: Flask is not installed. Please install it:")
    print("  pip install flask flask-cors")
    sys.exit(1)

# Setup Flask app
app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

# Get the base directory
BASE_DIR = Path(__file__).parent.absolute() if hasattr(sys, 'frozen') else Path(__file__).parent.absolute()
FRONTEND_DIR = BASE_DIR / 'frontend'

# In-memory data storage (same as app-simple.py)
tools_db = [
    {'id': 1, 'name': 'Hammer', 'brand': 'Stanley', 'quantity': 5, 'category': 'Hand Tools', 'description': 'Claw hammer'},
    {'id': 2, 'name': 'Screwdriver Set', 'brand': 'DeWalt', 'quantity': 8, 'category': 'Hand Tools', 'description': 'Multi-bit screwdriver'},
    {'id': 3, 'name': 'Wrench Set', 'brand': 'Craftsman', 'quantity': 3, 'category': 'Hand Tools', 'description': 'Socket wrench set'}
]

borrowers_db = []
users_db = [
    {'id': 1, 'name': 'Admin', 'email': 'admin@hulamko.com', 'username': 'admin', 'role': 'Admin'},
    {'id': 2, 'name': 'Teacher One', 'email': 'teacher1@hulamko.com', 'username': 'teacher1', 'role': 'Teacher'}
]
activity_log = []

next_tool_id = 4
next_borrower_id = 1
next_user_id = 3

# ==================== FRONTEND ROUTES ====================

@app.route('/')
@app.route('/index.html')
def index():
    """Serve the main HTML file"""
    try:
        return send_from_directory(str(FRONTEND_DIR), 'index.html')
    except Exception as e:
        return f"Error loading index.html: {str(e)}", 500

@app.route('/css/<path:filename>')
def serve_css(filename):
    """Serve CSS files"""
    try:
        return send_from_directory(str(FRONTEND_DIR / 'css'), filename)
    except Exception as e:
        return f"CSS file not found: {filename}", 404

@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files"""
    try:
        return send_from_directory(str(FRONTEND_DIR / 'js'), filename)
    except Exception as e:
        return f"JS file not found: {filename}", 404

@app.route('/images/<path:filename>')
def serve_images(filename):
    """Serve image files"""
    try:
        return send_from_directory(str(FRONTEND_DIR / 'images'), filename)
    except Exception as e:
        return f"Image not found: {filename}", 404

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve other static files"""
    try:
        return send_from_directory(str(FRONTEND_DIR), filename)
    except Exception as e:
        return f"File not found: {filename}", 404

# ==================== TOOLS API ====================

@app.route('/api/tools', methods=['GET'])
def get_tools():
    """Get all tools"""
    return jsonify(tools_db), 200

@app.route('/api/tools/<int:tool_id>', methods=['GET'])
def get_tool(tool_id):
    """Get a specific tool"""
    tool = next((t for t in tools_db if t['id'] == tool_id), None)
    if not tool:
        return jsonify({'message': 'Tool not found'}), 404
    return jsonify(tool), 200

@app.route('/api/tools', methods=['POST'])
def create_tool():
    """Create a new tool"""
    global next_tool_id
    
    data = request.get_json()
    new_tool = {
        'id': next_tool_id,
        'name': data.get('name'),
        'brand': data.get('brand'),
        'quantity': data.get('quantity', 0),
        'category': data.get('category'),
        'description': data.get('description'),
        'image': data.get('image')
    }
    tools_db.append(new_tool)
    next_tool_id += 1
    return jsonify(new_tool), 201

@app.route('/api/tools/<int:tool_id>', methods=['PUT'])
def update_tool(tool_id):
    """Update a tool"""
    tool = next((t for t in tools_db if t['id'] == tool_id), None)
    if not tool:
        return jsonify({'message': 'Tool not found'}), 404
    
    data = request.get_json()
    tool.update(data)
    return jsonify(tool), 200

@app.route('/api/tools/<int:tool_id>', methods=['DELETE'])
def delete_tool(tool_id):
    """Delete a tool"""
    global tools_db
    tools_db = [t for t in tools_db if t['id'] != tool_id]
    return jsonify({'message': 'Tool deleted'}), 200

# ==================== BORROWERS API ====================

@app.route('/api/borrowers', methods=['GET'])
def get_borrowers():
    """Get all borrowers"""
    return jsonify(borrowers_db), 200

@app.route('/api/borrowers', methods=['POST'])
def create_borrower():
    """Create a new borrower record"""
    global next_borrower_id
    
    data = request.get_json()
    new_borrower = {
        'id': next_borrower_id,
        'toolId': data.get('toolId'),
        'borrowerName': data.get('borrowerName'),
        'course': data.get('course'),
        'year': data.get('year'),
        'borrowDate': data.get('borrowDate'),
        'returnDate': data.get('returnDate'),
        'borrowReason': data.get('borrowReason'),
        'status': 'active',
        'dateRecorded': data.get('dateRecorded')
    }
    borrowers_db.append(new_borrower)
    next_borrower_id += 1
    return jsonify(new_borrower), 201

# ==================== USERS API ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    return jsonify(users_db), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    global next_user_id
    
    data = request.get_json()
    new_user = {
        'id': next_user_id,
        'name': data.get('name'),
        'email': data.get('email'),
        'username': data.get('username'),
        'role': data.get('role', 'User')
    }
    users_db.append(new_user)
    next_user_id += 1
    return jsonify(new_user), 201

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    # Try to serve index.html for SPA routing
    return send_from_directory(str(FRONTEND_DIR), 'index.html')

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500

# ==================== LAUNCHER ====================

def start_server(port=5000):
    """Start the Flask development server"""
    print(f"\n{'='*60}")
    print("  HulamKo - Starting Application Server")
    print(f"{'='*60}\n")
    
    print(f"  ✓ Frontend: {FRONTEND_DIR}")
    print(f"  ✓ Backend: Running on port {port}")
    print(f"\n  Opening application in browser...\n")
    
    # Start server in a background thread
    def run_server():
        app.run(host='localhost', port=port, debug=False, use_reloader=False)
    
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    
    # Wait a moment for server to start
    time.sleep(2)
    
    # Open browser
    try:
        webbrowser.open(f'http://localhost:{port}')
    except Exception as e:
        print(f"  Could not auto-open browser. Manually visit: http://localhost:{port}")
    
    # Keep the app running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n  Application stopped.")
        sys.exit(0)

if __name__ == '__main__':
    # Check if running as frozen executable (built with PyInstaller)
    if getattr(sys, 'frozen', False):
        BASE_DIR = Path(sys.executable).parent.absolute()
        FRONTEND_DIR = BASE_DIR / 'frontend'
        if not FRONTEND_DIR.exists():
            print(f"Error: Frontend directory not found at {FRONTEND_DIR}")
            print("Make sure all files are properly packaged in the executable.")
            sys.exit(1)
    
    start_server(port=5000)
