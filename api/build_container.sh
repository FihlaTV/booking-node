#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd -P)"
BUILD_DIR=${DIR}/build
VARS_FILE=${DIR}/vars.cfg

DOCKER=$( which docker 2> /dev/null )

[ ! -x "$DOCKER" ] && echo "Missing 'docker' executable: ${DOCKER}" && exit 1
[ ! -f "$VARS_FILE" ] && echo "Missing vars file: ${VARS_FILE}" && exit 1
[ ! -d "$BUILD_DIR" ] && echo "Missing build dir: ${BUILD_DIR}" && exit 1

# shellcheck source=vars.cfg
source $VARS_FILE

[ ! "$AUTHOR_NAME" ] && echo "Missing AUTHOR_NAME variable" && exit 1
[ ! "$IMAGE_NAME" ] && echo "Missing IMAGE_NAME variable" && exit 1

if [ "$1" = '--for-tests' ]; then
    $DOCKER build -t "generic/booking-node-api-from" $BUILD_DIR
    $DOCKER build -t "generic/booking-node-api-tests" -f ${BUILD_DIR}/Dockerfile_for_tests $BUILD_DIR
else
    $DOCKER build -t "${AUTHOR_NAME}/${IMAGE_NAME}" $BUILD_DIR
fi
