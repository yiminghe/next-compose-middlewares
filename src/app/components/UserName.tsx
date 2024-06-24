'use client';

import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { ClientContext } from '../../client-context/ClientContext';
import getUser from '../actions/getUser';

export const UserName = observer(() => {
  const user = useContext(ClientContext);
  return (
    <div>
      <div>client user: {user.name}</div>
      <a
        href="#"
        onClick={async (e) => {
          e.preventDefault();
          console.log(await getUser(Date.now()));
        }}>
        get user by action
      </a>
    </div>
  );
});
