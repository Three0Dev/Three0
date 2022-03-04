import React from 'react';
import { ActiveUsers } from '../components/ActiveUsers';
import {ProjectDetailsContext} from '../ProjectDetailsContext'

export function Auth() {
  let projectDetails = React.useContext(ProjectDetailsContext);
  let [users, setUsers] = React.useState(projectDetails.users);

  React.useEffect(() => {
    setUsers(projectDetails.users)
  }, [projectDetails]);

  return (
    <div style={{textAlign: "center", marginTop:"2%"}}>
      <ActiveUsers users={users}/>
    </div>
  );
}