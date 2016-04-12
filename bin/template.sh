#!/usr/bin/env bash
BIN_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$BIN_DIR/.."

# Terminating script if something goes wrong
set -e

OLD_CWD=`pwd`
cd $PROJECT_DIR

# @todo: add your logic here

cd $OLD_CWD

echo; echo "Done!";
