export const goToLogin: () => void = () => {
	console.log('bye!');
	debugger;
	window?.location?.assign?.(
		`${window?.location?.origin}${
			window?.location?.port ? `:${window?.location?.port}` : ''
		}/static/login`
	);
};
