#!/usr/bin/env bash

npm run prestart
contract=dev-1648778852229-15438908981274
myaccount=sreegrandhe.testnet 
# near view $contract get_all_projects '{"offset": 0, "limit": 10}'
# for i in {1..10}
# do
#     near call $contract create_project '{"name": "new_name", "description": "new_description"}' --accountId $myaccount
# done
near view $contract get_all_projects '{"offset": 0, "limit": 10}'
near view $contract get_all_projects '{"offset": 0, "limit": 5}'
near view $contract get_all_projects '{"offset": 1, "limit": 5}'
near view $contract get_all_projects '{"offset": 11, "limit": 5}'