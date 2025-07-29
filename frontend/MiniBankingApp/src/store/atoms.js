import { atom } from 'jotai';

export const userAtom = atom(null);

export const isAuthenticatedAtom = atom((get) => {
  const user = get(userAtom);
  return user !== null;
});

export const authInitializedAtom = atom(false);

export const accountsAtom = atom([]);

export const selectedAccountAtom = atom(null);

export const transactionsAtom = atom([]);

export const loadingAtom = atom(false);

export const errorAtom = atom(null);