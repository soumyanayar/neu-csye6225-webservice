#!/bin/bash

echo "After Install Step started"
echo "changing the directory to /home/ec2-user"
cd /home/ec2-user
echo "Printing the current directory"
pwd
echo "Printing all the files and folders in the current directory"
ls -a
# sudo unzip webservice.zip
echo "Changing the owner of the webservice folder to ec2-user"
sudo chown -R ec2-user:ec2-user /home/ec2-user/webservice
echo "Printing the current directory"
pwd

echo "Changing the directory to /home/ec2-user/webservice"
cd /home/ec2-user/webservice
echo "Calling the npm install command"
sudo npm install
echo "npm install completed"
echo "Printing all the files and folders in the current directory"
ls -a

echo "Creating the logs directory in /home/ec2-user/webservice"
sudo mkdir -p /home/ec2-user/webservice/logs
echo "Creating the log file csye6225.log in /home/ec2-user/webservice/logs"
sudo touch /home/ec2-user/webservice/logs/csye6225.log
echo "Changing the mode of the log file to 775"
sudo chmod 775 /home/ec2-user/webservice/logs/csye6225.log

echo "Copying the node server service file to /etc/systemd/system/node-server.service"
sudo cp /home/ec2-user/webservice/nodeserver.service /etc/systemd/system/nodeserver.service

echo "Copying the cloudwatch agent config file to /opt/cloudwatch-config.json"
sudo cp /home/ec2-user/webservice/cloudwatch-config.json /opt/cloudwatch-config.json

# Configure CloudWatch Agent
echo "Configuring CloudWatch Agent"
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s

echo "Enable and start the Amazon CloudWatch Agent"
sudo systemctl start amazon-cloudwatch-agent.service
sudo systemctl enable amazon-cloudwatch-agent.service
echo "After Install Step Completed"
