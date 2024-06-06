import React, { useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { useMadfuAuthMutation } from "../../store/apiSlices/madfuApi";

const Madfou3Modal = ({ isShowing, hide }) => {
	const [madfuAuthData, setMadfuAuthData] = useState({
		username: "",
		password: "",
		api_key: "",
		app_code: "",
		authorization: "",
	});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const store_id = localStorage.getItem("store_id");

	// handle madfu on change data
	const handleMadfuOnChange = (e) => {
		const { name, value } = e.target;

		setMadfuAuthData((prevStoreInfo) => {
			return { ...prevStoreInfo, [name]: value };
		});
	};

	// handle send authorization madfu data
	const [madfuAuth, { isLoading }] = useMadfuAuthMutation();
	const madfuAuthHandel = async (id, body) => {
		try {
			const response = await madfuAuth({ id, body }).unwrap();
			console.log("Response:", response);
			toast.success(response.message.ar);
			hide();
		} catch (error) {
			console.error("Failed to login:", error);
			toast.error("فشل تسجيل الدخول");
		}
	};

	const handleSubmitMadfou3Form = (e) => {
		e.preventDefault();

		if (madfuAuthData.username === "") {
			toast.error("من فضلك قم بكتابة اسم المستخدم");
			return;
		}
		if (madfuAuthData.password === "") {
			toast.error("من فضلك قم بكتابة كلمه السر");
			return;
		}

		if (madfuAuthData.api_key === "") {
			toast.error("من فضلك قم بكتابة الـ api_key");
			return;
		}

		if (madfuAuthData.app_code === "") {
			toast.error("من فضلك قم بكتابة رمز التطبيق(app_code)");
			return;
		}

		if (madfuAuthData.authorization === "") {
			toast.error("من فضلك قم بكتابة  بيانات الترخيص(authorization)");
			return;
		}

		const body = {
			username: madfuAuthData.username,
			password: madfuAuthData.password,
			api_key: madfuAuthData.api_key,
			app_code: madfuAuthData.app_code,
			authorization: madfuAuthData.authorization,
		};
		madfuAuthHandel(store_id, body);
	};

	return isShowing
		? ReactDOM.createPortal(
				<div className='Madfou3Modal-overlay' onClick={hide}>
					<div className='Madfou3Modal' onClick={(e) => e.stopPropagation()}>
						<button onClick={hide} className='closebtn'>
							<svg
								width='16'
								height='16'
								viewBox='0 0 16 16'
								xmlns='http://www.w3.org/2000/svg'>
								<path d='M15.2806 14.2193C15.3502 14.289 15.4055 14.3717 15.4432 14.4628C15.4809 14.5538 15.5003 14.6514 15.5003 14.7499C15.5003 14.8485 15.4809 14.9461 15.4432 15.0371C15.4055 15.1281 15.3502 15.2109 15.2806 15.2806C15.2109 15.3502 15.1281 15.4055 15.0371 15.4432C14.9461 15.4809 14.8485 15.5003 14.7499 15.5003C14.6514 15.5003 14.5538 15.4809 14.4628 15.4432C14.3717 15.4055 14.289 15.3502 14.2193 15.2806L7.99993 9.06024L1.78055 15.2806C1.63982 15.4213 1.44895 15.5003 1.24993 15.5003C1.05091 15.5003 0.860034 15.4213 0.719304 15.2806C0.578573 15.1398 0.499512 14.949 0.499512 14.7499C0.499512 14.5509 0.578573 14.36 0.719304 14.2193L6.93962 7.99993L0.719304 1.78055C0.578573 1.63982 0.499512 1.44895 0.499512 1.24993C0.499512 1.05091 0.578573 0.860034 0.719304 0.719304C0.860034 0.578573 1.05091 0.499512 1.24993 0.499512C1.44895 0.499512 1.63982 0.578573 1.78055 0.719304L7.99993 6.93962L14.2193 0.719304C14.36 0.578573 14.5509 0.499512 14.7499 0.499512C14.949 0.499512 15.1398 0.578573 15.2806 0.719304C15.4213 0.860034 15.5003 1.05091 15.5003 1.24993C15.5003 1.44895 15.4213 1.63982 15.2806 1.78055L9.06024 7.99993L15.2806 14.2193Z'></path>
							</svg>
						</button>
						<div class='mb-5 option-info-label d-flex align-items-center gap-2'>
							<svg
								stroke='currentColor'
								fill='currentColor'
								stroke-width='0'
								viewBox='0 0 512 512'
								height='1em'
								width='1em'
								xmlns='http://www.w3.org/2000/svg'>
								<path d='M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422s-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256s17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z'></path>
								<path d='M277 360h-42V235h42v125zm0-166h-42v-42h42v42z'></path>
							</svg>
							<span>
								لكي تتمكن من إستخدام مدفوع داخل متجرك قم بإدخال البيانات التالية
								التي حصلت عليها عند فتح حساب في مدفوع
							</span>
						</div>
						<form
							className='Madfou3Modal-form'
							onSubmit={handleSubmitMadfou3Form}>
							<div className='position-relative'>
								<label htmlFor='username'>اسم المستخدم</label>
								<input
									type='text'
									placeholder='قم بادخال اسم المستخدم'
									id='username'
									name='username'
									value={madfuAuthData.username}
									onChange={handleMadfuOnChange}
								/>
							</div>
							<div className='position-relative'>
								<label htmlFor='password'>كلمة السر</label>
								<input
									type={`${passwordVisible ? "text" : "password"}`}
									id='password'
									name='password'
									placeholder='قم بادخال كلمه السر'
									value={madfuAuthData.password}
									onChange={handleMadfuOnChange}
								/>
								<div
									className='showPassword'
									onClick={() => setPasswordVisible(!passwordVisible)}>
									{passwordVisible ? (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											version='1.1'
											viewBox='0 0 488.85 488.85'>
											<g>
												<path d='M244.425 98.725c-93.4 0-178.1 51.1-240.6 134.1-5.1 6.8-5.1 16.3 0 23.1 62.5 83.1 147.2 134.2 240.6 134.2s178.1-51.1 240.6-134.1c5.1-6.8 5.1-16.3 0-23.1-62.5-83.1-147.2-134.2-240.6-134.2zm6.7 248.3c-62 3.9-113.2-47.2-109.3-109.3 3.2-51.2 44.7-92.7 95.9-95.9 62-3.9 113.2 47.2 109.3 109.3-3.3 51.1-44.8 92.6-95.9 95.9zm-3.1-47.4c-33.4 2.1-61-25.4-58.8-58.8 1.7-27.6 24.1-49.9 51.7-51.7 33.4-2.1 61 25.4 58.8 58.8-1.8 27.7-24.2 50-51.7 51.7z'></path>
											</g>
										</svg>
									) : (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											version='1.1'
											viewBox='0 0 512 512'>
											<g>
												<g>
													<path d='M419.72 419.72 92.26 92.27l-.07-.08a19 19 0 0 0-26.78 27l28.67 28.67a332.64 332.64 0 0 0-88.19 89 34.22 34.22 0 0 0 0 38.38C65.86 364 160.93 416 256 415.35a271.6 271.6 0 0 0 90.46-15.16l46.41 46.41a19 19 0 0 0 26.94-26.79zM256 363.74a107.78 107.78 0 0 1-98.17-152.18l29.95 29.95a69.75 69.75 0 0 0 82.71 82.71l29.95 29.95a107.23 107.23 0 0 1-44.44 9.57zM506.11 236.81C446.14 148 351.07 96 256 96.65a271.6 271.6 0 0 0-90.46 15.16l46 46a107.78 107.78 0 0 1 142.63 142.63l63.74 63.74a332.49 332.49 0 0 0 88.2-89 34.22 34.22 0 0 0 0-38.37z'></path>
													<path d='M256 186.26a69.91 69.91 0 0 0-14.49 1.52l82.71 82.7A69.74 69.74 0 0 0 256 186.26z'></path>
												</g>
											</g>
										</svg>
									)}
								</div>
							</div>
							<div className='position-relative'>
								<label htmlFor='api_key'>api_key</label>
								<input
									type='text'
									placeholder='قم بادخال الـ api_key'
									id='api_key'
									name='api_key'
									value={madfuAuthData.api_key}
									onChange={handleMadfuOnChange}
								/>
							</div>
							<div className='position-relative'>
								<label htmlFor='app_code'>رمز التطبيق (app_code)</label>
								<input
									type='text'
									placeholder='قم بادخال رمز التطبيق'
									id='app_code'
									name='app_code'
									value={madfuAuthData.app_code}
									onChange={handleMadfuOnChange}
								/>
							</div>
							<div className='position-relative'>
								<label htmlFor='authorization'>
									بيانات الترخيص (authorization)
								</label>
								<input
									type='text'
									placeholder='قم بادخال بيانات الترخيص'
									id='authorization'
									name='authorization'
									value={madfuAuthData.authorization}
									onChange={handleMadfuOnChange}
								/>
							</div>
							<button
								disabled={
									isLoading ||
									(!madfuAuthData?.username &&
										!madfuAuthData?.password &&
										!madfuAuthData?.api_key &&
										!madfuAuthData?.app_code &&
										!madfuAuthData?.authorization)
								}
								className='btn'
								type='submit'>
								تسجيل
							</button>
						</form>
					</div>
				</div>,
				document.getElementById("madfou3-modal")
		  )
		: null;
};

export default Madfou3Modal;
