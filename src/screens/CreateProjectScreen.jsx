import React, { useEffect } from "react";
const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

function CreateProjectScreen(props) {
  useEffect(async () => {
    const ipfs = await IPFS.create();
    const orbitdb = await OrbitDB.createInstance(ipfs);

    const options = {
      // Give write access to ourselves
      accessController: {
        write: [orbitdb.identity.id],
      },
    };

    const db = await orbitdb.keyvalue("project1", options);
    const dbAddress = db.address;
    console.log(dbAddress);
    console.log(dbAddress.toString());

    await db.put("key1", "hello1");
    const val = await db.get("key1");
    console.log(val);
    // const db = await orbitdb.log("hello");
    // await db.load();
    // console.log("testing");
    // // Listen for updates from peers
    // db.events.on("replicated", (address) => {
    //   console.log(db.iterator({ limit: -1 }).collect());
    // });

    // // Add an entry
    // const hash = await db.add("world");
    // console.log(hash);

    // // Query
    // const result = db.iterator({ limit: -1 }).collect();
    // console.log(JSON.stringify(result, null, 2));
  }, []);

  return <div> Create Project Screen </div>;
}

export default CreateProjectScreen;
