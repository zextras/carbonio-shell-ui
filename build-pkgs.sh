#!/bin/bash

if [ $# -ne 1 ]; then
    echo "$0: usage: build-pkgs.sh <zapp_component>"
    exit 1
fi

name=$1

mkdir artifacts

if [ -f /etc/redhat-release ]; then
  ## Set the yum proxy
  sed -i"" '2iproxy=http://aptproxy.local.zextras.com:3142' /etc/yum.conf

  yum install -y rpm-build
  mkdir -p /root/rpmbuild/{BUILD,BUILDROOT,RPMS,SOURCES,SPECS,SRPMS}
  mv "pkg/com_zextras_zapp_$name.zip" /root/rpmbuild/SOURCES/
  rpmbuild -ba "zextras-zapp-$name.spec" || exit 1
  mv /root/rpmbuild/RPMS/*/*.rpm artifacts
else
  # Set the apt HTTP proxy
  echo 'Acquire::HTTP::Proxy "http://aptproxy.local.studiostorti.com:3142";' >/etc/apt/apt.conf.d/01proxy
  echo 'Acquire::HTTPS::Proxy "false";' >>/etc/apt/apt.conf.d/01proxy

  apt-get update
  apt-get install -y --no-install-recommends \
    build-essential \
    cdbs \
    devscripts \
    equivs \
    fakeroot
  mv "pkg/com_zextras_zapp_$name.zip" .
  dpkg-buildpackage -b || exit 1
  mv ../*.deb artifacts
fi

