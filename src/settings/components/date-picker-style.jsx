/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Container } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

const Styler = styled(Container)`
	.rw-btn,
	.rw-input-reset,
	.rw-input,
	.rw-dropdown-list-autofill,
	.rw-filter-input {
		color: inherit;
		padding: 0;
		margin: 0;
		border: none;
		box-shadow: none;
		background: none;
		background-image: none;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		-ms-touch-action: manipulation;
		touch-action: manipulation;
	}
	.rw-btn::-moz-focus-inner {
		padding: 0;
		border: 0;
	}
	select.rw-input {
		text-transform: none;
	}
	html input[type='button'].rw-input {
		-webkit-appearance: button;
		cursor: pointer;
	}
	textarea.rw-input {
		overflow: auto;
		resize: vertical;
	}
	button[disabled].rw-input,
	fieldset[disabled] .rw-input,
	html input[disabled].rw-input {
		cursor: not-allowed;
	}
	button.rw-input::-moz-focus-inner,
	input.rw-input::-moz-focus-inner {
		border: 0;
		padding: 0;
	}
	input[type='checkbox'],
	input[type='radio'] {
		box-sizing: border-box;
		padding: 0;
	}
	${
		/* @font-face {
	font-family: "RwWidgets";
	font-weight: normal;
	font-style: normal;
	${/* src: url("../fonts/rw-widgets.eot?v=4.1.0");
	src: url("../fonts/rw-widgets.eot?#iefix&v=4.1.0") format("embedded-opentype"),
	url("../fonts/rw-widgets.woff?v=4.1.0") format("woff"),
	url("../fonts/rw-widgets.ttf?v=4.1.0") format("truetype"),
		url("../fonts/rw-widgets.svg?v=4.1.0#fontawesomeregular") format("svg"); */ ''
	};
	.rw-i {
		display: inline-block;
		color: inherit;
		${/* font-family: RwWidgets; */ ''};
		font-style: normal;
		font-weight: normal;
		font-variant: normal;
		text-transform: none;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
	}
	.rw-i-caret-down:before {
		content: '\e803';
	}
	.rw-i-caret-up:before {
		content: '\e800';
	}
	.rw-i-chevron-left:before {
		content: '\f104';
	}
	.rw-i-chevron-right:before {
		content: '\f105';
	}
	.rw-i-clock-o:before {
		content: '\e805';
	}
	.rw-i-calendar:before {
		content: '\e804';
	}
	.rw-i-search:before {
		content: '\e801';
	}
	.rw-btn {
		position: relative;
		color: #333;
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		border: 0.0625rem solid transparent;
		cursor: pointer;
		outline: none;
	}
	.rw-state-readonly .rw-btn,
	.rw-state-disabled .rw-btn {
		cursor: not-allowed;
	}
	.rw-btn-select {
		opacity: 0.75;
		transition: opacity 150ms ease-in;
	}
	.rw-btn-select:hover,
	.rw-state-focus .rw-btn-select,
	:hover > .rw-btn-select {
		opacity: 1;
	}
	.rw-btn-primary {
		width: 100%;
		white-space: normal;
		line-height: 2rem;
	}
	.rw-btn-primary:hover {
		background-color: #e6e6e6;
	}
	.rw-btn-select[disabled],
	.rw-btn-primary[disabled],
	fieldset[disabled] .rw-btn-select,
	fieldset[disabled] .rw-btn-primary {
		box-shadow: none;
		cursor: not-allowed;
		opacity: 0.65;
		pointer-events: none;
	}
	.rw-sr {
		position: absolute;
		width: 0.0625rem;
		height: 0.0625rem;
		margin: -0.0625rem;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
	.rw-widget {
		background-clip: border-box;
		border: none;
		outline: none;
		position: relative;
		border-radius: 0.125rem 0.125rem 0 0;
		width: 100%;
	}
	.rw-widget,
	.rw-widget * {
		box-sizing: border-box;
	}
	.rw-widget:before,
	.rw-widget *:before,
	.rw-widget:after,
	.rw-widget *:after {
		box-sizing: border-box;
	}
	.rw-widget > .rw-widget-container {
		width: 100%;
		margin: 0;
	}
	.rw-widget-container {
		background-color: ${({ theme }) => theme.palette.gray5.regular};
		border-bottom: ${({ theme }) => theme.palette.gray2.regular} 0.0625rem solid;
	}
	.rw-widget-container.rw-state-focus,
	.rw-state-focus > .rw-widget-container,
	.rw-widget-container.rw-state-focus:hover,
	.rw-state-focus > .rw-widget-container:hover {
		background-color: ${({ theme }) => theme.palette.gray5.focus};
		border-bottom: ${({ theme }) => theme.palette.primary.regular} 0.0625rem solid;
	}
	.rw-widget-container.rw-state-readonly,
	.rw-state-readonly > .rw-widget-container {
		cursor: not-allowed;
	}
	.rw-widget-container.rw-state-disabled,
	.rw-state-disabled > .rw-widget-container,
	fieldset[disabled] .rw-widget-container,
	.rw-widget-container.rw-state-disabled:hover,
	.rw-state-disabled > .rw-widget-container:hover,
	fieldset[disabled] .rw-widget-container:hover,
	.rw-widget-container.rw-state-disabled:active,
	.rw-state-disabled > .rw-widget-container:active,
	fieldset[disabled] .rw-widget-container:active {
		box-shadow: none;
		cursor: not-allowed;
	}

	.rw-datetime-picker {
		height: 2.625rem;
	}
	.rw-widget-picker {
		position: relative;
		overflow: hidden;
		border-collapse: separate;
		display: inline-table;
		height: 100%;
	}
	.rw-widget-picker > * {
		position: relative;
		border: none;
		outline: none;
		width: 100%;
		height: 100%;
		display: table-cell;
	}
	.rw-widget-picker > .rw-select {
		width: ${({ allDay }) => (allDay ? '2.125rem' : '4.25rem')};
		white-space: nowrap;
	}
	.rw-open > .rw-widget-picker {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}
	.rw-open-up > .rw-widget-picker {
		border-top-right-radius: 0;
		border-top-left-radius: 0;
	}
	fieldset[disabled] .rw-widget-picker,
	.rw-state-disabled > .rw-widget-picker {
		background-color: #eee;
	}
	.rw-multiselect > .rw-widget-picker {
		height: auto;
	}
	.rw-select {
		cursor: pointer;
	}
	.rw-select > * {
		width: 2rem;
		height: 100%;
	}
	.rw-state-readonly .rw-select,
	.rw-state-disabled .rw-select {
		cursor: not-allowed;
	}
	.rw-select-bordered {
		cursor: pointer;
		border: none;
		border-left: #ccc 0.0625rem solid;
	}
	.rw-select-bordered:hover,
	.rw-select-bordered:active {
		background-color: #e6e6e6;
	}
	.rw-select-bordered:active {
		box-shadow: inset 0 0.1875rem 0.3125rem rgba(0, 0, 0, 0.125);
	}
	.rw-state-disabled .rw-select-bordered,
	.rw-state-readonly .rw-select-bordered,
	fieldset[disabled] .rw-select-bordered,
	.rw-state-disabled .rw-select-bordered:hover,
	.rw-state-readonly .rw-select-bordered:hover,
	fieldset[disabled] .rw-select-bordered:hover,
	.rw-state-disabled .rw-select-bordered:active,
	.rw-state-readonly .rw-select-bordered:active,
	fieldset[disabled] .rw-select-bordered:active {
		cursor: not-allowed;
		background-color: inherit;
		background-image: none;
		box-shadow: none;
	}
	.rw-rtl .rw-select-bordered {
		border-right: #ccc 0.0625rem solid;
		border-left: none;
	}
	.rw-rtl {
		direction: rtl;
	}
	.rw-input-reset,
	.rw-input,
	.rw-dropdown-list-autofill,
	.rw-filter-input {
		outline: 0;
	}
	.rw-input-reset::-moz-placeholder {
		color: #999;
		opacity: 1;
	}
	.rw-input-reset:-ms-input-placeholder {
		color: #999;
	}
	.rw-input-reset::-webkit-input-placeholder {
		color: #999;
	}
	.rw-input,
	.rw-dropdown-list-autofill,
	.rw-filter-input {
		padding: 0 0.857rem;
	}
	.rw-input[type='text']::-ms-clear {
		display: none;
	}
	.rw-input[disabled],
	fieldset[disabled] .rw-input {
		box-shadow: none;
		cursor: not-allowed;
		opacity: 1;
		background-color: #eee;
		border-color: #ccc;
	}
	.rw-input[readonly] {
		cursor: not-allowed;
	}
	.rw-i.rw-loading {
		display: block;
		${/* background: url("../img/loading.gif") no-repeat center; */ ''};
		min-width: 1rem;
		width: 1.9rem;
		height: 1rem;
	}
	.rw-i.rw-loading:before {
		content: '';
	}
	.rw-placeholder {
		color: #999;
	}
	.rw-detect-autofill:-webkit-autofill {
		animation-name: react-widgets-autofill-start;
		transition: background-color 50000s ease-in-out 0s;
	}
	.rw-detect-autofill:not(:-webkit-autofill) {
		animation-name: react-widgets-autofill-cancel;
	}
	.rw-webkit-autofill .rw-widget-container,
	.rw-input:-webkit-autofill {
		background-color: #faffbd !important;
		background-image: none !important;
		color: #000 !important;
	}
	.rw-widget-input,
	.rw-filter-input {
	}
	.rw-widget-input.rw-state-focus {
		box-shadow: 0 0 0.5rem rgba(102, 175, 233, 0.6),
			inset 0 0.0625rem 0.0625rem rgba(0, 0, 0, 0.075);
	}
	.rw-list {
		margin: 0;
		padding: 0;
		list-style: none;
		font-size: 1rem;
		outline: 0;
		overflow: auto;
		max-height: 12.5rem;
	}
	.rw-list-option {
		-ms-user-select: none;
		user-select: none;
		color: #333;
		cursor: pointer;
		border: 0.0625rem solid transparent;
	}
	.rw-list-option.rw-state-focus,
	.rw-list-option.rw-state-focus:hover {
		background-color: transparent;
		border-color: #66afe9;
		color: #333;
	}
	.rw-list-option:hover,
	.rw-list-option:hover.rw-state-focus {
		background-color: #e6e6e6;
		border-color: #e6e6e6;
		color: #333;
	}
	.rw-list-option.rw-state-selected,
	.rw-list-option.rw-state-selected:hover {
		background-color: #337ab7;
		border-color: #337ab7;
		color: white;
	}
	fieldset[disabled] .rw-list-option,
	.rw-list-option.rw-state-disabled,
	.rw-list-option.rw-state-readonly {
		box-shadow: none;
		cursor: not-allowed;
		color: #999;
		opacity: 0.7;
	}
	fieldset[disabled] .rw-list-option:hover,
	.rw-list-option.rw-state-disabled:hover,
	.rw-list-option.rw-state-readonly:hover {
		background: none;
		border-color: transparent;
	}
	.rw-list-empty,
	.rw-list-option,
	.rw-list-optgroup {
		padding: 0.143rem 0.75rem;
		outline: 0;
	}
	.rw-list-optgroup {
		font-weight: bold;
		padding-top: 0.4375rem;
	}
	.rw-list-option-create {
		border-top: 0.0625rem #ccc solid;
	}
	.rw-dropdown-list-autofill {
		padding: 0;
	}
	.rw-dropdown-list-input {
		background-color: transparent;
		vertical-align: middle;
		padding-right: 0;
		max-width: 0.0625rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	.rw-rtl .rw-dropdown-list-input {
		padding-right: 0.857rem;
		padding-left: 0;
	}
	.rw-filter-input {
		position: relative;
		margin: 0.25rem;
		padding-right: 0;
	}
	.rw-filter-input .rw-rtl {
		padding-right: 0.857rem;
		padding-left: 0;
	}
	.rw-filter-input .rw-select,
	.rw-filter-input .rw-btn {
		opacity: 0.75;
		cursor: text;
	}
	.rw-filter-input > .rw-select,
	.rw-filter-input > .rw-select:active,
	.rw-filter-input > .rw-select:hover {
		background: none;
		cursor: initial;
		box-shadow: none;
	}

	.rw-number-picker .rw-btn {
		cursor: pointer;
		height: calc(1.2145rem - 0.0625rem);
		${
			/*
		  margin-top: -0.0625rem\9;
	height: 1.2145rem\9;
*/ 'border: 0.125rem solid red;'
		};
		line-height: 1.2145rem;
		line-height: calc(1.2145rem - 0.0625rem);
		display: block;
		border: none;
	}

	.rw-number-picker .rw-btn:hover,
	.rw-number-picker .rw-btn:active {
		background-color: #e6e6e6;
	}
	.rw-number-picker .rw-btn:active {
		box-shadow: inset 0 0.1875rem 0.3125rem rgba(0, 0, 0, 0.125);
	}
	.rw-state-disabled .rw-number-picker .rw-btn,
	.rw-state-readonly .rw-number-picker .rw-btn,
	fieldset[disabled] .rw-number-picker .rw-btn,
	.rw-state-disabled .rw-number-picker .rw-btn:hover,
	.rw-state-readonly .rw-number-picker .rw-btn:hover,
	fieldset[disabled] .rw-number-picker .rw-btn:hover,
	.rw-state-disabled .rw-number-picker .rw-btn:active,
	.rw-state-readonly .rw-number-picker .rw-btn:active,
	fieldset[disabled] .rw-number-picker .rw-btn:active {
		cursor: not-allowed;
		background-color: inherit;
		background-image: none;
		box-shadow: none;
	}
	.rw-number-picker .rw-select {
		vertical-align: middle;
	}
	.rw-number-picker .rw-select,
	.rw-number-picker .rw-select:hover,
	.rw-number-picker .rw-select:active {
		box-shadow: none;
	}
	.rw-calendar-popup {
		right: auto;
		min-width: 0;
		width: 18rem;
	}
	.rw-calendar {
		border-radius: 0.25rem;
		background-color: #fff;
		border: #ccc 0.0625rem solid;
		overflow: hidden;
	}
	.rw-calendar.rw-popup {
		border-color: #ccc;
	}
	.rw-calendar-now {
		font-weight: bold;
	}
	.rw-calendar-btn-left,
	.rw-calendar-btn-right {
		width: 12.5%;
	}
	.rw-calendar-btn-view {
		width: 75%;
	}
	.rw-calendar-footer {
		border-top: 0.0625rem solid #ccc;
	}
	.rw-calendar-grid {
		outline: none;
		height: 14.28571429rem;
		table-layout: fixed;
		border-collapse: separate;
		border-spacing: 0;
		width: 100%;
		background-color: #fff;
	}
	.rw-head-cell {
		text-align: center;
		border-bottom: 0.0625rem solid #ccc;
		padding: 0.25rem;
	}
	.rw-cell {
		color: #333;
		border-radius: 0.25rem;
		cursor: pointer;
		line-height: normal;
		text-align: center;
		border: 0.0625rem solid transparent;
		padding: 0.25rem;
	}
	.rw-cell:hover {
		background-color: #e6e6e6;
		border-color: #e6e6e6;
		color: #333;
	}
	.rw-cell.rw-state-focus,
	.rw-cell.rw-state-focus:hover {
		background-color: transparent;
		border-color: #66afe9;
		color: #333;
	}
	.rw-cell.rw-state-selected,
	.rw-cell.rw-state-selected:hover {
		background-color: #337ab7;
		border-color: #337ab7;
		color: white;
	}
	.rw-cell.rw-state-disabled {
		color: #999;
		opacity: 0.7;
	}
	.rw-cell.rw-state-disabled:hover {
		background: none;
		border-color: transparent;
	}
	.rw-calendar-month .rw-cell {
		text-align: center;
	}
	.rw-cell-off-range {
		color: #999;
	}
	.rw-calendar-transition-group {
		position: relative;
	}
	.rw-calendar-transition {
		transition: transform 300ms;
		overflow: hidden;
	}
	.rw-calendar-transition-top {
		-ms-transform: translateY(-100%);
		transform: translateY(-100%);
	}
	.rw-calendar-transition-bottom {
		-ms-transform: translateY(100%);
		transform: translateY(100%);
	}
	.rw-calendar-transition-right {
		-ms-transform: translateX(-100%);
		transform: translateX(-100%);
	}
	.rw-calendar-transition-left {
		-ms-transform: translateX(100%);
		transform: translateX(100%);
	}
	.rw-calendar-transition-entering.rw-calendar-transition-top,
	.rw-calendar-transition-entered.rw-calendar-transition-top,
	.rw-calendar-transition-entering.rw-calendar-transition-bottom,
	.rw-calendar-transition-entered.rw-calendar-transition-bottom {
		-ms-transform: translateY(0);
		transform: translateY(0);
	}
	.rw-calendar-transition-entering.rw-calendar-transition-right,
	.rw-calendar-transition-entered.rw-calendar-transition-right,
	.rw-calendar-transition-entering.rw-calendar-transition-left,
	.rw-calendar-transition-entered.rw-calendar-transition-left {
		-ms-transform: translateX(0);
		transform: translateX(0);
	}
	.rw-calendar-transition-exiting.rw-calendar-transition-top {
		-ms-transform: translateY(100%);
		transform: translateY(100%);
	}
	.rw-calendar-transition-exiting.rw-calendar-transition-bottom {
		-ms-transform: translateY(-100%);
		transform: translateY(-100%);
	}
	.rw-calendar-transition-exiting.rw-calendar-transition-right {
		-ms-transform: translateX(100%);
		transform: translateX(100%);
	}
	.rw-calendar-transition-exiting.rw-calendar-transition-left {
		-ms-transform: translateX(-100%);
		transform: translateX(-100%);
	}
	.rw-select-list {
		overflow: auto;
		position: relative;
	}
	.rw-select-list .rw-list {
		max-height: none;
		font-size: 1rem;
	}
	.rw-select-list-label {
		display: block;
		position: relative;
		font-weight: normal;
		cursor: inherit;
		padding-left: 1.25rem;
		margin: 0;
	}
	.rw-rtl .rw-select-list-label {
		padding-left: 0;
		padding-right: 1.25rem;
	}
	input.rw-select-list-input {
		position: absolute;
		left: 0;
		top: 50%;
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
		${/* top: 0.1rem\9; */ ''};
		margin: 0;
		line-height: normal;
		cursor: inherit;
	}
	.rw-rtl input.rw-select-list-input {
		left: auto;
		right: 0;
	}
	.rw-loading-mask {
		content: '';
		${/* background: url("../img/loader-big.gif") no-repeat center; */ ''};
		position: absolute;
		background-color: #fff;
		border-radius: 0.25rem;
		opacity: 0.7;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
	}
	.rw-multiselect {
		cursor: text;
	}
	.rw-multiselect .rw-input-reset {
		height: calc(2.429rem - 0.125rem);
		${
			/* margin-top: -0.125rem\9;
	height: 2.429rem\9; */ ''
		};
		border-width: 0;
		width: auto;
		max-width: 100%;
		padding: 0 0.857rem;
	}
	.rw-multiselect .rw-select {
		vertical-align: middle;
	}
	.rw-multiselect .rw-select,
	.rw-multiselect .rw-select:hover,
	.rw-multiselect .rw-select:active {
		box-shadow: none;
		background: none;
	}
	.rw-multiselect-taglist {
		margin: 0;
		padding: 0;
		list-style: none;
		display: inline-block;
		vertical-align: 0;
		outline: none;
	}
	.rw-multiselect-tag {
		display: inline-table;
		color: inherit;
		padding: 0 0.35rem 0 0.35rem;
		margin-left: calc(0.279335rem - 0.0625rem);
		margin-top: 0.279335rem;
		margin-top: calc(0.279335rem - 0.0625rem);
		height: 1.87033rem;
		border-radius: 0.1875rem;
		background-color: #eee;
		border: 0.0625rem solid #ccc;
		cursor: default;
		vertical-align: top;
		text-align: center;
		overflow: hidden;
		max-width: 100%;
	}
	.rw-multiselect-tag > * {
		display: table-cell;
		vertical-align: middle;
		height: 100%;
	}
	.rw-rtl .rw-multiselect-tag {
		margin-left: 0;
		margin-right: calc(0.279335rem - 0.0625rem);
		padding: 0 0.35rem 0 0.35rem;
	}
	.rw-multiselect-tag.rw-state-focus,
	.rw-multiselect-tag.rw-state-focus:hover {
		background-color: transparent;
		border-color: #66afe9;
		color: #333;
	}
	.rw-multiselect-tag.rw-state-readonly,
	.rw-multiselect-tag.rw-state-disabled,
	.rw-state-readonly .rw-multiselect-tag,
	.rw-state-disabled .rw-multiselect-tag,
	fieldset[disabled] .rw-multiselect-tag {
		cursor: not-allowed;
	}
	.rw-multiselect-tag.rw-state-disabled,
	.rw-state-disabled .rw-multiselect-tag,
	fieldset[disabled] .rw-multiselect-tag {
		opacity: 0.65;
	}
	fieldset[disabled] .rw-multiselect-tag {
		box-shadow: none;
		cursor: not-allowed;
	}
	.rw-multiselect-tag-btn {
		color: inherit;
		margin-left: 0.25rem;
	}
	.rw-rtl .rw-multiselect-tag-btn {
		margin-left: 0;
		margin-right: 0.25rem;
	}
	.rw-autocomplete .rw-select {
		position: absolute;
		display: block;
		width: auto;
		top: 0;
		bottom: 0;
		right: 0;
	}
	.rw-popup-container {
		position: absolute;
		z-index: 1005;
		top: 100%;
		left: -0.375rem;
		right: -0.375rem;
	}
	.rw-popup-container.rw-dropup {
		top: auto;
		bottom: 100%;
	}
	.rw-state-focus .rw-popup-container {
		z-index: 1006;
	}
	.rw-popup-transition {
		width: 100%;
		margin-bottom: 0.375rem;
		padding: 0 0.375rem;
	}
	.rw-dropup > .rw-popup-transition {
		margin-bottom: 0;
		margin-top: 0.375rem;
	}
	.rw-popup {
		border-top-right-radius: 0;
		border-top-left-radius: 0;
		border-bottom-right-radius: 0.1875rem;
		border-bottom-left-radius: 0.1875rem;
		box-shadow: 0 0.3125rem 0.375rem rgba(0, 0, 0, 0.2);
		border: #ccc 0.0625rem solid;
		background: #fff;
	}
	.rw-dropup .rw-popup {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
		border-top-right-radius: 0.1875rem;
		border-top-left-radius: 0.1875rem;
		box-shadow: 0 -0.125rem 0.375rem rgba(0, 0, 0, 0.2);
	}
	.rw-popup-transition {
		transition: transform 200ms;
	}
	.rw-popup-transition-entering {
		overflow: hidden;
	}
	.rw-popup-transition-entering .rw-popup-transition {
		-ms-transform: translateY(0);
		transform: translateY(0);
		transition-timing-function: ease-out;
	}
	.rw-popup-transition-exiting .rw-popup-transition {
		transition-timing-function: ease-in;
	}
	.rw-popup-transition-exiting,
	.rw-popup-transition-exited {
		overflow: hidden;
	}
	.rw-popup-transition-exiting .rw-popup-transition,
	.rw-popup-transition-exited .rw-popup-transition {
		-ms-transform: translateY(-100%);
		transform: translateY(-100%);
	}
	.rw-popup-transition-exiting.rw-dropup .rw-popup-transition,
	.rw-popup-transition-exited.rw-dropup .rw-popup-transition {
		-ms-transform: translateY(100%);
		transform: translateY(100%);
	}
	.rw-popup-transition-exited {
		display: none;
	}
	.rw-state-disabled {
		box-shadow: none;
		cursor: not-allowed;
	}

	color: ${({ theme }) => theme.palette.text.regular};
	font-family: ${({ theme }) => theme.fonts.default};
	font-size: ${({ theme }) => theme.sizes.font.medium};
	font-weight: ${({ theme }) => theme.fonts.weight.regular};
`;

export default Styler;
