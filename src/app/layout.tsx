import { createLayout } from '@/middlewares';
import { getNextContext } from '@/next-compose-middlewares';
import React from 'react';

export default createLayout(function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('run layout', Date.now());
  const { user, req, res, type } = getNextContext();
  res.cookie('x-user-from-layout', 'yiminghe-from-layout', { path: '/' });
  return (
    <html lang="en" data-user={user}>
      <body>
        <div>url: {req.url}</div>
        <div>type: {type}</div>
        <div>user: {user}</div>
        {children}
      </body>
    </html>
  );
});
