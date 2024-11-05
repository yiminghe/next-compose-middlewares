import React from 'react';
import { getNextContext } from '@/next-compose-middlewares';
import { createPage } from '../middlewares';
import Link from 'next/link';
import { ClientProvider } from '../client-context/ClientContext';
import { UserInput } from './components/UserInput';
import { UserName } from './components/UserName';
import ServerInfo from './components/ServerInfo';
import ExtraContextInfo from './components/ExtraContextInfo';

export default createPage(async function Index() {
  console.log('run page', Date.now());
  const { user } = getNextContext();
  return (
    <ClientProvider name={user!}>
      <ExtraContextInfo />
      <ServerInfo />
      <UserInput />
      <UserName />
      <Link href="/get">get</Link> &nbsp; <Link href="/dynamic">dynamic</Link>
    </ClientProvider>
  );
});
