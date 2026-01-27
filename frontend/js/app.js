// HulamKo Enhanced Application - Main JavaScript
// This file contains improved functionality with better error handling and UX

// Global State
const appState = {
    currentTab: 'dashboard',
    allTools: [],
    allBorrowers: [],
    allUsers: [],
    activityLog: [],
    lastUpdate: null,
    isProcessing: false,
    isLoggedIn: false,
    currentUser: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('HulamKo Application Initializing...');
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        appState.isLoggedIn = true;
        appState.currentUser = savedUser;
        showMainApp();
        loadApplicationState();
        setupEventListeners();
        updateDashboard();
        renderTools();
        renderBorrowers();
        renderUsers();
        setupAutosave();
        console.log('HulamKo Ready!');
    } else {
        showLoginPage();
    }
});

// ==================== AUTHENTICATION ====================
function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    const userElement = document.getElementById('currentUser');
    if (userElement) {
        userElement.textContent = appState.currentUser.split('@')[0];
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!email || !password) {
        showAlert('Please enter both email and password', 'warning');
        return;
    }
    
    if (!email.includes('@')) {
        showAlert('Please enter a valid email address', 'warning');
        return;
    }
    
    // Validate against default credentials
    const validEmail = 'admin@hulamko.com';
    const validPassword = 'password123';
    
    if (email !== validEmail || password !== validPassword) {
        showAlert('Invalid email or password. Use admin@hulamko.com / password123', 'danger');
        return;
    }
    
    // Authentication successful
    appState.isLoggedIn = true;
    appState.currentUser = email;
    localStorage.setItem('currentUser', email);
    
    // Clear login form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    showAlert('Welcome back, ' + email.split('@')[0] + '!', 'success');
    
    loadApplicationState();
    setupEventListeners();
    updateDashboard();
    renderTools();
    renderBorrowers();
    renderUsers();
    setupAutosave();
    
    // Delay showing main app for animation
    setTimeout(() => {
        showMainApp();
    }, 600);
}

function showForgotPassword(e) {
    e.preventDefault();
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.querySelector('.login-form').style.display = 'none';
    document.getElementById('forgotPasswordForm').classList.add('active');
}

function backToLogin() {
    document.querySelector('.login-form').style.display = 'block';
    document.getElementById('forgotPasswordForm').classList.remove('active');
    document.getElementById('resetEmail').value = '';
}

function handlePasswordReset() {
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email || !email.includes('@')) {
        showAlert('Please enter a valid email address', 'warning');
        return;
    }
    
    showAlert('Password reset link has been sent to ' + email, 'success');
    setTimeout(() => {
        backToLogin();
    }, 2000);
}

function logout() {
    localStorage.removeItem('currentUser');
    appState.isLoggedIn = false;
    appState.currentUser = null;
    showAlert('You have been logged out', 'info');
    
    setTimeout(() => {
        showLoginPage();
    }, 1000);
}

// Load State from Storage
function loadApplicationState() {
    appState.allTools = JSON.parse(localStorage.getItem('tools')) || [];
    appState.allBorrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    appState.allUsers = JSON.parse(localStorage.getItem('users')) || [];
    appState.activityLog = JSON.parse(localStorage.getItem('activity')) || [];
    appState.lastUpdate = localStorage.getItem('lastUpdate');
}

// Save State to Storage
function saveApplicationState() {
    localStorage.setItem('tools', JSON.stringify(appState.allTools));
    localStorage.setItem('borrowers', JSON.stringify(appState.allBorrowers));
    localStorage.setItem('users', JSON.stringify(appState.allUsers));
    localStorage.setItem('activity', JSON.stringify(appState.activityLog));
    localStorage.setItem('lastUpdate', new Date().toISOString());
}

// Auto-save every 30 seconds
function setupAutosave() {
    setInterval(() => {
        if (!appState.isProcessing) {
            saveApplicationState();
        }
    }, 30000);
}

