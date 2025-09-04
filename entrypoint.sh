#!/bin/sh

COMMIT_HASH=$(cat /tmp/build/component.json | jq -r ".commit")
STATIC_DIR=/opt/zextras/web/iris/carbonio-shell-ui/"${COMMIT_HASH}"
CURRENT_DIR=/opt/zextras/web/iris/carbonio-shell-ui/current

mkdir -p "${STATIC_DIR}"
mkdir -p "${CURRENT_DIR}"

cp -r /tmp/build/* "${STATIC_DIR}"
cp -r /tmp/build/index.html "${CURRENT_DIR}"

jq -s '{components: .}' $(find /opt/zextras/web/iris -name component.json) > /opt/zextras/web/iris/components.json