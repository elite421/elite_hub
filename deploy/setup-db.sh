#!/bin/bash

# This script sets up the PostgreSQL database
# Run this on your database server

# Replace these with your desired database name and user
DB_NAME="myapp_db"
DB_USER="myapp_user"

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# Update PostgreSQL config to allow connections
PG_VERSION=$(psql --version | awk '{print $3}' | cut -d. -f1-2)
PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"

# Allow connections from localhost
if ! grep -q "listen_addresses" $PG_CONF; then
    echo "listen_addresses = '*'" | sudo tee -a $PG_CONF
else
    sudo sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" $PG_CONF
fi

# Update pg_hba.conf to allow password authentication
if ! grep -q "host    $DB_NAME" $PG_HBA; then
    echo "host    $DB_NAME    $DB_USER    127.0.0.1/32    md5" | sudo tee -a $PG_HBA
    echo "host    $DB_NAME    $DB_USER    ::1/128         md5" | sudo tee -a $PG_HBA
fi

# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql

echo "PostgreSQL setup completed!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Please update your .env file with the database credentials"
