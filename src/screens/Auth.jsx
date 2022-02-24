import React, { useEffect } from 'react';
import {Group, Button} from 'evergreen-ui';
import { ActiveUsers } from '../components/ActiveUsers';
import { UserLog } from '../components/UserLog';

export function Auth() {
  const options = [
    {
      label: 'Users',value: 'activeUsers'
    },
    {
      label: 'User Log', value: 'userLog'
    }
  ]

  const [optionType, setOptionType] = React.useState(options[0].value);

  React.useEffect(() => {
    async function getUsers(){
      try{
        const project = await window.contract.getAllUsers({pid: params.pid});
      } catch(e){
        console.error(e);
      }
    }

    getUsers();
  }, []);  
  return (
    <>
    <div style={{textAlign: "center", marginTop:"2%"}}>
      <Group>
        {
          options.map(option => (
            <Button appearance={optionType == option.value ? 'primary' : 'default'} key={option.value} onClick={() => setOptionType(option.value)}>{option.label}</Button>
          ))
        }
        </Group>
        </div>
        {
          optionType === 'activeUsers' ? <ActiveUsers /> : <UserLog />
        }
    </>
  );
}