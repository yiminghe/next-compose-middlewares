import { getNextContext } from 'next-context';
import Client1 from './Client';

export default function Server1() {
  return (
    <>
      <div>get server user from c1: {getNextContext().user}</div>
      <Client1 />
    </>
  );
}
