#!/bin/bash

# Copy cloudwatch agent config file
echo "Copying the cloudwatch agent config file to /opt/cloudwatch-config.json"
sudo cp /home/ec2-user/webservice/cloudwatch-config.json /opt/cloudwatch-config.json

# Configure CloudWatch Agent
echo "Configuring CloudWatch Agent"
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s
sudo chmod 775 /home/ec2-user/webservice/logs/csye6225.log

echo "Copying the node server service file to /etc/systemd/system/node-server.service"
sudo cp /home/ec2-user/webservice/nodeserver.service /etc/systemd/system/nodeserver.service
echo "Enabling and Starting the node server service"
sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service