// Add Activity Log
function addActivity(action) {
    appState.activityLog.unshift({
        action: action,
        timestamp: new Date().toISOString()
    });
    if (appState.activityLog.length > 100) {
        appState.activityLog.pop();
    }
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    const totalTools = appState.allTools.length;
    const totalAvailable = appState.allTools.reduce((sum, t) => sum + t.quantity, 0);
    const activeBorrowings = appState.allBorrowers.filter(b => !b.returned).length;
    const overdue = appState.allBorrowers.filter(b => !b.returned && new Date(b.return_date) < new Date()).length;
    
    document.getElementById('totalTools').textContent = totalTools;
    document.getElementById('activeBorrowings').textContent = activeBorrowings;
    document.getElementById('overdueItems').textContent = overdue;
    document.getElementById('totalUsers').textContent = appState.allUsers.length;
    
    renderActivity();
}

function renderActivity() {
    const activityDiv = document.getElementById('recentActivity');
    if (appState.activityLog.length === 0) {
        activityDiv.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><h4>No Activity Yet</h4><p>Start managing your inventory</p></div>`;
        return;
    }
    
    activityDiv.innerHTML = appState.activityLog.slice(0, 10).map(log => `
        <div class="activity-item">
            <strong>${log.action}</strong>
            <div class="text-muted" style="font-size: 0.85rem;">${new Date(log.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
}

// ==================== TOOLS MANAGEMENT ====================
function saveTool() {
    const form = document.getElementById('toolForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return false;
    }
    
    // Show loading state
    const loadingId = showLoadingState('Adding tool...');
    appState.isProcessing = true;
    
    try {
        const toolData = {
            id: Math.max(...appState.allTools.map(t => t.id || 0), 0) + 1,
            name: document.getElementById('toolName').value.trim(),
            brand: document.getElementById('toolBrand').value.trim(),
            description: document.getElementById('toolDescription').value.trim(),
            quantity: parseInt(document.getElementById('toolQuantity').value),
            category: document.getElementById('toolCategory').value,
            createdDate: new Date().toISOString()
        };
        
        if (!toolData.name) {
            hideLoadingState(loadingId);
            showAlert('Tool name is required', 'warning');
            appState.isProcessing = false;
            return false;
        }
        
        // Simulate API delay (remove if using real API)
        setTimeout(() => {
            appState.allTools.push(toolData);
            addActivity(`Tool "${toolData.name}" created`);
            saveApplicationState();
            
            hideLoadingState(loadingId);
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('addToolModal')).hide();
            showAlert(`Tool "${toolData.name}" added successfully!`, 'success');
            showSaveSuccess();
            renderTools();
            updateDashboard();
            appState.isProcessing = false;
        }, 400);
    } catch (error) {
        hideLoadingState(loadingId);
        handleError(error, 'Failed to add tool');
        appState.isProcessing = false;
    }
    updateToolSelect();
    
    appState.isProcessing = false;
    return false;
}

function editToolForm(toolId) {
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    document.getElementById('editToolId').value = tool.id;
    document.getElementById('editToolName').value = tool.name;
    document.getElementById('editToolBrand').value = tool.brand || '';
    document.getElementById('editToolQuantity').value = tool.quantity;
    document.getElementById('editToolCategory').value = tool.category || '';
}

function updateTool() {
    const toolId = parseInt(document.getElementById('editToolId').value);
    const tool = appState.allTools.find(t => t.id === toolId);
    
    if (!tool) {
        showAlert('Tool not found', 'danger');
        return false;
    }
    
    tool.name = document.getElementById('editToolName').value.trim();
    tool.brand = document.getElementById('editToolBrand').value.trim();
    tool.quantity = parseInt(document.getElementById('editToolQuantity').value);
    tool.category = document.getElementById('editToolCategory').value;
    
    addActivity(`Tool "${tool.name}" updated`);
    saveApplicationState();
    
    bootstrap.Modal.getInstance(document.getElementById('editToolModal')).hide();
    showAlert(`"${tool.name}" updated successfully!`, 'success');
    renderTools();
    updateDashboard();
    
    return false;
}

function deleteTool(toolId) {
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    if (!confirm(`Are you sure you want to delete "${tool.name}"? This action cannot be undone.`)) {
        return false;
    }
    
    const loadingId = showLoadingState('Deleting tool...');
    
    setTimeout(() => {
        try {
            appState.allTools = appState.allTools.filter(t => t.id !== toolId);
            addActivity(`Tool "${tool.name}" deleted`);
            saveApplicationState();
            
            hideLoadingState(loadingId);
            showAlert(`"${tool.name}" deleted successfully!`, 'success');
            showSaveSuccess();
            renderTools();
            updateDashboard();
        } catch (error) {
            hideLoadingState(loadingId);
            handleError(error, 'Failed to delete tool');
        }
    }, 400);
}

function filterTools() {
    const searchTerm = (document.getElementById('toolSearch')?.value || '').toLowerCase();
    const categoryTerm = document.getElementById('toolCategory')?.value || '';
    
    const filtered = appState.allTools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm) || 
                            tool.brand.toLowerCase().includes(searchTerm) ||
                            (tool.description && tool.description.toLowerCase().includes(searchTerm));
        const matchesCategory = !categoryTerm || tool.category === categoryTerm;
        return matchesSearch && matchesCategory;
    });

    renderFilteredTools(filtered);
}

