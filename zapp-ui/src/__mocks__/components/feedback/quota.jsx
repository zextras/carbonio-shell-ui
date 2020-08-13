import React from 'react';

export default function Quota({ fill }) {
	return `Quota (fill = ${fill ? 'set':'unset'})`;
}