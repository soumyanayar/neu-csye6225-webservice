locals { timestamp = regex_replace(timestamp(), "[- TZ:]", "") }

source "amazon-ebs" "ec2" {
  ami_name                    = "csye6225_spring2022_${local.timestamp}"
  ami_description             = "EC2 AMI for CSYE 6225"
  instance_type               = "t2.micro"
  ssh_username                = "ec2-user"
  ssh_private_key_file        = "/Users/soumyanayar/.ssh/id_ed25519"
  ssh_keypair_name            = "soumya_sshkey"
  associate_public_ip_address = true
  region                      = "us-west-2"
  source_ami                  = "ami-0341aeea105412b57"
}

build {
  sources = ["source.amazon-ebs.ec2"]
}
