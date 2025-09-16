#!/bin/bash
GH_PREFIX=https://github.com

arch=$(uname -m)
if [ $arch == 'armv7l' ]; then
   arch=armv7
fi
if [ $arch == 'x86_64' ]; then
   arch=amd64
fi
if [ $arch == 'aarch64' ]; then
  arch=arm64
fi
os=$(uname -o | tr '[:upper:]' '[:lower:]')

ver=$(curl -sL ${GH_PREFIX}/claudiodangelis/qrcp | grep -i "/claudiodangelis/qrcp/releases/tag/" | awk -F/ {'print $6'} | sed -e 's/href="\(.*\)"/\1/' | awk -F\" {'print $1'})
# get the latest release for this hardware architecture, from the list of releases
if [ $os != 'darwin' ]; then
   fn=$(curl -sL ${GH_PREFIX}/claudiodangelis/qrcp/releases | grep $ver | grep $arch | grep href | grep deb| awk -F'"'  '{print $2}')
else
   #  arm64 not built yet 3/6/25
   #if [ $arch == 'arm64' ]; then 
   #   arch=amd64
   #fi
   fn=$(curl -sL ${GH_PREFIX}/claudiodangelis/qrcp/releases | grep $ver | grep $os | grep $arch | grep href | awk -F'"'  '{print $2}')

fi

if [ $os == 'darwin' ]; then 
  suffix=gz
else 
  suffix=deb
fi
if [ '$fn'. != '.' ]; then
   ghl=${#GH_PREFIX}
   if [ ${fn:0:ghl} != ${GH_PREFIX} ]; then
        fn=${GH_PREFIX}${fn}
   fi
   curl -sL $fn > xx.$suffix
   if [ $os == 'darwin' ]; then 
      tar -xf xx.${suffix}
      #tar -xf data.tar.gz

      # Copy the binary
      cp qrcp /usr/local/bin/qrcp
      # Set execution permissions
      sudo chmod +x /usr/local/bin/qrcp
      git checkout README.md >/dev/null
   else 
      # install qrcp
      sudo dpkg -i xx.$suffix
   fi
else
    echo 'unable to find qrpc module for $arch'
fi

# add the image orientation tool
#if [ $os == 'darwin' ];then
#   brew install exiftran >/dev/null 2>&1
#else
#   sudo apt-get -y install exiftran >/dev/null
#fi
# watch out for multiple networks, just write the config file
if [ $os == 'darwin' ]; then
   nets=$(arp -a | grep ? | grep -m1 -v bridge | awk '{print $6}')
   #nets=$(ipconfig getifaddr $na)
else
   nets=$(ip link show | grep mtu | grep -v lo | grep up | grep -v -i docker | grep "state UP" | awk -F: '{print $2}' | awk '{print $1}')
fi
# if only one network
if [ $(echo $nets | wc -w ) -eq 1 ]; then
   # write it out to conf file
   echo "{ \"interface\": \"$nets\" }" >qrcp.json
else
    # split names into an array
    adapters=($nets) # split to array $diffs

    # if there are different files (array size greater than zero)
    if [ ${#adapters[@]} -gt 0 ]; then
        for adapter in "${adapters[@]}"
        do
	         # check to see if this is a wireless network (mirror on the wall)
             f=$(iwconfig $adapter | grep ESSID | awk '{print $1}')
             if [ "$f". != '.' ]; then
		        # use this adapter
                echo "{ \"interface\": \"$f\" }" >qrcp.json
		        # done with list
                break;
             fi
        done
    fi
fi
