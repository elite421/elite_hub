#!/bin/bash

# Create necessary directories
sudo mkdir -p /opt/myapp
sudo mkdir -p /var/log/myapp

# Set permissions
sudo chown -R $USER:$USER /opt/myapp
sudo chown -R $USER:$USER /var/log/myapp

# Install Node.js 18.x if not already installed
if ! command -v node &> /dev/null; then
    echo "Node.js not found. Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 process manager
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
    # Setup PM2 to start on boot
    pm2 startup
    sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
fi

# Install PostgreSQL client tools
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL client tools..."
    sudo apt-get install -y postgresql-client
fi

echo "Setup completed successfully!"
echo "Next steps:"
echo "1. Copy your application files to /opt/myapp"
echo "2. Create a .env file with your configuration"
echo "3. Run 'pm2 start ecosystem.config.js'"
echo "4. Run 'pm2 save' to save the process list"
echo "5. Run 'pm2 startup' and follow the instructions to enable auto-start"
