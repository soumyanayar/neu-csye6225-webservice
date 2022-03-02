#!/bin/bash

#unzip webservices and move t home directory
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
