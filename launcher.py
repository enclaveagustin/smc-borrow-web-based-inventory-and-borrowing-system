#!/usr/bin/env python3
"""
SMC-Borrow - Production Launcher
Serves the frontend and backend together as a standalone application
"""

import os
import sys
import time
import webbrowser
import threading
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

# Load environment variables from .env
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed, will use os.environ directly

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
    {'id': 1, 'name': 'KEYBOARD', 'brand': 'A4TECH', 'quantity': 41, 'category': 'Computer Equipments', 'description': 'KEYBOARD A4TECH USB A-SHAPE', 'location': 'CALL LAB RM. 116', 'yearAcquired': '2023-06-15', 'condition': 'Good Condition', 'assetCode': 'SMC-CE-001', 'previousQty': 41, 'actionSincePrev': ''},
    {'id': 2, 'name': 'MOUSE', 'brand': 'A4TECH', 'quantity': 41, 'category': 'Computer Equipments', 'description': 'MOUSE A4TECH USB A-SHAPE', 'location': 'CALL LAB RM. 116', 'yearAcquired': '2023-06-15', 'condition': 'Good Condition', 'assetCode': 'SMC-CE-002', 'previousQty': 41, 'actionSincePrev': ''},
    {'id': 3, 'name': 'MONITOR', 'brand': 'ACER', 'quantity': 32, 'category': 'Computer Equipments', 'description': '21.5" LED VGA+HDMI 75hz MONITOR ACER', 'location': 'CALL LAB RM. 116', 'yearAcquired': '2023-08-20', 'condition': 'Good Condition', 'assetCode': 'SMC-CE-003', 'previousQty': 32, 'actionSincePrev': ''},
    {'id': 4, 'name': 'AVR', 'brand': 'GENERIC', 'quantity': 41, 'category': 'Computer Equipments', 'description': 'GENERIC 500WATTS SECURE AVR', 'location': 'CALL LAB RM. 116', 'yearAcquired': '2023-02-14', 'condition': 'Good Condition', 'assetCode': 'SMC-CE-006', 'previousQty': 41, 'actionSincePrev': ''},
    {'id': 5, 'name': 'CHAIR', 'brand': 'N/A', 'quantity': 36, 'category': 'Furniture and Fixture', 'description': 'MONOBLOC WHITE', 'location': 'CALL LAB RM. 116', 'yearAcquired': '2019-05-15', 'condition': 'Needs Repair', 'assetCode': 'SMC-FF-011', 'previousQty': 36, 'actionSincePrev': 'Transferred'},
    {'id': 6, 'name': 'CRUCIFIX', 'brand': 'N/A', 'quantity': 1, 'category': 'Sacred Images and Chapel', 'description': 'CRUCIFIX', 'location': 'CALL LAB RM. 116', 'yearAcquired': '2019-01-20', 'condition': 'Good Condition', 'assetCode': 'SMC-SC-015', 'previousQty': 1, 'actionSincePrev': ''}
]

borrowers_db = []
users_db = [
    {'id': 1, 'name': 'Admin', 'email': 'admin@smcborrow.com', 'username': 'admin', 'role': 'Admin'},
    {'id': 2, 'name': 'Teacher One', 'email': 'teacher1@smcborrow.com', 'username': 'teacher1', 'role': 'Teacher'}
]
activity_log = []

