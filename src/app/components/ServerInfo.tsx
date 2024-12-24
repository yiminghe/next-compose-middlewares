import { getNextContext } from '@/next-compose-middlewares';

export default function ServerInfo() {
  const { req, user, res } = getNextContext();
  //res.cookie('deeper-rsc-cookie', 'serverCookieValue');
  return (
    <>
      <div>server user: {user}</div>
      <div>server cookies: {JSON.stringify(req.cookies)}</div>
    </>
  );
}
