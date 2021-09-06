import React, { useEffect, useState, FC } from 'react';
import { Location } from 'history';
import { Prompt, useHistory } from 'react-router';
import { Modal } from '@zextras/zapp-ui';

export const RouteLeavingGuard: FC = ({ children }) => {
	const history = useHistory();
	const [modalVisible, setModalVisible] = useState(false);
	const [lastLocation, setLastLocation] = useState<Location | null>(null);
	const [confirmedNavigation, setConfirmedNavigation] = useState(false);
	const closeModal = (): void => {
		setModalVisible(false);
	};
	const handleBlockedNavigation = (nextLocation: Location): boolean => {
		if (!confirmedNavigation) {
			setModalVisible(true);
			setLastLocation(nextLocation);
			return false;
		}
		return true;
	};
	const handleConfirmNavigationClick = (): void => {
		setModalVisible(false);
		setConfirmedNavigation(true);
	};
	useEffect(() => {
		if (confirmedNavigation && lastLocation) {
			// Navigate to the previous blocked location with your navigate function
			history.push(lastLocation.pathname);
		}
	}, [confirmedNavigation, history, lastLocation]);
	return (
		<>
			<Prompt message={handleBlockedNavigation} />
			{/* Your own alert/dialog/modal component */}
			<Modal
				open={modalVisible}
				onClose={closeModal}
				onConfirm={handleConfirmNavigationClick}
				title="Title_bold_dark"
				dismissLabel="Cancel"
				confirmLabel="Proceed"
			>
				{'U sure bro?'}
				{children}
			</Modal>
		</>
	);
};
export default RouteLeavingGuard;
