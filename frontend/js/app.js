// HulamKo Enhanced Application v3.0 - Main JavaScript
// Features: DateTime display, Defective tools, Categories/Locations, Year Acquired,
// Asset Code, Excel Import, Overdue adjustment, User CRUD, Inventory Reporting, Word Export

// ==================== GLOBAL STATE ====================
const appState = {
    currentTab: 'dashboard',
    allTools: [],
    allBorrowers: [],
    allUsers: [],
    activityLog: [],
    damageReports: [],
    toolMovements: [],
    lastUpdate: null,
    isProcessing: false,
    isLoggedIn: false,
    currentUser: null
};

// ==================== DATE/TIME DISPLAY ====================
let dateTimeInterval = null;

function startDateTimeClock() {
    updateDateTimeDisplay();
    dateTimeInterval = setInterval(updateDateTimeDisplay, 1000);
}

function updateDateTimeDisplay() {
    const el = document.getElementById('currentDateTime');
    if (!el) return;
    const now = new Date();
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    };
    el.textContent = now.toLocaleDateString('en-US', options);
}

// ==================== ASSET CODE GENERATOR ====================
function generateAssetCode() {
    const prefix = 'HK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${prefix}-${timestamp}-${random}`;
    const input = document.getElementById('toolAssetCode');
    if (input) input.value = code;
    return code;
}

function generateAssetCodeValue() {
    const prefix = 'HK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('HulamKo Application v3.0 Initializing...');
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser.trim() !== '') {
        appState.isLoggedIn = true;
        appState.currentUser = savedUser;
        showMainApp();
        loadApplicationState();
        setupEventListeners();
        updateDashboard();
        renderTools();
        updateToolSelect();
        updateInlineToolSelect();
        renderBorrowers();
        renderUsers();
        setupAutosave();
        startDateTimeClock();
        initReportYearFilter();
        console.log('HulamKo Ready!');
    } else {
        showLoginPage();
        // Enter-key login support (before setupEventListeners which runs post-login)
        const loginPw = document.getElementById('loginPassword');
        const loginEm = document.getElementById('loginEmail');
        if (loginPw) loginPw.addEventListener('keypress', function(e) { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } });
        if (loginEm) loginEm.addEventListener('keypress', function(e) { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } });
    }
});

// ==================== AUTHENTICATION ====================
function togglePasswordVisibility() {
    const passwordField = document.getElementById('loginPassword');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    if (dateTimeInterval) clearInterval(dateTimeInterval);
}

function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    const userElement = document.getElementById('currentUser');
    if (userElement) userElement.textContent = appState.currentUser.split('@')[0];
    startDateTimeClock();
}

function handleLogin() {
    try {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (!email || !password) { showAlert('Please enter both email and password', 'warning'); return; }
        if (!email.includes('@')) { showAlert('Please enter a valid email address', 'warning'); return; }
        const validEmail = 'admin@hulamko.com';
        const validPassword = 'password123';
        if (email !== validEmail || password !== validPassword) {
            showAlert('Invalid email or password. Use admin@hulamko.com / password123', 'danger');
            return;
        }
        appState.isLoggedIn = true;
        appState.currentUser = email;
        localStorage.setItem('currentUser', email);
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
        initReportYearFilter();
        setTimeout(() => { showMainApp(); }, 600);
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed: ' + error.message, 'danger');
    }
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
    if (!email || !email.includes('@')) { showAlert('Please enter a valid email address', 'warning'); return; }
    showAlert('Password reset link has been sent to ' + email, 'success');
    setTimeout(() => { backToLogin(); }, 2000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        appState.isLoggedIn = false;
        appState.currentUser = null;
        showAlert('You have been logged out successfully', 'info');
        setTimeout(() => { window.location.reload(); }, 1000);
    }
}

// ==================== STATE MANAGEMENT ====================
function loadApplicationState() {
    appState.allTools = JSON.parse(localStorage.getItem('tools')) || [];
    appState.allBorrowers = JSON.parse(localStorage.getItem('borrowers')) || [];
    appState.allUsers = JSON.parse(localStorage.getItem('users')) || [];
    appState.activityLog = JSON.parse(localStorage.getItem('activity')) || [];
    appState.damageReports = JSON.parse(localStorage.getItem('damageReports')) || [];
    appState.toolMovements = JSON.parse(localStorage.getItem('toolMovements')) || [];
    appState.lastUpdate = localStorage.getItem('lastUpdate');
}

function saveApplicationState() {
    localStorage.setItem('tools', JSON.stringify(appState.allTools));
    localStorage.setItem('borrowers', JSON.stringify(appState.allBorrowers));
    localStorage.setItem('users', JSON.stringify(appState.allUsers));
    localStorage.setItem('activity', JSON.stringify(appState.activityLog));
    localStorage.setItem('damageReports', JSON.stringify(appState.damageReports));
    localStorage.setItem('toolMovements', JSON.stringify(appState.toolMovements));
    localStorage.setItem('lastUpdate', new Date().toISOString());
}

function setupAutosave() {
    setInterval(() => { if (!appState.isProcessing) saveApplicationState(); }, 30000);
}

function addActivity(action) {
    appState.activityLog.unshift({ action: action, timestamp: new Date().toISOString() });
    if (appState.activityLog.length > 100) appState.activityLog.pop();
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    const totalTools = appState.allTools.length;
    const activeBorrowings = appState.allBorrowers.filter(b => !b.returned).length;
    const overdue = appState.allBorrowers.filter(b => !b.returned && new Date(b.return_date) < new Date()).length;
    const defective = appState.allTools.filter(t => t.condition === 'Needs Repair' || t.condition === 'Damaged' || t.condition === 'Lost').length;

    document.getElementById('totalTools').textContent = totalTools;
    document.getElementById('activeBorrowings').textContent = activeBorrowings;
    document.getElementById('overdueItems').textContent = overdue;
    document.getElementById('defectiveTools').textContent = defective;
    document.getElementById('totalUsers').textContent = appState.allUsers.length;

    renderDefectiveTools();
    renderActivity();
    initMonthlyRecordMonth();
    renderMonthlyRecord();
    renderTopBorrowersByCourseChart();
    checkOverdueAndNotify();
}

function renderDefectiveTools() {
    const list = document.getElementById('defectiveToolsList');
    const defective = appState.allTools.filter(t => t.condition === 'Needs Repair' || t.condition === 'Damaged' || t.condition === 'Lost');
    if (defective.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><h4>No Issues Found</h4><p>All tools are in good condition</p></div>';
        return;
    }
    list.innerHTML = '<div class="table-responsive"><table class="table table-bordered table-striped"><thead class="table-danger"><tr><th>Item</th><th>Brand</th><th>Category</th><th>Location</th><th>Status</th><th>Asset Code</th></tr></thead><tbody>' +
        defective.map(t => `<tr>
            <td>${escapeHtml(t.name)}</td>
            <td>${escapeHtml(t.brand) || 'N/A'}</td>
            <td>${escapeHtml(t.category) || 'N/A'}</td>
            <td>${escapeHtml(t.location) || 'N/A'}</td>
            <td><span class="badge bg-danger">${escapeHtml(t.condition)}</span></td>
            <td>${escapeHtml(t.assetCode) || 'N/A'}</td>
        </tr>`).join('') + '</tbody></table></div>';
}

function renderActivity() {
    const activityDiv = document.getElementById('recentActivity');
    if (appState.activityLog.length === 0) {
        activityDiv.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h4>No Activity Yet</h4><p>Start managing your inventory</p></div>';
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
    if (!form.checkValidity()) { showAlert('Please fill in all required fields', 'warning'); return false; }
    const category = document.getElementById('toolCategory').value.trim();
    if (!category) { showAlert('Please select a category', 'warning'); return false; }
    const location = document.getElementById('toolLocation').value.trim();
    if (!location) { showAlert('Please select a location', 'warning'); return false; }

    const loadingId = showLoadingState('Adding tool...');
    appState.isProcessing = true;

    try {
        const imageFile = document.getElementById('toolImage');
        let assetCode = document.getElementById('toolAssetCode').value || generateAssetCodeValue();

        const buildToolData = (imageData) => ({
            id: getNextId(appState.allTools),
            name: document.getElementById('toolName').value.trim(),
            brand: document.getElementById('toolBrand').value.trim(),
            description: document.getElementById('toolDescription').value.trim(),
            quantity: parseInt(document.getElementById('toolQuantity').value),
            category: category,
            location: location,
            condition: document.getElementById('toolCondition').value || 'Good Condition',
            yearAcquired: document.getElementById('toolYearAcquired').value || new Date().toISOString().split('T')[0],
            assetCode: assetCode,
            previousQty: parseInt(document.getElementById('toolPreviousQty').value) || 0,
            actionSincePrev: document.getElementById('toolAction').value || '',
            image: imageData || null,
            createdDate: new Date().toISOString()
        });

        const finishSave = (toolData) => {
            if (!toolData.name) { hideLoadingState(loadingId); showAlert('Tool name is required', 'warning'); appState.isProcessing = false; return; }
            setTimeout(() => {
                appState.allTools.push(toolData);
                // Record tool movement (Added) with date/time
                appState.toolMovements.push({
                    id: getNextId(appState.toolMovements),
                    tool_id: toolData.id,
                    tool_name: toolData.name,
                    movement_type: 'Added',
                    quantity_changed: toolData.quantity,
                    reason: 'New tool added to inventory',
                    remarks: '',
                    movement_date: new Date().toISOString()
                });
                addActivity(`Tool "${toolData.name}" added (${toolData.assetCode})`);
                saveApplicationState();
                hideLoadingState(loadingId);
                form.reset();
                document.getElementById('toolAssetCode').value = '';
                clearImagePreview();
                bootstrap.Modal.getInstance(document.getElementById('addToolModal')).hide();
                showAlert(`Tool "${toolData.name}" added successfully!`, 'success');
                renderTools();
                updateDashboard();
                updateToolSelect();
                updateInlineToolSelect();
                appState.isProcessing = false;
            }, 400);
        };

        if (imageFile.files.length > 0) {
            const reader = new FileReader();
            reader.onload = function(e) { finishSave(buildToolData(e.target.result)); };
            reader.readAsDataURL(imageFile.files[0]);
        } else {
            finishSave(buildToolData(null));
        }
    } catch (error) {
        hideLoadingState(loadingId);
        handleError(error, 'Failed to add tool');
        appState.isProcessing = false;
    }
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
    document.getElementById('editToolLocation').value = tool.location || '';
    document.getElementById('editToolYearAcquired').value = tool.yearAcquired || '';
    document.getElementById('editToolCondition').value = tool.condition || 'Good Condition';
    document.getElementById('editToolAssetCode').value = tool.assetCode || '';
    document.getElementById('editToolPreviousQty').value = tool.previousQty || 0;
    document.getElementById('editToolAction').value = tool.actionSincePrev || '';
}

function updateTool() {
    const toolId = parseInt(document.getElementById('editToolId').value);
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) { showAlert('Tool not found', 'danger'); return false; }

    tool.name = document.getElementById('editToolName').value.trim();
    tool.brand = document.getElementById('editToolBrand').value.trim();
    tool.quantity = parseInt(document.getElementById('editToolQuantity').value);
    tool.category = document.getElementById('editToolCategory').value;
    tool.location = document.getElementById('editToolLocation').value;
    tool.yearAcquired = document.getElementById('editToolYearAcquired').value;
    tool.condition = document.getElementById('editToolCondition').value;
    tool.previousQty = parseInt(document.getElementById('editToolPreviousQty').value) || 0;
    tool.actionSincePrev = document.getElementById('editToolAction').value || '';

    addActivity(`Tool "${tool.name}" updated`);
    saveApplicationState();
    bootstrap.Modal.getInstance(document.getElementById('editToolModal')).hide();
    showAlert(`"${tool.name}" updated successfully!`, 'success');
    renderTools();
    updateDashboard();
    return false;
}

