#!/bin/bash

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

{
    echo "DB_HOST=$DB_HOST"
    echo "DB_PORT=$DB_PORT"
    echo "DB_USERNAME=$DB_USERNAME"
    echo "DB_PASSWORD=$DB_PASSWORD"
    echo "DB_NAME=$DB_NAME"
    echo "PORT=$PORT"
} >>~/webservice/app.env
