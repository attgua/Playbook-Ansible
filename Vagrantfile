Vagrant.configure("2") do |config|

	servers =[
	  {
		  :hostname =>"Server1",
		  :box =>"centos/7",
		  :ip => "172.16.1.50"
	  },
    {
    	:hostname=>"Server2",
    	:box =>"centos/7",
    	:ip => "172.16.1.51"
    }
	]

  servers.each do |machine|
  	config.vm.define machine[:hostname] do |node|
  	      node.vm.box =machine[:box]
  	      node.vm.hostname = machine[:hostname]
  	      node.vm.network :private_network, ip: machine[:ip]
          
          node.vm.provision 'ansible' do |ansible|
          	ansible.playbook="main.yml"
          end
          
          node.vm.provider :virtualbox do |vb|
          	vb.customize ["modifyvm", :id, "--memory",1024]
          	vb.customize ["modifyvm", :id, "--cpus",1]

          end
	  end
  end
end