function deleteTool(toolId, reason, remarks) {
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) return;
    const activeBorrowings = appState.allBorrowers.filter(b => b.tool_id === toolId && !b.returned);
    if (activeBorrowings.length > 0) {
        showAlert(`Cannot delete "${tool.name}" — it has ${activeBorrowings.length} active borrowing(s). Return items first.`, 'danger');
        return;
    }
    const loadingId = showLoadingState('Removing tool...');
    setTimeout(() => {
        try {
            // Record tool movement (Removed/Pulled Out) with date/time and reason
            appState.toolMovements.push({
                id: getNextId(appState.toolMovements),
                tool_id: tool.id,
                tool_name: tool.name,
                movement_type: 'Pulled Out',
                quantity_changed: tool.quantity,
                reason: reason || 'Removed',
                remarks: remarks || '',
                movement_date: new Date().toISOString()
            });
            // Auto-file a damage report if reason is Damaged, For Repair, or Lost
            if (reason === 'Damaged' || reason === 'For Repair' || reason === 'Lost') {
                appState.damageReports.push({
                    id: getNextId(appState.damageReports),
                    tool_id: tool.id,
                    tool_name: tool.name,
                    reported_by: appState.currentUser ? appState.currentUser.split('@')[0] : 'Admin',
                    damage_type: reason,
                    severity: reason === 'Lost' ? 'Severe' : 'Moderate',
                    description: remarks || `Tool removed from inventory - ${reason}`,
                    date_reported: new Date().toISOString(),
                    status: 'Pending',
                    resolution_notes: '',
                    resolved_date: null
                });
            }
            appState.allTools = appState.allTools.filter(t => t.id !== toolId);
            addActivity(`Tool "${tool.name}" removed (Reason: ${reason}${remarks ? ', ' + remarks : ''})`);
            saveApplicationState();
            hideLoadingState(loadingId);
            showAlert(`"${tool.name}" removed successfully! (Reason: ${reason})`, 'success');
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
    const categoryTerm = (document.getElementById('toolCategoryFilter')?.value || '').trim();
    const locationTerm = (document.getElementById('toolLocationFilter')?.value || '').trim();

    const filtered = appState.allTools.filter(tool => {
        const matchesCategory = !categoryTerm || (tool.category || '') === categoryTerm;
        const matchesLocation = !locationTerm || (tool.location || '') === locationTerm;
        const matchesSearch = !searchTerm ||
            tool.name.toLowerCase().includes(searchTerm) ||
            (tool.brand || '').toLowerCase().includes(searchTerm) ||
            (tool.description || '').toLowerCase().includes(searchTerm) ||
            (tool.assetCode || '').toLowerCase().includes(searchTerm);
        return matchesCategory && matchesLocation && matchesSearch;
    });
    renderFilteredTools(filtered);
}

function renderTools() { renderFilteredTools(appState.allTools); }

function renderFilteredTools(tools) {
    const toolsList = document.getElementById('toolsList');
    if (tools.length === 0) {
        toolsList.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><h4>No Tools Found</h4><p>${appState.allTools.length === 0 ? 'Add your first tool' : 'Try a different search'}</p></div>`;
        return;
    }

    // TABLE FORMAT for full-width display
    toolsList.innerHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover tools-table">
                <thead class="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Asset Code</th>
                        <th>Item Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Qty</th>
                        <th>Condition</th>
                        <th>Year Acquired</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${tools.map((tool, idx) => {
                        const conditionClass = (tool.condition === 'Needs Repair' || tool.condition === 'Damaged' || tool.condition === 'Lost') ? 'bg-danger' : 'bg-success';
                        return `<tr>
                            <td>${idx + 1}</td>
                            <td><code>${escapeHtml(tool.assetCode) || 'N/A'}</code></td>
                            <td><strong>${escapeHtml(tool.name)}</strong>${tool.description ? '<br><small class="text-muted">' + escapeHtml(tool.description) + '</small>' : ''}</td>
                            <td>${escapeHtml(tool.brand) || 'N/A'}</td>
                            <td><span class="badge bg-info">${tool.category || 'N/A'}</span></td>
                            <td>${tool.location || 'N/A'}</td>
                            <td><span class="badge bg-primary">${tool.quantity}</span></td>
                            <td><span class="badge ${conditionClass}">${tool.condition || 'Good Condition'}</span></td>
                            <td>${tool.yearAcquired ? new Date(tool.yearAcquired).toLocaleDateString() : 'N/A'}</td>
                            <td>
                                <div class="btn-group btn-group-sm">
                                    <button class="btn btn-primary btn-sm" onclick="editToolForm(${tool.id})" data-bs-toggle="modal" data-bs-target="#editToolModal" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn btn-info btn-sm" onclick="exportQRCode(${tool.id})" title="Barcode"><i class="fas fa-barcode"></i></button>
                                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteTool(${tool.id})" title="Delete"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        <div class="text-muted mt-2"><strong>Total Items: ${tools.length}</strong></div>
    `;
}

// ==================== EXCEL IMPORT ====================
function importToolsFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const loadingId = showLoadingState('Importing from Excel...');
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet);

            if (jsonData.length === 0) {
                hideLoadingState(loadingId);
                showAlert('No data found in the Excel file', 'warning');
                return;
            }

            let imported = 0;
            jsonData.forEach(row => {
                const name = row['Name'] || row['name'] || row['Item Name'] || row['Item'] || row['ITEM NAME'] || row['item_name'] || '';
                if (!name.trim()) return;

                const toolData = {
                    id: getNextId(appState.allTools),
                    name: name.trim(),
                    brand: (row['Brand'] || row['brand'] || row['BRAND'] || '').toString().trim(),
                    description: (row['Description'] || row['description'] || row['DESCRIPTION'] || '').toString().trim(),
                    quantity: parseInt(row['Quantity'] || row['quantity'] || row['QTY'] || row['Qty'] || 1) || 1,
                    category: (row['Category'] || row['category'] || row['CATEGORY'] || 'Equipments').toString().trim(),
                    location: (row['Location'] || row['location'] || row['LOCATION'] || '').toString().trim(),
                    condition: (row['Condition'] || row['condition'] || row['CONDITION'] || row['Status'] || row['STATUS'] || 'Good Condition').toString().trim(),
                    yearAcquired: (row['Year Acquired'] || row['year_acquired'] || row['Date'] || new Date().toISOString().split('T')[0]).toString().trim(),
                    assetCode: (row['Asset Code'] || row['asset_code'] || row['Barcode'] || generateAssetCodeValue()).toString().trim(),
                    previousQty: parseInt(row['Previous Qty'] || row['Prev Qty'] || row['PREVIOUS QTY'] || 0) || 0,
                    actionSincePrev: (row['Action'] || row['action'] || row['Action Since Previous'] || '').toString().trim(),
                    image: null,
                    createdDate: new Date().toISOString()
                };
                appState.allTools.push(toolData);
                imported++;
            });

            saveApplicationState();
            hideLoadingState(loadingId);
            showAlert(`Successfully imported ${imported} tools from Excel!`, 'success');
            addActivity(`Imported ${imported} tools from Excel file`);
            renderTools();
            updateDashboard();
            updateToolSelect();
            updateInlineToolSelect();
        } catch (error) {
            hideLoadingState(loadingId);
            showAlert('Error reading Excel file: ' + error.message, 'danger');
            console.error('Excel import error:', error);
        }
    };

    reader.readAsArrayBuffer(file);
    event.target.value = '';
}

// ==================== BORROWERS MANAGEMENT ====================
function saveBorrower() {
    const form = document.getElementById('borrowerForm');
    if (!form.checkValidity()) { showAlert('Please fill in all required fields', 'warning'); return false; }
    const loadingId = showLoadingState('Recording borrowing...');
    try {
        const toolId = parseInt(document.getElementById('borrowerTool').value);
        const tool = appState.allTools.find(t => t.id === toolId);
        if (!tool) { hideLoadingState(loadingId); showAlert('Please select a valid tool', 'warning'); return false; }
        if (tool.quantity <= 0) { hideLoadingState(loadingId); showAlert(`"${tool.name}" is not available`, 'warning'); return false; }

        const studentId = document.getElementById('borrowerStudentId').value.trim();
        const email = document.getElementById('borrowerEmail').value.trim();
        if (!studentId) { hideLoadingState(loadingId); showAlert('Student ID / Barcode is required', 'warning'); return false; }
        if (!email) { hideLoadingState(loadingId); showAlert('Email address is required', 'warning'); return false; }

        const borrowerData = {
            id: getNextId(appState.allBorrowers),
            tool_id: toolId,
            student_id: studentId,
            email: email,
            borrower_name: document.getElementById('borrowerName').value.trim(),
            course: document.getElementById('borrowerCourse').value.trim(),
            year: document.getElementById('borrowerYear').value.trim(),
            borrow_date: document.getElementById('borrowDate').value,
            return_date: document.getElementById('returnDate').value,
            reason: document.getElementById('borrowReason').value.trim(),
            returned: false,
            returned_date: null,
            return_remarks: '',
            overdue_notified: false
        };

        if (!borrowerData.borrower_name) { hideLoadingState(loadingId); showAlert('Borrower name is required', 'warning'); return false; }
        if (new Date(borrowerData.return_date) <= new Date(borrowerData.borrow_date)) { hideLoadingState(loadingId); showAlert('Return date must be after borrow date', 'warning'); return false; }

        setTimeout(() => {
            tool.quantity -= 1;
            appState.allBorrowers.push(borrowerData);
            addActivity(`${borrowerData.borrower_name} borrowed "${tool.name}"`);
            saveApplicationState();
            hideLoadingState(loadingId);
            form.reset();
            bootstrap.Modal.getInstance(document.getElementById('addBorrowerModal')).hide();
            showAlert('Borrowing recorded successfully!', 'success');
            renderBorrowers(); renderTools(); updateDashboard(); updateToolSelect(); updateInlineToolSelect();
        }, 400);
    } catch (error) { hideLoadingState(loadingId); handleError(error, 'Failed to record borrowing'); }
    return false;
}

function returnBorrower(borrowerId, returnRemarks, returnCondition) {
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower || borrower.returned) return;
    const tool = appState.allTools.find(t => t.id === borrower.tool_id);
    borrower.returned = true;
    borrower.returned_date = new Date().toISOString();
    borrower.return_remarks = returnRemarks || '';
    if (tool) tool.quantity += 1;
    // If returned damaged, auto-file a damage report
    if (returnCondition && returnCondition !== 'Good Condition' && tool) {
        appState.damageReports.push({
            id: getNextId(appState.damageReports),
            tool_id: tool.id,
            tool_name: tool.name,
            reported_by: borrower.borrower_name,
            damage_type: returnCondition === 'Damaged' ? 'Damaged' : 'For Repair',
            severity: returnCondition === 'Damaged' ? 'Moderate' : 'Minor',
            description: `Returned ${returnCondition.toLowerCase()} by ${borrower.borrower_name}. Remarks: ${returnRemarks}`,
            date_reported: new Date().toISOString(),
            status: 'Pending',
            resolution_notes: '',
            resolved_date: null
        });
        addActivity(`DAMAGE REPORTED: "${tool.name}" returned ${returnCondition.toLowerCase()} by ${borrower.borrower_name}`);
    }
    addActivity(`${borrower.borrower_name} returned "${tool?.name || 'item'}"${returnRemarks ? ' - ' + returnRemarks : ''}`);
    saveApplicationState();
    showAlert('Item returned successfully!', 'success');
    renderBorrowers(); renderTools(); updateDashboard(); updateToolSelect(); updateInlineToolSelect();
}

// ==================== OVERDUE ADJUSTMENT ====================
function openAdjustOverdue(borrowerId) {
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower) return;
    const returnDate = new Date(borrower.return_date);
    const now = new Date();
    const diffTime = now - returnDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    document.getElementById('adjustBorrowerId').value = borrower.id;
    document.getElementById('adjustCurrentDate').value = returnDate.toLocaleDateString();
    document.getElementById('adjustDaysOverdue').value = diffDays + ' day(s) overdue';
    document.getElementById('adjustNewDate').value = '';

    bootstrap.Modal.getOrCreateInstance(document.getElementById('adjustOverdueModal')).show();
}

function saveAdjustedDate() {
    const borrowerId = parseInt(document.getElementById('adjustBorrowerId').value);
    const newDate = document.getElementById('adjustNewDate').value;
    if (!newDate) { showAlert('Please select a new return date', 'warning'); return; }

    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower) return;

    const oldDate = borrower.return_date;
    borrower.return_date = newDate;
    addActivity(`Adjusted return date for ${borrower.borrower_name}: ${oldDate} -> ${newDate}`);
    saveApplicationState();
    bootstrap.Modal.getInstance(document.getElementById('adjustOverdueModal')).hide();
    showAlert('Return date updated successfully!', 'success');
    renderBorrowers(); updateDashboard();
}

function calculateOverdueDays(returnDateStr) {
    const returnDate = new Date(returnDateStr);
    const now = new Date();
    if (now <= returnDate) return 0;
    return Math.ceil((now - returnDate) / (1000 * 60 * 60 * 24));
}

function filterBorrowers() {
    const searchTerm = (document.getElementById('borrowerSearch')?.value || '').toLowerCase();
    const statusTerm = document.getElementById('filterStatus')?.value || '';
    const filtered = appState.allBorrowers.filter(b => {
        const tool = appState.allTools.find(t => t.id === b.tool_id);
        const matchesSearch = b.borrower_name.toLowerCase().includes(searchTerm) || (tool && tool.name.toLowerCase().includes(searchTerm));
        let status = b.returned ? 'returned' : (new Date(b.return_date) < new Date() ? 'overdue' : 'active');
        return matchesSearch && (!statusTerm || status === statusTerm);
    });
    renderFilteredBorrowers(filtered);
}

function renderBorrowers() { renderFilteredBorrowers(appState.allBorrowers); }

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
        const overdueDays = isOverdue ? calculateOverdueDays(borrower.return_date) : 0;
        let status = borrower.returned ? 'Returned' : isOverdue ? 'Overdue' : 'Active';
        let badgeClass = borrower.returned ? 'badge-success' : isOverdue ? 'badge-danger' : 'badge-warning';

        return `
            <div class="borrower-card">
                <div class="row">
                    <div class="col-md-8">
                        <h4>${escapeHtml(borrower.borrower_name)}</h4>
                        <div class="detail-row"><span class="detail-label">Student ID:</span><span class="detail-value"><code>${escapeHtml(borrower.student_id) || 'N/A'}</code></span></div>
                        <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${escapeHtml(borrower.email) || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Course:</span><span class="detail-value">${escapeHtml(borrower.course) || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Year:</span><span class="detail-value">${escapeHtml(borrower.year) || 'N/A'}</span></div>
                        <div class="detail-row"><span class="detail-label">Tool:</span><span class="detail-value">${escapeHtml(tool?.name) || 'Unknown'}</span></div>
                        <div class="detail-row"><span class="detail-label">Borrow Date:</span><span class="detail-value">${new Date(borrower.borrow_date).toLocaleDateString()}</span></div>
                        <div class="detail-row"><span class="detail-label">Return Date:</span><span class="detail-value">${returnDate.toLocaleDateString()}</span></div>
                        ${isOverdue ? `<div class="detail-row"><span class="detail-label" style="color:red;">Days Overdue:</span><span class="detail-value" style="color:red; font-weight:bold;">${overdueDays} day(s)</span></div>` : ''}
                        ${borrower.reason ? `<div class="detail-row"><span class="detail-label">Reason:</span><span class="detail-value">${escapeHtml(borrower.reason)}</span></div>` : ''}
                        ${borrower.return_remarks ? `<div class="detail-row"><span class="detail-label">Return Remarks:</span><span class="detail-value"><em>${escapeHtml(borrower.return_remarks)}</em></span></div>` : ''}
                        ${!borrower.returned ? `
                        <div class="action-buttons">
                            <button class="btn btn-success btn-small" onclick="confirmReturn(${borrower.id})"><i class="fas fa-check"></i> Mark Returned</button>
                            ${isOverdue ? `<button class="btn btn-warning btn-small" onclick="openAdjustOverdue(${borrower.id})"><i class="fas fa-calendar-alt"></i> Adjust Date</button>` : ''}
                            ${isOverdue && borrower.email ? `<button class="btn btn-danger btn-small" onclick="sendOverdueEmail(${borrower.id})"><i class="fas fa-envelope"></i> Send Overdue Notice</button>` : ''}
                        </div>
                        ` : ''}
                    </div>
                    <div class="col-md-4 text-end">
                        <span class="badge ${badgeClass}">${status}</span>
                        ${isOverdue ? `<br><small style="color:red; font-weight:600;">${overdueDays} day(s) overdue</small>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== USERS MANAGEMENT (Add/Edit/Delete) ====================
function saveUser() {
    const form = document.getElementById('userForm');
    if (!form.checkValidity()) { showAlert('Please fill in all required fields', 'warning'); return false; }
    const username = document.getElementById('userUsername').value.trim();
    if (appState.allUsers.some(u => u.username === username)) { showAlert('Username already exists', 'danger'); return false; }

    const userData = {
        id: getNextId(appState.allUsers),
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
    renderUsers(); updateDashboard();
    return false;
}

function editUserForm(userId) {
    const user = appState.allUsers.find(u => u.id === userId);
    if (!user) return;
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserUsername').value = user.username;
    document.getElementById('editUserRole').value = user.role;
}

function updateUser() {
    const userId = parseInt(document.getElementById('editUserId').value);
    const user = appState.allUsers.find(u => u.id === userId);
    if (!user) { showAlert('User not found', 'danger'); return false; }

    user.name = document.getElementById('editUserName').value.trim();
    user.email = document.getElementById('editUserEmail').value.trim();
    user.username = document.getElementById('editUserUsername').value.trim();
    user.role = document.getElementById('editUserRole').value;

    addActivity(`User "${user.name}" updated`);
    saveApplicationState();
    bootstrap.Modal.getInstance(document.getElementById('editUserModal')).hide();
    showAlert(`User "${user.name}" updated successfully!`, 'success');
    renderUsers(); updateDashboard();
    return false;
}

function deleteUser(userId) {
    const user = appState.allUsers.find(u => u.id === userId);
    if (!user) return;
    appState.allUsers = appState.allUsers.filter(u => u.id !== userId);
    addActivity(`User "${user.name}" deleted`);
    saveApplicationState();
    showAlert(`User "${user.name}" deleted successfully!`, 'success');
    renderUsers(); updateDashboard();
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

function renderUsers() { renderFilteredUsers(appState.allUsers); }

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
                    <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${user.email}</span></div>
                    <div class="detail-row"><span class="detail-label">Username:</span><span class="detail-value">@${user.username}</span></div>
                    <div class="action-buttons">
                        <button class="btn btn-primary btn-small" onclick="editUserForm(${user.id})" data-bs-toggle="modal" data-bs-target="#editUserModal"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-danger btn-small" onclick="confirmDeleteUser(${user.id})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
                <div class="col-md-4 text-end">
                    <span class="badge bg-success">${user.role}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== INVENTORY REPORTING ====================
function initReportYearFilter() {
    const sel = document.getElementById('reportYearFilter');
    if (!sel) return;
    const currentYear = new Date().getFullYear();
    sel.innerHTML = '';
    for (let y = currentYear; y >= currentYear - 10; y--) {
        sel.innerHTML += `<option value="${y}">${y}</option>`;
    }
}

function generateInventoryReport() {
    const period = document.getElementById('reportPeriodFilter').value;
    const year = parseInt(document.getElementById('reportYearFilter').value);
    const officeLocation = document.getElementById('reportOfficeLocation').value;

    let filteredTools = appState.allTools;

    // Filter by location if specified
    if (officeLocation) {
        filteredTools = filteredTools.filter(tool => (tool.location || '') === officeLocation);
    }

    if (period !== 'all') {
        filteredTools = filteredTools.filter(tool => {
            if (!tool.yearAcquired && !tool.createdDate) return true;
            const dateStr = tool.yearAcquired || tool.createdDate;
            const d = new Date(dateStr);
            const toolYear = d.getFullYear();
            const toolMonth = d.getMonth() + 1; // 1-12

            if (period === 'yearly') return toolYear === year;
            if (period === '1st_sem') return toolYear === year && toolMonth >= 8 && toolMonth <= 12;
            if (period === '2nd_sem') return toolYear === year && toolMonth >= 1 && toolMonth <= 5;
            if (period === 'summer') return toolYear === year && (toolMonth === 6 || toolMonth === 7);
            return true;
        });
    }

    const tbody = document.getElementById('reportTableBody');
    if (filteredTools.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" class="text-center">No tools found for the selected criteria.</td></tr>';
    } else {
        // SMCTI form format: Prev Qty | Items | Current Qty | Brand/Spec | Status checkmarks | Action checkmarks
        tbody.innerHTML = filteredTools.map(t => {
            const cond = t.condition || 'Good Condition';
            const action = t.actionSincePrev || '';
            return `<tr>
                <td class="text-center">${t.previousQty || ''}</td>
                <td><strong>${escapeHtml(t.name)}</strong></td>
                <td class="text-center">${t.quantity}</td>
                <td>${escapeHtml(t.brand || '')}${t.description ? ' ' + escapeHtml(t.description) : ''}</td>
                <td class="text-center">${cond === 'Good Condition' ? '✓' : ''}</td>
                <td class="text-center">${cond === 'Needs Repair' ? '✓' : ''}</td>
                <td class="text-center">${cond === 'Lost' ? '✓' : ''}</td>
                <td class="text-center">${cond === 'Damaged' ? '✓' : ''}</td>
                <td class="text-center">${action === 'Newly Acquired' ? '✓' : ''}</td>
                <td class="text-center">${action === 'Removed' ? '✓' : ''}</td>
                <td class="text-center">${action === 'Transferred' ? '✓' : ''}</td>
                <td class="text-center">${action === 'Disposed' ? '✓' : ''}</td>
            </tr>`;
        }).join('');
    }

    // Set report date if empty
    const reportDateEl = document.getElementById('reportDate');
    if (reportDateEl && !reportDateEl.value) {
        reportDateEl.value = new Date().toISOString().split('T')[0];
    }

    document.getElementById('inventoryReportResult').style.display = 'block';
    showAlert(`Inventory report generated: ${filteredTools.length} total items listed`, 'success');
}

// ==================== EXPORT TO WORD (SMCTI INVENTORY FORM FORMAT) ====================
function exportReportToWord() {
    const reportBody = document.getElementById('reportTableBody');
    if (!reportBody || reportBody.children.length === 0) {
        showAlert('Please generate an inventory report first', 'warning');
        return;
    }

    // Get form header values
    const sy = document.getElementById('reportSY')?.value || '2024-2025';
    const division = document.getElementById('reportDivision')?.value || 'Administration';
    const deptLevel = document.getElementById('reportDeptLevel')?.value || 'Higher Education';
    const department = document.getElementById('reportDepartment')?.value || 'ICT/COLLEGE';
    const officeLocation = document.getElementById('reportOfficeLocation')?.value || '';
    const reportDate = document.getElementById('reportDate')?.value || new Date().toISOString().split('T')[0];

    // Signatories
    const preparedBy = document.getElementById('sigPreparedBy').value || '________________________';
    const preparedByTitle = document.getElementById('sigPreparedByTitle')?.value || '';
    const verifiedBy = document.getElementById('sigVerifiedBy').value || '________________________';
    const verifiedByTitle = document.getElementById('sigVerifiedByTitle')?.value || '';
    const notedBy = document.getElementById('sigNotedBy').value || '________________________';
    const notedByTitle = document.getElementById('sigNotedByTitle')?.value || '';

    // Format date
    const formattedDate = new Date(reportDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Division checkmarks
    const divAdmin = division === 'Administration' ? '(✓)' : '( )';
    const divAcademic = division === 'Academic' ? '(✓)' : '( )';
    const divFinance = division === 'Finance' ? '(✓)' : '( )';
    const deptHigher = deptLevel === 'Higher Education' ? '(✓)' : '( )';
    const deptBasic = deptLevel === 'Basic Education' ? '(✓)' : '( )';

    // Build table rows from report data
    let tableRows = '';
    const rows = reportBody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 12) {
            tableRows += `<tr>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[0].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; font-size:9pt; font-weight:bold;">${cells[1].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[2].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; font-size:9pt;">${cells[3].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[4].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[5].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[6].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[7].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[8].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[9].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[10].textContent}</td>
                <td style="border:1px solid #000; padding:4px 6px; text-align:center; font-size:9pt;">${cells[11].textContent}</td>
            </tr>`;
        }
    });

    // Add empty rows to fill the page (like the real form)
    const emptyRowsNeeded = Math.max(0, 25 - rows.length);
    for (let i = 0; i < emptyRowsNeeded; i++) {
        tableRows += `<tr>
            <td style="border:1px solid #000; padding:4px 6px; height:22px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
            <td style="border:1px solid #000; padding:4px 6px;">&nbsp;</td>
        </tr>`;
    }

    const htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8">
    <style>
        @page { size: landscape; margin: 0.5in 0.5in 0.5in 0.5in; }
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
        .header-table { width: 100%; border: none; margin-bottom: 10px; }
        .header-table td { border: none; vertical-align: top; }
        .school-name { font-size: 14pt; font-weight: bold; }
        .office-name { font-size: 9pt; font-weight: bold; }
        .address-line { font-size: 8pt; color: #333; }
        .motto { font-size: 9pt; font-style: italic; }
        .form-title { text-align: center; font-size: 12pt; font-weight: bold; margin: 8px 0 3px 0; }
        .form-sy { text-align: center; font-size: 10pt; margin-bottom: 10px; }
        .division-line { font-size: 9pt; margin-bottom: 2px; }
        .dept-line { font-size: 9pt; margin-bottom: 8px; }
        .smcti-badge { text-align: center; font-weight: bold; border: 2px solid #1a3a6b; padding: 5px 10px; background: #1a3a6b; color: white; font-size: 10pt; }
        .smcti-badge div { font-size: 8pt; margin-top: 2px; }
    </style>
    </head>
    <body>
        <!-- HEADER -->
        <table class="header-table" style="border:none; width:100%;">
            <tr style="border:none;">
                <td style="border:none; width:10%; vertical-align:middle; text-align:center;">
                    <div style="width:60px; height:60px; border:2px solid #1a3a6b; border-radius:50%; text-align:center; line-height:56px; font-size:8pt; font-weight:bold; color:#1a3a6b; margin: 0 auto;">SMCTI<br>SEAL</div>
                </td>
                <td style="border:none; width:65%; padding-left:10px;">
                    <div class="school-name">ST. MARY'S COLLEGE OF TAGUM, INC</div>
                    <div class="office-name">OFFICE OF THE PROPERTY CUSTODIAN</div>
                    <div class="address-line">National Highway, Tagum City, 8100 Davao del Norte, Philippines</div>
                    <div class="address-line">Email Address: propertycustodian@smctagum.edu.ph</div>
                    <div class="motto"><em>Quality Transformative Ignacian Marian Education</em></div>
                </td>
                <td style="border:none; width:25%; text-align:right; vertical-align:middle;">
                    <div style="display:inline-block; border:2px solid #1a3a6b; padding:8px 15px; text-align:center;">
                        <div style="font-weight:bold; font-size:12pt; letter-spacing:3px; color:#1a3a6b;">S M C T I</div>
                        <div style="font-weight:bold; font-size:12pt; letter-spacing:3px; color:#1a3a6b;">Q T I M E</div>
                        <div style="font-size:7pt; color:#333; margin-top:3px;">Faith &bull; Excellence &bull; Service</div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- FORM TITLE -->
        <div class="form-title">INVENTORY FORM</div>
        <div class="form-sy">SY ${escapeHtml(sy)}</div>

        <!-- DIVISION / DEPARTMENT LINES -->
        <table style="border:none; width:100%; font-size:9pt; margin-bottom:5px;">
            <tr style="border:none;">
                <td style="border:none; width:50%;">Division (✓):&nbsp;&nbsp; ${divAdmin} Administration &nbsp;&nbsp; ${divAcademic} Academic &nbsp;&nbsp; ${divFinance} Finance</td>
                <td style="border:none; width:50%;"></td>
            </tr>
            <tr style="border:none;">
                <td style="border:none;">Department (✓):&nbsp;&nbsp; ${deptHigher} Higher Education &nbsp;&nbsp; ${deptBasic} Basic Education</td>
                <td style="border:none;"></td>
            </tr>
        </table>
        <table style="border:none; width:100%; font-size:9pt; margin-bottom:10px;">
            <tr style="border:none;">
                <td style="border:none; width:60%;">Department: <strong><u>&nbsp;&nbsp;${escapeHtml(department)}&nbsp;&nbsp;</u></strong></td>
                <td style="border:none; width:40%; text-align:right;">Date: <strong><u>&nbsp;&nbsp;${formattedDate}&nbsp;&nbsp;</u></strong></td>
            </tr>
            <tr style="border:none;">
                <td style="border:none;" colspan="2">Office/Unit Location: <strong><u>&nbsp;&nbsp;${escapeHtml(officeLocation) || 'ALL LOCATIONS'}&nbsp;&nbsp;</u></strong></td>
            </tr>
        </table>

        <!-- INVENTORY TABLE -->
        <table style="width:100%; border-collapse:collapse; font-size:9pt;">
            <thead>
                <tr>
                    <th rowspan="2" style="border:1px solid #000; padding:4px; text-align:center; background:#dce6f1; font-size:8pt; width:5%;">PREV-<br>IOUS<br>QTY.</th>
                    <th rowspan="2" style="border:1px solid #000; padding:4px; text-align:center; background:#dce6f1; font-size:8pt; width:12%;">ITEMS</th>
                    <th rowspan="2" style="border:1px solid #000; padding:4px; text-align:center; background:#dce6f1; font-size:8pt; width:5%;">CUR-<br>RENT<br>QTY.</th>
                    <th rowspan="2" style="border:1px solid #000; padding:4px; text-align:center; background:#dce6f1; font-size:8pt; width:22%;">BRAND NAME / SPECIFICATION</th>
                    <th colspan="4" style="border:1px solid #000; padding:4px; text-align:center; background:#dce6f1; font-size:8pt;">STATUS (✓)</th>
                    <th colspan="4" style="border:1px solid #000; padding:4px; text-align:center; background:#dce6f1; font-size:7pt;">ACTIONS MADE SINCE<br>PREVIOUS INVENTORY (✓)</th>
                </tr>
                <tr>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Good<br>Con-<br>dition</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Needs<br>Repair</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:4%;">Lost</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Dam-<br>age</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Newly<br>Acq-<br>uired</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Re-<br>mo-<br>ved</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Trans-<br>fer-<br>red</th>
                    <th style="border:1px solid #000; padding:3px; text-align:center; background:#dce6f1; font-size:7pt; width:5%;">Dis-<br>po-<br>sed</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>

        <br><br>

        <!-- SIGNATORIES -->
        <table style="border:none; width:100%; margin-top:30px;">
            <tr style="border:none;">
                <td style="border:none; text-align:center; width:33%; padding-top:40px;">
                    <div style="font-size:9pt;">Prepared By:</div>
                    <br><br>
                    <div style="border-top:1px solid #000; display:inline-block; padding-top:3px; min-width:200px;">
                        <strong style="font-size:10pt;">${escapeHtml(preparedBy)}</strong>
                    </div>
                    ${preparedByTitle ? '<div style="font-size:8pt; color:#666; margin-top:2px;">' + escapeHtml(preparedByTitle) + '</div>' : ''}
                </td>
                <td style="border:none; text-align:center; width:33%; padding-top:40px;">
                    <div style="font-size:9pt;">Verified By:</div>
                    <br><br>
                    <div style="border-top:1px solid #000; display:inline-block; padding-top:3px; min-width:200px;">
                        <strong style="font-size:10pt;">${escapeHtml(verifiedBy)}</strong>
                    </div>
                    ${verifiedByTitle ? '<div style="font-size:8pt; color:#666; margin-top:2px;">' + escapeHtml(verifiedByTitle) + '</div>' : ''}
                </td>
                <td style="border:none; text-align:center; width:33%; padding-top:40px;">
                    <div style="font-size:9pt;">Noted By:</div>
                    <br><br>
                    <div style="border-top:1px solid #000; display:inline-block; padding-top:3px; min-width:200px;">
                        <strong style="font-size:10pt;">${escapeHtml(notedBy)}</strong>
                    </div>
                    ${notedByTitle ? '<div style="font-size:8pt; color:#666; margin-top:2px;">' + escapeHtml(notedByTitle) + '</div>' : ''}
                </td>
            </tr>
        </table>
    </body>
    </html>`;

    try {
        const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `SMCTI_Inventory_Form_SY${sy.replace(/\s+/g, '')}_${department.replace(/[\/\s]+/g, '_')}.doc`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        // Delay cleanup so the browser has time to start the download
        setTimeout(function() {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1000);
        showAlert('SMCTI Inventory Form exported to Word successfully!', 'success');
    } catch (err) {
        console.error('Word export error:', err);
        showAlert('Export failed: ' + err.message, 'danger');
    }
}

// ==================== EXPORT TO EXCEL (SMCTI INVENTORY FORM FORMAT) ====================
function exportReportToExcel() {
    if (typeof XLSX === 'undefined') {
        showAlert('Excel library not loaded. Please check your internet connection and refresh the page.', 'danger');
        return;
    }
    const reportBody = document.getElementById('reportTableBody');
    if (!reportBody || reportBody.children.length === 0) {
        showAlert('Please generate an inventory report first', 'warning');
        return;
    }

    try {
    const sy = document.getElementById('reportSY')?.value || '2024-2025';
    const department = document.getElementById('reportDepartment')?.value || 'ICT_COLLEGE';
    const officeLocation = document.getElementById('reportOfficeLocation')?.value || 'ALL LOCATIONS';
    const division = document.getElementById('reportDivision')?.value || 'Administration';
    const deptLevel = document.getElementById('reportDeptLevel')?.value || 'Higher Education';
    const reportDate = document.getElementById('reportDate')?.value || new Date().toISOString().split('T')[0];

    // Build worksheet data
    const wsData = [];

    // Header rows
    wsData.push(['ST. MARY\'S COLLEGE OF TAGUM, INC']);
    wsData.push(['OFFICE OF THE PROPERTY CUSTODIAN']);
    wsData.push(['National Highway, Tagum City, 8100 Davao del Norte, Philippines']);
    wsData.push([]);
    wsData.push(['INVENTORY FORM']);
    wsData.push(['SY ' + sy]);
    wsData.push([]);
    wsData.push(['Division: ' + division, '', 'Department Level: ' + deptLevel]);
    wsData.push(['Department: ' + department, '', 'Date: ' + reportDate]);
    wsData.push(['Office/Unit Location: ' + (officeLocation || 'ALL LOCATIONS')]);
    wsData.push([]);

    // Table headers
    wsData.push(['PREV. QTY.', 'ITEMS', 'CURRENT QTY.', 'BRAND NAME / SPECIFICATION',
        'Good Condition', 'Needs Repair', 'Lost', 'Damaged',
        'Newly Acquired', 'Removed', 'Transferred', 'Disposed']);

    // Table data from report
    const rows = reportBody.querySelectorAll('tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 12) {
            wsData.push([
                cells[0].textContent.trim(),
                cells[1].textContent.trim(),
                cells[2].textContent.trim(),
                cells[3].textContent.trim(),
                cells[4].textContent.trim(),
                cells[5].textContent.trim(),
                cells[6].textContent.trim(),
                cells[7].textContent.trim(),
                cells[8].textContent.trim(),
                cells[9].textContent.trim(),
                cells[10].textContent.trim(),
                cells[11].textContent.trim()
            ]);
        }
    });

    // Signatories
    const preparedBy = document.getElementById('sigPreparedBy')?.value || '';
    const preparedByTitle = document.getElementById('sigPreparedByTitle')?.value || '';
    const verifiedBy = document.getElementById('sigVerifiedBy')?.value || '';
    const verifiedByTitle = document.getElementById('sigVerifiedByTitle')?.value || '';
    const notedBy = document.getElementById('sigNotedBy')?.value || '';
    const notedByTitle = document.getElementById('sigNotedByTitle')?.value || '';

    wsData.push([]);
    wsData.push([]);
    wsData.push(['Prepared By:', '', '', 'Verified By:', '', '', '', 'Noted By:']);
    wsData.push([]);
    wsData.push([preparedBy, '', '', verifiedBy, '', '', '', notedBy]);
    wsData.push([preparedByTitle, '', '', verifiedByTitle, '', '', '', notedByTitle]);

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws['!cols'] = [
        { wch: 10 }, { wch: 25 }, { wch: 12 }, { wch: 35 },
        { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 10 },
        { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }
    ];

    // Merge header cells
    ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 11 } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: 11 } },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, `SMCTI_Inventory_Form_SY${sy.replace(/\s+/g, '')}_${department.replace(/[\/\s]+/g, '_')}.xlsx`);
    showAlert('SMCTI Inventory Form exported to Excel successfully!', 'success');
    } catch (err) {
        console.error('Excel export error:', err);
        showAlert('Excel export failed: ' + err.message, 'danger');
    }
}

// ==================== TOOL SELECTS ====================
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

function updateInlineToolSelect() {
    const toolSelect = document.getElementById('inlineBorrowerTool');
    if (!toolSelect) return;
    toolSelect.innerHTML = '<option value="">Select a tool</option>';
    appState.allTools.forEach(tool => {
        if (tool.quantity > 0) {
            const option = document.createElement('option');
            option.value = tool.id;
            option.textContent = `${tool.name} (${tool.quantity} available)`;
            toolSelect.appendChild(option);
        }
    });
}

// ==================== CONFIRMATION DIALOGS ====================
function confirmDeleteTool(toolId) {
    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) return;
    const activeBorrowings = appState.allBorrowers.filter(b => b.tool_id === toolId && !b.returned);
    if (activeBorrowings.length > 0) {
        showAlert(`Cannot delete "${tool.name}" — it has ${activeBorrowings.length} active borrowing(s). Return items first.`, 'danger');
        return;
    }
    document.getElementById('deleteToolId').value = tool.id;
    document.getElementById('deleteToolName').value = tool.name;
    document.getElementById('deleteToolReason').value = '';
    document.getElementById('deleteToolRemarks').value = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('deleteToolReasonModal')).show();
}

