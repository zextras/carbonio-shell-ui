import moment from 'moment';

export function checkUpdate() {
	const today = moment();
	const nextNotifyOn = Number(localStorage.getItem('nextNotifyOn'));
	const differenceInDays = moment(nextNotifyOn).diff(today, 'days');
	if (differenceInDays <= 0) {
		return true;
	}
	return false;
}
