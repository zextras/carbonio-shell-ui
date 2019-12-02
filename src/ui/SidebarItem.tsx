import React, { FC, useState, ReactElement } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { map } from "lodash";
import {
	Collapse,
	List,
	ListItem,
	ListItemIcon,
	ListItemText
} from '@material-ui/core';
import {
	ExpandLess,
	ExpandMore
} from '@material-ui/icons';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { IMainSubMenuItemData } from '../router/IRouterService';

export interface ISidebarItemProps extends IMainSubMenuItemData {
	level: number;
}

const SidebarItem: FC<ISidebarItemProps> = ({label, icon, children, level, to}: ISidebarItemProps) => {
	const [open, setOpen] = useState(false);
	const classes = makeStyles((theme: Theme) =>
		createStyles({
			nested: {
				paddingLeft: level * theme.spacing(4),
			}
		})
	)();
	const renderLink = React.useMemo(
		() =>
			React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'innerRef' | 'to'>>(
				(itemProps, ref) => (
					// With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
					// See https://github.com/ReactTraining/react-router/issues/6056
					<RouterLink to={to} {...itemProps} innerRef={ref} />
				),
			),
		[to],
	);
	return(
		<>
			<ListItem
				button
				component={renderLink}
				onClick={(): void => setOpen(!open)}
				className={classes.nested}
			>
				<ListItemIcon>
					{icon}
				</ListItemIcon>
				<ListItemText primary={label} />
				{children && children.length > 0 && (
					open ? <ExpandLess /> : <ExpandMore />
				)}
			</ListItem>
			{children && children.length > 0 &&
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{map(
							children,
							(folder: ISidebarItemProps, index: number): ReactElement =>
								<SidebarItem
									id={folder.id}
									label={folder.label}
									icon={folder.icon}
									children={folder.children}
									level={level + 1}
									to={folder.to}
									key={index}
								/>
							)
						}
					</List>
				</Collapse>
			}
		</>
	);
};

export default SidebarItem