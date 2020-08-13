import React from 'react';

export default function Responsive({ mode }) {
	return `Responsive (mode = ${mode? 'set':'unset'})`;
}