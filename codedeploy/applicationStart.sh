#!/bin/bash

echo "Copying the node server service file to /etc/systemd/system/node-server.service"
sudo cp /home/ec2-user/webservice/nodeserver.service /etc/systemd/system/nodeserver.service
echo "Enabling and Starting the node server service"
sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service
