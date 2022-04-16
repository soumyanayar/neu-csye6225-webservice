#!/bin/bash

sudo yum update

echo "Installing MySQL Client"
sudo yum install -y mysql

echo "Downloading certificate bundle for MySQL"
cd /home/ec2-user
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
echo "confirm if the file global-bundle.pem is downloaded"
ls global-bundle.pem
if [ $? -eq 0 ]; then
    echo "global-bundle.pem file downloaded successfully"
else
    echo "global-bundle.pem file not downloaded"
    exit 1
fi

echo "Installing nodejs"
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_16.x | sudo -E bash -
sudo yum install -y nodejs
echo "nodejs installed successfully"
echo "$(npm --version) is the version of npm"

echo "Installing unzip"
sudo yum makecache
sudo yum install unzip -y

# New changes made
unzip /home/ec2-user/webservice.zip -d /home/ec2-user/webservice
sudo rm -rf /home/ec2-user/webservice.zip

# Install the node server
cd /home/ec2-user/webservice
sudo npm install

echo "Installing AWS CodeDeploy Agent"
sudo yum update
sudo yum install ruby -y
sudo yum install wget -y
wget https://aws-codedeploy-us-west-2.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto

echo "Installing AWS CloudWatch Agent"
sudo yum install -y aws-cfn-bootstrap
sudo yum install -y amazon-cloudwatch-agent
sudo yum install -y python-pip
sudo pip install awscli

echo "Copying the cloudwatch agent config file to /opt/cloudwatch-config.json"
sudo cp /home/ec2-user/webservice/cloudwatch-config.json /opt/cloudwatch-config.json

# Configure CloudWatch Agent
echo "Configuring CloudWatch Agent"
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s

sudo mkdir -p /home/ec2-user/webservice/logs
sudo touch /home/ec2-user/webservice/logs/csye6225.log
sudo chmod 775 /home/ec2-user/webservice/logs/csye6225.log

echo "Copying the node server service file to /etc/systemd/system/node-server.service"
sudo cp /home/ec2-user/webservice/nodeserver.service /etc/systemd/system/nodeserver.service
