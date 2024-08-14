import React from "react";

import { MdOutlineDns } from "react-icons/md";

const DnsInfoLabel = ({ dns1, dns2, title }) => {
	return (
		<div
			className={` d-flex justify-content-end align-items-start gap-2 mb-5 option-info-label dns_info_label`}>
			<span>
				<h5 className='dns_info_label__title mb-1'>:{title}</h5>
				<div>
					<p className='dns_info_label__info'>{dns1}</p>
					<p className='dns_info_label__info'>{dns2}</p>
				</div>
			</span>
			<MdOutlineDns />
		</div>
	);
};

export default DnsInfoLabel;
