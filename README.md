# EMURGO BUILD Mesh Workshop

Create repo:
- go to https://github.com/ and create a new repo
- i named the repo `emurgo-build-mesh-workshop`, you can call it however you like
- clone the repo to your local machine
- open the repo folder in visual studio code
- open terminal in visual studio code

Get starter template:
- go to https://meshjs.dev/starter-templates
- run `npx create-mesh-app build-mesh-workshop -t starter -s next -l ts`
- run `cd build-mesh-workshop`
- run `yarn dev`
- open browser `http://localhost:3000`
- connect your wallet to see if it works

Connect wallet and hooks:
- open `pages/index.tsx`
- you will see a `ConnectWallet` component (https://meshjs.dev/react/ui-components#connectWallet)
- add `useWallet` hook (https://meshjs.dev/react/wallet-hooks#useWallet):
  - `const { wallet, connected } = useWallet();`
  - `{!connected ? <CardanoWallet /> : <>You are connected!</>}`

Transaction - minting:
- just a quick show on the docs, on how to send assets: https://meshjs.dev/apis/transaction
- How to mint tokens:
  - go to https://meshjs.dev/apis/transaction/minting
  - create folder `components` and file `Mint.tsx`
  - copy the codes on the docs to `Mint.tsx`
  - go to https://meshjs.dev/guides/multisig-minting
  - change to minting with app wallet
  - go to https://meshjs.dev/providers/koios#onTxConfirmed
  - add `onTxConfirmed`

Smart contracts:
- just a quick show on the docs, how to load a script CBOR for transaction: https://meshjs.dev/apis/transaction/smart-contract
- in this workshop, we will create a new contract with plu-ts (you can PlutusTx, Aiken or other scripting language):
  - install with `yarn add @harmoniclabs/plu-ts`
  - create PlutsScript.ts and create a new contract

Transaction - lock assets in script:
- load plutus script
- use `resolvePlutusScriptAddress()` to get script address
- get user wallet's address and use `resolvePaymentKeyHash()` to get payment key hash
- create a transaction, sending 2 ADA to the script address

Transaction - redeem assets from script:
- load plutus script
- use `resolveDataHash()` to get data hash of the payment key hash
- use blockchain provider to `fetchAddressUTxOs()` to get the utxos from the script address
- create redeemer
- create transaction, redeeming the utxos from the script address

Deployment
- commit codes to GitHub
- log in / sign up Vercel
- deploy to Vercel
