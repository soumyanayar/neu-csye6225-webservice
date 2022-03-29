#!/bin/bash

sudo yum update

echo "Installing MySQL Client"
sudo yum install -y mysql

echo "Installing nodejs"
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
echo "nodejs installed successfully"
echo "$(npm --version) is the version of npm"

echo "Installing unzip"
sudo yum makecache
sudo yum install unzip -y

# New changes
unzip webservice.zip -d ~/webservice

echo "Installing AWS CodeDeploy Agent"
sudo yum update
sudo yum install ruby -y
sudo yum install wget -y
wget https://aws-codedeploy-us-west-2.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
