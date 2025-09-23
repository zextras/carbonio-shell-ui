FROM alpine

RUN apk add --no-cache jq

COPY dist /tmp/build

RUN COMMIT_ID=$(jq -r .commit /tmp/build/component.json) \
&& SHELL_PATH="/opt/zextras/web/iris/carbonio-shell-ui" \
&& mkdir -p "${SHELL_PATH}/${COMMIT_ID}" \
&& mkdir -p "${SHELL_PATH}/current" \
&& cp -r /tmp/build/* "${SHELL_PATH}/${COMMIT_ID}" \
&& cp  /tmp/build/index.html "${SHELL_PATH}/current/index.html" \
&& rm -r /tmp/build

ENTRYPOINT ["/bin/sh", "-c", "jq -s '{components: .}' $(find /opt/zextras/web/iris/ -name component.json) > /opt/zextras/web/iris/components.json"]