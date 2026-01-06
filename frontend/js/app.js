// HulamKo Application - Main JavaScript

// Global Variables
let currentUser = 'Admin';
let qrScanning = false;
let qrCanvas = null;
let qrCanvasContext = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('HulamKo Application Loaded');
    initializeApp();
});

function initializeApp() {
    loadDashboard();
    loadTools();
    loadBorrowers();
    loadUsers();
    setupEventListeners();
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    console.log('Loading Dashboard');
    
    // Get statistics
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Calculate stats
    document.getElementById('totalToolsCount').textContent = tools.length;
    document.getElementById('totalUsersCount').textContent = users.length;
    
    const activeBorrowings = borrowers.filter(b => !b.returnedDate).length;
    document.getElementById('activeBorrowingsCount').textContent = activeBorrowings;
    
    const today = new Date();
    const overdue = borrowers.filter(b => {
        if (b.returnedDate) return false;
        const expectedDate = new Date(b.expectedReturnDate);
        return expectedDate < today;
    }).length;
    document.getElementById('overdueItemsCount').textContent = overdue;
    
    loadRecentActivity();
}

function loadRecentActivity() {
    const borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tbody = document.getElementById('recentActivityTable');
    
    if (borrowers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No activity yet</td></tr>';
        return;
    }
    
    // Get last 10 activities
    const recent = borrowers.slice(-10).reverse();
    tbody.innerHTML = '';
    
    recent.forEach(activity => {
        const tool = tools.find(t => t.id == activity.toolId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tool ? tool.name : 'Unknown'}</td>
            <td>${activity.returnedDate ? 'Returned' : 'Borrowed'}</td>
            <td>${activity.borrowerName}</td>
            <td>${new Date(activity.borrowedDate).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// ==================== TOOLS ====================
function loadTools() {
    console.log('Loading Tools');
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tbody = document.getElementById('toolsTable');
    const selectTool = document.getElementById('selectTool');
    
    tbody.innerHTML = '';
    selectTool.innerHTML = '<option value="">Choose a tool...</option>';
    
    if (tools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No tools added yet</td></tr>';
        return;
    }
    
    tools.forEach(tool => {
        // Add to table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="qr-code-container">
                    <img src="${generateQRCode(tool.id)}" alt="QR" style="width: 50px;">
                </div>
            </td>
            <td>${tool.name}</td>
            <td>${tool.brand}</td>
            <td>${tool.description}</td>
            <td><span class="badge bg-success">${tool.availableQty}</span></td>
            <td>${tool.quantity}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editTool(${tool.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTool(${tool.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
        
        // Add to select dropdown
        const option = document.createElement('option');
        option.value = tool.id;
        option.textContent = `${tool.name} (${tool.availableQty} available)`;
        selectTool.appendChild(option);
    });
}

function saveTool() {
    const name = document.getElementById('toolName').value;
    const brand = document.getElementById('toolBrand').value;
    const description = document.getElementById('toolDescription').value;
    const quantity = parseInt(document.getElementById('toolQuantity').value);
    const category = document.getElementById('toolCategory').value;
    
    if (!name || !brand || !quantity) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    const tool = {
        id: Date.now(),
        name: name,
        brand: brand,
        description: description,
        quantity: quantity,
        availableQty: quantity,
        category: category,
        createdDate: new Date().toISOString()
    };
    
    let tools = JSON.parse(localStorage.getItem('tools')) || [];
    tools.push(tool);
    localStorage.setItem('tools', JSON.stringify(tools));
    
    // Reset form
    document.getElementById('addToolForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addToolModal')).hide();
    
    showAlert('Tool added successfully!', 'success');
    loadTools();
    loadDashboard();
}

function editTool(id) {
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tool = tools.find(t => t.id == id);
    
    if (tool) {
        document.getElementById('toolName').value = tool.name;
        document.getElementById('toolBrand').value = tool.brand;
        document.getElementById('toolDescription').value = tool.description;
        document.getElementById('toolQuantity').value = tool.quantity;
        document.getElementById('toolCategory').value = tool.category;
        
        // Show modal
        new bootstrap.Modal(document.getElementById('addToolModal')).show();
    }
}

function deleteTool(id) {
    if (confirm('Are you sure you want to delete this tool?')) {
        let tools = JSON.parse(localStorage.getItem('tools')) || [];
        tools = tools.filter(t => t.id != id);
        localStorage.setItem('tools', JSON.stringify(tools));
        
        showAlert('Tool deleted successfully!', 'success');
        loadTools();
        loadDashboard();
    }
}

// ==================== BORROWERS ====================
function loadBorrowers() {
    console.log('Loading Borrowers');
    const borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tbody = document.getElementById('borrowersTable');
    
    tbody.innerHTML = '';
    
    if (borrowers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No borrowing records yet</td></tr>';
        return;
    }
    
    borrowers.forEach(borrower => {
        const tool = tools.find(t => t.id == borrower.toolId);
        const status = getStatus(borrower);
        const statusClass = status === 'active' ? 'badge-active' : status === 'returned' ? 'badge-returned' : 'badge badge-danger';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tool ? tool.name : 'Unknown'}</td>
            <td>${borrower.borrowerName}</td>
            <td>${borrower.reason}</td>
            <td>${new Date(borrower.borrowedDate).toLocaleDateString()}</td>
            <td>${new Date(borrower.borrowedDate).toLocaleTimeString()}</td>
            <td>${borrower.returnedDate ? new Date(borrower.returnedDate).toLocaleDateString() : '-'}</td>
            <td><span class="badge ${statusClass}">${status.toUpperCase()}</span></td>
            <td>
                ${!borrower.returnedDate ? `
                    <button class="btn btn-sm btn-success" onclick="recordReturn(${borrower.id})">
                        <i class="fas fa-check"></i> Return
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-danger" onclick="deleteBorrower(${borrower.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function saveBorrower() {
    const toolId = document.getElementById('selectTool').value;
    const borrowerName = document.getElementById('borrowerName').value;
    const reason = document.getElementById('borrowingReason').value;
    const expectedReturnDate = document.getElementById('expectedReturnDate').value;
    
    if (!toolId || !borrowerName || !reason || !expectedReturnDate) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }
    
    // Update tool availability
    let tools = JSON.parse(localStorage.getItem('tools')) || [];
    const toolIndex = tools.findIndex(t => t.id == toolId);
    if (toolIndex !== -1 && tools[toolIndex].availableQty > 0) {
        tools[toolIndex].availableQty--;
        localStorage.setItem('tools', JSON.stringify(tools));
    } else {
        showAlert('Tool not available or quantity is zero', 'danger');
        return;
    }
    
    const borrower = {
        id: Date.now(),
        toolId: parseInt(toolId),
        borrowerName: borrowerName,
        reason: reason,
        borrowedDate: new Date().toISOString(),
        expectedReturnDate: expectedReturnDate,
        returnedDate: null
    };
    
    let borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    borrowers.push(borrower);
    localStorage.setItem('borrowers', JSON.stringify(borrowers));
    
    // Reset form
    document.getElementById('addBorrowerForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addBorrowerModal')).hide();
    
    showAlert('Borrowing recorded successfully!', 'success');
    loadBorrowers();
    loadTools();
    loadDashboard();
}

function recordReturn(borrowerId) {
    const borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    const borrowerIndex = borrowers.findIndex(b => b.id == borrowerId);
    
    if (borrowerIndex !== -1) {
        borrowers[borrowerIndex].returnedDate = new Date().toISOString();
        localStorage.setItem('borrowers', JSON.stringify(borrowers));
        
        // Update tool availability
        let tools = JSON.parse(localStorage.getItem('tools')) || [];
        const toolIndex = tools.findIndex(t => t.id == borrowers[borrowerIndex].toolId);
        if (toolIndex !== -1) {
            tools[toolIndex].availableQty++;
            localStorage.setItem('tools', JSON.stringify(tools));
        }
        
        showAlert('Item returned successfully!', 'success');
        loadBorrowers();
        loadTools();
        loadDashboard();
    }
}

function deleteBorrower(borrowerId) {
    if (confirm('Are you sure you want to delete this record?')) {
        let borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
        borrowers = borrowers.filter(b => b.id != borrowerId);
        localStorage.setItem('borrowers', JSON.stringify(borrowers));
        
        showAlert('Record deleted successfully!', 'success');
        loadBorrowers();
    }
}

function getStatus(borrower) {
    if (borrower.returnedDate) {
        return 'returned';
    }
    
    const today = new Date();
    const expectedDate = new Date(borrower.expectedReturnDate);
    
    if (expectedDate < today) {
        return 'overdue';
    }
    
    return 'active';
}

// ==================== USERS ====================
function loadUsers() {
    console.log('Loading Users');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('usersTable');
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users added yet</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-primary">${user.role}</span></td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function saveUser() {
    const username = document.getElementById('username').value;
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    
    if (!username || !fullName || !email || !password || !role) {
        showAlert('Please fill in all fields', 'warning');
        return;
    }
    
    const user = {
        id: Date.now(),
        username: username,
        fullName: fullName,
        email: email,
        password: btoa(password), // Simple base64 encoding (use proper hashing in production)
        role: role,
        createdDate: new Date().toISOString()
    };
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reset form
    document.getElementById('addUserForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
    
    showAlert('User added successfully!', 'success');
    loadUsers();
    loadDashboard();
}

function editUser(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id == id);
    
    if (user) {
        document.getElementById('username').value = user.username;
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        
        new bootstrap.Modal(document.getElementById('addUserModal')).show();
    }
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.id != id);
        localStorage.setItem('users', JSON.stringify(users));
        
        showAlert('User deleted successfully!', 'success');
        loadUsers();
    }
}

// ==================== QR CODE HANDLING ====================
function startQRScanner() {
    qrScanning = true;
    const video = document.getElementById('qr-scanner');
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            video.srcObject = stream;
            video.play();
            scanQRCode(video);
        })
        .catch(err => {
            showAlert('Camera access denied: ' + err.message, 'danger');
        });
}

function stopQRScanner() {
    qrScanning = false;
    const video = document.getElementById('qr-scanner');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
}

function scanQRCode(video) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    function scan() {
        if (!qrScanning) return;
        
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            try {
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                
                if (code) {
                    handleScannedQRCode(code.data);
                    stopQRScanner();
                    return;
                }
            } catch (e) {
                // Continue scanning
            }
        }
        
        requestAnimationFrame(scan);
    }
    
    scan();
}

function handleScannedQRCode(qrData) {
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tool = tools.find(t => t.id == qrData);
    
    if (tool) {
        const scannedInfo = document.getElementById('scannedItemInfo');
        scannedInfo.innerHTML = `
            <strong>Tool Found!</strong><br>
            <strong>Name:</strong> ${tool.name}<br>
            <strong>Brand:</strong> ${tool.brand}<br>
            <strong>Available:</strong> ${tool.availableQty}/${tool.quantity}<br>
            <button class="btn btn-primary mt-2" onclick="borrowScannedTool(${tool.id})">
                <i class="fas fa-plus"></i> Record Borrowing
            </button>
        `;
    } else {
        document.getElementById('scannedItemInfo').innerHTML = `
            <span class="text-danger">Tool not found in database</span>
        `;
    }
}

function borrowScannedTool(toolId) {
    document.getElementById('selectTool').value = toolId;
    new bootstrap.Modal(document.getElementById('addBorrowerModal')).show();
}

function generateQRCode(text) {
    // Using QR Server API for QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text}`;
}

// ==================== UTILITY FUNCTIONS ====================
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    alertContainer.innerHTML += alertHTML;
    
    setTimeout(() => {
        const alertElement = document.getElementById(alertId);
        if (alertElement) {
            alertElement.remove();
        }
    }, 5000);
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('searchTools').addEventListener('keyup', function() {
        filterTools();
    });
    
    document.getElementById('filterByBrand').addEventListener('keyup', function() {
        filterTools();
    });
    
    document.getElementById('searchBorrower').addEventListener('keyup', function() {
        filterBorrowers();
    });
    
    document.getElementById('filterStatus').addEventListener('change', function() {
        filterBorrowers();
    });
    
    document.getElementById('searchUser').addEventListener('keyup', function() {
        filterUsers();
    });
}

function filterTools() {
    const searchValue = document.getElementById('searchTools').value.toLowerCase();
    const brandValue = document.getElementById('filterByBrand').value.toLowerCase();
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tbody = document.getElementById('toolsTable');
    
    tbody.innerHTML = '';
    
    const filtered = tools.filter(tool => {
        return (tool.name.toLowerCase().includes(searchValue) || tool.description.toLowerCase().includes(searchValue)) &&
               (tool.brand.toLowerCase().includes(brandValue) || brandValue === '');
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No tools found</td></tr>';
        return;
    }
    
    filtered.forEach(tool => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="qr-code-container">
                    <img src="${generateQRCode(tool.id)}" alt="QR" style="width: 50px;">
                </div>
            </td>
            <td>${tool.name}</td>
            <td>${tool.brand}</td>
            <td>${tool.description}</td>
            <td><span class="badge bg-success">${tool.availableQty}</span></td>
            <td>${tool.quantity}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editTool(${tool.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTool(${tool.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterBorrowers() {
    const searchValue = document.getElementById('searchBorrower').value.toLowerCase();
    const statusValue = document.getElementById('filterStatus').value;
    const borrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    const tools = JSON.parse(localStorage.getItem('tools')) || [];
    const tbody = document.getElementById('borrowersTable');
    
    tbody.innerHTML = '';
    
    const filtered = borrowers.filter(borrower => {
        const matchesSearch = borrower.borrowerName.toLowerCase().includes(searchValue);
        const matchesStatus = !statusValue || getStatus(borrower) === statusValue;
        return matchesSearch && matchesStatus;
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No records found</td></tr>';
        return;
    }
    
    filtered.forEach(borrower => {
        const tool = tools.find(t => t.id == borrower.toolId);
        const status = getStatus(borrower);
        const statusClass = status === 'active' ? 'badge-active' : status === 'returned' ? 'badge-returned' : 'badge badge-danger';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tool ? tool.name : 'Unknown'}</td>
            <td>${borrower.borrowerName}</td>
            <td>${borrower.reason}</td>
            <td>${new Date(borrower.borrowedDate).toLocaleDateString()}</td>
            <td>${new Date(borrower.borrowedDate).toLocaleTimeString()}</td>
            <td>${borrower.returnedDate ? new Date(borrower.returnedDate).toLocaleDateString() : '-'}</td>
            <td><span class="badge ${statusClass}">${status.toUpperCase()}</span></td>
            <td>
                ${!borrower.returnedDate ? `
                    <button class="btn btn-sm btn-success" onclick="recordReturn(${borrower.id})">
                        <i class="fas fa-check"></i> Return
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-danger" onclick="deleteBorrower(${borrower.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterUsers() {
    const searchValue = document.getElementById('searchUser').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tbody = document.getElementById('usersTable');
    
    tbody.innerHTML = '';
    
    const filtered = users.filter(user => {
        return user.username.toLowerCase().includes(searchValue) ||
               user.fullName.toLowerCase().includes(searchValue) ||
               user.email.toLowerCase().includes(searchValue);
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
        return;
    }
    
    filtered.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td><span class="badge bg-primary">${user.role}</span></td>
            <td><span class="badge bg-success">Active</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        localStorage.removeItem('currentUser');
        window.location.reload();
    }
}
