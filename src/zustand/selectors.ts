/* eslint-disable react-hooks/rules-of-hooks */
/* THIS FILE CONTAINS HOOKS, BUT ESLINT IS DUMB */
import { useMemo } from 'react';
import { useStore } from './store';
import { UnknownFunction } from './store-types';

export const useSharedFunction = (id: string): UnknownFunction | undefined =>
	useStore((state) => state.shares.functions[id]?.function);

export const useAddSharedFunction = (app: string) => (): ((
	id: string,
	fn: UnknownFunction
) => void) => {
	const cb = useStore((state) => state.addSharedFunction);
	const partiaCb = useMemo(() => cb(app), [cb]);
	return partiaCb;
};

export const useRemoveSharedFunction = (app: string) => (): ((id: string) => void) => {
	const cb = useStore((state) => state.removeSharedFunction);
	const partialCb = useMemo(() => cb(app), [cb]);
	return partialCb;
};