function executeDeleteTool() {
    const toolId = parseInt(document.getElementById('deleteToolId').value);
    const reason = document.getElementById('deleteToolReason').value;
    const remarks = document.getElementById('deleteToolRemarks').value.trim();
    if (!reason) { showAlert('Please select a reason for removal', 'warning'); return; }
    bootstrap.Modal.getInstance(document.getElementById('deleteToolReasonModal')).hide();
    deleteTool(toolId, reason, remarks);
}

function confirmDeleteUser(userId) {
    const user = appState.allUsers.find(u => u.id === userId);
    if (!user) return;
    if (confirm(`Delete user "${user.name}"?\n\nThis action cannot be undone.`)) deleteUser(userId);
}

function confirmReturn(borrowerId) {
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower) return;
    const tool = appState.allTools.find(t => t.id === borrower.tool_id);
    document.getElementById('returnBorrowerId').value = borrower.id;
    document.getElementById('returnBorrowerName').value = borrower.borrower_name;
    document.getElementById('returnToolName').value = tool?.name || 'Unknown';
    document.getElementById('returnStudentIdScan').value = '';
    document.getElementById('returnCondition').value = 'Good Condition';
    document.getElementById('returnRemarks').value = '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('returnRemarksModal')).show();
}

function executeReturnBorrower() {
    const borrowerId = parseInt(document.getElementById('returnBorrowerId').value);
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower) return;
    const scannedId = document.getElementById('returnStudentIdScan').value.trim();
    const returnCondition = document.getElementById('returnCondition').value;
    const returnRemarks = document.getElementById('returnRemarks').value.trim();
    if (!scannedId) { showAlert('Please scan or enter the Student ID / Barcode', 'warning'); return; }
    if (borrower.student_id && scannedId !== borrower.student_id) {
        showAlert(`Student ID mismatch! Expected "${borrower.student_id}" but got "${scannedId}". The same ID used for borrowing must be scanned.`, 'danger');
        return;
    }
    if (!returnRemarks) { showAlert('Please enter return remarks/comments', 'warning'); return; }
    bootstrap.Modal.getInstance(document.getElementById('returnRemarksModal')).hide();
    returnBorrower(borrowerId, returnRemarks, returnCondition);
}

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
    appState.currentTab = tab;
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(tab).style.display = 'block';
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'tools') { renderTools(); updateToolSelect(); updateInlineToolSelect(); }
    else if (tab === 'borrowers') { renderBorrowers(); updateInlineToolSelect(); }
    else if (tab === 'users') { renderUsers(); }
    else if (tab === 'settings') { initReportYearFilter(); }
    else if (tab === 'damageReporting') { renderDamageReports(); updateDamageToolSelect(); }
    else if (tab === 'dashboard') { updateDashboard(); }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    const toolSearch = document.getElementById('toolSearch');
    const toolCat = document.getElementById('toolCategoryFilter');
    const toolLoc = document.getElementById('toolLocationFilter');
    const borrowerSearch = document.getElementById('borrowerSearch');
    const filterStatus = document.getElementById('filterStatus');
    const userSearch = document.getElementById('userSearch');

    if (toolSearch) toolSearch.addEventListener('keyup', filterTools);
    if (toolCat) toolCat.addEventListener('change', filterTools);
    if (toolLoc) toolLoc.addEventListener('change', filterTools);
    if (borrowerSearch) borrowerSearch.addEventListener('keyup', filterBorrowers);
    if (filterStatus) filterStatus.addEventListener('change', filterBorrowers);
    if (userSearch) userSearch.addEventListener('keyup', filterUsers);

    const toolForm = document.getElementById('toolForm');
    const borrowerForm = document.getElementById('borrowerForm');
    const userForm = document.getElementById('userForm');
    const editToolForm = document.getElementById('editToolForm');

    if (toolForm) toolForm.addEventListener('submit', function(e) { e.preventDefault(); saveTool(); });
    if (borrowerForm) borrowerForm.addEventListener('submit', function(e) { e.preventDefault(); saveBorrower(); });
    if (userForm) userForm.addEventListener('submit', function(e) { e.preventDefault(); saveUser(); });
    if (editToolForm) editToolForm.addEventListener('submit', function(e) { e.preventDefault(); updateTool(); });

    // Enter-key login support
    const loginPassword = document.getElementById('loginPassword');
    const loginEmail = document.getElementById('loginEmail');
    if (loginPassword) loginPassword.addEventListener('keypress', function(e) { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } });
    if (loginEmail) loginEmail.addEventListener('keypress', function(e) { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } });

    updateToolSelect();
    updateInlineToolSelect();
}

