// Database operations can sync with backend API
// This file serves as a bridge between frontend and backend

class DatabaseManager {
    constructor() {
        this.apiUrl = 'http://localhost:5000/api';
    }

    // Tools API calls
    async getTools() {
        try {
            const response = await fetch(`${this.apiUrl}/tools`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching tools:', error);
            return JSON.parse(localStorage.getItem('tools')) || [];
        }
    }

    async addTool(tool) {
        try {
            const response = await fetch(`${this.apiUrl}/tools`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tool)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding tool:', error);
            return false;
        }
    }

    // Borrowers API calls
    async getBorrowers() {
        try {
            const response = await fetch(`${this.apiUrl}/borrowers`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching borrowers:', error);
            return JSON.parse(localStorage.getItem('borrowers')) || [];
        }
    }

    async addBorrower(borrower) {
        try {
            const response = await fetch(`${this.apiUrl}/borrowers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(borrower)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding borrower:', error);
            return false;
        }
    }

    // Users API calls
    async getUsers() {
        try {
            const response = await fetch(`${this.apiUrl}/users`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return JSON.parse(localStorage.getItem('users')) || [];
        }
    }

    async addUser(user) {
        try {
            const response = await fetch(`${this.apiUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding user:', error);
            return false;
        }
    }
}

const db = new DatabaseManager();
