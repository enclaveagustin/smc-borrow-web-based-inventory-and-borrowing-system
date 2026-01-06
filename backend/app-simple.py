"""
HulamKo Backend - Simplified Flask API (No Database Required)
Handles API operations with in-memory data storage
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json

app = Flask(__name__)
CORS(app)

# In-memory data storage
tools_db = [
    {'id': 1, 'name': 'Hammer', 'brand': 'Stanley', 'quantity': 5, 'category': 'Hand Tools', 'description': 'Claw hammer'},
    {'id': 2, 'name': 'Screwdriver Set', 'brand': 'DeWalt', 'quantity': 8, 'category': 'Hand Tools', 'description': 'Multi-bit screwdriver'},
    {'id': 3, 'name': 'Wrench Set', 'brand': 'Craftsman', 'quantity': 3, 'category': 'Hand Tools', 'description': 'Socket wrench set'}
]

borrowers_db = []

users_db = [
    {'id': 1, 'name': 'Admin', 'email': 'admin@hulam.ko', 'username': 'admin', 'role': 'Admin'},
    {'id': 2, 'name': 'Teacher One', 'email': 'teacher1@hulam.ko', 'username': 'teacher1', 'role': 'Teacher'}
]

activity_log = []

next_tool_id = 4
next_borrower_id = 1
next_user_id = 3

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
    
    if not data.get('name') or not data.get('quantity'):
        return jsonify({'message': 'Name and quantity are required'}), 400
    
    new_tool = {
        'id': next_tool_id,
        'name': data['name'],
        'brand': data.get('brand', ''),
        'quantity': data['quantity'],
        'category': data.get('category', ''),
        'description': data.get('description', ''),
        'created_at': datetime.now().isoformat()
    }
    
    tools_db.append(new_tool)
    next_tool_id += 1
    
    # Log activity
    activity_log.insert(0, {
        'action': f'Tool "{new_tool["name"]}" created',
        'timestamp': datetime.now().isoformat()
    })
    
    return jsonify(new_tool), 201

@app.route('/api/tools/<int:tool_id>', methods=['PUT'])
def update_tool(tool_id):
    """Update a tool"""
    tool = next((t for t in tools_db if t['id'] == tool_id), None)
    if not tool:
        return jsonify({'message': 'Tool not found'}), 404
    
    data = request.get_json()
    tool.update({
        'name': data.get('name', tool['name']),
        'brand': data.get('brand', tool['brand']),
        'quantity': data.get('quantity', tool['quantity']),
        'category': data.get('category', tool['category']),
        'description': data.get('description', tool['description'])
    })
    
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

@app.route('/api/borrowers/<int:borrower_id>', methods=['GET'])
def get_borrower(borrower_id):
    """Get a specific borrower"""
    borrower = next((b for b in borrowers_db if b['id'] == borrower_id), None)
    if not borrower:
        return jsonify({'message': 'Borrower not found'}), 404
    return jsonify(borrower), 200

@app.route('/api/borrowers', methods=['POST'])
def create_borrower():
    """Create a new borrowing record"""
    global next_borrower_id
    data = request.get_json()
    
    required = ['tool_id', 'borrower_name', 'borrow_date', 'return_date']
    if not all(data.get(field) for field in required):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if tool exists
    tool = next((t for t in tools_db if t['id'] == data['tool_id']), None)
    if not tool:
        return jsonify({'message': 'Tool not found'}), 404
    
    new_borrower = {
        'id': next_borrower_id,
        'tool_id': data['tool_id'],
        'borrower_name': data['borrower_name'],
        'borrow_date': data['borrow_date'],
        'return_date': data['return_date'],
        'reason': data.get('reason', ''),
        'returned': False,
        'returned_date': None,
        'created_at': datetime.now().isoformat()
    }
    
    borrowers_db.append(new_borrower)
    next_borrower_id += 1
    
    # Update tool quantity
    tool['quantity'] -= 1
    
    # Log activity
    activity_log.insert(0, {
        'action': f'{data["borrower_name"]} borrowed "{tool["name"]}"',
        'timestamp': datetime.now().isoformat()
    })
    
    return jsonify(new_borrower), 201

@app.route('/api/borrowers/<int:borrower_id>/return', methods=['PUT'])
def return_borrowing(borrower_id):
    """Mark a borrowing as returned"""
    borrower = next((b for b in borrowers_db if b['id'] == borrower_id), None)
    if not borrower:
        return jsonify({'message': 'Borrower not found'}), 404
    
    borrower['returned'] = True
    borrower['returned_date'] = datetime.now().isoformat()
    
    # Update tool quantity
    tool = next(t for t in tools_db if t['id'] == borrower['tool_id'])
    tool['quantity'] += 1
    
    # Log activity
    activity_log.insert(0, {
        'action': f'{borrower["borrower_name"]} returned "{tool["name"]}"',
        'timestamp': datetime.now().isoformat()
    })
    
    return jsonify(borrower), 200

@app.route('/api/borrowers/<int:borrower_id>', methods=['DELETE'])
def delete_borrower(borrower_id):
    """Delete a borrowing record"""
    global borrowers_db
    borrowers_db = [b for b in borrowers_db if b['id'] != borrower_id]
    return jsonify({'message': 'Borrower deleted'}), 200

# ==================== USERS API ====================

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all users"""
    return jsonify(users_db), 200

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Get a specific user"""
    user = next((u for u in users_db if u['id'] == user_id), None)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify(user), 200

@app.route('/api/users', methods=['POST'])
def create_user():
    """Create a new user"""
    global next_user_id
    data = request.get_json()
    
    required = ['name', 'email', 'username', 'role']
    if not all(data.get(field) for field in required):
        return jsonify({'message': 'Missing required fields'}), 400
    
    # Check if username already exists
    if any(u['username'] == data['username'] for u in users_db):
        return jsonify({'message': 'Username already exists'}), 400
    
    new_user = {
        'id': next_user_id,
        'name': data['name'],
        'email': data['email'],
        'username': data['username'],
        'role': data['role'],
        'created_at': datetime.now().isoformat()
    }
    
    users_db.append(new_user)
    next_user_id += 1
    
    # Log activity
    activity_log.insert(0, {
        'action': f'User "{new_user["name"]}" created',
        'timestamp': datetime.now().isoformat()
    })
    
    return jsonify(new_user), 201

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user"""
    user = next((u for u in users_db if u['id'] == user_id), None)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    user.update({
        'name': data.get('name', user['name']),
        'email': data.get('email', user['email']),
        'role': data.get('role', user['role'])
    })
    
    return jsonify(user), 200

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    global users_db
    users_db = [u for u in users_db if u['id'] != user_id]
    return jsonify({'message': 'User deleted'}), 200

