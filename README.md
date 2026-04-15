# Point-Of-Sale System ☕

A sleek, modern, and role-based POS system designed for coffee shops and small businesses. Built with **React**, **Vite**, and **Firebase Firestore**.

![POS Demo](file:///C:/Users/JoeMama/.gemini/antigravity/brain/f36a04ba-b959-4134-8970-21115a836c3c/.system_generated/click_feedback/click_feedback_1776257772939.png)

## ✨ Features

- 🔐 **Secure Role-Based Login**: Separate portals for Admin and Employee (Staff) accounts.
- 📊 **Admin Dashboard**: Real-time sales statistics including Total Revenue, Orders, and Daily performance.
- 📑 **Order History**: A searchable list of past transactions with salesperson attribution.
- 🗑️ **Deletion Approval Workflow**: Security feature where Staff deletion requests must be approved by an Admin.
- 📥 **CSV Export**: Admins can download the entire sales history for Excel/Reporting.
- 🌙 **Modern Design**: Premium dark-mode interface with glassmorphism aesthetics.
- 📱 **Mobile Responsive**: Optimized for both tablet POS terminals and mobile phones.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/your-username/project-kaapi.git
cd project-kaapi
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the root directory and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Initial Admin (Optional for seeding)
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=admin123
```

### 3. Run Development Server
```bash
npm run dev
```

## 👥 Managing Staff
To add new staff members easily:
1. Go to your **Firebase Console** -> **Firestore Database**.
2. In the `users` collection, add a new document.
3. Set fields: `username` (string), `password` (string), and `role` (string: "employee" or "admin").

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite
- **Database**: Cloud Firestore
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom Glassmorphism)

---

> [!TIP]
> **Pro Tip**: To keep the app secure, always ensure your `.env` file is listed in your `.gitignore` before making your repository public!
