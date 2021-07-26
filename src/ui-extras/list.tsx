import { Container } from '@zextras/zapp-ui';
import React, { FC, useRef, ReactElement, useEffect, MutableRefObject, LegacyRef } from 'react';
import { map } from 'lodash';
import { Spinner } from './spinner';
import { useIsVisible } from './use-is-visible';

type ListItemProps<T extends { id: string }> = {
	item: T;
	items: Array<T>;
	active?: boolean;
	selected?: boolean;
	selecting?: boolean;
	index: number;
	visible: boolean;
};
export type ListProps<T extends { id: string }> = {
	ItemComponent: FC<ListItemProps<T>>;
	items: Array<T>;
	active?: boolean;
	selected?: boolean;
	selecting?: boolean;
	onListBottom?: () => void;
};

type ListItemWrapperProps<T extends { id: string }> = ListProps<T> & {
	listRef: MutableRefObject<HTMLDivElement | undefined>;
	item: T;
	index: number;
};

const LIWrapper = <T extends { id: string }>({
	index,
	listRef,
	ItemComponent,
	item,
	items,
	selected,
	selecting,
	active
}: ListItemWrapperProps<T>): ReactElement => {
	const [inView, ref] = useIsVisible(listRef);
	return (
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		<div ref={ref}>
			<ItemComponent
				visible={inView}
				index={index}
				item={item}
				items={items}
				selected={selected}
				selecting={selecting}
				active={active}
			/>
		</div>
	);
};

const BottomElement: FC<{
	listRef: MutableRefObject<HTMLDivElement | undefined>;
	onVisible: () => void;
}> = ({ listRef, onVisible }) => {
	const [inView, ref] = useIsVisible(listRef);
	useEffect(() => {
		if (inView) {
			onVisible();
		}
	}, [inView, onVisible]);
	return (
		<div ref={ref as LegacyRef<HTMLDivElement>}>
			<Spinner />
		</div>
	);
};
export const List = <T extends { id: string }>({
	items,
	ItemComponent,
	selected,
	selecting,
	active,
	onListBottom
}: ListProps<T>): ReactElement => {
	const ref = useRef<HTMLDivElement>();

	return (
		<div ref={ref as LegacyRef<HTMLDivElement>} style={{ height: '100%', width: '100%' }}>
			<Container
				orientation="vertical"
				mainAlignment="flex-start"
				crossAlignment="stretch"
				style={{ overflowY: 'auto' }}
			>
				{map(items, (item, index) => (
					<LIWrapper
						ItemComponent={ItemComponent}
						key={item.id}
						listRef={ref}
						index={index}
						item={item}
						items={items}
						selected={selected}
						selecting={selecting}
						active={active}
					/>
				))}
				{onListBottom && <BottomElement listRef={ref} onVisible={onListBottom} />}
			</Container>
		</div>
	);
};
