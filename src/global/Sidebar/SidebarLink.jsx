import React from "react";
import { NavLink } from "react-router-dom";
import { MenuItem } from "react-pro-sidebar";

const SidebarLink = ({
	to,
	icon: Icon,
	label,
	onClick,
	as = "li",
	href,
	target,
	rel,
	className,
}) => {
	if (href) {
		return (
			<a as={as} href={href} target={target} rel={rel} className={className}>
				<MenuItem onClick={onClick}>
					<Icon />
					<span className='me-2'>{label}</span>
				</MenuItem>
			</a>
		);
	}

	return (
		<NavLink className={className} to={to} onClick={onClick}>
			<MenuItem>
				<Icon />
				<span className='me-2'>{label}</span>
			</MenuItem>
		</NavLink>
	);
};

export default SidebarLink;
