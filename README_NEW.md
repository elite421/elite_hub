# 🚀 QR Code Authentication System

A secure authentication system that uses QR codes for login verification. Users scan a QR code with their phone, receive a hash code via WhatsApp, and send it to the company number to complete authentication.

**Company WhatsApp Number:** `+91 82794 39828`

## 📋 Prerequisites

- Node.js 18.x or later
- PostgreSQL 12 or later
- WhatsApp Business API access (or WhatsApp Web)
- Git
- PM2 (for production)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and update the values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration. Key variables to update:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/your_database

# Authentication
NEXTAUTH_SECRET=your_secure_nextauth_secret
JWT_SECRET=your_secure_jwt_secret

# WhatsApp
BOT_SERVICE_URL=http://localhost:4002
BOT_CLIENT_ID=your_bot_id
DEFAULT_COUNTRY_CODE=91

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_admin_password
ADMIN_PHONE=918279439828  # Company WhatsApp number with country code
```

### 4. Database Setup

1. Create a PostgreSQL database
2. Run the database migrations:

```bash
# Install PostgreSQL client if needed
sudo apt-get install postgresql-client

# Run the database setup script
chmod +x deploy/setup-db.sh
./deploy/setup-db.sh
```

### 5. Start Development Server

```bash
# Start Next.js development server
npm run dev

# In a separate terminal, start the WhatsApp bot
npm run bot:local
```

Visit `http://localhost:3000` in your browser.

## 🚀 Production Deployment

### Using PM2 (Recommended)

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start the application:
   ```bash
   # Build the application
   npm run build
   
   # Start with PM2
   pm2 start ecosystem.config.js --env production
   
   # Save PM2 process list
   pm2 save
   
   # Set up PM2 to start on boot
   pm2 startup
   ```

### Environment Variables

For production, make sure to set these environment variables:

- `NODE_ENV=production`
- `NEXTAUTH_URL` - Your production URL (e.g., `https://yourdomain.com`)
- `DATABASE_URL` - Your production database connection string
- `JWT_SECRET` - A secure random string for JWT signing
- `BOT_SERVICE_URL` - URL where the WhatsApp bot is running
- `ADMIN_PHONE` - Company WhatsApp number with country code (e.g., `918279439828`)

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify `DATABASE_URL` is correct
   - Ensure PostgreSQL is running and accessible
   - Check database user permissions

2. **WhatsApp Bot Not Starting**
   - Check if port 4002 is available
   - Verify WhatsApp Web session directory permissions
  
3. **Authentication Problems**
   - Ensure `NEXTAUTH_SECRET` is set and consistent
   - Check JWT configuration

## 📞 Support

For support, please contact:
- **Email:** support@yourdomain.com
- **WhatsApp:** +91 82794 39828

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

- All sensitive data is encrypted
- Regular security updates
- Rate limiting enabled
- CSRF protection

---

*Last Updated: October 27, 2025*
