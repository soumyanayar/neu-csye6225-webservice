#!/bin/bash

#unzip webservices and move t home directory
sudo yum makecache
sudo yum install unzip -y
unzip webservice.zip -d ~/webservice

cd ~/webservice || exit

npm install

sudo cp ~/webservice/nodeserver.service /etc/systemd/system/nodeserver.service

sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service
