import React from 'react'
import ProjectDetailsContext from "../state/ProjectDetailsContext";
import { Button } from "@mui/material";
import { UploadSystem } from '../components/hosting-components'
import { addHosting, deployHostingContract } from "../services/NEAR";

export default function Hosting() {
	const [isHostingEnabled, setIsHostingEnabled] = React.useState(false)
	const { projectDetails, projectContract } = React.useContext(
		ProjectDetailsContext
	  );
	  projectContract.has_hosting().then((hasHosting: boolean) => {
		setIsHostingEnabled(hasHosting);
	  });

	  console.log("Hello")

	return isHostingEnabled ? (
	<UploadSystem />
	) : (
			<div>
			  <Button
				onClick={() => {
				  addHosting(projectContract).then((success: boolean) => {
					setIsHostingEnabled(success);
				  });
				}}
			  >
				{" "}
				Add hosting{" "}
			  </Button>
			</div>
		  );
}