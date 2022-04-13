#!/bin/bash

echo "Application Start Step started"

# Copy cloudwatch agent config file
# echo "Copying the cloudwatch agent config file to /opt/cloudwatch-config.json"
# sudo cp /home/ec2-user/webservice/cloudwatch-config.json /opt/cloudwatch-config.json

# # Configure CloudWatch Agent
# echo "Configuring CloudWatch Agent"
# sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/cloudwatch-config.json -s

# echo "Creating the logs directory in /home/ec2-user/webservice"
# sudo mkdir -p /home/ec2-user/webservice/logs
# echo "Creating the log file csye6225.log in /home/ec2-user/webservice/logs"
# sudo touch /home/ec2-user/webservice/logs/csye6225.log
# echo "Changing the mode of the log file to 775"
# sudo chmod 775 /home/ec2-user/webservice/logs/csye6225.log

# echo "Copying the node server service file to /etc/systemd/system/node-server.service"
# sudo cp /home/ec2-user/webservice/nodeserver.service /etc/systemd/system/nodeserver.service
# echo "Enabling the node server service"
# sudo systemctl enable nodeserver.service
# echo "Starting the node server service"
# sudo systemctl start nodeserver.service

echo "Copy the app.env file to /home/ec2-user/webservice/app.env"
sudo cp /home/ec2-user/webservice/app.env /home/ec2-user/webservice/app.env

echo "Start and enable the node server service"
sudo systemctl start nodeserver.service
sudo systemctl enable nodeserver.service

echo "Application Start Step Completed"
