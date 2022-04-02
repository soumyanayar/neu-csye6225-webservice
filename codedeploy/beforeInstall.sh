#!/bin/bash

# echo "Stopping the cloudwatch agent"
# sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop || true

echo "If nodeserver is running, stop it"
sudo systemctl status nodeserver.service
if [ $? -eq 0 ]; then
    echo "Stopping node server service"
    sudo systemctl stop nodeserver.service
    echo "Disabling node server service"
    sudo systemctl disable nodeserver.service
fi

echo "if any app is running at port 3000, stop it"
sudo lsof -t -i:3000
if [ $? -eq 0 ]; then
    echo "Killing the process at port 3000"
    sudo kill -9 $(sudo lsof -t -i:3000)
fi

cd /home/ec2-user
sudo rm -rf webservice

# install aws clodwatch agent
echo "Installing aws cloudwatch agent"
sudo yum install -y aws-cfn-bootstrap
sudo yum install -y amazon-cloudwatch-agent
sudo yum install -y python-pip
sudo pip install awscli
