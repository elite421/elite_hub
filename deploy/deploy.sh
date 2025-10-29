#!/bin/bash

# Stop existing services if running
pm2 delete all 2>/dev/null

# Update code from git (if using git)
# git pull origin main

# Install/update dependencies
npm ci --production

# Build the Next.js application
npm run build

# Ensure log directory exists
mkdir -p /var/log/myapp

# Start services using PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Set up log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Display status
pm2 status

echo "Deployment completed!"
echo "Check logs with: pm2 logs"
echo "Check status with: pm2 status"
