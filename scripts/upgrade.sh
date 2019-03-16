#!/usr/bin/env bash

pm2 delete phantom-core > /dev/null 2>&1
pm2 delete phantom-core-relay > /dev/null 2>&1
pm2 delete phantom-core-forger > /dev/null 2>&1

pm2 delete core > /dev/null 2>&1
pm2 delete core-relay > /dev/null 2>&1
pm2 delete core-forger > /dev/null 2>&1

node ./scripts/upgrade/upgrade.js

# Sometimes the upgrade script doesn't properly replace PHANTOM_ with CORE_
# https://github.com/PhantomChain/core/blob/develop/scripts/upgrade/upgrade.js#L206
cd ~

if [ -f .config/phantom-core/devnet/.env ]; then
    sed -i 's/PHANTOM_/CORE_/g' .config/phantom-core/devnet/.env
fi

if [ -f .config/phantom-core/devnet/plugins.js ]; then
    sed -i 's/PHANTOM_/CORE_/g' .config/phantom-core/devnet/plugins.js
fi

if [ -f .config/phantom-core/mainnet/.env ]; then
    sed -i 's/PHANTOM_/CORE_/g' .config/phantom-core/mainnet/.env
fi

if [ -f .config/phantom-core/mainnet/plugins.js ]; then
    sed -i 's/PHANTOM_/CORE_/g' .config/phantom-core/mainnet/plugins.js
fi

cd ~/phantom-core
yarn setup
