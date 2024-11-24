import React, { useState, useContext, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Context
import { LoadingContext } from "../../Context/LoadingProvider";
import { TextEditorContext } from "../../Context/TextEditorProvider";

// Icons
// import { UserImage } from "../../data/images";

// Css Styles
import "./EvaluationThePlatform.css";

// Components
import { Breadcrumb } from "../../components";
import { TextEditor } from "../../components/TextEditor";

// RTK query
import {
	useAddEvaluationThePlatformApiMutation,
	useGetExistCommentQuery,
} from "../../store/apiSlices/evaluationThePlatformApi";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";
import { CircularLoading } from "../../HelperComponents";

const EvaluationThePlatform = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// -----------------------------------------------------------
	// Get The The exist Comment
	const [curtComment, setCurComment] = useState();
	const { data: commentData, isLoading: existCommentLoading } =
		useGetExistCommentQuery();

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	// To handle errors
	const [evaluationError, setEvaluationError] = useState("");

	useEffect(() => {
		if (commentData?.Comment_text?.comment_text) {
			setEditorValue(commentData?.Comment_text?.comment_text);
			setCurComment(commentData?.Comment_text?.comment_text);
		}
	}, [commentData?.Comment_text?.comment_text]);

	// send add Evaluation The Platform Function
	const [addEvaluationThePlatform, { isLoading }] =
		useAddEvaluationThePlatformApiMutation();

	const handleAddEvaluationThePlatform = async () => {
		setLoadingTitle("جاري اضافة تعليقك لمنصة اطلبها ");
		setEvaluationError("");

		// data that send to api...
		let formData = new FormData();
		formData.append("comment_text", editorValue);
		formData.append("updateComment", commentData?.existComment ? 1 : 0);

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

	const isDisabled =
		editorValue === "" ||
		editorValue === "<p><br></p>" ||
		editorValue === curtComment ||
		isLoading ||
		existCommentLoading;

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تقييم المنصة</title>
			</Helmet>
			<section className='academy-page evaluationThePlatform p-lg-3'>
				{existCommentLoading ? (
					<div
						className=' d-flex justify-content-center align-items-center'
						style={{ height: "70vh" }}>
						<CircularLoading />
					</div>
				) : (
					<>
						<Breadcrumb mb={"mb-md-5 mb-3"} currentPage={"تقييم المنصة"} />

						<div className='row mb-5'>
							<div className='col-12'>
								<div className='label d-flex align-items-center justify-content-center text-center'>
									قم بتقييم تجربة استخدامك لمنصة اطلبها
								</div>
								<div className='evaluation-the-platform'>
									<TextEditor
										ToolBar={"evaluationThePlatform"}
										placeholder={`تقييمك يهمنا ويساعدنا كثير في تحسين خدماتنا لتقديم الافضل ودعم كبير لنا`}
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
							{/*
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
									تقييمك يهمنا ويساعدنا كثير في تحسين خدماتنا لتقديم الافضل ودعم
									كبير لنا
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
	*/}
							<div className='col-12 mb-5'>
								<div className=' d-flex flex-column justify-content-center align-items-center'>
									<button
										disabled={isDisabled}
										onClick={handleAddEvaluationThePlatform}
										className='send-valuation-btn d-flex flex-column justify-content-center align-items-center'>
										{commentData?.existComment
											? "تعديل التقييم"
											: "ارسال التقييم"}
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</section>
		</>
	);
};

export default EvaluationThePlatform;
