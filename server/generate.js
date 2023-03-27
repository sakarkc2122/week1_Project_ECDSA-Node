// This JS file should only run just to generate Keys in address_to_PK.json file in the same directory
// To run this file: node server/generate.js

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const fs = require("fs");

const ADDRESS_TO_PK = "./address_to_PK.json";

async function generateKeys() {
  let privateKey1, publicKey1, walletAddress1;
  let privateKey, publicKey, walletAddress;
  let balance = 0;
  let updatedData;

  for (let i = 0; i < 5; i++) {
    privateKey1 = secp.utils.randomPrivateKey();
    publicKey1 = secp.getPublicKey(privateKey1);
    walletAddress1 = keccak256(publicKey1.slice(1)).slice(-20);

    privateKey = toHex(privateKey1);
    publicKey = toHex(publicKey1.slice(1));
    walletAddress = toHex(walletAddress1);

    // Check if the file exists before trying to read it
    if (!fs.existsSync(ADDRESS_TO_PK)) {
      console.log("File does not exist, creating it...");
      fs.writeFileSync(ADDRESS_TO_PK, JSON.stringify({}));
    }

    // Read the JSON file
    const balances = JSON.parse(fs.readFileSync(ADDRESS_TO_PK, "utf8"));
    if (balances?.walletAddress) {
      if (!balances[walletAddress].includes(privateKey)) {
        balance += 10;
        balances[walletAddress].push(privateKey, publicKey, balance);
      }
    }
    {
      balance += 10;
      balances[walletAddress] = [privateKey, publicKey, balance];
    }

    // Write the new data to the JSON file
    fs.writeFileSync(ADDRESS_TO_PK, JSON.stringify(balances, null, 2));

    // Read the updated data from the JSON file
    updatedData = JSON.parse(fs.readFileSync(ADDRESS_TO_PK));
  }
  console.log("Updated file contents:", updatedData);
}
// generateKeys();
module.exports = generateKeys;

async function testingAuthentication() {
  const msgHash =
    "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";

  const c = await secp.sign(
    msgHash,
    "d44e2bfed85216355abb9f6cf0e6f056df961303eeee6d091614e1cfb943c3ac",
    { recovered: true }
  );
  const p = secp.recoverPublicKey(msgHash, c[0], c[1]);
  console.log(p);
  console.log(toHex(p));
  // console.log(balances["0e20e27bf95bcd47ac7349907675e565d9cc9a99"][1]);
}
