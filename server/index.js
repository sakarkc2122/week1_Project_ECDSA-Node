const express = require("express");
const cors = require("cors");
const balances = require("./address_to_PK.json");
const port = 3042;
const secp = require("ethereum-cryptography/secp256k1");
const app = express();
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const fs = require("fs");

app.use(cors());
app.use(express.json());

app.get("/balance/:recovery", async (req, res) => {
  const { recovery } = req.params;
  const [messageHash, sigObj, recoveryBit, walletAddress] = JSON.parse(
    recovery
  );
  const sig = new Uint8Array(Object.values(sigObj));

  try {
    const publicKey1 = secp.recoverPublicKey(messageHash, sig, recoveryBit);
    const recoveredWalletAddress = toHex(
      keccak256(publicKey1.slice(1)).slice(12)
    );
    if (walletAddress !== recoveredWalletAddress) {
      return res.status(400).send({ message: "Invalid recovery request!" });
    }
    if (!balances.hasOwnProperty(walletAddress)) {
      return res.status(404).send({ message: "Address not found!" });
    }
    const balance = balances[walletAddress][2] || 0;
    res.send({ balance });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error!" });
  }
});

app.post("/send", (req, res) => {
  const { senderWalletAddress, amount, receiverWalletAddress } = req.body;

  setInitialBalance(senderWalletAddress);
  setInitialBalance(receiverWalletAddress);

  if (balances[senderWalletAddress][2] < amount) {
    res.status(400).send({ message: "Not enough balance!" });
  } else {
    balances[senderWalletAddress][2] -= amount;
    balances[receiverWalletAddress][2] += amount;
    fs.writeFileSync("./address_to_PK.json", JSON.stringify(balances));
    res.send({ balance: balances[senderWalletAddress][2] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances.hasOwnProperty(address)) {
    balances[address] = [address, null, 0];
  }
}
