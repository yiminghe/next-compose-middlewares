'use client';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ClientContext } from '@/client-context/ClientContext';
export default observer(function Main1() {
  const user = useContext(ClientContext);
  return 'component1 of user: ' + user.name;
});
