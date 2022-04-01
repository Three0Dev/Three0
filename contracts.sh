#!/usr/bin/env bash

# npm run prestart
contract=dev-1648778852229-15438908981274
myaccount=sreegrandhe.testnet 
# near view $contract get_all_projects '{}'
# near call $contract create_project '{"name": "new_name", "description": "new_description"}' --accountId $myaccount
near view $contract get_all_projects '{}'
near call $contract delete_project '{"project_id": "project_0"}' --accountId $myaccount
near view $contract get_all_projects '{}'
