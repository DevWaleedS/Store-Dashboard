import React, { useEffect, useState } from "react";
import { useSendStoresInfoToMadfuMutation } from "../../../store/apiSlices/paymentGatewaysApi";
import { toast } from "react-toastify";
import { useGetMainInformationQuery } from "../../../store/apiSlices/mainInformationApi";
import CircularLoading from "../../../HelperComponents/CircularLoading";

const SendStoresInfo = () => {
	// To get  store info that come from api
	const { data: storeInfoData, isLoading: isStoreIfoLoading } =
		useGetMainInformationQuery();

	const [storeInfo, setStoreInfo] = useState({
		name: "",
		phonenumber: "",
		email: "",
		store_name: "",
		store_id: "",
	});

	useEffect(() => {
		if (storeInfoData) {
			setStoreInfo({
				...SendStoresInfo,
				name: storeInfoData?.owner_name,
				phonenumber: storeInfoData?.phonenumber?.startsWith("+966")
					? storeInfoData?.phonenumber?.slice(4)
					: storeInfoData?.phonenumber?.startsWith("00966")
					? storeInfoData?.phonenumber.slice(5)
					: storeInfoData?.phonenumber,
				email: storeInfoData?.user?.email,
				store_name: storeInfoData?.store_name,
				store_id: storeInfoData?.id,
			});
		}
	}, [storeInfoData]);

	// handle madfu on change data
	const handleSendInfoOnChange = (e) => {
		const { name, value } = e.target;

		setStoreInfo((prevStoreInfo) => {
			return { ...prevStoreInfo, [name]: value };
		});
	};

	// handle send Stores Info To Madfu
	const [sendStoresInfoToMadfu, { isLoading }] =
		useSendStoresInfoToMadfuMutation();

	const handleSubmitMadfou3Form = async () => {
		// data that send to api
		let formData = new FormData();
		formData.append("name", storeInfo.name);
		formData.append(
			"phonenumber",
			storeInfo?.phonenumber?.startsWith("+966") ||
				storeInfo?.phonenumber?.startsWith("00966")
				? storeInfo?.phonenumber
				: `+966${storeInfo?.phonenumber}`
		);
		formData.append("email", storeInfo.email);
		formData.append("store_name", storeInfo.store_name);
		formData.append("store_id", storeInfo.store_id);

		// make request...
		try {
			const response = await sendStoresInfoToMadfu({
				body: formData,
			});

			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
			} else {
				toast.error(response.data.message.ar, {
					theme: "light",
				});
			}
		} catch (error) {
			console.error("Error changing sendStoresInfoToMadfu:", error);
		}
	};

	return (
		<>
			<div class='mb-5 option-info-label d-flex align-items-center gap-2 '>
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
					لكي تتمكن من إستخدام مدفوع داخل متجرك أرسل البيانات التالية التي ،قمت
					بادخالها عند فتح المتجر كمعلومات للتواصل ، قم بمراجعتها او التعديل
					عليها قبل الإرسال.
				</span>
			</div>

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
						<label htmlFor='name'> الاسم بالكامل</label>
						<input
							type='text'
							placeholder='قم بادخال  الاسم بالكامل'
							id='name'
							name='name'
							value={storeInfo.name}
							onChange={handleSendInfoOnChange}
						/>
					</div>
					<div className='position-relative'>
						<label htmlFor='phonenumber'> رقم الجوال</label>
						<div className='store-info-phonenumber'>
							<input
								type='text'
								id='phonenumber'
								name='phonenumber'
								maxLength={9}
								placeholder='قم بادخال رقم الجوال'
								value={storeInfo.phonenumber}
								onChange={handleSendInfoOnChange}
							/>
							<span>966+</span>
						</div>
					</div>
					<div className='position-relative'>
						<label htmlFor='email'>البريد الالكتروني</label>
						<input
							style={{ direction: "ltr" }}
							type='email'
							placeholder='قم بادخال البريد الالكتوني '
							id='email'
							name='email'
							value={storeInfo.email}
							onChange={handleSendInfoOnChange}
						/>
					</div>
					<div className='position-relative'>
						<label htmlFor='store_name'>اسم المتجر</label>
						<input
							type='text'
							placeholder='قم بادخال اسم المتجر'
							id='store_name'
							name='store_name'
							value={storeInfo.store_name}
							onChange={handleSendInfoOnChange}
						/>
					</div>

					<button
						disabled={
							isLoading ||
							(!storeInfo?.name &&
								!storeInfo?.phonenumber &&
								!storeInfo?.email &&
								!storeInfo?.store_name &&
								!storeInfo?.store_id)
						}
						className='btn'
						onClick={handleSubmitMadfou3Form}>
						إرسال البيانات
					</button>
				</section>
			)}
		</>
	);
};

export default SendStoresInfo;
