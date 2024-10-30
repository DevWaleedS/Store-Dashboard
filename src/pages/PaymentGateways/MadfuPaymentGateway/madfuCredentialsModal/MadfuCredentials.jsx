import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { PageHint } from "../../../../components";
import { CircularLoading } from "../../../../HelperComponents";
import { useMadfuAuthMutation } from "../../../../store/apiSlices/paymentGatewaysApi";

const MadfuCredentials = ({
	hide,
	isMadfu,
	isStoreIfoLoading,
	storeInfoData,
	refetch,
}) => {
	const [madfuAuthData, setMadfuAuthData] = useState({
		username: "",
		password: "",
		api_key: "",
		app_code: "",
		authorization: "",
	});

	useEffect(() => {
		if (storeInfoData) {
			setMadfuAuthData({
				...madfuAuthData,
				username: storeInfoData?.madfu_username,
				password: storeInfoData?.madfu_password,
				api_key: storeInfoData?.madfu_api_key,
				app_code: storeInfoData?.madfu_app_code,
				authorization: storeInfoData?.madfu_authorization,
			});
		}
	}, [storeInfoData]);

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
	const handleSubmitMadfou3Form = async () => {
		// data that send to api
		let formData = new FormData();
		formData.append("username", madfuAuthData.username);
		formData.append("password", madfuAuthData?.password);
		formData.append("api_key", madfuAuthData.api_key);
		formData.append("app_code", madfuAuthData.app_code);
		formData.append("authorization", madfuAuthData.authorization);
		formData.append("store_id", store_id);

		// make request...
		try {
			const response = await madfuAuth({
				id: store_id,
				body: formData,
			});

			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				hide();
				refetch();
			} else {
				toast.error(response.data.message.ar, {
					theme: "light",
				});
			}
		} catch (error) {
			console.error("Error changing madfuAuth:", error);
		}
	};
	return (
		<>
			<PageHint
				hint={`تم إرسال طلبك إلى شركة مدفوع وسيقومون بالتواصل معكم لإنهاء إجراءات التفعيل خلال 3 أيام عمل، في حال وجود أي إستفسارات أخرى تخص طلبكم بتوفير خدمات مدفوع الرجاء التواصل مع (sales@madfu.com.sa)`}
				flex='d-flex align-items-center gap-2'
			/>

			{isStoreIfoLoading ? (
				<div
					style={{
						height: "180px",
						display: "flex",
						alignItem: "center",
						justifyContent: "center",
					}}>
					<CircularLoading />
				</div>
			) : (
				<section className='Madfou3Modal-form'>
					<div className='position-relative'>
						<label htmlFor='username'>اسم المستخدم</label>
						<input
							type='text'
							required
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
							required
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
							required
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
							required
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
							required
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
							!madfuAuthData?.username ||
							!madfuAuthData?.password ||
							!madfuAuthData?.api_key ||
							!madfuAuthData?.app_code ||
							!madfuAuthData?.authorization
						}
						className='btn'
						onClick={handleSubmitMadfou3Form}>
						{isMadfu ? "تعديل البينات" : "تسجيل"}
					</button>
				</section>
			)}
		</>
	);
};

export default MadfuCredentials;
