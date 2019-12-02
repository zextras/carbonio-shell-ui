import {
	useState,
	useEffect
} from 'react';
import { BehaviorSubject } from 'rxjs';

export function useObservable<T>(observable: BehaviorSubject<T>): T {
	const [value, setValue] = useState<T>(observable.value);
	useEffect(() => {
		const sub = observable.subscribe(setValue);
		return (): void => sub.unsubscribe();
	}, [observable]);
	return value;
}
