# Deployment Guide

This guide explains how to deploy the application on an Ubuntu server with PostgreSQL.

## Prerequisites

- Ubuntu 20.04/22.04 LTS server
- Node.js 18.x or later
- PostgreSQL 12 or later
- PM2 (will be installed by the setup script)
- Git (optional, for pulling updates)

## Server Setup

1. **Update system packages**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install required dependencies**
   ```bash
   sudo apt install -y build-essential
   ```

## Database Setup

1. **Run the database setup script**
   ```bash
   chmod +x deploy/setup-db.sh
   sudo ./deploy/setup-db.sh
   ```

2. **Update your .env file** with the database credentials:
   ```
   DATABASE_URL=postgresql://myapp_user:your_secure_password@localhost:5432/myapp_db
   ```

## Application Deployment

1. **Copy application files** to the server
   ```bash
   sudo mkdir -p /opt/myapp
   sudo chown -R $USER:$USER /opt/myapp
   # Copy your application files to /opt/myapp
   ```

2. **Run the setup script**
   ```bash
   chmod +x deploy/setup.sh
   ./deploy/setup.sh
   ```

3. **Configure environment variables**
   Create a `.env` file in `/opt/myapp` with all required environment variables.

4. **Deploy the application**
   ```bash
   cd /opt/myapp
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

## Managing the Application

- **View logs**: `pm2 logs`
- **Check status**: `pm2 status`
- **Restart services**: `pm2 restart all`
- **Stop services**: `pm2 stop all`
- **Start services**: `pm2 start ecosystem.config.js --env production`

## Updating the Application

1. Pull the latest changes (if using Git)
   ```bash
   cd /opt/myapp
   git pull
   ```

2. Run the deploy script
   ```bash
   ./deploy/deploy.sh
   ```

## Troubleshooting

- **Check PM2 logs**: `pm2 logs`
- **Check PostgreSQL logs**: `sudo tail -f /var/log/postgresql/*.log`
- **Check system logs**: `journalctl -u postgresql`

## Security Considerations

1. **Firewall**: Ensure your firewall allows traffic on ports 3000 (Next.js) and any ports used by your bot.
   ```bash
   sudo ufw allow 3000/tcp
   sudo ufw enable
   ```

2. **SSL**: Set up Nginx as a reverse proxy with Let's Encrypt for HTTPS.

3. **Environment Variables**: Never commit sensitive data in `.env` files.

## Backup

Set up regular backups for your PostgreSQL database:

```bash
# Create a backup directory
mkdir -p ~/db_backups

# Create a backup script
cat > ~/backup_db.sh << 'EOL'
#!/bin/bash
BACKUP_DIR=~/db_backups
DATE=$(date +%Y%m%d_%H%M%S)
PGPASSWORD=your_secure_password pg_dump -U myapp_user -h localhost myapp_db > $BACKUP_DIR/backup_$DATE.sql
# Keep only the last 7 backups
ls -t $BACKUP_DIR/backup_*.sql | tail -n +8 | xargs rm -f
EOL

# Make it executable
chmod +x ~/backup_db.sh

# Add to crontab to run daily
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup_db.sh") | crontab -
```

## Next Steps

1. Set up a reverse proxy (Nginx/Apache) for better security and performance
2. Configure SSL certificates (Let's Encrypt)
3. Set up monitoring (PM2 monitoring, database monitoring)
4. Configure log rotation for application logs
