import React, { useState, useContext, useEffect } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Icons
import { UserImage } from "../../data/images";
import { HomeIcon } from "../../data/Icons";

// Css Styles
import "./EvaluationThePlatform.css";
import { TextEditor } from "../../components/TextEditor";
import { TextEditorContext } from "../../Context/TextEditorProvider";

// Redux
import { useSelector } from "react-redux";

const EvaluationThePlatform = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const [reload, setReload] = useState(false);
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	// -----------------------------------------------------------

	//  handle if the store is not verified navigate to home page
	const navigate = useNavigate();
	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);
	useEffect(() => {
		if (verificationStoreStatus !== "تم التوثيق") {
			navigate("/");
		}
	}, [verificationStoreStatus]);
	// -----------------------------------------------------------

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	// To handle errors
	const [evaluationError, setEvaluationError] = useState("");

	// send add Evaluation The Platform Function
	const addEvaluationThePlatform = () => {
		setLoadingTitle("جاري اضافة تعليقك لمنصة اطلبها ");
		setEvaluationError("");
		let formData = new FormData();
		formData.append("comment_text", editorValue);
		axios
			.post(`https://backend.atlbha.com/api/Store/etlobhaComment`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
					setEditorValue("");
				} else {
					setLoadingTitle("");
					setEvaluationError(res?.data?.message?.en?.comment_text?.[0]);
					toast.error(res?.data?.message?.en?.comment_text?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تقييم المنصة</title>
			</Helmet>
			<section className='academy-page evaluationThePlatform p-lg-3'>
				{/** pagination  */}
				<div className='head-category mb-md-5 mb-3'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<HomeIcon />
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
							قم بتقييم تجربة استخدامك لمنصة اطلبها
						</div>
						<div className='evaluation-the-platform'>
							<TextEditor
								ToolBar={"evaluationThePlatform"}
								placeholder={
									"منصة رائعة وسهلة أوصي باستخدامها لتبدأ بالتجارة الإلكترونية"
								}
							/>
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
							<span>(يظهر تقييمك في الصفحة الرئيسية للمنصة)</span>
						</div>
					</div>

					<div className='col-12 mb-5'>
						<div className='preview-valuation-wrapper d-flex flex-column justify-content-center align-items-center gap-4'>
							<div className='user-image  '>
								<img
									className='img-fluid'
									src={localStorage.getItem("storeLogo") || UserImage}
									alt=''
								/>
							</div>
							{editorValue === "" || editorValue === "<p><br></p>" ? (
								<div className='evaluation-content'>
									منصة رائعة وسهلة أوصي باستخدامها لتبدأ بالتجارة الإلكترونية
								</div>
							) : (
								<div
									className='evaluation-content'
									dangerouslySetInnerHTML={{
										__html: editorValue,
									}}
								/>
							)}
						</div>
					</div>

					<div className='col-12 mb-5'>
						<div className=' d-flex flex-column justify-content-center align-items-center'>
							<button
								disabled={
									editorValue === "" || editorValue === "<p><br></p>"
										? true
										: false
								}
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
