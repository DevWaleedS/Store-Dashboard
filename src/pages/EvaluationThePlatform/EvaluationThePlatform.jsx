import React, { useState, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";
import { TextEditorContext } from "../../Context/TextEditorProvider";

// Icons
import { UserImage } from "../../data/images";

// Css Styles
import "./EvaluationThePlatform.css";

// Components
import { Breadcrumb } from "../../components";
import { TextEditor } from "../../components/TextEditor";

// RTK query
import { useAddEvaluationThePlatformApiMutation } from "../../store/apiSlices/evaluationThePlatformApi";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";

const EvaluationThePlatform = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	// -----------------------------------------------------------

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	// To handle errors
	const [evaluationError, setEvaluationError] = useState("");

	// send add Evaluation The Platform Function
	const [addEvaluationThePlatform, { isLoading }] =
		useAddEvaluationThePlatformApiMutation();

	const handleAddEvaluationThePlatform = async () => {
		setLoadingTitle("جاري اضافة تعليقك لمنصة اطلبها ");
		setEvaluationError("");

		// data that send to api...
		let formData = new FormData();
		formData.append("comment_text", editorValue);

		// make request...
		try {
			const response = await addEvaluationThePlatform({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				setEndActionTitle(response?.data?.message?.ar);

				setEditorValue("");
			} else {
				setLoadingTitle("");

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);

				setLoadingTitle("");
				setEvaluationError(response?.data?.message?.en?.comment_text?.[0]);
			}
		} catch (error) {
			console.error("Error changing addEvaluationThePlatform:", error);
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تقييم المنصة</title>
			</Helmet>
			<section className='academy-page evaluationThePlatform p-lg-3'>
				<Breadcrumb mb={"mb-md-5 mb-3"} currentPage={"تقييم المنصة"} />

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
										: false || isLoading
								}
								onClick={handleAddEvaluationThePlatform}
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
