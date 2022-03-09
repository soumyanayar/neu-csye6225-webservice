#!/bin/bash

sudo yum update

echo "Install MySQL Client"
sudo yum install mysql

echo "Install nodejs"
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs

echo "nodejs installed successfully"
echo "$(npm --version) is the version of npm"

sudo yum makecache
sudo yum install unzip -y
unzip webservice.zip -d ~/webservice
