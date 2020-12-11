#!/bin/bash
set -ex
export DEBIAN_FRONTEND=noninteractive
export TZ=Europe/Rome

set_pkgs_author() {
  git config user.name "Zextras SRL"
  git config user.email "packages@zextras.com"
}

retrieve_previous_tag() {
  local previous_tag
  if [ ! -f /usr/bin/git ]; then
    install_deps
  fi
  previous_tag="$(git describe --abbrev=0 "$(git describe --abbrev=0 --tags)^")"
  printf "%s" "${previous_tag}"
}

bump_deb() {
  local previous_version="${1}"
  local current_version="${2}"
  local branch="${3}"

  local argline="--debian-branch $branch --git-author"

  if [[ "${branch}" =~ "beta" ]]; then
    argline+=" -D unstable"
  else
    argline+=" -D stable"
  fi

  gbp dch ${argline} \
    --since ${previous_version} \
    --new-version ${current_version} \
    --git-author
}

bump_rpm() {
  local previous_version="${1}"
  local current_version="${2}"
  local branch="${3}"
  local name="${4}"

  local argline="--packaging-branch $branch \
    --git-author \
    --spec-file=zextras-zapp-$name.spec \
    --spawn-editor=0"

  local valid_rel=${current_version%*.beta*}b${current_version##*.}
  
  gbp rpm-ch ${argline} \
    --since ${previous_version} \
    --changelog-revision ${valid_rel}

  sed -i -e "s/Version:\([ ]*\).*/Version:\1${valid_rel}/g" zextras-zapp-$name.spec
}

install_deps() {
  if [ -f /etc/redhat-release ]; then

    ## Set the yum proxy
    sed -i"" '2iproxy=http://aptproxy.local.zextras.com:3142' \
    /etc/yum.conf

    yum install -y rpm-build
    mkdir -p /root/rpmbuild/{BUILD,BUILDROOT,RPMS,SOURCES,SPECS,SRPMS}

  else

    #Set the apt HTTP proxy
    echo 'Acquire::HTTP::Proxy "http://aptproxy.local.studiostorti.com:3142";' >/etc/apt/apt.conf.d/01proxy
    echo 'Acquire::HTTPS::Proxy "false";' >>/etc/apt/apt.conf.d/01proxy
    ln -snf /usr/share/zoneinfo/"$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

    apt-get update
    apt-get install -y --no-install-recommends \
      build-essential \
      cdbs \
      devscripts \
      fakeroot \
      git-buildpackage \
      git-buildpackage-rpm \
      libdistro-info-perl

  fi
}

bump() {
  local previous_version="${1}"
  local current_version="${2}"
  local branch="${3}"
  local name="${4}"
  bump_deb "${previous_version}" "${current_version#v}" "${branch}"
  bump_rpm "${previous_version}" "${current_version#v}" "${branch}" "${name}"
}

prepare() {
  if [ ! -d artifacts ]; then
    mkdir artifacts
  fi
}

build_rpm() {
  mv "pkg/com_zextras_zapp_$name.zip" /root/rpmbuild/SOURCES/
  rpmbuild -ba "zextras-zapp-$name.spec" || exit 1
  mv /root/rpmbuild/RPMS/*/*.rpm artifacts
}

build_deb() {
  mv "pkg/com_zextras_zapp_$name.zip" .
  dpkg-buildpackage -b || exit 1
  mv ../*.deb artifacts
}

build() {
  prepare
  set_pkgs_author
  install_deps
  if [ -f /etc/redhat-release ]; then
    build_rpm
  else
    build_deb
  fi
}

usage() {
  echo "${0}: usage: ./build-pkgs.sh build <zapp_component>"
  echo "${0}:        ./build-pkgs.sh bump <current_version> <branch> <zapp_component>"
  exit 1
}

# Script entrypoint
process_args() {

  case "$1" in
    bump)
      local current_version="${2}"
      local branch=${3}
      local name=${4}
      local previous_version
      previous_version="$(retrieve_previous_tag)"

      bump "${previous_version}" "${current_version}" "${branch}" "${name}"
      ;;
    build)
      local name="${2}"
      build "${name}"
      ;;
    *) usage ;;
  esac
}

process_args "$@"
