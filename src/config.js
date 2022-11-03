const CONTRACT_NAME = process.env.CONTRACT_NAME || "alpha.three0.testnet";

const LOCAL_KURTOSIS_URL = process.env.KURTOSIS_URL || "http://localhost";

function getNEARConfig(env) {
  switch (env) {
    case "mainnet":
      return {
        networkId: "mainnet",
        nodeUrl: "https://rpc.mainnet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.near.org",
        helperUrl: "https://helper.mainnet.near.org",
        explorerUrl: "https://explorer.mainnet.near.org",
      };
    case "development":
    case "production":
    case "development":
    case "testnet":
      return {
        networkId: "testnet",
        nodeUrl: "https://rpc.testnet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
      };
    case "betanet":
      return {
        networkId: "betanet",
        nodeUrl: "https://rpc.betanet.near.org",
        contractName: CONTRACT_NAME,
        walletUrl: "https://wallet.betanet.near.org",
        helperUrl: "https://helper.betanet.near.org",
        explorerUrl: "https://explorer.betanet.near.org",
      };
    case "localnet":
      return {
        networkId: "local",
        nodeUrl: `${LOCAL_KURTOSIS_URL}:8332`,
        keyPath: `${process.cwd()}/.near/validator_key.json`,
        walletUrl: `${LOCAL_KURTOSIS_URL}:8334`,
        contractName: CONTRACT_NAME,
        explorerUrl: `${LOCAL_KURTOSIS_URL}:8331`,
        helperUrl: `${LOCAL_KURTOSIS_URL}:8330`,
        masterAccount: "test.near",
      };
    case "test":
    case "ci":
      return {
        networkId: "shared-test",
        nodeUrl: "https://rpc.ci-testnet.near.org",
        contractName: CONTRACT_NAME,
        masterAccount: "test.near",
      };
    case "ci-betanet":
      return {
        networkId: "shared-test-staging",
        nodeUrl: "https://rpc.ci-betanet.near.org",
        contractName: CONTRACT_NAME,
        masterAccount: "test.near",
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in src/config.js.`
      );
  }
}

module.exports = getNEARConfig;
