import { getServerUser } from '@/server-context/serverContext';
import Client1 from './Client';

export default function Server1() {
  return (
    <>
      <div>get server user from c2: {getServerUser()}</div>
      <Client1 />
    </>
  );
}
