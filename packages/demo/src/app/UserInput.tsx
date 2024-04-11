'use client';

import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export const UserInput = observer(() => {
  const user = useContext(GlobalContext);
  const onChange = useCallback((e: any) => {
    user.name = e.target.value;
    // same as
    // user.setUser(e.target.value);
  }, []);
  return (
    <div>
      <input value={user.name} onChange={onChange} />
    </div>
  );
});