// ==================== UTILITY ====================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getNextId(arr) {
    if (!arr || arr.length === 0) return 1;
    return Math.max(...arr.map(item => item.id || 0)) + 1;
}

function showAlert(message, type = 'info') {
    const alertId = 'alert-' + Date.now();
    const alertHTML = `
        <div id="${alertId}" class="alert-message alert-${type === 'danger' ? 'error' : type}" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' || type === 'danger' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        </div>
    `;
    const temp = document.createElement('div');
    temp.innerHTML = alertHTML;
    document.body.appendChild(temp.firstElementChild);
    setTimeout(() => {
        const el = document.getElementById(alertId);
        if (el) { el.style.animation = 'slideInRight 0.3s ease reverse'; setTimeout(() => el.remove(), 300); }
    }, 4000);
}

function showLoadingState(message = 'Processing...') {
    const loadingId = 'loading-overlay-' + Date.now();
    const loadingHTML = `<div id="${loadingId}" class="loading-overlay"><div class="loading-content"><div class="loading-spinner"></div><p style="margin-top: 1rem; color: #666; font-weight: 500;">${message}</p></div></div>`;
    const temp = document.createElement('div');
    temp.innerHTML = loadingHTML;
    document.body.appendChild(temp.firstElementChild);
    return loadingId;
}

