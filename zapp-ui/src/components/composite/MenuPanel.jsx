import React from 'react';
import PropTypes from 'prop-types';
import Container from "../layout/Container";
import Collapse from "../utilities/Collapse";
import Responsive from "../utilities/Responsive";
import Accordion from "../navigation/Accordion";

function MenuPanel({
	menuIsOpen,
	tree,
}) {
	return (
		<Container
			orientation="horizontal"
			background="gray5"
			width="fit"
			height="fill"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
			style={{ position: 'absolute', right: 0, top: 0, zIndex: 3 }}
		>
			<Responsive mode="desktop">
				<Collapse
					orientation="horizontal"
					open={menuIsOpen}
					maxSize="256px"
				>
					<Container width={256} height="fill" orientation="vertical" mainAlignment="flex-start">
						{tree.map((app, index) => <Accordion level={0} key={index} click={app.click} icon={app.icon} label={app.label} items={app.folders} divider/>)}
					</Container>
				</Collapse>
			</Responsive>
		</Container>
	);
}

MenuPanel.propTypes = {
	menuIsOpen: PropTypes.bool.isRequired,
	tree: PropTypes.arrayOf(
		PropTypes.shape({
			app: PropTypes.string,
			label: PropTypes.string,
			icon: PropTypes.string,
			folders: PropTypes.arrayOf(
				PropTypes.shape({
					label: PropTypes.string
				})
			)
		})
	).isRequired
};

export default MenuPanel;
