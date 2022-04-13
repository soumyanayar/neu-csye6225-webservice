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
# echo "Copying the /home/ec2-user/app.env to /home/ec2-user/webservice/app.env"
# sudo cp /home/ec2-user/app.env /home/ec2-user/webservice/app.env
echo "Changing the directory to /home/ec2-user/webservice"
cd /home/ec2-user/webservice
echo "Calling the npm install command"
sudo npm install
echo "npm install completed"
echo "Printing all the files and folders in the current directory"
ls -a

echo "Enable and start the Amazon CloudWatch Agent"
sudo systemctl start amazon-cloudwatch-agent.service
sudo systemctl enable amazon-cloudwatch-agent.service
echo "After Install Step Completed"