function hideLoadingState(loadingId) {
    const el = document.getElementById(loadingId);
    if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s ease'; setTimeout(() => el.remove(), 300); }
}

function showSaveSuccess() {
    const savedId = 'saved-indicator-' + Date.now();
    const savedHTML = `<div id="${savedId}" class="save-indicator" style="position: fixed; bottom: 20px; right: 20px; z-index: 9998;"><i class="fas fa-cloud-upload-alt"></i><span>Saved</span></div>`;
    const temp = document.createElement('div');
    temp.innerHTML = savedHTML;
    document.body.appendChild(temp.firstElementChild);
    setTimeout(() => { const el = document.getElementById(savedId); if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.5s ease'; setTimeout(() => el.remove(), 500); } }, 2000);
}

function handleError(error, message = 'An error occurred') {
    console.error('Error:', error);
    showAlert(message + ' - ' + (error.message || error), 'error');
    return false;
}

// ==================== SETTINGS ====================
function updateProfile() {
    const name = document.getElementById('settingName').value;
    const email = document.getElementById('settingEmail').value;
    localStorage.setItem('userProfile', JSON.stringify({ name, email, updatedAt: new Date().toISOString() }));
    document.getElementById('currentUser').textContent = name;
    showAlert('Profile updated successfully', 'success');
}

function saveSettings() {
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

function clearAllData() {
    if (confirm('This will delete all data. Are you absolutely sure?')) {
        if (confirm('This action cannot be undone. Click OK to confirm.')) {
            localStorage.clear();
            appState.allTools = [];
            appState.allBorrowers = [];
            appState.allUsers = [];
            appState.activityLog = [];
            showAlert('All data has been cleared', 'warning');
            setTimeout(() => { window.location.reload(); }, 1500);
        }
    }
}

// ==================== BARCODE SCANNING ====================
let barcodeInputElement = null;

function openBarcodeScanner() {
    document.getElementById('barcode-scanner-section').style.display = 'block';
    barcodeInputElement = document.getElementById('barcodeInput');
    if (barcodeInputElement) { barcodeInputElement.value = ''; barcodeInputElement.focus(); }
    if (!barcodeInputElement._barcodeListener) {
        barcodeInputElement.addEventListener('change', handleBarcodeInput);
        barcodeInputElement.addEventListener('keypress', function(e) { if (e.key === 'Enter') { e.preventDefault(); handleBarcodeInput(e); } });
        barcodeInputElement._barcodeListener = true;
    }
}

function closeBarcodeScanner() {
    document.getElementById('barcode-scanner-section').style.display = 'none';
    document.getElementById('scanned-barcode-details').style.display = 'none';
    if (barcodeInputElement) barcodeInputElement.value = '';
}

function handleBarcodeInput(event) {
    const barcode = event.target.value.trim();
    if (!barcode) return;
    const tool = appState.allTools.find(t =>
        t.id === barcode || t.id === parseInt(barcode) ||
        (t.assetCode && t.assetCode === barcode) ||
        (t.barcode && t.barcode === barcode)
    );
    if (tool) {
        barcodeInputElement.value = '';
        displayBarcodeScannedTool(tool);
        autoFillBorrowingForm(tool);
    } else {
        showAlert(`Tool with barcode "${barcode}" not found.`, 'warning');
        barcodeInputElement.value = '';
        barcodeInputElement.focus();
    }
}

function displayBarcodeScannedTool(tool) {
    document.getElementById('scanned-barcode-details').style.display = 'block';
    document.getElementById('barcodedToolName').textContent = tool.name;
    document.getElementById('barcodedToolBrand').textContent = tool.brand || 'N/A';
    document.getElementById('barcodedToolCategory').textContent = tool.category || 'N/A';
    document.getElementById('barcodedToolQuantity').textContent = tool.quantity || '0';
    showAlert(`${tool.name} scanned successfully!`, 'success');
}

function autoFillBorrowingForm(tool) {
    document.getElementById('inline-borrower-form').style.display = 'block';
    closeBarcodeScanner();
    document.getElementById('inlineBorrowerTool').value = tool.id;
    document.getElementById('inlineBorrowDate').valueAsDate = new Date();
    const returnDate = new Date(); returnDate.setDate(returnDate.getDate() + 7);
    document.getElementById('inlineReturnDate').valueAsDate = returnDate;
    showAlert(`Tool "${tool.name}" loaded. Now enter borrower details.`, 'success');
    setTimeout(() => { document.getElementById('inlineBorrowerName')?.focus(); }, 100);
}

function closeInlineForm() {
    document.getElementById('inline-borrower-form').style.display = 'none';
    document.getElementById('inlineBorrowerForm').reset();
}

function saveInlineBorrower() {
    const toolId = document.getElementById('inlineBorrowerTool').value;
    const studentId = document.getElementById('inlineStudentId').value.trim();
    const email = document.getElementById('inlineBorrowerEmail').value.trim();
    const borrowerName = document.getElementById('inlineBorrowerName').value;
    const course = document.getElementById('inlineBorrowerCourse').value;
    const year = document.getElementById('inlineBorrowerYear').value;
    const borrowDate = document.getElementById('inlineBorrowDate').value;
    const returnDate = document.getElementById('inlineReturnDate').value;
    const borrowReason = document.getElementById('inlineBorrowReason').value;

    if (!toolId || !studentId || !email || !borrowerName || !course || !year || !borrowDate || !returnDate) {
        showAlert('Please fill in all required fields (including Student ID and Email)', 'warning'); return;
    }

    const newBorrower = {
        id: getNextId(appState.allBorrowers),
        tool_id: parseInt(toolId), student_id: studentId, email: email,
        borrower_name: borrowerName, course, year,
        borrow_date: borrowDate, return_date: returnDate, reason: borrowReason,
        returned: false, returned_date: null, return_remarks: '', overdue_notified: false
    };

    const tool = appState.allTools.find(t => t.id === parseInt(toolId));
    if (tool) tool.quantity -= 1;
    appState.allBorrowers.push(newBorrower);
    saveApplicationState();
    closeInlineForm();
    renderBorrowers(); renderTools(); updateDashboard(); updateToolSelect(); updateInlineToolSelect();
    showAlert(`Borrowing recorded for ${borrowerName}!`, 'success');
}

// ==================== BARCODE EXPORT ====================
function exportQRCode(toolId) {
    try {
        const tool = appState.allTools.find(t => t.id === toolId);
        if (!tool) { showAlert('Tool not found', 'error'); return; }
        const toolName = tool.name;

        const barcodeCanvas = document.createElement('canvas');
        barcodeCanvas.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
        document.body.appendChild(barcodeCanvas);

        try {
            JsBarcode(barcodeCanvas, tool.assetCode || String(tool.id), {
                format: 'CODE128', width: 2, height: 80, displayValue: true, fontSize: 14, margin: 10
            });

            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = 600; finalCanvas.height = 400;
            const ctx = finalCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 600, 400);
            ctx.fillStyle = '#000000'; ctx.font = 'bold 20px Arial'; ctx.textAlign = 'center';
            ctx.fillText('Tool Barcode', 300, 35);
            ctx.drawImage(barcodeCanvas, 50, 70, 500, 140);
            ctx.font = 'bold 13px Arial'; ctx.fillText('Tool: ' + tool.name, 300, 240);
            ctx.font = '12px Arial';
            ctx.fillText('Asset Code: ' + (tool.assetCode || tool.id), 300, 260);
            ctx.fillText('Category: ' + (tool.category || 'N/A'), 300, 280);
            ctx.fillText('Location: ' + (tool.location || 'N/A'), 300, 300);

            const pngUrl = finalCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = tool.name.replace(/\s+/g, '_') + '_Barcode.png';
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            showAlert('Barcode downloaded: ' + link.download, 'success');
            document.body.removeChild(barcodeCanvas);
        } catch (err) {
            document.body.removeChild(barcodeCanvas);
            showAlert('Error generating barcode: ' + err.message, 'error');
        }
    } catch (error) {
        showAlert('Failed to export barcode: ' + error.message, 'error');
    }
}

// ==================== IMAGE MANAGEMENT ====================
function previewToolImage(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { showAlert('Image size must be less than 5MB', 'warning'); document.getElementById('toolImage').value = ''; return; }
        if (!file.type.startsWith('image/')) { showAlert('Please select a valid image file', 'warning'); document.getElementById('toolImage').value = ''; return; }
        const reader = new FileReader();
        reader.onload = function(e) { document.getElementById('previewImg').src = e.target.result; document.getElementById('imagePreview').style.display = 'block'; };
        reader.readAsDataURL(file);
    }
}

function clearImagePreview() {
    document.getElementById('toolImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

function viewToolImage(toolName, imageData) {
    document.getElementById('imageViewerTitle').textContent = toolName;
    document.getElementById('imageViewerImg').src = imageData;
    document.getElementById('imageViewerImg').dataset.imageData = imageData;
    document.getElementById('imageViewerImg').dataset.toolName = toolName;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('imageViewerModal')).show();
}

function downloadToolImage() {
    const img = document.getElementById('imageViewerImg');
    const toolName = img.dataset.toolName || 'tool-image';
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `${toolName.replace(/\s+/g, '_')}_${Date.now()}.png`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showAlert('Image downloaded successfully!', 'success');
}

// ==================== DAMAGE REPORTING SECTION ====================
function updateDamageToolSelect() {
    const select = document.getElementById('damageTool');
    if (!select) return;
    select.innerHTML = '<option value="">Select a tool</option>';
    appState.allTools.forEach(tool => {
        const option = document.createElement('option');
        option.value = tool.id;
        option.textContent = `${tool.name} (${tool.brand || 'N/A'}) - ${tool.assetCode || 'N/A'}`;
        select.appendChild(option);
    });
}

function saveDamageReport() {
    const toolId = parseInt(document.getElementById('damageTool').value);
    const reportedBy = document.getElementById('damageReportedBy').value.trim();
    const damageType = document.getElementById('damageType').value;
    const severity = document.getElementById('damageSeverity').value;
    const description = document.getElementById('damageDescription').value.trim();

    if (!toolId || !reportedBy || !damageType || !description) {
        showAlert('Please fill in all required fields', 'warning'); return;
    }

    const tool = appState.allTools.find(t => t.id === toolId);
    if (!tool) { showAlert('Tool not found', 'danger'); return; }

    const report = {
        id: getNextId(appState.damageReports),
        tool_id: toolId,
        tool_name: tool.name,
        reported_by: reportedBy,
        damage_type: damageType,
        severity: severity,
        description: description,
        date_reported: new Date().toISOString(),
        status: 'Pending',
        resolution_notes: '',
        resolved_date: null
    };

    appState.damageReports.push(report);

    // Update tool condition based on damage type
    if (damageType === 'Damaged') tool.condition = 'Damaged';
    else if (damageType === 'For Repair') tool.condition = 'Needs Repair';
    else if (damageType === 'Lost') tool.condition = 'Lost';

    // Record as tool movement
    appState.toolMovements.push({
        id: getNextId(appState.toolMovements),
        tool_id: tool.id,
        tool_name: tool.name,
        movement_type: 'Pulled Out',
        quantity_changed: 0,
        reason: `Damage Report: ${damageType}`,
        remarks: description,
        movement_date: new Date().toISOString()
    });

    addActivity(`Damage Report filed: "${tool.name}" - ${damageType} (${severity}) by ${reportedBy}`);
    saveApplicationState();
    document.getElementById('damageReportForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addDamageReportModal')).hide();
    showAlert('Damage report submitted successfully!', 'success');
    renderDamageReports();
    updateDashboard();
}

function filterDamageReports() {
    const searchTerm = (document.getElementById('damageSearch')?.value || '').toLowerCase();
    const typeTerm = document.getElementById('damageTypeFilter')?.value || '';
    const statusTerm = document.getElementById('damageStatusFilter')?.value || '';

    const filtered = appState.damageReports.filter(r => {
        const matchesSearch = !searchTerm ||
            r.tool_name.toLowerCase().includes(searchTerm) ||
            r.reported_by.toLowerCase().includes(searchTerm) ||
            r.description.toLowerCase().includes(searchTerm);
        const matchesType = !typeTerm || r.damage_type === typeTerm;
        const matchesStatus = !statusTerm || r.status === statusTerm;
        return matchesSearch && matchesType && matchesStatus;
    });
    renderFilteredDamageReports(filtered);
}

function renderDamageReports() { renderFilteredDamageReports(appState.damageReports); }

function renderFilteredDamageReports(reports) {
    const list = document.getElementById('damageReportsList');
    if (!list) return;
    if (reports.length === 0) {
        list.innerHTML = '<div class="empty-state"><i class="fas fa-check-circle"></i><h4>No Damage Reports</h4><p>No damage reports have been filed yet</p></div>';
        return;
    }

    list.innerHTML = `
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-danger">
                    <tr>
                        <th>#</th>
                        <th>Date Reported</th>
                        <th>Tool</th>
                        <th>Reported By</th>
                        <th>Type</th>
                        <th>Severity</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reports.map((r, idx) => {
                        const statusBadge = r.status === 'Pending' ? 'bg-warning' :
                            r.status === 'Under Review' ? 'bg-info' :
                            r.status === 'Repaired' || r.status === 'Replaced' ? 'bg-success' : 'bg-secondary';
                        const severityBadge = r.severity === 'Minor' ? 'bg-info' :
                            r.severity === 'Moderate' ? 'bg-warning' : 'bg-danger';
                        return `<tr>
                            <td>${idx + 1}</td>
                            <td>${new Date(r.date_reported).toLocaleString()}</td>
                            <td><strong>${escapeHtml(r.tool_name)}</strong></td>
                            <td>${escapeHtml(r.reported_by)}</td>
                            <td><span class="badge bg-danger">${escapeHtml(r.damage_type)}</span></td>
                            <td><span class="badge ${severityBadge}">${escapeHtml(r.severity)}</span></td>
                            <td>${escapeHtml(r.description)}</td>
                            <td><span class="badge ${statusBadge}">${escapeHtml(r.status)}</span></td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="openUpdateDamageStatus(${r.id})" title="Update Status"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-danger" onclick="deleteDamageReport(${r.id})" title="Delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>
        <div class="text-muted mt-2"><strong>Total Reports: ${reports.length}</strong></div>
    `;
}

function openUpdateDamageStatus(reportId) {
    const report = appState.damageReports.find(r => r.id === reportId);
    if (!report) return;
    document.getElementById('updateDamageId').value = report.id;
    document.getElementById('updateDamageStatus').value = report.status;
    document.getElementById('updateDamageNotes').value = report.resolution_notes || '';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('updateDamageStatusModal')).show();
}

function updateDamageReportStatus() {
    const reportId = parseInt(document.getElementById('updateDamageId').value);
    const report = appState.damageReports.find(r => r.id === reportId);
    if (!report) return;
    report.status = document.getElementById('updateDamageStatus').value;
    report.resolution_notes = document.getElementById('updateDamageNotes').value.trim();
    if (report.status === 'Repaired' || report.status === 'Replaced' || report.status === 'Written Off') {
        report.resolved_date = new Date().toISOString();
        // Optionally restore tool condition if repaired/replaced
        if (report.status === 'Repaired' || report.status === 'Replaced') {
            const tool = appState.allTools.find(t => t.id === report.tool_id);
            if (tool) tool.condition = 'Good Condition';
        }
    }
    addActivity(`Damage Report #${report.id} for "${report.tool_name}" updated to "${report.status}"`);
    saveApplicationState();
    bootstrap.Modal.getInstance(document.getElementById('updateDamageStatusModal')).hide();
    showAlert('Damage report status updated!', 'success');
    renderDamageReports();
    updateDashboard();
}

function deleteDamageReport(reportId) {
    if (!confirm('Delete this damage report?')) return;
    appState.damageReports = appState.damageReports.filter(r => r.id !== reportId);
    saveApplicationState();
    showAlert('Damage report deleted', 'success');
    renderDamageReports();
}

// ==================== MONTHLY RECORD REPORT (Dashboard) ====================
function initMonthlyRecordMonth() {
    const el = document.getElementById('monthlyRecordMonth');
    if (!el || el.value) return;
    const now = new Date();
    el.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function renderMonthlyRecord() {
    const monthInput = document.getElementById('monthlyRecordMonth');
    if (!monthInput || !monthInput.value) return;
    const [year, month] = monthInput.value.split('-').map(Number);
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // A. Added Tools this month
    const addedMovements = appState.toolMovements.filter(m => {
        const d = new Date(m.movement_date);
        return m.movement_type === 'Added' && d >= startOfMonth && d <= endOfMonth;
    });

    // B. Damaged Tools this month
    const damagedReports = appState.damageReports.filter(r => {
        const d = new Date(r.date_reported);
        return d >= startOfMonth && d <= endOfMonth;
    });

    // C. Pulled-out Tools this month
    const pulledOutMovements = appState.toolMovements.filter(m => {
        const d = new Date(m.movement_date);
        return (m.movement_type === 'Pulled Out' || m.movement_type === 'Removed') && d >= startOfMonth && d <= endOfMonth;
    });

    document.getElementById('monthlyAdded').textContent = addedMovements.length;
    document.getElementById('monthlyDamaged').textContent = damagedReports.length;
    document.getElementById('monthlyPulledOut').textContent = pulledOutMovements.length;

    // Details table
    const detailsDiv = document.getElementById('monthlyRecordDetails');
    if (!detailsDiv) return;

    let html = '';
    if (addedMovements.length > 0) {
        html += `<h5 style="color: var(--success); margin-top: 1rem;"><i class="fas fa-plus-circle"></i> Added Tools</h5>
        <div class="table-responsive"><table class="table table-sm table-bordered"><thead class="table-success"><tr><th>Tool</th><th>Qty</th><th>Date & Time</th><th>Reason</th></tr></thead><tbody>
        ${addedMovements.map(m => `<tr><td>${escapeHtml(m.tool_name)}</td><td>${m.quantity_changed}</td><td>${new Date(m.movement_date).toLocaleString()}</td><td>${escapeHtml(m.reason || '')}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    if (damagedReports.length > 0) {
        html += `<h5 style="color: var(--danger); margin-top: 1rem;"><i class="fas fa-tools"></i> Damaged Tools</h5>
        <div class="table-responsive"><table class="table table-sm table-bordered"><thead class="table-danger"><tr><th>Tool</th><th>Type</th><th>Severity</th><th>Date & Time</th><th>Reported By</th></tr></thead><tbody>
        ${damagedReports.map(r => `<tr><td>${escapeHtml(r.tool_name)}</td><td>${escapeHtml(r.damage_type)}</td><td>${escapeHtml(r.severity)}</td><td>${new Date(r.date_reported).toLocaleString()}</td><td>${escapeHtml(r.reported_by)}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    if (pulledOutMovements.length > 0) {
        html += `<h5 style="color: var(--warning); margin-top: 1rem;"><i class="fas fa-minus-circle"></i> Pulled-out Tools</h5>
        <div class="table-responsive"><table class="table table-sm table-bordered"><thead class="table-warning"><tr><th>Tool</th><th>Qty</th><th>Date & Time</th><th>Reason</th><th>Remarks</th></tr></thead><tbody>
        ${pulledOutMovements.map(m => `<tr><td>${escapeHtml(m.tool_name)}</td><td>${m.quantity_changed}</td><td>${new Date(m.movement_date).toLocaleString()}</td><td>${escapeHtml(m.reason || '')}</td><td>${escapeHtml(m.remarks || '')}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    if (!html) html = '<p class="text-muted">No records for this month.</p>';
    detailsDiv.innerHTML = html;
}

// ==================== TOP BORROWERS BY COURSE (Bar Chart) ====================
let topBorrowersChart = null;

function renderTopBorrowersByCourseChart() {
    const canvas = document.getElementById('topBorrowersCourseChart');
    if (!canvas || typeof Chart === 'undefined') return;

    // Count borrowings by course
    const courseCounts = {};
    appState.allBorrowers.forEach(b => {
        const course = b.course || 'Unknown';
        courseCounts[course] = (courseCounts[course] || 0) + 1;
    });

    const sortedCourses = Object.entries(courseCounts).sort((a, b) => b[1] - a[1]);
    const labels = sortedCourses.map(c => c[0]);
    const data = sortedCourses.map(c => c[1]);

    const colors = [
        '#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1', '#14b8a6'
    ];

    if (topBorrowersChart) {
        topBorrowersChart.destroy();
    }

    topBorrowersChart = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Items Borrowed',
                data: data,
                backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                borderColor: labels.map((_, i) => colors[i % colors.length]),
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Items Borrowed per Course',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 },
                    title: { display: true, text: 'Number of Borrowings' }
                },
                x: {
                    title: { display: true, text: 'Course' },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 30,
                        font: { size: 10 }
                    }
                }
            }
        }
    });
}

