import { getExtraContext } from "../utils/extra-context";

export default function ExtraContextInfo() {
  const extra = getExtraContext();
  return <div>from: {extra.from}</div>;
}
