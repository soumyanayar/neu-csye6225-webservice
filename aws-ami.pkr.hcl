locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

source "amazon-ebs" "ec2" {
  ami_name        = "csye6225_spring2022_${local.timestamp}"
  ami_description = "EC2 AMI for CSYE 6225"
  instance_type   = "t2.micro"
  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
    // encrypted             = true
  }
  ssh_username                = "ec2-user"
  ami_users                   = ["906347585273"]
  associate_public_ip_address = true
  region                      = "us-west-2"
  source_ami                  = "ami-0341aeea105412b57"
}

build {
  sources = ["source.amazon-ebs.ec2"]

  // New Chancges
  provisioner "file" {
    source      = "webservice.zip"
    destination = "~/webservice.zip"
  }

  provisioner "shell" {
    scripts = [
      "rundependencies.sh"
    ]
  }
}
