import React from "react";

// Third party
import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";

// Icons
import { MdFileUpload } from "react-icons/md";

const UploadStoreIcon = ({
	iconErrors,
	setStoreIcon,
	storeIcon,
	defaultStoreIcon,
}) => {
	// handle images size
	const maxFileSize = 2 * 1024 * 1024; // 2 MB;

	// Function to handle notifications and update the state based on the image type (logo or icon)
	const handleInvalid = (type, errMsg, resetState) => {
		// Display a warning notification
		toast.warning(errMsg, { theme: "light" });

		// Reset the image state
		resetState();
	};

	// Function to handle changes in the icon
	const onChangeSelectIcon = (imageList, addUpdateIndex) => {
		// Check if the image size is valid
		const isSizeValid = imageList.every(
			(image) => image.file.size <= maxFileSize
		);

		// Check if the image dimensions are valid
		imageList.every((image) => {
			const img = new Image();

			// Set the event listener to check dimensions once the image is loaded
			img.onload = () => {
				if (img.width !== 32 && img.height !== 32) {
					// If dimensions are not valid, display a warning and reset the icon state
					handleInvalid(
						"icon",
						"مقاس الايقون يجب أن يكون  32 بكسل عرض 32 بكسل ارتفاع.",
						() => setStoreIcon([])
					);
				}
			};

			img.src = image?.data_url;

			return true; // Returning true because the actual check is done in the onload event
		});

		// If the image size is not valid
		if (!isSizeValid) {
			// Display a warning message and reset the icon state
			handleInvalid("icon", "حجم الايقون يجب أن لا يزيد عن 2 ميجابايت.", () =>
				setStoreIcon([])
			);

			return;
		}

		setStoreIcon(imageList);
	};

	return (
		<div
			className='row d-flex justify-content-center align-items-center'
			style={{ cursor: "pointer" }}>
			<div className='col-lg-8 col-12'>
				<div className='select-country'>
					<label htmlFor='upload-icon' className='setting_label'>
						ايقونة تبويب المتجر في المتصفح
						<span className='tax-text me-2'>
							(المقاس الأنسب 32 بكسل عرض 32 بكسل الارتفاع)
						</span>
					</label>
					<div>
						<ImageUploading
							value={storeIcon}
							onChange={onChangeSelectIcon}
							dataURLKey='data_url'
							acceptType={["jpg", "png", "jpeg"]}>
							{({ onImageUpload, dragProps }) => (
								<div
									className='upload-icon-btn'
									onClick={() => {
										onImageUpload();
									}}
									{...dragProps}>
									<div style={{ width: "35px", height: "35px" }}>
										{storeIcon[0] ? (
											<img
												className='img-fluid'
												src={storeIcon[0].data_url}
												alt=''
												style={{ objectFit: "contain" }}
											/>
										) : (
											<img
												className='img-fluid'
												src={defaultStoreIcon}
												alt=''
												style={{ objectFit: "contain" }}
											/>
										)}
									</div>

									<MdFileUpload />
								</div>
							)}
						</ImageUploading>
					</div>
					<span className='tax-text w-100'>الحد الأقصي للايقونة هو 2MG</span>
				</div>
				{iconErrors && (
					<div className='d-flex flex-wrap'>
						<span className='fs-6 w-100 text-danger'>{iconErrors}</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default UploadStoreIcon;
