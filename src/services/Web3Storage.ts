const url = 'https://three0-storage-proxy.onrender.com'

async function web3StorageClientAuth(projectContract: any) {
	function getCookie(cname: string) {
		const name = `${cname}=`
		const decodedCookie = decodeURIComponent(document.cookie)
		const ca = decodedCookie.split(';')
		for (let i = 0; i < ca.length; i += 1) {
			let c = ca[i]
			while (c.charAt(0) === ' ') {
				c = c.substring(1)
			}
			if (c.indexOf(name) === 0) {
				return c.substring(name.length, c.length)
			}
		}
		return ''
	}

	function setCookie(name: string, value: string, days: number) {
		const expires = new Date(Date.now() + days * 864e5).toUTCString()
		document.cookie += `${name}=${encodeURIComponent(
			value
		)}; expires=${expires}; path=/`
	}

	const token = getCookie('three0storage')

	if (token) {
		return token
	}

	const nonce = await projectContract.set_nonce()

	const res = await fetch(`${url}/generateToken`, {
		method: 'POST',
		// credentials: 'include',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			nonce,
			accountId: projectContract.account.accountId,
			pid: projectContract.account.accountId,
		}),
	}).then((resp) => resp.json())

	setCookie('three0storage', res.token, 1)
	return res.token
}

async function uploadWeb3Files(files: Array<File>, projectContract: any) {
	const token = await web3StorageClientAuth(projectContract)

	const fd = new FormData()
	files.forEach((file) => {
		fd.append('file', file)
	})

	const output = await fetch(`${url}/upload`, {
		// credentials: 'include',
		mode: 'cors',
		headers: {
			Authorization: `${token}`,
		},
		method: 'POST',
		body: fd,
	}).then((res) => res.json())

	if (output.status) {
		return output.cid
	}
	throw new Error(output.message)
}

const gateway = 'https://w3s.link/ipfs'

export default uploadWeb3Files

export { gateway as web3StorageGateway }
