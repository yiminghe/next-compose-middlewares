'use client';

import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { ClientContext } from '../../client-context/ClientContext';
import getUser from '../actions/getUser';

export const UserName = observer(() => {
  const user = useContext(ClientContext);
  return (
    <div>
      <div>{user.name}</div>
      <a
        href="#"
        onClick={async (e) => {
          e.preventDefault();
          console.log(await getUser());
        }}>
        get user by action
      </a>
    </div>
  );
});
