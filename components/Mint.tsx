import {
  Transaction,
  ForgeScript,
  AppWallet,
  KoiosProvider,
} from "@meshsdk/core";
import type { Mint, AssetMetadata } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { mnemonic } from "../config/MintingWallet";

export default function Mint() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState(0);

  async function startMing() {
    setLoading(true);
    setState(1);

    const blockchainProvider = new KoiosProvider("preprod");

    // app wallet
    const appWallet = new AppWallet({
      networkId: 0,
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      key: {
        type: "mnemonic",
        words: mnemonic,
      },
    });

    // forgingScript
    const appWalletAddress = appWallet.getPaymentAddress();
    const forgingScript = ForgeScript.withOneSignature(appWalletAddress);

    // token
    const assetMetadata1: AssetMetadata = {
      name: "Mesh Token",
      image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
      mediaType: "image/jpg",
      description: "This NFT is minted by Mesh (https://meshjs.dev/).",
    };
    const asset1: Mint = {
      assetName: "MeshToken",
      assetQuantity: "1",
      metadata: assetMetadata1,
      label: "721",
      recipient: await wallet.getChangeAddress(),
    };

    // transaction
    const tx = new Transaction({ initiator: wallet });
    tx.mintAsset(forgingScript, asset1);
    tx.sendLovelace(
      "addr_test1vpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0c7e4cxr",
      "10000000"
    );

    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    console.log(txHash);

    setLoading(false);

    // onTxConfirmed
    setState(2);
    blockchainProvider.onTxConfirmed(txHash, () => {
      setState(3);
      console.log("Transaction confirmed");
    });
  }

  return (
    <>
      <button
        className="card"
        type="button"
        onClick={() => startMing()}
        disabled={loading}
      >
        <h2>Demo: Mint Token</h2>
        {state == 0 && <p>Buy native tokens with multi-sig minting.</p>}
        {state == 1 && <p>Building transaction...</p>}
        {state == 2 && <p>Awaiting confirmation.</p>}
        {state == 3 && <p>Transaction confirmed.</p>}
      </button>
    </>
  );
}
