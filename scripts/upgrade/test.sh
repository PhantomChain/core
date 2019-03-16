#!/usr/bin/env bash

rm -rf /home/phantom/phantom-core
git clone https://github.com/PhantomChain/core -b upgrade /home/phantom/phantom-core

mkdir /home/phantom/.phantom
touch /home/phantom/.phantom/.env

mkdir /home/phantom/.phantom/config

mkdir /home/phantom/.phantom/database
touch /home/phantom/.phantom/database/json-rpc.sqlite
touch /home/phantom/.phantom/database/transaction-pool.sqlite
touch /home/phantom/.phantom/database/webhooks.sqlite

mkdir /home/phantom/.phantom/logs
mkdir /home/phantom/.phantom/logs/mainnet
touch /home/phantom/.phantom/logs/mainnet/test.log
