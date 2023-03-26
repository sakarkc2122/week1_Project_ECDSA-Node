import server from "./server";
import { getPublicKey, sign } from "ethereum-cryptography/secp256k1";
import { useState } from "react";

const signedByUser = async (senderWalletAddress, privateKey, setBalance) => {
  // messageHash is fixed 64 hexadecimal characters
  const messageHash =
    "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";
  try {
    const c = await sign(messageHash, privateKey, { recovered: true });
    const d = [messageHash, c[0], c[1], senderWalletAddress];
    const { data: balance } = await server.get(`balance/${JSON.stringify(d)}`);
    setBalance(balance.balance);
    alert(
      "Valid Authentication & you will get your balance after you click OK"
    );
  } catch (error) {
    alert("Invalid Authentication");
    console.error(error);
    setBalance(0);
  }
};

function Wallet({
  balance,
  setBalance,
  senderWalletAddress,
  setSenderWalletAddress,
}) {
  const [privateKey, setPrivateKey] = useState("");

  async function handleSignClick() {
    if (senderWalletAddress && privateKey) {
      await signedByUser(senderWalletAddress, privateKey, setBalance);
    } else {
      alert("Please fill senderWalletAddress and privateKey");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={senderWalletAddress}
          onChange={(evt) => setSenderWalletAddress(evt.target.value)}
        />
      </label>
      <label>
        Private Key
        <input
          placeholder="Type your private key"
          value={privateKey}
          onChange={(evt) => setPrivateKey(evt.target.value)}
        />
      </label>
      <button onClick={handleSignClick}>Sign and Verify</button>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
