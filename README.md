# Playbook-Ansible
The task of this repository is to create a playbook with Ansible able to:

- Provisioning two Virtual Machines CentOs
- Control that the Doker's partition is at least equal to 40 GB (If necessary apply a resize) 
- Setup Docker on VM
- Configure Docker with:
	a) Securely exposition of the Docker Daemon REST APIs
	b) Docker Daemon with automatically start at system startup
- Configure the Docker Swarm