# ==================== STATISTICS API ====================

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get system statistics"""
    total_tools = len(tools_db)
    total_tools_available = sum(t['quantity'] for t in tools_db)
    active_borrowings = len([b for b in borrowers_db if not b['returned']])
    overdue_items = len([b for b in borrowers_db if not b['returned'] and b['return_date'] < datetime.now().isoformat()])
    total_users = len(users_db)
    
    return jsonify({
        'total_tools': total_tools,
        'total_tools_available': total_tools_available,
        'active_borrowings': active_borrowings,
        'overdue_items': overdue_items,
        'total_users': total_users,
        'recent_activity': activity_log[:10]
    }), 200

# ==================== ACTIVITY LOG API ====================

@app.route('/api/activity', methods=['GET'])
def get_activity():
    """Get activity log"""
    limit = request.args.get('limit', 20, type=int)
    return jsonify(activity_log[:limit]), 200

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'HulamKo Backend API is running',
        'timestamp': datetime.now().isoformat()
    }), 200

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 HulamKo Backend API Starting...")
    print("=" * 60)
    print("✅ API Base URL: http://localhost:5000/api")
    print("✅ Health Check: http://localhost:5000/api/health")
    print("✅ CORS Enabled: Frontend can communicate freely")
    print("=" * 60)
    app.run(debug=True, host='localhost', port=5000)
