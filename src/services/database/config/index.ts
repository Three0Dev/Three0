import { IPFSOptions } from 'ipfs-core/src/components/network'

// eslint-disable-next-line import/prefer-default-export
export const config: IPFSOptions = {
	start: true,
	EXPERIMENTAL: {
		ipnsPubsub: true,
	},
	relay: {
		enabled: true, // enable circuit relay dialer and listener
		hop: {
			enabled: true, // enable circuit relay HOP (make this node a relay)
		},
	},
	preload: {
		enabled: false,
	},
	config: {
		Addresses: {
			Swarm: [
				'/dns4/signal-rtc.three0dev.com/tcp/443/wss/p2p-webrtc-star/',
				'/dns4/three0-ipfs-wss-node.onrender.com/tcp/10000/wss/p2p/QmXz8gH7VhjuGYRbPR8HyGXB6BGvNg9WMkiGUg2qh6Hshx',
			],
		},
	},
}
