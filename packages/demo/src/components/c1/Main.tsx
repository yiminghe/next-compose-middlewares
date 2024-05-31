'use client';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { GlobalContext } from '@/app/GlobalContext';
export default observer(function Main1() {
  const user = useContext(GlobalContext);
  return 'component1 of user: ' + user.name;
});
