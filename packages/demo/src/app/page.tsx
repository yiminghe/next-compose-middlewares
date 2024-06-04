import React from 'react';
import { createPage } from 'next-compose-middlewares';
import { user } from '../middlewares';
import Link from 'next/link';
import { GlobalProvider } from './GlobalContext';
import { UserInput } from './UserInput';
import { UserName } from './UserName';

export default createPage([
  user,
  ({ user, res }) => {
    res.render(
      <GlobalProvider name={user}>
        <UserInput />
        <UserName />
        <Link href="/get">get</Link>
      </GlobalProvider>,
    );
  },
]);