next_tool_id = 7
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
        'image': data.get('image'),
        'location': data.get('location'),
        'yearAcquired': data.get('yearAcquired'),
        'condition': data.get('condition', 'Good Condition'),
        'assetCode': data.get('assetCode'),
        'previousQty': data.get('previousQty', 0),
        'actionSincePrev': data.get('actionSincePrev', '')
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

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """Update a user"""
    user = next((u for u in users_db if u['id'] == user_id), None)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    data = request.get_json()
    user.update(data)
    return jsonify(user), 200

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user"""
    global users_db
    users_db = [u for u in users_db if u['id'] != user_id]
    return jsonify({'message': 'User deleted'}), 200

@app.route('/api/borrowers/<int:borrower_id>', methods=['PUT'])
def update_borrower(borrower_id):
    """Update a borrower record (e.g. adjust return date)"""
    borrower = next((b for b in borrowers_db if b['id'] == borrower_id), None)
    if not borrower:
        return jsonify({'message': 'Borrower not found'}), 404
    data = request.get_json()
    borrower.update(data)
    return jsonify(borrower), 200

# ==================== HEALTH CHECK ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

# ==================== EMAIL API ====================

@app.route('/api/send-overdue-email', methods=['POST'])
def send_overdue_email():
    """Send overdue notification email via Gmail SMTP"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        to_email = data.get('to_email')
        borrower_name = data.get('borrower_name', 'Student')
        tool_name = data.get('tool_name', 'Borrowed Item')
        student_id = data.get('student_id', 'N/A')
        borrow_date = data.get('borrow_date', 'N/A')
        return_date = data.get('return_date', 'N/A')
        days_overdue = data.get('days_overdue', 0)

        if not to_email:
            return jsonify({'success': False, 'message': 'Recipient email is required'}), 400

        # Get SMTP credentials from environment
        sender_email = os.environ.get('EMAIL_SENDER', '')
        app_password = os.environ.get('EMAIL_APP_PASSWORD', '')
        smtp_host = os.environ.get('EMAIL_SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('EMAIL_SMTP_PORT', 587))

        if not sender_email or not app_password:
            return jsonify({'success': False, 'message': 'Email credentials not configured in .env file'}), 500

        # Build the email
        msg = MIMEMultipart('alternative')
        msg['From'] = f'SMC-Borrow Inventory System <{sender_email}>'
        msg['To'] = to_email
        msg['Subject'] = f'OVERDUE Notice - {tool_name} | SMC-Borrow Inventory System'

        # Plain text version
        text_body = f"""Dear {borrower_name},

This is to notify you that the item you borrowed is now OVERDUE.

Details:
  - Item: {tool_name}
  - Student ID: {student_id}
  - Borrow Date: {borrow_date}
  - Expected Return Date: {return_date}
  - Days Overdue: {days_overdue} day(s)

Please return the item immediately to avoid further penalties.

Thank you,
SMC-Borrow Inventory System
St. Mary's College of Tagum, Inc.
"""

        # HTML version
        html_body = f"""
        <html>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #dc3545, #c82333); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">⚠️ OVERDUE NOTICE</h1>
                    <p style="color: #f8d7da; margin: 8px 0 0 0; font-size: 14px;">SMC-Borrow Inventory System</p>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #333;">Dear <strong>{borrower_name}</strong>,</p>
                    <p style="font-size: 14px; color: #555; line-height: 1.6;">This is to notify you that the item you borrowed is now <strong style="color: #dc3545;">OVERDUE</strong>. Please return it immediately to avoid further penalties.</p>
                    <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="margin: 0 0 12px 0; color: #856404; font-size: 16px;">📋 Borrowing Details</h3>
                        <table style="width: 100%; font-size: 14px; color: #333;">
                            <tr><td style="padding: 6px 0; font-weight: 600;">Item:</td><td style="padding: 6px 0;">{tool_name}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: 600;">Student ID:</td><td style="padding: 6px 0;">{student_id}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: 600;">Borrow Date:</td><td style="padding: 6px 0;">{borrow_date}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: 600;">Expected Return:</td><td style="padding: 6px 0;">{return_date}</td></tr>
                            <tr><td style="padding: 6px 0; font-weight: 600; color: #dc3545;">Days Overdue:</td><td style="padding: 6px 0; color: #dc3545; font-weight: bold; font-size: 18px;">{days_overdue} day(s)</td></tr>
                        </table>
                    </div>
                    <p style="font-size: 14px; color: #555; line-height: 1.6;">Please return the item to the <strong>Office of the Property Custodian</strong> at your earliest convenience.</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6;">
                    <p style="font-size: 12px; color: #6c757d; margin: 0;">St. Mary's College of Tagum, Inc.</p>
                    <p style="font-size: 11px; color: #adb5bd; margin: 4px 0 0 0;">This is an automated message from SMC-Borrow Inventory System</p>
                </div>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        # Send the email via SMTP
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(sender_email, app_password)
            server.sendmail(sender_email, to_email, msg.as_string())

        print(f'  ✉ Overdue email sent to {to_email} for "{tool_name}"')
        return jsonify({'success': True, 'message': f'Overdue notification sent to {to_email}'}), 200

    except smtplib.SMTPAuthenticationError:
        print(f'  ✗ SMTP Auth Error - Check EMAIL_APP_PASSWORD in .env')
        return jsonify({'success': False, 'message': 'Email authentication failed. Check App Password in .env'}), 500
    except smtplib.SMTPException as e:
        print(f'  ✗ SMTP Error: {str(e)}')
        return jsonify({'success': False, 'message': f'SMTP error: {str(e)}'}), 500
    except Exception as e:
        print(f'  ✗ Email Error: {str(e)}')
        return jsonify({'success': False, 'message': f'Failed to send email: {str(e)}'}), 500

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
    print("  SMC-Borrow - Starting Application Server")
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
