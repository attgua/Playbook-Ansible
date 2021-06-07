# Playbook-Ansible
The task of this repository is to create a **playbook with Ansible** able to:

- Provisioning two Virtual Machines CentOs
- Control that the Doker's partition is at least equal to 40 GB (If necessary apply a resize) 
- Setup Docker on VM
- Configure Docker with: <br/>
  - Securely exposition of the Docker Daemon REST APIs <br/>
  - Docker Daemon with automatically start at system startup
- Configure the Docker Swarm

## Setup

The following procedure has been tested on **Ubuntu 18.04.5 LTS**.

install ansible

'''
$ sudo apt update
$ sudo apt install software-properties-common
$ sudo add-apt-repository --yes --update ppa:ansible/ansible
$ sudo apt install ansible
'''
