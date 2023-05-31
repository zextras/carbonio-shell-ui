/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Event as SentryEvent } from '@sentry/browser';
import {
	Button,
	Container,
	ContainerProps,
	Icon,
	LabelFactoryProps,
	Row,
	Select,
	SelectItem,
	Text,
	useSnackbar
} from '@zextras/carbonio-design-system';
import { filter, find, map } from 'lodash';
import React, {
	TextareaHTMLAttributes,
	useCallback,
	useEffect,
	useMemo,
	useReducer,
	useState
} from 'react';
import type { TFunction } from 'i18next';
import styled, { DefaultTheme } from 'styled-components';
import { useUserAccount } from '../store/account';
import { useAppList } from '../store/app';
import { closeBoard } from '../store/boards';
import { getT } from '../store/i18n';
import { feedback } from './functions';

// TODO: replace with DS TextArea?
const TextArea = styled.textarea<{ size?: keyof DefaultTheme['sizes']['font'] }>`
	width: 100%;
	min-height: 8rem;
	box-sizing: border-box;
	outline: none;
	border: none;
	background: ${({ theme }): string => theme.palette.gray5.regular};
	resize: none;
	transition: height 0.4s ease;
	color: ${({ theme }): string => theme.palette.text.regular};
	font-family: ${({ theme }): string => theme.fonts.default};
	font-size: ${({ theme, size }): string => theme.sizes.font[size ?? 'medium']};
	&:focus {
		background: ${({ theme }): string => theme.palette.gray4.regular};
		outline: none;
	}
`;

const TextContainer = styled(Container)`
	text-align: justify;
	align-items: flex-start;
	width: 80%;
`;

const ButtonContainer = styled(Container)`
	width: 20%;
	position: relative;
`;

const TAContainer = styled(Container)`
	background: ${({ theme }): string => theme.palette.gray5.regular};
	border-radius: 0.125rem 0.125rem 0 0;
	padding: 0.5rem;
	transition: height 0.4s ease;
	height: auto;
	max-height: 50%;
	&:focus-within {
		background: ${({ theme }): string => theme.palette.gray4.regular};
		outline: none;
		border-bottom: 0.0625rem solid ${({ theme }): string => theme.palette.primary.regular};
	}
`;

const SubHeadingText = styled(Text)<{ lineHeight?: string }>`
	border-radius: 0.125rem 0.125rem 0 0;
	font-size: 0.875rem;
	font-weight: 300;
	margin-top: 0.625rem;
	line-height: ${({ lineHeight }): string => lineHeight ?? 'normal'};
`;

interface LabelContainerProps extends ContainerProps {
	disabled: boolean;
}

const LabelContainer = styled(Container)<LabelContainerProps>`
	border-bottom: 0.0625rem solid
		${({ theme, disabled }): string =>
			disabled ? theme.palette.error.regular : theme.palette.gray2.regular};
`;

const emptyEvent: SentryEvent = {
	message: '',
	level: 'info',
	release: 'unknown',
	extra: {
		app: '0',
		topic: '0'
	},
	user: {}
};

type SentryEventReducer =
	| { type: 'set-user'; payload: SentryEvent['user'] }
	| { type: 'reset'; payload: never }
	| { type: 'set-message'; payload: SentryEvent['message'] }
	| { type: 'select-app'; payload: { version: SentryEvent['release']; app: string } }
	| { type: 'select-topic'; payload: string };

function reducer(state: SentryEvent, { type, payload }: SentryEventReducer): SentryEvent {
	switch (type) {
		case 'set-user':
			return { ...state, user: payload };
		case 'reset':
			return emptyEvent;
		case 'set-message':
			return { ...state, message: payload };
		case 'select-app':
			return {
				...state,
				release: payload.version,
				extra: { ...state.extra, app: payload.app }
			};
		case 'select-topic':
			return { ...state, extra: { ...state.extra, topic: payload } };
		default:
			return state;
	}
}

type Topic = { label: string; value: string };

const getTopics = (t: TFunction): Array<Topic> => [
	{ label: t('feedback.user_interface', 'User interface'), value: 'UserInterface' },
	{ label: t('feedback.behaviors', 'Behaviors'), value: 'Behaviors' },
	{ label: t('feedback.missing_features', 'Missing features'), value: 'MissingFeatures' },
	{ label: t('feedback.other', 'Other'), value: 'Other' }
];

