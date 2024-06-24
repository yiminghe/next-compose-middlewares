'use client';

import { enableStaticRendering } from 'mobx-react-lite';
import { computed, makeObservable, observable, action } from 'mobx';
import { createContext } from 'react';

enableStaticRendering(typeof window === 'undefined');

export class User {
  _name: string;
  constructor(name: string) {
    this._name = name;
    makeObservable(this, {
      _name: observable,
      name: computed,
      setUser: action,
    });
  }

  get name() {
    return this._name;
  }

  set name(u: string) {
    this._name = u;
  }

  setUser(name: string) {
    this._name = name;
  }
}

export const ClientContext = createContext<User>(null as any);

export function ClientProvider({
  children,
  name,
}: {
  children: any;
  name: string;
}) {
  return (
    <ClientContext.Provider value={new User(name)}>
      {children}
    </ClientContext.Provider>
  );
}
