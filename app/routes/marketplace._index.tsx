import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

export default function Home() {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "d652fc88-1bbd-4729-9d57-b024c449d250",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWidget variant="modal" />
    </DynamicContextProvider>
  );
}
