#!/usr/bin/env bash
set -ex

# prepare client
npm install

# prepare server
(cd server && go get ./... && go build)

npm run start:all
