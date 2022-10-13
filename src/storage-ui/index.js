import FileManager from './components/FileManager/FileManager'
import { Contract } from 'near-api-js'
import * as short from 'short-uuid'
import { initIPFS } from '../orbit-db-console/src/database'

async function getContract() {
	const PID = window.location.href.split('/')[3]
	console.log(PID)
	// const { projectDetails, projectContract } = React.useContext(
	// 	ProjectDetailsContext
	// );
	const contract = await new Contract(window.walletConnection.account(), 'storage.' + PID, {
		// View methods are read only. They don't modify the state, but usually return some value.
		viewMethods: ['list_files', 'get_file'],
		// Change methods can modify the state. But you don't receive the returned value when called.
		changeMethods: ['new_default_meta', 'insert_file', 'nft_mint'],
	  })
	return contract
}

export async function getList(path) {
	console.log(path)
	let list = await (await getContract()).list_files({ path: path + '/'})
    const ret = [];
    for (let i = 0; i < list.length; i++) {
      let name = '';
      let type = 0;
      if (list[i].endsWith('/')) {
        name = list[i].substring(0, list[i].length - 1);
        type = 2;
      }
      else {
        name = list[i];
        type = 1;
      }
      //get all but last character if last character is /
      ret.push({ name: name, type: type })
    }
    // console.log(ret)
    return Promise.resolve(ret);
}

export const createDirectory = (path) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export const deletePaths = (paths) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export async function openFile(path) {
	const subPath = path.slice(1);
    console.log(subPath)
    let token_id = await (await getContract()).get_file({ file_path: subPath });
    console.log(token_id)
}

export const rename = (path) =>
	new Promise((resolve) => {
		setTimeout(resolve, 100)
	})

export async function uploadFiles(path, files) {
	var filepath = path;
    if(path == "") {
      filepath = files[0].name
    }
    else {
      filepath = path.slice(1) + '/' + files[0].name;
    }

    // Upload to IPFS

    // Put IPFS URL into NFT and mint
	const ipfs = await initIPFS()
	const file = await ipfs.add(files[0])

	console.log(file)

	const file_metadata = {
		title: files[0].name,
        description: "This is a test",
		media: "http://ipfs.io/ipfs/" + file.path,
		media_hash: btoa(file.path),
        issued_at: Date.now(),
	}

	console.log(file_metadata)

	await new Promise(r => setTimeout(r, 2000));

    (await getContract()).nft_mint({
      token_id: short.generate().toLowerCase(),
      metadata: file_metadata,
      path: filepath,
      receiver_id: window.walletConnection.account().accountId,
    //   perpetual_royalties: royalties
    },
    "300000000000000", // attached GAS (optional)
    "100000000000000000000000" // attached deposit in yoctoNEAR (optional)
    )

    return new Promise(resolve => {
      setTimeout(resolve, 100);
    });
}

export default FileManager
