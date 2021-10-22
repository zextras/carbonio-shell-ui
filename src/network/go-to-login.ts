export const goToLogin: () => void = () => {
	window?.location?.assign?.(`${window?.location?.origin}/static/login`);
};
