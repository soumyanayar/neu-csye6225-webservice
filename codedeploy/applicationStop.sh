#!/bin/bash

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
