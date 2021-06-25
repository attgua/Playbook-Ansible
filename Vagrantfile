#require_relative './vagrant/key_authorization'

Vagrant.configure("2") do |config|

  #config.ssh.insert_key = false   #false to use the private key
  #authorize_key_for_root config, '~/.ssh/id_dsa.pub', '~/.ssh/id_rsa.pub'


	servers =[
	  {
		  :hostname =>"server1",
		  :box =>"centos/8",
		  :ip => "192.168.33.40"
	  },
    {
    	:hostname=>"server2",
    	:box =>"centos/8",
    	:ip => "192.168.33.41"
    }
	]
  config.disksize.size = '51GB'

  servers.each do |machine|
  	config.vm.define machine[:hostname] do |node|
  	      node.vm.box =machine[:box]
  	      node.vm.hostname = machine[:hostname]
  	      node.vm.network :private_network, ip: machine[:ip]
        #node.disksize.size = '40GB'

          node.vm.provision "shell" do |s|
            ssh_prv_key = ""
            ssh_pub_key = ""
            if File.file?("#{Dir.home}/.ssh/id_rsa")
              ssh_prv_key = File.read("#{Dir.home}/.ssh/id_rsa")
              ssh_pub_key = File.readlines("#{Dir.home}/.ssh/id_rsa.pub").first.strip
            else
              puts "No SSH key found. You will need to remedy this before pushing to the repository."
            end
            s.inline = <<-SHELL
              if grep -sq "#{ssh_pub_key}" /home/vagrant/.ssh/authorized_keys; then
                echo "SSH keys already provisioned."
              exit 0;
              fi
              echo "SSH key provisioning."
              mkdir -p /home/vagrant/.ssh/
              touch /home/vagrant/.ssh/authorized_keys
              echo #{ssh_pub_key} >> /home/vagrant/.ssh/authorized_keys
              echo #{ssh_pub_key} > /home/vagrant/.ssh/.pub
              chmod 644 /home/vagrant/.ssh/id_rsa.pub 
              echo sudo "#{ssh_prv_key}" > /home/vagrant/.ssh/id_rsa
              chmod 600 /home/vagrant/.ssh/id_rsa
              chown -R vagrant:vagrant /home/vagrant
              exit 0
            SHELL
          end

        #  node.vm.provision 'ansible' do |ansible|
        #  	ansible.playbook="main.yml"
        #  end
          
          node.vm.provider :virtualbox do |vb|
          	vb.customize ["modifyvm", :id, "--memory",1024]
          	vb.customize ["modifyvm", :id, "--cpus",1]
          end
	  end
  end
end