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
  previous_tag="$(git describe --abbrev=0 "$(git describe --abbrev=0 --tags)^")"
  printf "%s" "${previous_tag}"
}

bump_deb() {
  local current_tag="${1}"
  local branch="${2}"

  local previous_tag
  previous_tag="$(retrieve_previous_tag)"

  local argline="--ignore-branch --git-author"

  if [[ "${branch}" =~ "beta" ]]; then
    argline+=" -D unstable"
  else
    argline+=" -D stable"
  fi

  gbp dch ${argline} \
    --since ${previous_tag} \
    --new-version ${current_tag} \
    --git-author
}

bump_rpm() {
  local current_tag="${1}"
  local branch="${2}"
  local name="${3}"

  local previous_tag
  previous_tag="$(retrieve_previous_tag)"

  local argline="--ignore-branch \
		--git-author \
		--spec-file=zextras-zapp-${name}.spec \
		--spawn-editor=0"

  local valid_tag="${current_tag%-beta*}b${current_tag##*.}"

  gbp rpm-ch ${argline} \
    --since ${previous_tag} \
    --changelog-revision ${valid_tag}

  sed -i -e "s/Version:\([ ]*\).*/Version:\1${valid_tag}/g" "zextras-zapp-${name}.spec"
}

install_deps() {
  local action_flag="${1}"
  local packages

  if [ -f /etc/redhat-release ]; then

    ## Set the yum proxy
    sed -i"" '2iproxy=http://aptproxy.local.zextras.com:3142' \
      /etc/yum.conf

    yum install -q -y git rpm-build || exit 1
    mkdir -p /root/rpmbuild/{BUILD,BUILDROOT,RPMS,SOURCES,SPECS,SRPMS}

  else

    #Set the apt HTTP proxy
    echo 'Acquire::HTTP::Proxy "http://aptproxy.local.studiostorti.com:3142";' >/etc/apt/apt.conf.d/01proxy
    echo 'Acquire::HTTPS::Proxy "false";' >>/etc/apt/apt.conf.d/01proxy
    ln -snf /usr/share/zoneinfo/"${TZ}" /etc/localtime && echo "${TZ}" >/etc/timezone

    if [ "${action_flag}" == "bump" ]; then
      packages="git-buildpackage \
			git-buildpackage-rpm \
			libdistro-info-perl"
    else
      packages="build-essential \
      cdbs \
      devscripts \
      fakeroot \
      git"
    fi

    apt-get update
    apt-get install -q -y \
      --no-install-recommends \
      ${packages} || exit 1
  fi
}

bump() {
  local current_tag="${1}"
  local branch="${2}"
  local name="${3}"
  set_pkgs_author
  bump_deb "${current_tag#v}" "${branch}"
  bump_rpm "${current_tag#v}" "${branch}" "${name}"
}

prepare() {
  if [ ! -d artifacts ]; then
    mkdir artifacts
  fi
}

build_rpm() {
  mv "pkg/com_zextras_zapp_${name}.zip" /root/rpmbuild/SOURCES/
  rpmbuild -ba "zextras-zapp-${name}.spec" || exit 1
  mv /root/rpmbuild/RPMS/*/*.rpm artifacts
}

build_deb() {
  mv "pkg/com_zextras_zapp_${name}.zip" .
  dpkg-buildpackage -b || exit 1
  mv ../*.deb artifacts
}

build() {
  prepare

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
      local current_tag="${2}"
      local branch=${3}
      local name=${4}
      install_deps "${1}"
      bump "${current_tag}" "${branch}" "${name}"
      ;;
    build)
      install_deps "${1}"
      local name="${2}"
      build "${name}"
      ;;
    *) usage ;;
  esac
}

process_args "$@"
