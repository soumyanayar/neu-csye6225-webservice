#!/bin/bash

{
    echo "DB_HOST=database-1.chbtgrwuns7v.us-west-2.rds.amazonaws.com"
    echo "DB_PORT=3306"
    echo "DB_USERNAME=admin"
    echo "DB_PASSWORD=1pNxHsm7HlpCCrdDPESy"
    echo "DB_NAME=my_webserver_db"
    echo "PORT=3000"
    echo "AWS_BUCKET_NAME=webservice-bucket-5e1889cd-fabf-4425-b16b-c029145b795e"
} >>~/webservice/app.env

mkdir ~/.aws

{
    echo "[default]"
    echo "region=us-west-2"
} >>~/.aws/config

{
    echo "[default]"
    echo "aws_access_key_id=AKIAT2HPCMSJSSQKND5B"
    echo "aws_secret_access_key=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"
} >>~/.aws/credentials

cd ~/webservice || exit
npm install
sudo cp ~/webservice/nodeserver.service /etc/systemd/system/nodeserver.service

sudo systemctl enable nodeserver.service
sudo systemctl start nodeserver.service
