#!/bin/bash

sudo yum update
sudo wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo rpm -Uvh mysql80-community-release-el7-3.noarch.rpm
sudo yum install mysql-server -y

sudo systemctl start mysqld
sudo systemctl enable mysqld

echo "mysql server started"
DB_PASSWORD="$(sudo grep 'temporary password' /var/log/mysqld.log | rev | cut -d" " -f1 | rev | tr -d ".")"
echo "$DB_PASSWORD is the password for the mysql server"
echo "$DB_HOST is the hostname of the mysql server"
echo "$DB_USERNAME is the username for the mysql server"

echo "Install nodejs"
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

echo "nodejs installed successfully"
echo "$(npm --version) is the version of npm"
