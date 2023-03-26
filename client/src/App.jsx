import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [senderWalletAddress, setSenderWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        senderWalletAddress={senderWalletAddress}
        setSenderWalletAddress={setSenderWalletAddress}
      />
      <Transfer
        setBalance={setBalance}
        senderWalletAddress={senderWalletAddress}
      />
    </div>
  );
}

export default App;
