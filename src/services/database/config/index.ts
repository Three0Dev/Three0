// eslint-disable-next-line import/prefer-default-export
export const config = {
  ipfs: {
    start: true,
    EXPERIMENTAL: {
      pubsub: true,
    },
    preload: {
      enabled: false,
    },
    config: {
      Addresses: {
        Swarm: [
          // '/dns4/three0-rtc-node.herokuapp.com/tcp/443/wss/p2p-webrtc-star/',
        ],
      },
    },
  },
};
