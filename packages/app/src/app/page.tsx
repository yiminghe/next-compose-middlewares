import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '../middlewares';
import Link from 'next/link';

export default createPage([
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