function renderTools() {
    renderFilteredTools(appState.allTools);
}

function renderFilteredTools(tools) {
    const toolsList = document.getElementById('toolsList');
    
    if (tools.length === 0) {
        toolsList.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><h4>No Tools Found</h4><p>${appState.allTools.length === 0 ? 'Add your first tool' : 'Try a different search'}</p></div>`;
        return;
    }

    toolsList.innerHTML = tools.map(tool => `
        <div class="tool-card">
            <div class="row">
                <div class="col-md-8">
                    <h4>${tool.name}</h4>
                    <div class="detail-row">
                        <span class="detail-label">Brand:</span>
                        <span class="detail-value">${tool.brand || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Category:</span>
                        <span class="detail-value"><span class="badge bg-info">${tool.category || 'Uncategorized'}</span></span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Available:</span>
                        <span class="detail-value"><span class="badge bg-success">${tool.quantity}</span></span>
                    </div>
                    ${tool.description ? `
                    <div class="detail-row">
                        <span class="detail-label">Description:</span>
                        <span class="detail-value" style="font-size: 0.9rem;">${tool.description}</span>
                    </div>
                    ` : ''}
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="editToolForm(${tool.id})" data-bs-toggle="modal" data-bs-target="#editToolModal">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-info btn-small" onclick="exportQRCode(${tool.id}, '${tool.name}')">
                            <i class="fas fa-download"></i> Export QR
                        </button>
                        <button class="btn btn-danger btn-small" onclick="confirmDeleteTool(${tool.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <div id="qr-tool-${tool.id}" style="padding: 10px;"></div>
                </div>
            </div>
        </div>
    `).join('');

    tools.forEach(tool => {
        try {
            const elem = document.getElementById(`qr-tool-${tool.id}`);
            if (elem && elem.childNodes.length === 0) {
                new QRCode(elem, {
                    text: JSON.stringify({id: tool.id, name: tool.name}),
                    width: 120,
                    height: 120,
                    colorDark: '#667eea',
                    colorLight: '#f7fafc'
                });
            }
        } catch (e) {
            console.log('QR code generation skipped for tool', tool.id);
        }
    });
}

// ==================== BORROWERS MANAGEMENT ====================
function saveBorrower() {
    const form = document.getElementById('borrowerForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return false;
    }

    const loadingId = showLoadingState('Recording borrowing...');
    
    try {
        const toolId = parseInt(document.getElementById('borrowerTool').value);
        const tool = appState.allTools.find(t => t.id === toolId);
        
        if (!tool) {
            hideLoadingState(loadingId);
            showAlert('Please select a valid tool', 'warning');
            return false;
        }
        
        if (tool.quantity <= 0) {
            hideLoadingState(loadingId);
            showAlert(`"${tool.name}" is not available`, 'warning');
            return false;
        }
        
        const borrowerData = {
            id: Math.max(...appState.allBorrowers.map(b => b.id || 0), 0) + 1,
            tool_id: toolId,
            borrower_name: document.getElementById('borrowerName').value.trim(),
            borrow_date: document.getElementById('borrowDate').value,
            return_date: document.getElementById('returnDate').value,
            reason: document.getElementById('borrowReason').value.trim(),
            returned: false,
            returned_date: null
        };
        
        if (!borrowerData.borrower_name) {
            hideLoadingState(loadingId);
            showAlert('Borrower name is required', 'warning');
            return false;
        }
        
        if (new Date(borrowerData.return_date) <= new Date(borrowerData.borrow_date)) {
            hideLoadingState(loadingId);
            showAlert('Return date must be after borrow date', 'warning');
            return false;
        }
        
        setTimeout(() => {
            tool.quantity -= 1;
            appState.allBorrowers.push(borrowerData);
            addActivity(`${borrowerData.borrower_name} borrowed "${tool.name}"`);
            saveApplicationState();
            
            hideLoadingState(loadingId);
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('addBorrowerModal')).hide();
            showAlert(`Borrowing recorded successfully!`, 'success');
            showSaveSuccess();
            renderBorrowers();
            renderTools();
            updateDashboard();
            updateToolSelect();
        }, 400);
    } catch (error) {
        hideLoadingState(loadingId);
        handleError(error, 'Failed to record borrowing');
    }
    
    return false;
}

function returnBorrower(borrowerId) {
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower || borrower.returned) return;
    
    const tool = appState.allTools.find(t => t.id === borrower.tool_id);
    
    borrower.returned = true;
    borrower.returned_date = new Date().toISOString();
    if (tool) {
        tool.quantity += 1;
    }
    
    addActivity(`${borrower.borrower_name} returned "${tool?.name || 'item'}"`);
    saveApplicationState();
    
    showAlert(`Item returned successfully!`, 'success');
    renderBorrowers();
    renderTools();
    updateDashboard();
    updateToolSelect();
}

function filterBorrowers() {
    const searchTerm = (document.getElementById('borrowerSearch')?.value || '').toLowerCase();
    const statusTerm = document.getElementById('filterStatus')?.value || '';
    
    const filtered = appState.allBorrowers.filter(b => {
        const tool = appState.allTools.find(t => t.id === b.tool_id);
        const matchesSearch = b.borrower_name.toLowerCase().includes(searchTerm) ||
                            (tool && tool.name.toLowerCase().includes(searchTerm));
        
        let status = b.returned ? 'returned' : (new Date(b.return_date) < new Date() ? 'overdue' : 'active');
        const matchesStatus = !statusTerm || status === statusTerm;
        
        return matchesSearch && matchesStatus;
    });

    renderFilteredBorrowers(filtered);
}

function renderBorrowers() {
    renderFilteredBorrowers(appState.allBorrowers);
}

function renderFilteredBorrowers(borrowers) {
    const borrowersList = document.getElementById('borrowersList');
    
    if (borrowers.length === 0) {
        borrowersList.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><h4>No Borrowings Found</h4><p>${appState.allBorrowers.length === 0 ? 'Record your first borrowing' : 'Try a different filter'}</p></div>`;
        return;
    }

    borrowersList.innerHTML = borrowers.map(borrower => {
        const tool = appState.allTools.find(t => t.id === borrower.tool_id);
        const returnDate = new Date(borrower.return_date);
        const isOverdue = returnDate < new Date() && !borrower.returned;
        let status = borrower.returned ? 'Returned' : isOverdue ? 'Overdue' : 'Active';
        let badgeClass = borrower.returned ? 'badge-success' : isOverdue ? 'badge-danger' : 'badge-warning';

        return `
            <div class="borrower-card">
                <div class="row">
                    <div class="col-md-8">
                        <h4>${borrower.borrower_name}</h4>
                        <div class="detail-row">
                            <span class="detail-label">Tool:</span>
                            <span class="detail-value">${tool?.name || 'Unknown'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Borrow Date:</span>
                            <span class="detail-value">${new Date(borrower.borrow_date).toLocaleDateString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Return Date:</span>
                            <span class="detail-value">${returnDate.toLocaleDateString()}</span>
                        </div>
                        ${borrower.reason ? `
                        <div class="detail-row">
                            <span class="detail-label">Reason:</span>
                            <span class="detail-value">${borrower.reason}</span>
                        </div>
                        ` : ''}
                        ${!borrower.returned ? `
                        <div class="action-buttons">
                            <button class="btn btn-success btn-small" onclick="confirmReturn(${borrower.id})">
                                <i class="fas fa-check"></i> Mark Returned
                            </button>
                        </div>
                        ` : ''}
                    </div>
                    <div class="col-md-4 text-end">
                        <span class="badge ${badgeClass}">
                            ${status}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== USERS MANAGEMENT ====================
function saveUser() {
    const form = document.getElementById('userForm');
    if (!form.checkValidity()) {
        showAlert('Please fill in all required fields', 'warning');
        return false;
    }
    
    const username = document.getElementById('userUsername').value.trim();
    
    if (appState.allUsers.some(u => u.username === username)) {
        showAlert('Username already exists', 'danger');
        return false;
    }

    const userData = {
        id: Math.max(...appState.allUsers.map(u => u.id || 0), 0) + 1,
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        username: username,
        role: document.getElementById('userRole').value,
        createdDate: new Date().toISOString()
    };

    appState.allUsers.push(userData);
    addActivity(`User "${userData.name}" created`);
    saveApplicationState();
    
    form.reset();
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    showAlert(`User "${userData.name}" added successfully!`, 'success');
    renderUsers();
    updateDashboard();
    
    return false;
}

function deleteUser(userId) {
    const user = appState.allUsers.find(u => u.id === userId);
    if (!user) return;
    
    appState.allUsers = appState.allUsers.filter(u => u.id !== userId);
    addActivity(`User "${user.name}" deleted`);
    saveApplicationState();
    
    showAlert(`User "${user.name}" deleted successfully!`, 'success');
    renderUsers();
    updateDashboard();
}

function filterUsers() {
    const searchTerm = (document.getElementById('userSearch')?.value || '').toLowerCase();
    
    const filtered = appState.allUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm) || 
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
    );

    renderFilteredUsers(filtered);
}

function renderUsers() {
    renderFilteredUsers(appState.allUsers);
}

function renderFilteredUsers(users) {
    const usersList = document.getElementById('usersList');
    
    if (users.length === 0) {
        usersList.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><h4>No Users Found</h4><p>${appState.allUsers.length === 0 ? 'Add your first user' : 'Try a different search'}</p></div>`;
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="user-card">
            <div class="row">
                <div class="col-md-8">
                    <h4>${user.name}</h4>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${user.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Username:</span>
                        <span class="detail-value">@${user.username}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-danger btn-small" onclick="confirmDeleteUser(${user.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <span class="badge bg-success">${user.role}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateToolSelect() {
    const selectTool = document.getElementById('borrowerTool');
    if (!selectTool) return;
    
    selectTool.innerHTML = '<option value="">Select a tool</option>';
    appState.allTools.forEach(tool => {
        if (tool.quantity > 0) {
            const option = document.createElement('option');
            option.value = tool.id;
            option.textContent = `${tool.name} (${tool.quantity} available)`;
            selectTool.appendChild(option);
        }
    });
}

// ==================== CONFIRMATION DIALOGS ====================
function confirmDeleteTool(toolId) {
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    if (confirm(`⚠️ Delete "${tool.name}"?\n\nThis action cannot be undone.`)) {
        deleteTool(toolId);
    }
}

function confirmDeleteUser(userId) {
    const user = appState.allUsers.find(u => u.id === userId);
    if (!user) return;
    
    if (confirm(`⚠️ Delete user "${user.name}"?\n\nThis action cannot be undone.`)) {
        deleteUser(userId);
    }
}

function confirmReturn(borrowerId) {
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    const tool = appState.allTools.find(t => t.id === borrower.tool_id);
    
    if (confirm(`Mark "${tool?.name || 'item'}" as returned by ${borrower.borrower_name}?`)) {
        returnBorrower(borrowerId);
    }
}

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
    appState.currentTab = tab;
    
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'tools') {
        renderTools();
        updateToolSelect();
    } else if (tab === 'borrowers') {
        renderBorrowers();
    } else if (tab === 'users') {
        renderUsers();
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Search handlers
    const toolSearch = document.getElementById('toolSearch');
    const toolCat = document.getElementById('toolCategory');
    const borrowerSearch = document.getElementById('borrowerSearch');
    const filterStatus = document.getElementById('filterStatus');
    const userSearch = document.getElementById('userSearch');

    if (toolSearch) toolSearch.addEventListener('keyup', filterTools);
    if (toolCat) toolCat.addEventListener('change', filterTools);
    if (borrowerSearch) borrowerSearch.addEventListener('keyup', filterBorrowers);
    if (filterStatus) filterStatus.addEventListener('change', filterBorrowers);
    if (userSearch) userSearch.addEventListener('keyup', filterUsers);

    // Form submissions
    const toolForm = document.getElementById('toolForm');
    const borrowerForm = document.getElementById('borrowerForm');
    const userForm = document.getElementById('userForm');
    const editToolForm = document.getElementById('editToolForm');

    if (toolForm) toolForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTool();
    });
    if (borrowerForm) borrowerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveBorrower();
    });
    if (userForm) userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveUser();
    });
    if (editToolForm) editToolForm.addEventListener('submit', function(e) {
        e.preventDefault();
        updateTool();
    });

    // Keyboard shortcut for clear database
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'D') {
            event.preventDefault();
            window.location.href = 'clear-database.html';
        }
    });

    updateToolSelect();
}

