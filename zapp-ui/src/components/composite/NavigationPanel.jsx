import React from 'react';
import PropTypes from 'prop-types';
import Container from "../primitive/Container";
import Collapse, { Collapser } from "../utilities/Collapse";
import IconButton from "../primitive/IconButton";
import Responsive from "../utilities/Responsive";
import Accordion from "../primitive/Accordion";
import Quota from "../primitive/Quota";
import Padding from "../primitive/Padding";

const NavigationPanel = ({
													 navigationBarIsOpen,
													 tree,
													 menuTree,
													 selectedApp,
													 onCollapserClick,
													 quota
}) => {
	let subTree = [];
	tree.forEach((app) => {
		if (app.app === selectedApp) {
			subTree = app.folders;
		}
	});
	return (
		<Container
			orientation="horizontal"
			background="bg_9"
			width="fit"
			height="fill"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Responsive mode="desktop">
				<Container
					width={64}
					height="fill"
					background="bg_7"
					orientation="vertical"
					mainAlignment="flex-start"
				>
					{ tree.map((app, index) => (<PrimaryBarElement key={index} icon={app.icon} click={app.click}/>))}
				</Container>
				<Collapse
					orientation="horizontal"
					open={navigationBarIsOpen}
					maxSize="256px"
				>
					<Container width={256} height="fill" orientation="vertical" mainAlignment="flex-start">
						{ subTree.map((folder, index) => (<Accordion click={folder.click} key={index} label={folder.label} items={folder.subfolders ? folder.subfolders : []} level={0}/>))}
					</Container>
				</Collapse>
				<Collapser clickCallback={onCollapserClick}/>
			</Responsive>
			<Responsive mode="mobile">
				<Container
					height="fill"
					width="fit"
					background="bg_9"
					style={{
						position: 'absolute',
						left: 0,
						top: 0,
						zIndex: 3
					}}
				>
					<Collapse
						orientation="horizontal"
						open={navigationBarIsOpen}
						crossSize="100%"
					>
						<Container width={256+64+12} height="fill" orientation="vertical" mainAlignment="space-between">
							<Container width="fill" height="fill" orientation="vertical" mainAlignment="flex-start">
								{tree.map((app, index) => <Accordion level={0} key={index} icon={app.icon} label={app.label} click={app.click} items={app.folders} divider/>)}
							</Container>
							<Container width="fill" height="fit" orientation="vertical" mainAlignment="flex-end">
								{menuTree.map((app, index) => <Accordion level={0} key={index} icon={app.icon} click={app.click} label={app.label} items={app.folders} divider/>)}
								<Padding vertical="medium">
									<Quota fill={quota}/>
								</Padding>
							</Container>
						</Container>
					</Collapse>
				</Container>
			</Responsive>
		</Container>
	);
};

NavigationPanel.propTypes = {
	selectedApp: PropTypes.string,
	navigationBarIsOpen: PropTypes.bool.isRequired,
	onCollapserClick: PropTypes.func.isRequired,
	tree: PropTypes.arrayOf(
		PropTypes.shape({
			app: PropTypes.string,
			click: PropTypes.func,
			label: PropTypes.string,
			icon: PropTypes.string,
			folders: PropTypes.arrayOf(
				PropTypes.shape({
					label: PropTypes.string
				})
			)
		})
	).isRequired,
	menuTree: PropTypes.arrayOf(
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
	).isRequired,
	quota: PropTypes.number
};

const PrimaryBarElement = ({ icon, click }) => {
	return (
		<IconButton icon={icon} onClick={click} size="large"/>
	);
};

export default NavigationPanel;
