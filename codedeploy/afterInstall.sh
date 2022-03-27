#!/bin/bash

cd /home/ec2-user
pwd
ls -a
sudo chown -R ec2-user:ec2-user /home/ec2-user/webservice
sudo unzip webservice.zip
pwd
sudo cp /home/ec2-user/app.env webservice/app.env
cd /home/ec2-user/webservice
sudo npm install
ls -a