// ==================== UTILITY ====================
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer') || document.body;
    const alertId = 'alert-' + Date.now();
    
    // Use better styling with custom CSS classes
    const typeClass = {
        'success': 'alert-success',
        'error': 'alert-error',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[type] || 'alert-info';
    
    const alertHTML = `
        <div id="${alertId}" class="alert-message ${typeClass}" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        </div>
    `;
    
    const temp = document.createElement('div');
    temp.innerHTML = alertHTML;
    document.body.appendChild(temp.firstElementChild);
    
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => alertElement.remove(), 300);
        }
    }, 4000);
}

// Show Loading State
function showLoadingState(message = 'Processing...') {
    const loadingId = 'loading-overlay-' + Date.now();
    const loadingHTML = `
        <div id="${loadingId}" class="loading-overlay">
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem; color: #666; font-weight: 500;">${message}</p>
            </div>
        </div>
    `;
    
    const temp = document.createElement('div');
    temp.innerHTML = loadingHTML;
    document.body.appendChild(temp.firstElementChild);
    
    return loadingId; // Return ID so it can be removed later
}

// Hide Loading State
function hideLoadingState(loadingId) {
    const loadingElement = document.getElementById(loadingId);
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        loadingElement.style.transition = 'opacity 0.3s ease';
        setTimeout(() => loadingElement.remove(), 300);
    }
}

