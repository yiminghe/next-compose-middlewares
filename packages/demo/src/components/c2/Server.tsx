import { getPageContext } from 'next-compose-middlewares';
import Client1 from './Client';

export default function Server1() {
  return (
    <>
      <div>get server user from c2: {getPageContext().user}</div>
      <Client1 />
    </>
  );
}
