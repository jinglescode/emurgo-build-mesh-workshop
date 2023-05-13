import Lock from "./Lock";
import Mint from "./Mint";
import Unlock from "./Unlock";

export default function Connected() {
  return (
    <>
      <div className="grid">
        <Mint />
        <Lock />
        <Unlock />
      </div>
    </>
  );
}
