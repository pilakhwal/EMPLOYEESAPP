# 🎬 StudioTrack Pro

**Professional Desktop & Mobile Attendance and Work Report System**

A comprehensive web application for managing studio attendance, shoot tracking, and daily work reports with enterprise-grade security features.

---

## ✨ Features

### 🖥️ Desktop-Optimized Interface
- **Professional Sidebar Navigation** - Clean, organized menu system
- **Dashboard Analytics** - Visual charts and statistics
- **Keyboard Shortcuts** - Press `?` to view all shortcuts
- **Responsive Design** - Works seamlessly on laptops, desktops, and tablets
- **Real-time Updates** - Live clock and status indicators

### 🔐 Security Features
- **Password-Based Login** - Separate passwords for admin and employees
- **Two-Factor Authentication (2FA)** - Email OTP verification
- **Password Management** - Change/reset passwords anytime
- **Simulated Email Inbox** - View all OTP codes in admin panel
- **Entry Locking** - Once submitted, only admin can edit/delete

### 👨‍💼 Admin Panel
- **Dashboard** - Overview with charts and analytics
- **Employee Management** - Add/edit/delete employees
- **Indoor Shoots** - Track all indoor shoot entries
- **Outdoor Shoots** - Track all outdoor shoot entries
- **Daily Reports** - View and manage work reports
- **Settings** - Password management, 2FA toggle, Google Sheets backup

### 👷 Employee Portal
- **Indoor Shoot Entry** - Submit indoor shoot details
- **Outdoor Shoot Entry** - Submit outdoor shoot details
- **Daily Work Report** - Track tasks, hours, and summaries
- **Photo Upload** - Attach JPEG images to entries
- **Password Change** - Update personal password

---

## 🚀 Quick Start

### Login Credentials

**Admin Access:**
- Password: `admin123`
- Email: `lalit2info@gmail.com`
- 2FA: Enabled (check Email Inbox in Settings)

**Employee Access:**
| Name | Password | Email | 2FA |
|------|----------|-------|-----|
| Rahul Sharma | `rahul123` | rahul@studio.com | ✅ ON |
| Priya Patel | `priya123` | priya@studio.com | ✅ ON |
| Amit Kumar | `amit123` | amit@studio.com | ❌ OFF |
| Sneha Gupta | `sneha123` | sneha@studio.com | ✅ ON |
| Vikram Singh | `vikram123` | vikram@studio.com | ❌ OFF |

---

## ⌨️ Keyboard Shortcuts (Admin Panel)

| Shortcut | Action |
|----------|--------|
| `?` | Show/hide keyboard shortcuts |
| `Alt + 1` | Go to Dashboard |
| `Alt + 2` | Go to Employees |
| `Alt + 3` | Go to Indoor Shoots |
| `Alt + 4` | Go to Outdoor Shoots |
| `Alt + 5` | Go to Daily Reports |
| `Alt + 6` | Go to Settings |

---

## 📊 Dashboard Features

### Admin Dashboard
- **Stats Cards** - Total employees, shoots, hours, completion rate
- **Weekly Activity Chart** - Visual bar chart of shoots and reports
- **Quick Stats** - Total hours, completion rate, today's entries, pending tasks
- **Recent Shoots** - Latest shoot entries with details
- **Top Performers** - Employee rankings by hours worked

### Employee Dashboard
- **Entry Form** - Step-by-step form for submitting entries
- **History View** - Expandable cards showing all past entries
- **Photo Preview** - View uploaded images
- **Lock Status** - Visual indicator for locked entries

---

## 🔒 Security Workflow

### Login Flow
```
1. Select Role (Admin/Employee)
2. Enter Password
3. [If 2FA Enabled] Enter 6-digit OTP from Email
4. Access Granted
```

### OTP System
- **6-digit code** sent to registered email
- **5-minute expiry** on all codes
- **Resend option** available
- **Simulated inbox** in admin settings for testing

### Password Management
- **Admin** can change their own password
- **Admin** can reset any employee's password
- **Employees** can change their own password
- **Validation** - Minimum 6 characters, confirmation match

---

## 📱 Mobile & Desktop Support

### Desktop Features
- Sidebar navigation
- Dashboard with charts
- Keyboard shortcuts
- Split-view layouts
- Better data tables

### Mobile Features
- Hamburger menu
- Touch-friendly buttons
- Optimized forms
- Responsive cards

---

## 💾 Data Storage

All data is stored in **localStorage** for demo purposes:
- Employee records
- Shoot entries
- Daily reports
- Passwords
- OTP sessions
- Notifications

**Note:** For production use, integrate with a backend database.

---

## 🌐 Google Sheets Integration

Backup all data to Google Sheets:
1. Create a Google Apps Script
2. Deploy as Web App
3. Paste the URL in Settings
4. Click "Sync Now" to backup

---

## 🎨 UI/UX Highlights

- **Modern Design** - Clean, professional interface
- **Color-Coded Tabs** - Purple (Indoor), Amber (Outdoor), Green (Reports)
- **Smooth Animations** - Transitions and hover effects
- **Responsive Layout** - Works on all screen sizes
- **Accessibility** - Keyboard navigation support
- **Dark Mode Ready** - Easy to extend

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

---

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Configuration

### Change Default Passwords
1. Login as Admin
2. Go to Settings
3. Click "Change Admin Password"
4. Enter current and new passwords

### Enable/Disable 2FA
**For Admin:**
- Settings → Admin Security → Toggle 2FA

**For Employees:**
- Settings → Employee Security → Toggle 2FA per employee

---

## 📝 Entry Fields

### Shoot Entry (Indoor/Outdoor)
1. Date & Time
2. Employee Name (auto-filled)
3. Check In / Check Out
4. Total Hours (auto-calculated)
5. Location
6. Client Name
7. Project Details
8. Photo Upload (JPEG)

### Daily Report
1. Date & Time
2. Employee Name (auto-filled)
3. Check In / Check Out
4. Total Hours (auto-calculated)
5. Tasks (description, status, hours)
6. Work Summary
7. Challenges/Blockers
8. Tomorrow's Plan
9. Photo Upload (JPEG)

---

## 🔐 Security Best Practices

1. **Change default passwords** immediately after first login
2. **Enable 2FA** for all critical accounts
3. **Regular backups** to Google Sheets
4. **Monitor email inbox** for OTP codes
5. **Lock entries** after submission to prevent tampering

---

## 📞 Support

For issues or questions:
- Check the keyboard shortcuts (`?`)
- Review the Settings page
- Contact system administrator

---

## 📄 License

© 2026 StudioTrack Pro - Professional Production Management System

---

## 🎯 Future Enhancements

- Real email integration (SMTP/SendGrid)
- Backend API with database
- Export to PDF/Excel
- Advanced analytics
- Team collaboration features
- Mobile app (React Native)
- Biometric authentication
- Push notifications

---

**Built with ❤️ for professional studio management**