// ==================== OVERDUE EMAIL NOTIFICATION ====================
function checkOverdueAndNotify() {
    const overdueBorrowers = appState.allBorrowers.filter(b =>
        !b.returned && new Date(b.return_date) < new Date() && !b.overdue_notified && b.email
    );
    if (overdueBorrowers.length > 0) {
        const overdueCount = overdueBorrowers.length;
        // Show notification badge
        const overdueEl = document.getElementById('overdueItems');
        if (overdueEl) overdueEl.style.color = '#ef4444';
    }
}

function sendOverdueEmail(borrowerId) {
    const borrower = appState.allBorrowers.find(b => b.id === borrowerId);
    if (!borrower || !borrower.email) {
        showAlert('No email address found for this borrower', 'warning');
        return;
    }
    const tool = appState.allTools.find(t => t.id === borrower.tool_id);
    const overdueDays = calculateOverdueDays(borrower.return_date);

    const loadingId = showLoadingState('Sending overdue notification...');

    fetch('/api/send-overdue-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            to_email: borrower.email,
            borrower_name: borrower.borrower_name,
            tool_name: tool?.name || 'Unknown Item',
            student_id: borrower.student_id || 'N/A',
            borrow_date: new Date(borrower.borrow_date).toLocaleDateString(),
            return_date: new Date(borrower.return_date).toLocaleDateString(),
            days_overdue: overdueDays
        })
    })
    .then(res => res.json())
    .then(data => {
        hideLoadingState(loadingId);
        if (data.success) {
            borrower.overdue_notified = true;
            addActivity(`Overdue email sent to ${borrower.borrower_name} (${borrower.email})`);
            saveApplicationState();
            showAlert(`Overdue notification sent to ${borrower.email}!`, 'success');
            renderBorrowers();
        } else {
            showAlert(`Failed to send email: ${data.message}`, 'danger');
        }
    })
    .catch(err => {
        hideLoadingState(loadingId);
        showAlert('Failed to send email. Check server console for details.', 'danger');
        console.error('Email send error:', err);
    });
}

