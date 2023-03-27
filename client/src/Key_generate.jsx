import server from "./server";

export default function Key_generate() {
  async function handleKeyGeneration() {
    try {
      await server.post("/key_generate/");
      console.log(
        "5 wallet address generated successfully! check /server/address_to_PK.json for detail"
      );
    } catch (error) {
      console.error("Error generating key:", error);
    }
  }
  return (
    <>
      <button onClick={handleKeyGeneration}>Generate Key</button>
    </>
  );
}
