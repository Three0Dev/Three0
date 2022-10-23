// This file does two things:
//
// 1. Compile the Rust contract using cargo (see buildCmd below). This will
//    create a wasm file in the 'build' folder.
// 2. Create a symbolic link (symlink) to the generated wasm file in the root
//    project's `out` folder, for easy use with near-cli.
//
// First, import some helper libraries. `shelljs` is included in the
// devDependencies of the root project, which is why it's available here. It
// makes it easy to use *NIX-style scripting (which works on Linux distros,
// macOS, and Unix systems) on Windows as well.

// eslint-disable-next-line import/no-extraneous-dependencies
const sh = require('shelljs')

// Figure out which directory the user called this script from, which we'll use
// later to set up the symlink.
const calledFromDir = sh.pwd().toString()

// For the duration of this script, we want to operate from within the
// Rust project's folder. Let's change into that directory.
sh.cd(__dirname)

// You can call this script with `node compile.js` or `node compile.js
// --debug`. Let's set a variable to track whether `--debug` was used.
const debug = process.argv.pop() === '--debug'

// You can call this script with `node compile.js` or `node compile.js --debug`.
// Let's set a variable to track whether `--debug` was used.
// Note: see other flags in ./cargo/config. Unfortunately, you cannot set the
// `--target option` in Cargo.toml.
const buildCmd = `cargo build --target wasm32-unknown-unknown ${
	debug ? '' : '--release'
}`

// Execute the build command, storing exit code for later use
const { code } = sh.exec(buildCmd)

// Assuming this is compiled from the root project directory, link the compiled
// contract to the `out` folder –
// When running commands like `near deploy`, near-cli looks for a contract at
// <CURRENT_DIRECTORY>/out/main.wasm
if (code === 0 && calledFromDir !== __dirname) {
	const type = debug ? 'debug' : 'release'
	const outDir = `./target/wasm32-unknown-unknown/${type}`

	const linkDir = `${calledFromDir}/out`
	const link = `${linkDir}/main.wasm`
	const controllerPackageName = getName('controller')
	const outFile = `${outDir}/${controllerPackageName}.wasm`
	sh.mkdir('-p', linkDir)
	sh.rm('-f', link)
	// fixes #831: copy-update instead of linking .- sometimes sh.ln does not work on Windows
	sh.cp('-u', outFile, link)

	const frontEndDir = `${calledFromDir}/src/contract-wasms`
	const frontEndLink = `${frontEndDir}/near.wasm`
	const projectPackageName = getName('project')
	const outProjectFile = `${outDir}/${projectPackageName}.wasm`

	const hostingFrontEndLink = `${frontEndDir}/near-hosting.wasm`
	const hostingPackageName = getName("hosting")
	const outHostingFile = `${outDir}/${hostingPackageName}.wasm`

	sh.mkdir('-p', frontEndDir)
	sh.rm('-f', frontEndLink)
	sh.rm('-f', hostingFrontEndLink)
	// fixes #831: copy-update instead of linking .- sometimes sh.ln does not work on Windows
	sh.cp('-u', outProjectFile, frontEndLink)
	sh.cp('-u', outHostingFile, hostingFrontEndLink)

	sh.echo('')
	sh.echo('Controller Size:')
	sh.exec(`wc -c ${outFile} | awk '{print $1}'`)
	sh.echo('')
	sh.echo('Project Size:')
	sh.exec(`wc -c ${outProjectFile} | awk '{print $1}'`)
	sh.echo("")
	sh.echo("Hosting Size:")
	sh.exec(`wc -c ${outHostingFile} | awk '{print $1}'`)
	sh.echo("")
}

// exit script with the same code as the build command
process.exit(code)

function getName(fileDir) {
	return require('fs')
		.readFileSync(`${__dirname}/${fileDir}/Cargo.toml`)
		.toString()
		.match(/name = "([^"]+)"/)[1]
}
