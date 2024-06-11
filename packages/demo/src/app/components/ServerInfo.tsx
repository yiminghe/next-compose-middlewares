import { getServerContext } from 'next-compose-middlewares';

export default function ServerInfo() {
  const { req, user } = getServerContext();
  return (
    <>
      <div>server user: {user}</div>
      <div>server cookies: {JSON.stringify(req.cookies)}</div>
    </>
  );
}
