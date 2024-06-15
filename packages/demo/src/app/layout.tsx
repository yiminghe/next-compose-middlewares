import { user } from '@/middlewares';
import { createLayout, getNextContext } from 'next-compose-middlewares';
import React from 'react';

export default createLayout(
  [user],
  function RootLayout({ children }: { children: React.ReactNode }) {
    const { user, req, res, type } = getNextContext();
    res.cookie('x-user', 'yiminghe', { path: '/' });
    return (
      <html lang="en" data-user={user}>
        <body>
          <div>url: {req.url}</div>
          <div>type: {type}</div>
          {children}
        </body>
      </html>
    );
  },
);
