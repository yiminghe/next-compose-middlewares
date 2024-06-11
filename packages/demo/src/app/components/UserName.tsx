'use client';

import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { ClientContext } from '../../client-context/ClientContext';

export const UserName = observer(() => {
  const user = useContext(ClientContext);
  return <div>{user.name}</div>;
});
