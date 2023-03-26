import { useState } from "react";
import server from "./server";

function Transfer({ setBalance, senderWalletAddress }) {
  const [sendAmount, setSendAmount] = useState("");
  const [receiverWalletAddress, setReceiverWalletAddress] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        senderWalletAddress: senderWalletAddress,
        amount: parseInt(sendAmount),
        receiverWalletAddress,
      });
      setBalance(balance);
      alert("Balance Transfered and your balance will be deducted next");
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        receiverWalletAddress
        <input
          placeholder="Type an address, for example: 0x2"
          value={receiverWalletAddress}
          onChange={setValue(setReceiverWalletAddress)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
