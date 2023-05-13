import {
  Transaction,
  KoiosProvider,
  PlutusScript,
  resolvePlutusScriptAddress,
  resolvePaymentKeyHash,
  resolveDataHash,
} from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import { scriptCbor } from "../config/PlutsScript";

export default function Unlock() {
  const { wallet } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [state, setState] = useState(0);

  async function startUnlock() {
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

      // datum
      const address = (await wallet.getUsedAddresses())[0];
      const walletKeyhash = resolvePaymentKeyHash(address);
      const dataHash = resolveDataHash(walletKeyhash);

      // get UTXO from script
      const utxos = await blockchainProvider.fetchAddressUTxOs(
        scriptAddress,
        "lovelace"
      );

      let utxo = utxos.find((utxo: any) => {
        return utxo.output.dataHash == dataHash;
      });

      if (utxo) {
        // redeemer
        const redeemer = {
          data: "join emurgo hackathon",
        };

        // transaction
        const tx = new Transaction({ initiator: wallet })
          .redeemValue({
            value: utxo,
            script: script,
            datum: utxo,
            redeemer: redeemer,
          })
          .sendValue(address, utxo)
          .setRequiredSigners([address]);

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);

        setLoading(false);

        // onTxConfirmed
        setState(2);
        blockchainProvider.onTxConfirmed(txHash, () => {
          setState(3);
          console.log("Transaction confirmed");
        });
      } else {
        setLoading(false);
        setState(0);
      }
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
        onClick={() => startUnlock()}
        disabled={loading}
      >
        <h2>Demo: Unlock Asset</h2>
        {state == 0 && <p>Redeem locked ADA from script.</p>}
        {state == 1 && <p>Building transaction...</p>}
        {state == 2 && <p>Awaiting confirmation.</p>}
        {state == 3 && <p>Transaction confirmed.</p>}
      </button>
    </>
  );
}
