require_relative './vagrant/key_authorization'

Vagrant.configure('2') do |config|
  config.vm.box = 'centos/7'
  config.ssh.insert_key = false #false to use the private key
  authorize_key_for_root config, '~/.ssh/id_dsa.pub', '~/.ssh/id_rsa.pub'

  N = 2
  (1..N).each do |server_id|
    config.vm.define "server#{server_id}" do |server|  
      server.vm.hostname = "server#{server_id}"
      server.vm.network "private_network", ip: "172.16.1.#{50+server_id}"

      if server_id == N
        server.vm.provision :ansible do |ansible|
          ansible.limit = "all"
          ansible.playbook = "main.yml"
        end      
      end
    end
  end
end