interface ModuleLabelFactory {
	selected: SelectItem[];
	label?: string;
	open: boolean;
	focus: boolean;
	disabled: boolean;
}

const ModuleLabelFactory = ({
	selected,
	label,
	open,
	focus,
	disabled
}: ModuleLabelFactory): JSX.Element => (
	<LabelContainer
		orientation="horizontal"
		width="fill"
		crossAlignment="center"
		mainAlignment="space-between"
		borderRadius="half"
		background={'gray5'}
		padding={{
			all: 'small'
		}}
		disabled={disabled}
	>
		<Row takeAvailableSpace mainAlignment="unset">
			<Text size="medium" color={open || focus ? 'primary' : 'secondary'}>
				{selected.length > 0 ? selected[0].label : label}
			</Text>
		</Row>
		<Icon
			size="large"
			icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
			color={open || focus ? 'primary' : 'secondary'}
			style={{ alignSelf: 'center' }}
		/>
	</LabelContainer>
);

interface FeedbackLabelFactoryProps extends LabelFactoryProps {
	showErr: boolean;
}

const FeedbackLabelFactory = ({
	selected,
	label,
	open,
	focus,
	showErr
}: FeedbackLabelFactoryProps): JSX.Element => (
	<LabelContainer
		disabled={showErr}
		orientation="horizontal"
		width="fill"
		crossAlignment="center"
		mainAlignment="space-between"
		borderRadius="half"
		background={'gray5'}
		padding={{
			all: 'small'
		}}
	>
		<Row takeAvailableSpace mainAlignment="unset">
			{showErr ? (
				<Text size="medium" color={(open && showErr) || focus ? 'primary' : 'error'}>
					{selected.length > 0 ? selected[0].label : label}
				</Text>
			) : (
				<Text size="medium" color={open || focus ? 'primary' : 'secondary'}>
					{selected.length > 0 ? selected[0].label : label}
				</Text>
			)}
		</Row>

		{showErr ? (
			<Icon
				size="large"
				icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
				color={(open && showErr) || focus ? 'primary' : 'error'}
				style={{ alignSelf: 'center' }}
			/>
		) : (
			<Icon
				size="large"
				icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
				color={open || focus ? 'primary' : 'secondary'}
				style={{ alignSelf: 'center' }}
			/>
		)}
	</LabelContainer>
);

