import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user, finishMiddleware } from '../middlewares';
import Link from 'next/link';

export default createPage([
  finishMiddleware,
  user,
  ({ user, response }) => {
    response.jsx = (
      <>
        <p>{user}</p>
        <Link href="/get">get</Link>
      </>
    );
  },
]);