// Show Save Success with Visual Feedback
function showSaveSuccess() {
    const savedId = 'saved-indicator-' + Date.now();
    const savedHTML = `
        <div id="${savedId}" class="save-indicator" style="position: fixed; bottom: 20px; right: 20px; z-index: 9998;">
            <i class="fas fa-cloud-upload-alt"></i>
            <span>Saved</span>
        </div>
    `;
    
    const temp = document.createElement('div');
    temp.innerHTML = savedHTML;
    document.body.appendChild(temp.firstElementChild);
    
    setTimeout(() => {
        const element = document.getElementById(savedId);
        if (element) {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease';
            setTimeout(() => element.remove(), 500);
        }
    }, 2000);
}

// Error State Handler
function handleError(error, message = 'An error occurred') {
    console.error('Error:', error);
    showAlert(message + ' - ' + (error.message || error), 'error');
    return false;
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.setItem('currentUser', '');
        showAlert('You have been logged out successfully', 'info');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Settings Functions
function updateProfile() {
    const name = document.getElementById('settingName').value;
    const email = document.getElementById('settingEmail').value;
    
    localStorage.setItem('userProfile', JSON.stringify({
        name: name,
        email: email,
        updatedAt: new Date().toISOString()
    }));
    
    document.getElementById('currentUser').textContent = name;
    showAlert('Profile updated successfully', 'success');
}

function saveSettings() {
    const settings = {
        enableNotifications: document.querySelector('input[type="checkbox"]:nth-child(1)').checked,
        autoSave: document.querySelector('input[type="checkbox"]:nth-child(2)').checked,
        savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('appSettings', JSON.stringify(settings));
    showAlert('Settings saved successfully', 'success');
}

function exportData() {
    const data = {
        tools: appState.allTools,
        borrowers: appState.allBorrowers,
        users: appState.allUsers,
        activity: appState.activityLog,
        exportedAt: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hulam-ko-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    showAlert('Data exported successfully', 'success');
}

// ==================== QR CODE SCANNING & EXPORT ====================
let html5QrcodeScanner = null;

function initializeQRScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.render(onQRScanSuccess, onQRScanError);
        return;
    }

    html5QrcodeScanner = new Html5Qrcode("qr-reader");
    const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    html5QrcodeScanner.start(
        { facingMode: "environment" },
        qrConfig,
        onQRScanSuccess,
        onQRScanError
    ).catch(err => {
        console.log('Error starting QR scanner:', err);
        showAlert('Unable to access camera. Please check permissions or use manual entry.', 'warning');
    });
}

function onQRScanSuccess(decodedText, decodedResult) {
    try {
        const scannedData = JSON.parse(decodedText);
        
        if (scannedData.id && scannedData.name) {
            const tool = appState.allTools.find(t => t.id === scannedData.id);
            
            if (tool) {
                // Show success message
                document.getElementById('qr-result').style.display = 'block';
                document.getElementById('scannedToolName').textContent = tool.name;
                
                // Auto-fill the borrowing form
                setTimeout(() => {
                    if (html5QrcodeScanner) {
                        html5QrcodeScanner.stop();
                        html5QrcodeScanner = null;
                    }
                    
                    // Close scanner modal and open borrowing modal with tool selected
                    bootstrap.Modal.getInstance(document.getElementById('scanQRModal')).hide();
                    
                    // Set the tool in the form
                    document.getElementById('borrowerTool').value = tool.id;
                    document.getElementById('borrowDate').valueAsDate = new Date();
                    
                    const returnDate = new Date();
                    returnDate.setDate(returnDate.getDate() + 7); // Default 7 days
                    document.getElementById('returnDate').valueAsDate = returnDate;
                    
                    // Open borrowing modal
                    const borrowModal = new bootstrap.Modal(document.getElementById('addBorrowerModal'));
                    borrowModal.show();
                    
                    showAlert(`Tool "${tool.name}" scanned! Fill in borrower details.`, 'success');
                }, 500);
            }
        }
    } catch (e) {
        console.log('Invalid QR code data:', decodedText);
    }
}

function onQRScanError(error) {
    // Ignore scanning errors, just keep trying
    console.log('QR scan error:', error);
}

function exportQRCode(toolId, toolName) {
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) return;
    
    // Create a temporary container
    const tempDiv = document.createElement('div');
    const qrContainer = document.createElement('div');
    qrContainer.style.padding = '20px';
    qrContainer.style.backgroundColor = 'white';
    qrContainer.style.borderRadius = '8px';
    tempDiv.appendChild(qrContainer);
    
    // Generate QR code
    const qrData = JSON.stringify({ id: tool.id, name: tool.name });
    new QRCode(qrContainer, {
        text: qrData,
        width: 300,
        height: 300,
        colorDark: '#667eea',
        colorLight: '#ffffff'
    });
    
    // Get the QR code image
    setTimeout(() => {
        const qrImage = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
        
        if (qrImage) {
            let imageData;
            
            if (qrImage.tagName === 'CANVAS') {
                imageData = qrImage.toDataURL('image/png');
            } else {
                // Convert image to canvas
                const canvas = document.createElement('canvas');
                canvas.width = qrImage.width;
                canvas.height = qrImage.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(qrImage, 0, 0);
                imageData = canvas.toDataURL('image/png');
            }
            
            // Create download link
            const link = document.createElement('a');
            link.href = imageData;
            link.download = `${tool.name.replace(/\s+/g, '_')}_QR_${new Date().toISOString().split('T')[0]}.png`;
            link.click();
            
            showAlert(`QR code for "${tool.name}" exported successfully!`, 'success');
        }
    }, 500);
}

