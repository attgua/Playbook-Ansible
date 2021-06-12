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

To make this playbook work properly are required:

* `[VirtualBox](https://www.virtualbox.org/)`
* `[Vagrant](https://www.ansible.com/)` 
* `[Ansible](ansible.com)*`

The presence of *[vagrant-hostsupdater](https://github.com/agiledivider/vagrant-hostsupdater)* is also recommended for an automatic management of hosts, which otherwise can still be done manually.

To create a secure SSH connection, in addition to the connection provided by Vagrant, you can follow, from the step two, the *the path to success* to build a convenient local playground present [here](https://max.engineer/six-ansible-practices#automate-adding-your-pub-key-to-vms).

Otherwise if you have correctly set private key, public key and config in your `\~.ssh` folder you just can use the script present in Vagranfile (taken from [here](https://stackoverflow.com/questions/30075461/how-do-i-add-my-own-public-key-to-vagrant-vm)) of this repo that the first time it is run it will copy its public key on the VM allowing access as `ssh vagrant@your_device_name`.


## Startup CentOS

Make sure you have the minimum requirements of `2 cpu` and `2048 MB` of allocable RAM memory (oterwhise change those settings before launching the machines).

You can launch the two VM with the command:

```
vagrant up

```

that will launch two CentOS 7 virtual machines with the name `Server1` and `Server2` and ip `192.168.33.40/41`. 

Furthermore, thanks to the script mentioned, the access key for the connection is provided (only if the key is not present).

## Control Memory

This solution is ispired from [this](https://stackoverflow.com/questions/26981907/using-ansible-to-manage-disk-space) solved-problem on stackoverflow.

At the execution of the main ansible:
```
ansible-playbook -i hosts main.yml
```
the first role passed has the task of carrying out a check on the amount of memory, made possible by the loop `loop: "{{ ansible_mounts|flatten(levels=1) }}"` which checks that the amount of memory is greater than 40 GB.

If fails it actives the next two conditions. 
The first condition installs the `lvm2` package. 
The second condition with `fasdam` now disponible resizes the disk memory.


## Install Docker

A pre-configured playbook made by [yonglai](https://gist.github.com/yonglai/d4617d6914d5f4eb22e4e5a15c0e9a03) is used to install docker.

First yum is installed as a package manager.






