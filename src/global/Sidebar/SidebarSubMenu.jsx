import React from "react";
import { SubMenu } from "react-pro-sidebar";
import SidebarLink from "./SidebarLink";

const SidebarSubMenu = ({ label, icon: Icon, items, onClose, onVerify }) => {
	return (
		<SubMenu label={label} icon={<Icon />} as='li'>
			{items?.map((item, index) => (
				<SidebarLink
					key={index}
					to={item.href ?? item?.to}
					icon={item.icon}
					target={item?.target}
					label={item.label}
					onClick={() => {
						onClose();
						onVerify();

						// to handle open maintenance mode modal
						if (item.isMaintenanceModeModal) {
							item.isMaintenanceModeModal();
						}

						// to handle open verify store modal
						if (item.isVerifyStoreModal) {
							item.isVerifyStoreModal();
						}
					}}
					className='sub-menu-link'
				/>
			))}
		</SubMenu>
	);
};

export default SidebarSubMenu;
