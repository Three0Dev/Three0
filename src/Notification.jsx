import getConfig from "./config";
const { networkId } = getConfig(process.env.NODE_ENV || "development");

function Notification(message) {
    const urlPrefix = `https://explorer.${networkId}.near.org/accounts`;
    return (
      <aside>
        <a
          target="_blank"
          rel="noreferrer"
          href={`${urlPrefix}/${window.accountId}`}
        >
          {window.accountId}
        </a>
        {" " + message + " "}
        <a
          target="_blank"
          rel="noreferrer"
          href={`${urlPrefix}/${window.contract.contractId}`}
        >
          {window.contract.contractId}
        </a>
        <footer>
          <div>✔ Succeeded</div>
          <div>Just now</div>
        </footer>
      </aside>
    );
  }