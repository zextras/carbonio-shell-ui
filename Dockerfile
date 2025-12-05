FROM --platform=$BUILDPLATFORM backplane/jq:latest@sha256:aa00858476e259336dc224ff7e1e43706e2e26ed52a975d5f34f66c82ba9455d AS builder

# Define path variables
ENV IRIS_BASE_PATH="/opt/zextras/web/iris" \
    WEB_PATH="/opt/zextras/web/iris/carbonio-shell-ui"

# Copy dist first so we can read component.json
COPY dist /tmp/dist

# Extract COMMIT_ID and set up directories
RUN COMMIT_ID=$(jq -r .commit /tmp/dist/component.json) \
    && mkdir -p "${WEB_PATH}/current" \
    && mv /tmp/dist/index.html "${WEB_PATH}/current/index.html" \
    && mkdir -p "${WEB_PATH}/${COMMIT_ID}" \
    && mv /tmp/dist/* "${WEB_PATH}/${COMMIT_ID}/"

# Final stage - built for all target platforms
FROM backplane/jq:latest@sha256:aa00858476e259336dc224ff7e1e43706e2e26ed52a975d5f34f66c82ba9455d

# Re-define path variable for final stage
ENV IRIS_BASE_PATH="/opt/zextras/web/iris"

# Just copy the prepared files
COPY --from=builder /opt/zextras /opt/zextras

# Generate components.json from all component.json files
ENTRYPOINT ["/bin/sh", "-c", "jq -s '{components: .}' $(find ${IRIS_BASE_PATH}/ -name component.json) > ${IRIS_BASE_PATH}/components.json"]
