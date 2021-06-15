[![Build Status](https://www.travis-ci.com/attgua/Playbook-Ansible.svg?branch=main)](https://www.travis-ci.com/attgua/Playbook-Ansible)

# Playbook-Ansible
The task of this repository was to create a **playbook with Ansible** able to:

- Provisioning two Virtual Machines CentOs
- Control that the Doker's partition is at least equal to 40 GB (If necessary apply a resize) 
- Setup Docker on VM
- Configure Docker with: <br/>
  - Securely exposition of the Docker Daemon REST APIs <br/>
  - Docker Daemon automatically start at system startup
- Configure the Docker Swarm

## Setup

To make this playbook work properly are required:

* [VirtualBox](https://www.virtualbox.org/)
* [Vagrant](https://www.ansible.com/)
* [Ansible](https://ansible.com)

The presence of *[vagrant-hostsupdater](https://github.com/agiledivider/vagrant-hostsupdater)* is also recommended for automatic management of hosts, which otherwise can still be done manually.

To create a secure SSH connection, in addition to the connection provided by Vagrant, you can follow, from step two, the *the path to success* to build a convenient local playground present [here](https://max.engineer/six-ansible-practices#automate-adding-your-pub-key-to-vms).

Otherwise, if you have correctly set private key, public key, and config in your `\~.ssh` folder you just can use the script present in Vagranfile (taken from [here](https://stackoverflow.com/questions/30075461/how-do-i-add-my-own-public-key-to-vagrant-vm)) of this repo that the first time it is run it will copy its public key on the VM allowing access as `ssh vagrant@your_device_name`.


## Startup CentOS

Make sure you have the minimum requirements of `2 CPU` and `2048 MB` of allocable RAM (otherwise change those settings before launching the machines).

You can launch the two VM with the command:

```
$ vagrant up

```

that will launch two CentOS 7 virtual machines with the name `Server1` and `Server2` and IP `192.168.33.40/41`. 

Furthermore, thanks to the script mentioned, the access key for the connection is provided (only if the key is not present).

## Control Memory

This solution is inspired from [this](https://stackoverflow.com/questions/26981907/using-ansible-to-manage-disk-space) solved-problem on StackOverflow.

At the execution of the main ansible:
```
$ ansible-playbook -i hosts main.yml
```
the first role passed has the task of carrying out a check on the amount of memory, made possible by the loop `loop: "{{ ansible_mounts|flatten(levels=1) }}"` which checks that the amount of memory is greater than 40 GB.

If fails it actives the next two conditions. 
The first condition installs the `lvm2` package. 
The second condition with `fasdam` now disponible resizes the disk memory.


## Docker Setup

A pre-configured playbook made by [yonglai](https://gist.github.com/yonglai/d4617d6914d5f4eb22e4e5a15c0e9a03) is used as a base to install docker.
I added control of the presence of the packages, so if the playbook is played more times the packages already present will be skipped.

As a Docker setup, I wrote a routine that opens TCP port `2377` (for cluster management communications) TCP and UDP port `7946` (for communication among nodes), and UDP port `4789` (for overlay network traffic) as directly indicated in the docker documentation.
At the end of this routine, the firewalld and the Docker system are reloaded to guarantee the correct configuration.

## Docker Configuration

To expose the Docker Daemon in a more 'secure' way I followed again the [docker documentation](http://docs.docker.oeynet.com/engine/security/https/).
I created a CA, server, and client key with OpenSSL for the two centO servers. Otherwise, Docker would have communicated using an exposed HTTP socket.
Thanks to these certifications it is not possible to contact the Docker Daemon without the authentication.
Following this path, I had to config automatically the new Service TPS.
I have found useful the playbook [ansible-role-docker-tls](https://github.com/cromarty/ansible-role-docker-tls).
I disabled all the functions of this playbook except the one that overrides the docker file with the new settings. I added a personalized creation of the directory for each server and the importation of the certifications previously created. Finally, I added a new template (override.config2.j2) to configure either the second machine. 


## Docker Swarm

For the Docker Swarm settings, I found a very useful preconfigured [playbook](https://github.com/atosatto/ansible-dockerswarm).
I chose it because it is very well documented on how to use it e rich of activable rules.
On this was also present a configuration on how to install and activate Docker on your machine (now those functions are deactivated but fell free of using them instead of the one in "install_docker").
In this rule, after have divided my hosts in "swarm_manager" (server1) and "swarm_worker" (server2), a Docker swarm is created in with the master is the server1 and the only worker is the server2. This was well set I only needed to change the swarm configuration in a way that the address to use was 192.168.33.40.


## Check 

To check if the playbook works correctly you can:

- Check the security of the Daemon:

  - connection with server1:
```

$ docker --tlsverify --tlscacert=certs/s1/ca.pem --tlscert=certs/s1/cert.pem --tlskey=certs/s1/key.pem -H=192.168.33.40:2376 version

```
  - connection with server2

```

$ docker --tlsverify --tlscacert=certs/s2/ca.pem --tlscert=certs/s2/cert.pem --tlskey=certs/s2/key.pem -H=192.168.33.41:2376 version 

```

- Log in the server1 and verify it is the master:

```

$ ssh vagrant@server1
$ docker node ls

```

  If is working you should see:
```

ID                            HOSTNAME   STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
4dzy1fpyyhdcg7vczzy16mzx2 *   server1    Ready     Active         Leader           20.10.7
wf502ogvhba9w3psnos1938lv     server2    Ready     Active                          20.10.7

```

- [Deploy a service](https://docs.docker.com/engine/swarm/swarm-tutorial/deploy-service/) on your machine: 

```

$ ssh vagrant@server1

$ docker service create --replicas 1 --name helloworld alpine ping docker.com
w13grvkrf2qcn20xrizo1nijw
overall progress: 1 out of 1 tasks 
1/1: running   [==================================================>] 
verify: Service converged 

$ docker service ls
ID             NAME         MODE         REPLICAS   IMAGE           PORTS
w13grvkrf2qc   helloworld   replicated   1/1        alpine:latest   


```
 






