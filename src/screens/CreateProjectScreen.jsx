import React, { useEffect } from "react";
const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

function CreateProjectScreen(props) {
  useEffect(async () => {
    const ipfs = await IPFS.create();
    const orbitdb = await OrbitDB.createInstance(ipfs);
  }, []);
  return <div> Create Project Screen </div>;
}

export default CreateProjectScreen;
