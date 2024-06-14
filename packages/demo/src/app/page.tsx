import React from 'react';
import { createPage, getNextContext } from 'next-compose-middlewares';
import { user } from '../middlewares';
import Link from 'next/link';
import { ClientProvider } from '../client-context/ClientContext';
import { UserInput } from './components/UserInput';
import { UserName } from './components/UserName';
import ServerInfo from './components/ServerInfo';
import ExtraContextInfo from './components/ExtraContextInfo';

export default createPage([user], function Index(...args) {
  console.log('Index', args);
  const { user, res } = getNextContext();
  res.render(
    <ClientProvider name={user}>
      <ExtraContextInfo />
      <ServerInfo />
      <UserInput />
      <UserName />
      <Link href="/get">get</Link>
    </ClientProvider>,
  );
});
