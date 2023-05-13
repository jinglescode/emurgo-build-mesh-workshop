import {
  Transaction,
  KoiosProvider,
  PlutusScript,
  resolvePlutusScriptAddress,
  resolvePaymentKeyHash,
} from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { scriptCbor } from "../config/PlutsScript";

export default function Lock() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState(0);

  async function startLock() {
    setLoading(true);
    setState(1);

    try {
      const blockchainProvider = new KoiosProvider("preprod");

      // load script
      const script: PlutusScript = {
        code: scriptCbor,
        version: "V2",
      };
      const scriptAddress = resolvePlutusScriptAddress(script, 0);

      // prepare walletKeyhash for datum
      const address = (await wallet.getUsedAddresses())[0];
      const walletKeyhash = resolvePaymentKeyHash(address);

      // transaction
      const tx = new Transaction({ initiator: wallet }).sendLovelace(
        {
          address: scriptAddress,
          datum: {
            value: walletKeyhash,
            inline: true,
          },
        },
        "2000000"
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
    } catch (e) {
      setLoading(false);
      setState(0);
      console.error(e);
    }
  }

  return (
    <>
      <button
        className="card"
        type="button"
        onClick={() => startLock()}
        disabled={loading}
      >
        <h2>Demo: Lock Asset</h2>
        {state == 0 && <p>Create transaction to lock ADA in script.</p>}
        {state == 1 && <p>Building transaction...</p>}
        {state == 2 && <p>Awaiting confirmation.</p>}
        {state == 3 && <p>Transaction confirmed.</p>}
      </button>
    </>
  );
}
