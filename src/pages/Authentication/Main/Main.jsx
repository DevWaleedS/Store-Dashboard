import React, { useState, useEffect } from "react";
import "./Main.css";
// Third party
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
// Components
import LogoHeader from "../LogoHeader/LogoHeader";
import Tabs from "../Tabs/Tabs";
import Login from "../Login/Login";
import RegisterStore from "../RegisterStore/RegisterStore";
import useFetch from "../../../Hooks/UseFetch";
// Icons

import RegisterDelegate from "../RegisterDelegate/RegisterDelegate";
import { SvgComponent } from "../../../data/Icons";

const mainTitle = [
	{ id: 1, text: "قم بتسجيل الدخول الى حسابك" },
	{ id: 2, text: "أنشئ حسابك واستمتع بالتجارة الإلكترونية" },
	{ id: 3, text: "أنشئ حسابك واستمتع بالتجارة الإلكترونية" },
];
const imgTitle = [
	{ id: 1, text: "مرحباً بعودتك" },
	{ id: 2, text: "منصة اطلبها" },
	{ id: 3, text: "منصة اطلبها" },
];
const imgSubTitle = [
	{ id: 1, text: "منصة اطلبها للتجارة الإلكترونية" },
	{ id: 2, text: "معنى جديد للتجارة الإلكترونية" },
	{ id: 3, text: "معنى جديد للتجارة الإلكترونية" },
];

function Main() {
	const { fetchedData } = useFetch(
		"https://backend.atlbha.com/api/selector/registrationMarketer"
	);
	const store_token = localStorage.getItem("store_token");
	const navigate = useNavigate();
	const parm = useParams();
	const [activeTab, setActiveTab] = useState(0);
	useEffect(() => {
		if (
			parm?.type === "login" ||
			parm?.type === "merchant" ||
			parm?.type === "delegate"
		) {
			setActiveTab(
				parm?.type === "login"
					? 0
					: parm?.type === "merchant"
					? 1
					: parm?.type === "delegate" &&
					  fetchedData?.data?.registration_marketer === "active"
					? 2
					: 0
			);
		} else {
			navigate("*");
		}
	}, [parm?.type]);

	// THIS IS WILL BROKEN THE AUT LOGIC

	// if (store_token) {
	// 	return <Navigate to='/' />;
	// }

	return (
		<>
			<Helmet>
				<meta />
				<title>أطلبها</title>
				<meta name='description' content='معنى جديد للتجارة الإلكترونية' />
			</Helmet>
			<div className='main-in-box' dir='ltr'>
				<div className='all-content' dir='rtl'>
					<div className='right-side'>
						<LogoHeader />
						<div className='all'>
							<Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
							<h2>{mainTitle?.[activeTab]?.text}</h2>
							{activeTab === 0 ? (
								<Login />
							) : activeTab === 1 ? (
								<RegisterStore />
							) : (
								<RegisterDelegate />
							)}
						</div>
					</div>

					<div className='left-side'>
						<span className='over-info'>
							<SvgComponent />
						</span>
						<div className='info-svg'>
							<h4>{imgSubTitle?.[activeTab]?.text}</h4>
							<h1>{imgTitle?.[activeTab]?.text}</h1>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Main;
