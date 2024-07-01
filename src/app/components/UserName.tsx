'use client';

import { observer } from 'mobx-react-lite';
import { useState, useContext } from 'react';
import { ClientContext } from '../../client-context/ClientContext';
import getUser from '../actions/getUser';

export const UserName = observer(() => {
  const user = useContext(ClientContext);
  const [ret, setRet] = useState<string>('');
  return (
    <div>
      <div>client user: {user.name}</div>
      <a
        href="#"
        data-cy="action"
        onClick={async (e) => {
          e.preventDefault();
          const res = await getUser(Date.now());
          console.log(res);
          setRet(res.user!);
        }}>
        get user by action
      </a>{' '}
      &nbsp;
      <b>from action: {ret}</b>
    </div>
  );
});
