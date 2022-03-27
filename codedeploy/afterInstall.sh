#!/bin/bash

cd /home/ec2-user
pwd
ls -a
sudo unzip webservice.zip
pwd
sudo cp /home/ec2-user/app.env webservice/app.env
cd /home/ec2-user/webservice
sudo npm install
ls -a