// Setup QR Scanner when modal is shown
document.addEventListener('show.bs.modal', function(e) {
    if (e.target.id === 'scanQRModal') {
        document.getElementById('qr-result').style.display = 'none';
        setTimeout(() => {
            initializeQRScanner();
        }, 500);
    }
});

// Stop QR Scanner when modal is hidden
document.addEventListener('hide.bs.modal', function(e) {
    if (e.target.id === 'scanQRModal') {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.stop().then(ignored => {
                html5QrcodeScanner = null;
            }).catch(err => {
                console.log('Error stopping QR scanner:', err);
            });
        }
    }
});

function clearAllData() {
    if (confirm('This will delete all data. Are you absolutely sure?')) {
        if (confirm('This action cannot be undone. Click OK to confirm.')) {
            localStorage.clear();
            appState.allTools = [];
            appState.allBorrowers = [];
            appState.allUsers = [];
            appState.activityLog = [];
            
            showAlert('All data has been cleared', 'warning');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }
}

// Category Management
function getCategories() {
    return ['Hand Tools', 'Power Tools', 'Electronics', 'Safety Equipment', 'Other'];
}

function addNewCategory() {
    const newCat = prompt('Enter new category name:');
    if (newCat && newCat.trim()) {
        let categories = JSON.parse(localStorage.getItem('toolCategories')) || getCategories();
        if (!categories.includes(newCat)) {
            categories.push(newCat);
            localStorage.setItem('toolCategories', JSON.stringify(categories));
            updateCategorySelects();
            showAlert(`Category "${newCat}" added successfully`, 'success');
        } else {
            showAlert('Category already exists', 'warning');
        }
    }
}

function updateCategorySelects() {
    const categories = JSON.parse(localStorage.getItem('toolCategories')) || getCategories();
    const selects = document.querySelectorAll('[id*="Category"]');
    
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
        select.value = currentValue;
    });
}

// Initialize categories on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCategorySelects();
});

