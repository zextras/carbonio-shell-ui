import { Component } from 'react';

export type UnknownFunction = (args: unknown) => unknown;
export type SearchType =
	| 'conversation'
	| 'message'
	| 'contact'
	| 'appointment'
	| 'task'
	| 'wiki'
	| 'document';
export type SearchResult = {
	id: string;
};

export type CustomSearchDefinition = {
	customSearch: (query: string) => Promise<Array<SearchResult>>;
	UiComponent: Component<unknown>;
};

export type StandardSearchDefinition = {
	types: Array<SearchType>;
	searchRequestParams?: unknown; // put additional searchRequest parameters here
	UiComponent: Component<unknown>;
};

export type SharedFunction = {
	id: string;
	app: string;
	function: UnknownFunction;
};

export type SharedFunctionMap = {
	[id: string]: SharedFunction;
};

export type SimpleSearchMap = {
	[app: string]: CustomSearchDefinition | StandardSearchDefinition;
};

export type AdvancedSearchMap = {
	// TODO: Expand this when more info is available.
	[app: string]: unknown;
};

export type ShellState = {
	shares: {
		functions: SharedFunctionMap;
	};
	search: {
		simple: SimpleSearchMap;
		advanced: AdvancedSearchMap;
	};
	addSimpleSearch: (
		app: string
	) => (
		types: Array<SearchType>,
		UiComponent: Component<unknown>,
		searchRequestParams?: unknown
	) => void;
	addCustomSimpleSearch: (
		app: string
	) => (
		customSearch: (query: string) => Promise<Array<SearchResult>>,
		UiComponent: Component<unknown>
	) => void;
	addSharedFunction: (app: string) => (id: string, fn: UnknownFunction) => void;
	removeSharedFunction: (app: string) => (id: string) => void;
};
