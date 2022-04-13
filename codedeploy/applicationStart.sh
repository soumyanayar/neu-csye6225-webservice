#!/bin/bash

echo "Application Start Step started"

echo "Copy the app.env file to /home/ec2-user/webservice/app.env"
sudo cp /home/ec2-user/app.env /home/ec2-user/webservice/app.env

echo "Enabling the node server service"
sudo systemctl enable nodeserver.service
echo "Starting the node server service"
sudo systemctl start nodeserver.service

echo "Application Start Step Completed"
