import React from "react";
// Third party
import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";
import { Fragment } from "react";
import { MdFileUpload } from "react-icons/md";

const UploadStoreLogo = ({
	storeLogo,
	setStoreLogo,
	defaultStoreLogo,
	logoErrors,
}) => {
	// handle images size
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;

	// Function to handle notifications and update the state based on the image type (logo or icon)
	const handleInvalid = (type, errMsg, resetState) => {
		// Display a warning notification
		toast.warning(errMsg, { theme: "light" });

		// Reset the image state
		resetState();
	};

	// Function to handle changes in the logo
	const onChangeStoreLogo = (imageList, addUpdateIndex) => {
		// Check if the image size is valid
		const isSizeValid = imageList.every(
			(image) => image.file.size <= maxFileSize
		);

		// Check if the image dimensions are valid
		imageList.every((image) => {
			const img = new Image();

			// Set the event listener to check dimensions once the image is loaded
			img.onload = () => {
				if ((img.width !== 110 || img.height !== 110) && (img.width !== 110 || img.height >= 110) && (img.width >= 110 || img.height !== 110)) {
					// If dimensions are not valid, display a warning and reset the logo state
					handleInvalid(
						"logo",
						"مقاس الشعار يجب أن يكون  110 بكسل عرض 110 بكسل ارتفاع.",
						() => setStoreLogo([])
					);
				}
			};

			img.src = image?.data_url;

			return true; // Returning true because the actual check is done in the onload event
		});

		// If the image size is not valid
		if (!isSizeValid) {
			// Display a warning message and reset the logo state
			handleInvalid(
				"logo",
				"حجم الشعار يجب أن لا يزيد عن 1 ميجابايت.",

				() => setStoreLogo([])
			);

			return;
		}

		// If all checks are valid, update the state
		setStoreLogo(imageList);
	};

	return (
		<div className='row d-flex justify-content-center align-items-center mb-3'>
			<div className='col-lg-6 col-12'>
				<div className='upload-logo-set d-flex justify-content-center align-items-center flex-column'>
					{/** Upload Image  */}
					<ImageUploading
						value={storeLogo}
						onChange={onChangeStoreLogo}
						dataURLKey='data_url'
						acceptType={["jpg", "png", "jpeg"]}>
						{({ imageList, onImageUpload, dragProps }) => (
							// Ui For Upload Log
							<Fragment>
								{/** Preview Image Box */}
								<div className='upload-image-wrapper'>
									{storeLogo[0] ? (
										<div className='upload-image-bx mb-2'>
											<img
												src={storeLogo?.[0]?.data_url}
												alt={""}
												className='img-fluid'
											/>
										</div>
									) : (
										<div className='upload-image-bx mb-2'>
											<img
												src={defaultStoreLogo}
												alt={""}
												className='img-fluid'
											/>
										</div>
									)}
								</div>

								{/** upload btn */}
								<span className='tax-text w-100'>
									الحد الأقصي للشعار هو 2MG
								</span>
								<button
									className='upload-log-btn'
									onClick={onImageUpload}
									{...dragProps}>
									<span className='d-flex justify-content-center align-items-center gap-1 flex-wrap'>
										رفع الشعار
										<div className='tax-text'>
											(المقاس الأنسب 110 بكسل عرض أو 110 بكسل الارتفاع)
										</div>
									</span>

									<MdFileUpload />
								</button>

								{logoErrors && (
									<span className='fs-6 w-100 text-danger'>{logoErrors}</span>
								)}
							</Fragment>
						)}
					</ImageUploading>
				</div>
			</div>
		</div>
	);
};

export default UploadStoreLogo;