const Feedback = (): JSX.Element => {
	const t = getT();
	const allApps = useAppList();
	const apps = useMemo(
		() => filter(allApps, (app) => !!app.sentryDsn),

		[allApps]
	);
	const appItems = useMemo(
		(): SelectItem[] =>
			map(
				apps,
				(app): SelectItem => ({
					label: app.display,
					value: app.name
				})
			),
		[apps]
	);
	const account = useUserAccount();
	const [sentryEvent, dispatch] = useReducer(reducer, emptyEvent);
	const [showErr, setShowErr] = useState(false);
	const [limit, setLimit] = useState(0);

	const onAppSelect = useCallback(
		(ev) =>
			dispatch({
				type: 'select-app',
				payload: {
					app: ev,
					version: find(apps, ['name', ev])?.version
				}
			}),
		[apps]
	);

	const onTopicSelect = useCallback((ev) => {
		setShowErr(false);
		dispatch({ type: 'select-topic', payload: ev });
	}, []);

	const onInputChange = useCallback<
		NonNullable<TextareaHTMLAttributes<HTMLTextAreaElement>['onChange']>
	>((event) => {
		// eslint-disable-next-line no-param-reassign
		event.target.style.height = 'auto';
		// eslint-disable-next-line no-param-reassign
		event.target.style.height = `${25 + event.target.scrollHeight}px`;
		if (event.target.value.length <= 500) {
			setLimit(event.target.value.length);
			dispatch({ type: 'set-message', payload: event.target.value });
		}
	}, []);

	const checkTopicSelect = useCallback<
		NonNullable<TextareaHTMLAttributes<HTMLTextAreaElement>['onKeyUp']>
	>(
		(event) => {
			if (sentryEvent.extra?.topic === '0') {
				setShowErr(true);
			} else {
				setShowErr(false);
			}
			if (event.key === 'Backspace' && sentryEvent.message?.length === 0) {
				setShowErr(false);
			}
		},
		[setShowErr, sentryEvent]
	);

	const createSnackbar = useSnackbar();

	const confirmHandler = useCallback(() => {
		const feedbackId = feedback(sentryEvent);
		createSnackbar(
			feedbackId
				? { type: 'success', label: t('feedback.success', 'Thank you for your feedback') }
				: {
						type: 'error',
						label: t('feedback.error', 'There was an error while sending your feedback')
				  }
		);
		closeBoard('feedback');
	}, [sentryEvent, createSnackbar, t]);

	useEffect(() => {
		dispatch({
			type: 'set-user',
			payload: { id: account.id, name: account.displayName ?? account.name }
		});
	}, [account]);

	const disabledSend = useMemo(
		() =>
			(sentryEvent?.message?.length ?? 0) <= 0 ||
			sentryEvent.extra?.topic === '0' ||
			sentryEvent.extra?.app === '0',
		[sentryEvent.message, sentryEvent.extra?.topic, sentryEvent.extra?.app]
	);

	const LabelFactory = useCallback(
		(props: LabelFactoryProps) => <FeedbackLabelFactory {...props} showErr={showErr} />,
		[showErr]
	);

	const topics = useMemo(() => getTopics(t), [t]);

	const defaultTopic = useMemo(
		(): Topic =>
			find(topics, (topic) => topic.value === sentryEvent.extra?.topic) ?? { label: '', value: '' },
		[sentryEvent.extra?.topic, topics]
	);

	return (
		<Container padding={{ all: 'large' }} mainAlignment="space-around">
			<Container orientation="horizontal" height="fit">
				<TextContainer mainAlignment="flex-start" crossAlignment="flex-start">
					<Text weight="bold" size="large">
						{t('feedback.report_something', 'Do you want to report something?')}
					</Text>
					<SubHeadingText overflow="break-word" lineHeight="1.5">
						{t(
							'feedback.explanation',
							'Please send us your feedback about your new experience with Zextras Server. Your opinion is meaningful for us to improve our product. So tell us what’s on your mind.'
						)}
					</SubHeadingText>
					<SubHeadingText overflow="break-word">
						{t(
							'feedback.hint',
							'Remember: define the topic using module and macro area selectors before write your feedback. Thanks for your help.'
						)}
					</SubHeadingText>
				</TextContainer>

				<ButtonContainer crossAlignment="flex-end" mainAlignment="baseline">
					<Button
						label={t('feedback.send', 'SEND')}
						onClick={confirmHandler}
						disabled={disabledSend}
					/>
				</ButtonContainer>
			</Container>
			<Container
				padding={{ bottom: 'medium' }}
				height="fit"
				mainAlignment="space-between"
				crossAlignment="flex-start"
				orientation="horizontal"
			>
				<Container mainAlignment="space-between" crossAlignment="flex-start" maxWidth="19.0625rem">
					<Row padding={{ vertical: 'large' }}>
						<Text weight="bold" size="small">
							Module
						</Text>
					</Row>
					<Select
						label={t('feedback.select_a_module', 'Select a module')}
						items={appItems}
						defaultSelection={{ label: '', value: '' }}
						onChange={onAppSelect}
						LabelFactory={ModuleLabelFactory}
					/>
				</Container>
				<Container mainAlignment="space-between" crossAlignment="flex-start" maxWidth="19.0625rem">
					<Row padding={{ vertical: 'large' }}>
						<Text weight="bold" size="small">
							Topic
						</Text>
					</Row>
					<Select
						label={t('feedback.select_a_topic', 'Select a topic')}
						items={topics}
						defaultSelection={defaultTopic}
						onChange={onTopicSelect}
						LabelFactory={LabelFactory}
						multiple={false}
					/>
				</Container>
			</Container>
			<TAContainer crossAlignment="flex-end">
				<TextArea
					value={sentryEvent.message}
					onKeyUp={checkTopicSelect}
					onChange={onInputChange}
					placeholder={t('feedback.write_here', 'Write your feedback here')}
				/>
				<Text size="medium" color="secondary">
					{limit}/500
				</Text>
			</TAContainer>
		</Container>
	);
};

export default Feedback;
