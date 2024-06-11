import { getServerContext } from 'next-compose-middlewares';
import Client1 from './Client';

export default function Server1() {
  return (
    <>
      <div>get server user from c1: {getServerContext().user}</div>
      <Client1 />
    </>
  );
}
