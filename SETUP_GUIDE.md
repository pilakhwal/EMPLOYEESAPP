# StudioTrack Pro - Quick Setup Guide

## 🚀 INSTANT SETUP (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:5173
```

---

## 🔐 LOGIN CREDENTIALS

### Admin Login:
- **Password:** `admin123`
- **Email:** `lalit2info@gmail.com`
- **2FA:** Enabled (check Settings → Email Inbox for OTP)

### Employee Login:
| Name | Password | Email | 2FA |
|------|----------|-------|-----|
| Rahul Sharma | `rahul123` | rahul@studio.com | ✅ ON |
| Priya Patel | `priya123` | priya@studio.com | ✅ ON |
| Amit Kumar | `amit123` | amit@studio.com | ❌ OFF |
| Sneha Gupta | `sneha123` | sneha@studio.com | ✅ ON |
| Vikram Singh | `vikram123` | vikram@studio.com | ❌ OFF |

---

## 📁 PROJECT STRUCTURE

```
studiTrack-pro/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite config
├── tsconfig.json           # TypeScript config
├── README.md               # Documentation
├── FULL_APP_DUMP.txt       # Complete source dump
├── SETUP_GUIDE.md          # This file
│
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Main app component
│   ├── index.css          # Global styles
│   ├── types.ts           # TypeScript types
│   ├── store.ts           # Data management
│   ├── utils.ts           # Utility functions
│   │
│   └── components/
│       ├── Login.tsx              # Login screen
│       ├── AdminPanel.tsx         # Admin dashboard
│       ├── AdminDashboard.tsx     # Analytics dashboard
│       ├── EmployeeDashboard.tsx  # Employee portal
│       └── DesktopLayout.tsx      # Desktop wrapper
│
└── dist/                  # Built files (after npm run build)
    ├── index.html
    └── assets/
        ├── index-[hash].css
        └── index-[hash].js
```

---

## ⌨️ KEYBOARD SHORTCUTS

Press `?` in admin panel to see all shortcuts:

| Shortcut | Action |
|----------|--------|
| `?` | Show/hide shortcuts |
| `Alt + 1` | Dashboard |
| `Alt + 2` | Employees |
| `Alt + 3` | Indoor Shoots |
| `Alt + 4` | Outdoor Shoots |
| `Alt + 5` | Daily Reports |
| `Alt + 6` | Settings |

---

## 🎯 QUICK TEST FLOW

### Test Admin Login:
1. Click "Admin"
2. Enter password: `admin123`
3. Go to Settings → Email Inbox
4. Copy 6-digit OTP code
5. Enter OTP to login
6. Explore dashboard, manage employees

### Test Employee Login:
1. Click "Employee"
2. Select "Rahul Sharma"
3. Enter password: `rahul123`
4. Submit new Indoor Shoot entry
5. Upload a photo
6. View entry history

---

## 💾 DATA MANAGEMENT

### Export Data:
1. Login as Admin
2. Go to Settings
3. Click "Export All Data (JSON)"
4. File downloads automatically

### Import Data:
1. Login as Admin
2. Go to Settings → Data Backup & Restore
3. Click "Import Data (JSON)"
4. Select your backup file
5. Data restored automatically

### Clear All Data:
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

---

## 🔧 TROUBLESHOOTING

### Issue: Can't login
- Clear browser localStorage
- Refresh page
- Try default credentials

### Issue: OTP not showing
- Go to Settings → Email Inbox
- Check for verification emails
- Click "Resend Code" if needed

### Issue: Data not saving
- Check browser localStorage quota
- Export data regularly as backup
- Clear old entries if needed

---

## 📱 RESPONSIVE DESIGN

### Desktop (1920px+):
- Full sidebar navigation
- Dashboard with charts
- Keyboard shortcuts

### Tablet (768px - 1024px):
- Optimized layouts
- Touch-friendly buttons

### Mobile (< 768px):
- Hamburger menu
- Stacked forms
- Mobile-optimized UI

---

## 🌐 DEPLOYMENT

### Deploy to Vercel:
```bash
npm run build
vercel deploy
```

### Deploy to Netlify:
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Deploy to GitHub Pages:
```bash
npm run build
# Push dist/ to gh-pages branch
```

---

## 🔒 SECURITY NOTES

1. **Change default passwords** after first login
2. **Enable 2FA** for all critical accounts
3. **Regular backups** using export feature
4. **Monitor email inbox** for OTP codes
5. **Lock entries** after submission

---

## 📊 FEATURES OVERVIEW

### Admin Features:
- ✅ Dashboard with analytics
- ✅ Employee management
- ✅ Shoot entry management
- ✅ Daily report management
- ✅ Password management
- ✅ 2FA toggle per user
- ✅ Google Sheets backup
- ✅ Data export/import
- ✅ Email inbox simulation

### Employee Features:
- ✅ Indoor shoot entry
- ✅ Outdoor shoot entry
- ✅ Daily work report
- ✅ Photo upload (JPEG)
- ✅ Auto-calculated hours
- ✅ Entry history
- ✅ Password change

---

## 🛠️ TECH STACK

- **React 18.2.0** - UI framework
- **TypeScript 5.7.0** - Type safety
- **Tailwind CSS 4.1.7** - Styling
- **Vite 6.3.5** - Build tool
- **Lucide React 0.294.0** - Icons
- **LocalStorage** - Data persistence

---

## 📞 SUPPORT

For issues:
1. Check keyboard shortcuts (`?`)
2. Review Settings page
3. Check browser console for errors
4. Clear localStorage and retry

---

## 📝 CHANGELOG

### Version 3.0.0 (Current)
- ✅ Added desktop layout with sidebar
- ✅ Added dashboard analytics
- ✅ Added keyboard shortcuts
- ✅ Added password management
- ✅ Added 2FA authentication
- ✅ Added data export/import
- ✅ Updated admin email to lalit2info@gmail.com
- ✅ Enhanced responsive design

---

© 2026 StudioTrack Pro - Professional Production Management System
