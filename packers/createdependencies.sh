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
echo "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Z/H9LtQh%jSD';" >createdb.sql
mysql --connect-expired-password -u root --password="$DB_PASSWORD" mysql <createdb.sql
DB_PASSWORD=Z/H9LtQh%jSD
mysqladmin -u root -p"$DB_PASSWORD" create "$DB_NAME"
echo "mysql database $DB_NAME created"
echo "Install nodejs"
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

echo "nodejs installed successfully"
echo "$(npm --version) is the version of npm"

sudo yum makecache
sudo yum install unzip -y
unzip webservice.zip -d ~/webservice

{
    echo "DB_HOST=$DB_HOST"
    echo "DB_PORT=$DB_PORT"
    echo "DB_USERNAME=$DB_USERNAME"
    echo "DB_PASSWORD=$DB_PASSWORD"
    echo "DB_NAME=$DB_NAME"
    echo "PORT=$PORT"
} >>~/webservice/app.env

cd ~/webservice || exit
npm install
sudo cp ~/webservice/nodeserver.service /etc/systemd/system/nodeserver.service

sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service
