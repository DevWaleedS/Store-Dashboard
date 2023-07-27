import React, { useState } from "react";
import { Link } from "react-router-dom";
import howIcon from "../../data/Icons/icon_24_home.svg";
import UserImage from "../../data/Icons/user-img.png";

import "./EvaluationThePlatform.css";
import { Helmet } from "react-helmet";

import { useContext } from "react";
import { UserAuth } from "../../Context/UserAuthorProvider";
import { LoadingContext } from "../../Context/LoadingProvider";
import axios from "axios";
import { useCookies } from "react-cookie";
import Context from "../../Context/context";

const EvaluationThePlatform = () => {
	const [cookies] = useCookies(["access_token"]);
	const [reload, setReload] = useState(false);
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const UserInfo = useContext(UserAuth);
	const { userInfo } = UserInfo;
	// To handle errors
	const [evaluationError, setEvaluationError] = useState("");

	const [commentText, setCommentText] = useState("");
	// send add Evaluation The Platform Function
	const addEvaluationThePlatform = () => {
		setLoadingTitle("جاري إضافة تعليقك لمنصة اطلبها ");
		setEvaluationError("");
		let formData = new FormData();
		formData.append("comment_text", commentText);
		axios
			.post(`https://backend.atlbha.com/api/Store/etlobhaComment`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);

					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEvaluationError(res?.data?.message?.en?.comment_text?.[0]);
				}
			});
	};
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تقييم المنصة</title>
			</Helmet>
			<section className='academy-page evaluationThePlatform p-lg-3'>
				{/** pagination  */}
				<div className='head-category mb-md-5 mb-3'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<img src={howIcon} alt='' />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>
									<li className='breadcrumb-item active' aria-current='page'>
										تقييم المنصة
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				<div className='row mb-5'>
					<div className='col-12'>
						<div className='label d-flex align-items-center justify-content-center text-center'>
							قم بتقييم تجربة استخدامك لمنصة أطلبها
						</div>
						<div className=''>
							<div className='d-flex flex-row align-items-center gap-4 '>
								<textarea
									resize='false'
									value={commentText}
									onChange={(e) => setCommentText(e.target.value)}
									placeholder='	منصة رائعة وسهلة أوصي باستخدامها لتبدأ بالتجارة
                           الإلكترونية'></textarea>
							</div>
						</div>
					</div>
					<div className='col-12'>
						{evaluationError && (
							<span className='fs-6 text-danger'>{evaluationError}</span>
						)}
					</div>
				</div>
				<div className='row'>
					<div className='col-12 mb-4'>
						<div className='preview-valuation'>
							معاينة التقييم{" "}
							<span>(يمكن أن يظهر تقييمك في الصفحة الرئيسية للمنصة)</span>
						</div>
					</div>

					<div className='col-12 mb-5'>
						<div className='preview-valuation-wrapper d-flex flex-column justify-content-center align-items-center gap-4'>
							<div className='user-image  '>
								<img src={userInfo?.user_image || UserImage} alt='' />
							</div>
							<div className='evaluation-content'>
								{commentText
									? commentText
									: "منصة رائعة وسهلة أوصي باستخدامها لتبدأ بالتجارة الإلكترونية"}
							</div>
						</div>
					</div>

					<div className='col-12 mb-5'>
						<div className=' d-flex flex-column justify-content-center align-items-center'>
							<button
								onClick={addEvaluationThePlatform}
								className='send-valuation-btn d-flex flex-column justify-content-center align-items-center'>
								ارسال
							</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default EvaluationThePlatform;
