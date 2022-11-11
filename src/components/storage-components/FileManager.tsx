/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { Contract } from "near-api-js";
import * as short from "short-uuid";
import { initIPFS } from "../../services/database";
import TopBar from "./TopBar";
import Footer from "./Footer";
import MiddleArea from "./MiddleArea";
import "./FileManager.css";

const defaultLabels = {
  fileSingle: "file",
  fileMultiple: "files",
  folderSingle: "folder",
  folderMultiple: "folders",
  root: "Root",
  home: "Home",
  up: "Up",
  reload: "Reload",
  upload: "Upload",
  download: "Download",
  delete: "Delete",
  rename: "Rename",
  createDirectory: "Create directory",
};

interface FileManagerProps {
  pid: any;
}

export default function FileManager({ pid }: FileManagerProps) {
  const contract = new Contract(
    window.walletConnection.account(),
    `storage.${pid}`,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ["list_files", "get_file", "has_storage", "get_storage"],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["new_default_meta", "nft_mint", "set_storage"],
    }
  );

  const features = ["uploadFiles"];

  const [collapsed, setCollapsed] = useState({});
  const [structure, setStructure] = useState({});
  const [currentPath, setCurrentPath] = useState("");
  const [lastPath, setLastPath] = useState("");
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(false);

  const labels = defaultLabels;

  const enabledFeatures = features;

  const uploadFiles = async (path: string, files: File[]) => {
    let filepath = path;
    if (path === "") {
      filepath = files[0].name;
    } else {
      filepath = `${path.slice(1)}/${files[0].name}`;
    }

    // Upload to IPFS

    // Put IPFS URL into NFT and mint
    const ipfs = await initIPFS();
    const file = await ipfs.add(files[0]);

    const fileMetadata = {
      title: files[0].name,
      description: "This is a test",
      media: `http://ipfs.io/ipfs/${file.path}`,
      media_hash: btoa(file.path),
      file_type: files[0].type,
      issued_at: Date.now(),
    };

    return contract.nft_mint(
      {
        token_id: short.generate().toLowerCase(),
        metadata: fileMetadata,
        path: filepath,
        receiver_id: window.walletConnection.account().accountId,
        //   perpetual_royalties: royalties
      },
      "300000000000000", // attached GAS (optional)
      "100000000000000000000000" // attached deposit in yoctoNEAR (optional)
    );
  };

  //TODO
  const rename = (path: string) =>
    new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

  //TODO
  const deletePaths = (paths: string) =>
    new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

  const openFile = async (path: string) => {
    const subPath = path.slice(1);
    const tokenMetaData = await contract.get_file({ file_path: subPath });
    return tokenMetaData;
  };

  const getList = async (path: string) => {
    const list = await contract.list_files({ path: `${path}/` });
    const ret = [];
    for (let i = 0; i < list.length; i += 1) {
      let name = "";
      let type = 0;
      if (list[i].endsWith("/")) {
        name = list[i].substring(0, list[i].length - 1);
        type = 2;
      } else {
        name = list[i];
        type = 1;
      }
      // get all but last character if last character is /
      ret.push({ name, type });
    }
    // console.log(ret)
    return Promise.resolve(ret);
  };

  const load = async (path: string) => {
    try {
      const response = await getList(path);
      return response.map((item: { name: any; type: number }) => ({
        name: item.name,
        type: item.type === 1 ? 1 : 2,
      }));
    } catch (error: any) {
      console.error(error);
      return `Error: ${error.message}`;
    }
  };

  const reload = async () => {
    setLoading(true);
    const updated: any = {};
    const notChanged: any = {};
    try {
      const paths = Object.keys(structure).filter((path) => {
        if (
          currentPath.indexOf(path) === 0 ||
          path.indexOf(currentPath) === 0
        ) {
          return true;
        }
        notChanged[path] = structure[path as keyof typeof structure];
        return false;
      });
      if (paths.indexOf(currentPath) === -1) {
        paths.push(currentPath);
      }
      await Promise.all(
        paths.map((path) => {
          const promise = load(path);
          promise
            .then((list) => {
              if (list !== undefined) {
                updated[path] = list;
                if (path === currentPath) {
                  setLastPath(currentPath);
                }
              }
            })
            .catch(console.error);
          return promise;
        })
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setCurrentPath(lastPath);
    }
    const processed = { ...notChanged, ...updated };
    const ordered: any = {};
    Object.keys(processed)
      .sort((a, b) => {
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      })
      .forEach((path) => {
        ordered[path] = processed[path];
      });
    setStructure(ordered);
  };

  useEffect(() => {
    reload();
    setSelection([]);
  }, [currentPath]);

  return (
    <div className={`FileManager${loading ? " FileManager-Loading" : ""}`}>
      <TopBar
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        uploadFiles={uploadFiles}
        labels={labels}
        reload={reload}
        enabledFeatures={enabledFeatures}
      />
      <Footer
        structure={structure}
        setStructure={setStructure}
        currentPath={currentPath}
        selection={selection}
        enabledFeatures={enabledFeatures}
        labels={labels}
        deletePaths={deletePaths}
        reload={reload}
        rename={rename}
      />
      <MiddleArea
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        structure={structure}
        currentPath={currentPath}
        setCurrentPath={setCurrentPath}
        openFile={openFile}
        reload={reload}
        selection={selection}
        setSelection={setSelection}
        enabledFeatures={enabledFeatures}
        labels={labels}
        loading={loading}
        rename={rename}
      />
    </div>
  );
}