// ==================== STUDENT ID SCANNER ====================
function openStudentIdScanner() {
    document.getElementById('student-id-scanner-section').style.display = 'block';
    const input = document.getElementById('studentIdScanInput');
    if (input) {
        input.value = '';
        input.focus();
        if (!input._scanListener) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    processStudentIdScan();
                }
            });
            input._scanListener = true;
        }
    }
}

function closeStudentIdScanner() {
    document.getElementById('student-id-scanner-section').style.display = 'none';
    document.getElementById('student-id-scan-result').style.display = 'none';
}

function processStudentIdScan() {
    const input = document.getElementById('studentIdScanInput');
    const studentId = input.value.trim();
    if (!studentId) { showAlert('Please scan or enter a Student ID', 'warning'); return; }

    // Check if this student has an active borrowing (for return)
    const activeBorrowing = appState.allBorrowers.find(b =>
        b.student_id === studentId && !b.returned
    );

    if (activeBorrowing) {
        // Found active borrowing - prompt return
        const tool = appState.allTools.find(t => t.id === activeBorrowing.tool_id);
        document.getElementById('student-id-scan-result').style.display = 'block';
        document.getElementById('scannedStudentIdDisplay').textContent = studentId;
        showAlert(`Student ${activeBorrowing.borrower_name} has active borrowing: "${tool?.name || 'item'}". Opening return form...`, 'info');
        closeStudentIdScanner();
        // Open the return modal
        confirmReturn(activeBorrowing.id);
        // Pre-fill the student ID scan
        setTimeout(() => {
            const returnScanEl = document.getElementById('returnStudentIdScan');
            if (returnScanEl) returnScanEl.value = studentId;
        }, 300);
    } else {
        // No active borrowing - open borrow form with student ID pre-filled
        document.getElementById('student-id-scan-result').style.display = 'block';
        document.getElementById('scannedStudentIdDisplay').textContent = studentId;
        closeStudentIdScanner();
        document.getElementById('inline-borrower-form').style.display = 'block';
        document.getElementById('inlineStudentId').value = studentId;
        document.getElementById('inlineBorrowDate').valueAsDate = new Date();
        const returnDate = new Date(); returnDate.setDate(returnDate.getDate() + 7);
        document.getElementById('inlineReturnDate').valueAsDate = returnDate;
        showAlert(`Student ID "${studentId}" scanned. Fill in borrower details.`, 'success');
        setTimeout(() => { document.getElementById('inlineBorrowerName')?.focus(); }, 100);
    }
    input.value = '';
}

// ==================== SCAN RETURN BY STUDENT ID ====================
function processReturnScan() {
    const studentId = document.getElementById('returnScanStudentId').value.trim();
    if (!studentId) { showAlert('Please scan or enter a Student ID', 'warning'); return; }

    const activeBorrowing = appState.allBorrowers.find(b =>
        b.student_id === studentId && !b.returned
    );

    if (activeBorrowing) {
        bootstrap.Modal.getInstance(document.getElementById('scanReturnModal')).hide();
        confirmReturn(activeBorrowing.id);
        setTimeout(() => {
            const returnScanEl = document.getElementById('returnStudentIdScan');
            if (returnScanEl) returnScanEl.value = studentId;
        }, 300);
    } else {
        document.getElementById('returnScanResult').style.display = 'block';
        document.getElementById('returnScanResult').innerHTML = '<div class="alert alert-warning"><i class="fas fa-exclamation-triangle"></i> No active borrowing found for this Student ID.</div>';
    }
}
