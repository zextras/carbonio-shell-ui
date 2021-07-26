import { some } from 'lodash';
import { MutableRefObject, useState, useEffect, useRef, useMemo } from 'react';

export const useIsVisible = (
	listRef: MutableRefObject<HTMLDivElement | undefined>
): [boolean, MutableRefObject<HTMLDivElement | undefined>] => {
	const [vis, setVis] = useState(false);
	const ref = useRef<HTMLDivElement>();

	const observer = useMemo(
		() =>
			new IntersectionObserver(
				(entries) => {
					setVis(some(entries, (entry) => entry.isIntersecting));
				},
				{
					root: listRef.current
				}
			),
		[listRef]
	);
	useEffect(() => {
		const curr = ref.current;
		if (curr) {
			observer.observe(curr);
		}
		return (): void => {
			if (curr) {
				observer.unobserve(curr);
			}
		};
	}, [observer]);
	return [vis, ref];
};
