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

ver=$(curl -sL ${GH_PREFIX}/claudiodangelis/qrcp | grep -i "/claudiodangelis/qrcp/releases/tag/" | awk -F/ {'print $6'} | sed -e 's/href="\(.*\)"/\1/' | awk -F\" {'print $1'})
# get the latest release for this hardware architecture, from the list of releases
fn=$(curl -sL ${GH_PREFIX}/claudiodangelis/qrcp/releases | grep $ver | grep $arch | grep href | grep deb| awk -F'"'  '{print $2}')

if [ '$fn'. != '.' ]; then
   if [ ${fn:0:17} != ${GH_PREFIX} ]; then
        fn=${GH_PREFIX}${fn}
   fi
   # download the  file for this machine
   curl -sL $fn > xx.deb
   # install qrcp
   sudo dpkg -i xx.deb
else
    echo 'unable to find qrpc module for $arch'
fi

# add the image orientation tool
sudo apt-get -y install exiftran
# watch out for multiple networks, just write the config file
nets=$(ip link show | grep mtu | grep -v lo | grep up | grep -v -i docker | grep "state UP" | awk -F: '{print $2}' | awk '{print $1}')
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
