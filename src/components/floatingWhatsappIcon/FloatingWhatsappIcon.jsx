import React from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import "./FloatingWhatsappIcon.css";
import { AtlbhaImage } from "../../data/images";

const FloatingWhatsappIcon = () => {
	return (
		<FloatingWhatsApp
			allowEsc
			avatar={AtlbhaImage}
			allowClickAway
			notification
			notificationSound
			notificationDelay={10}
			chatboxStyle={{
				borderRadius: "8px",
				direction: "ltr",
			}}
			className='floating-whatsapp-icon'
			accountName='منصة أطلبها'
			statusMessage='سيتم التواصل في أقرب وقت'
			chatMessage='مرحباً، كيف يمكنني مساعدتك؟'
			placeholder='أكتب رسالتك هنا...'
			phoneNumber='+966567009332'
		/>
	);
};

export default FloatingWhatsappIcon;
