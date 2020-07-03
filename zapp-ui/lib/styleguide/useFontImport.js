import { useEffect } from 'react';

export default function useFontImport() {
	useEffect(() => {
		let link = document.getElementById('font-import-tag');
		if (!link) {
			link = document.createElement("link")
			link.id = 'font-import-tag';
			link.rel = 'stylesheet';
			link.href = 'https://fonts.googleapis.com/css?family=Roboto:400,400i,500,500i,700,700i&display=swap';
			link.type = 'text/css';
			document.head.appendChild(link);
			return () => {
				document.head.removeChild(link);
			}
		}
	}, []);
}
