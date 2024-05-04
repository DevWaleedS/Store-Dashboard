import React from "react";
import { useNavigate } from "react-router-dom";

function Tabs({ activeTab, setActiveTab, registration_marketer }) {
	const tabs = [
		{ id: 1, text: "تسجيل الدخول", link: "login", status: "active" },
		{ id: 2, text: "تسجيل تاجر", link: "merchant", status: "active" },
		{
			id: 3,
			text: "تسجيل مندوب",
			link: "delegate",
			status: registration_marketer,
		},
	];
	const navigate = useNavigate();
	return (
		<div className='tabs'>
			{tabs
				?.filter((tab) => tab?.status === "active")
				?.map((tab, index) => (
					<button
						onClick={() => {
							setActiveTab(index);
							navigate(`/auth/${tab?.link}`);
						}}
						key={tab?.id}
						className={`tab ${index === activeTab ? "active" : ""}`}>
						{tab?.text}
					</button>
				))}
		</div>
	);
}

export default Tabs;
