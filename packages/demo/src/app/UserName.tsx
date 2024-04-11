'use client';

import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export const UserName = observer(() => {
  const user = useContext(GlobalContext);
  return <div>{user.name}</div>;
});
