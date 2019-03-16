#!/usr/bin/env bash

cd ~/phantom-core
pm2 delete phantom-core
pm2 delete phantom-core-relay
git reset --hard
git pull
git checkout master
yarn run bootstrap
yarn run upgrade

pm2 --name 'phantom-core-relay' start ~/phantom-core/packages/core/dist/index.js -- relay --network mainnet
