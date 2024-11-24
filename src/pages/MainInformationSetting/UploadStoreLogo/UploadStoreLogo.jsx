import React from "react";
// Third party
import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";
import { Fragment } from "react";
import { MdFileUpload } from "react-icons/md";
import { UploadIcon } from "../../../data/Icons";

const UploadStoreLogo = ({
	storeLogoUpdate,
	setStoreLogoUpdate,
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
	const errMsgStyle = {
		whiteSpace: "normal",
		padding: "0",
		fontSize: "14px",
	};
	const onChangeStoreLogo = (imageList, addUpdateIndex) => {
		const requireMinWidth = 110;
		const requireMaxWidth = 160;
		const requireMinHeight = 110;
		const requireMaxHeight = 114;

		const img = new Image();

		const errorMes = `
				<span> - الحد الأدنى للأبعاد هو 110 عرض و 110 ارتفاع</span>
				 <br />
				<span> - الحد الأقصى للأبعاد هو 160 بكسل عرض و 114 ارتفاع</span> `;

		// Check if the image size is valid
		const isSizeValid = imageList.every(
			(image) => image.file.size <= maxFileSize
		);

		// Check if the image dimensions are valid
		imageList.every((image) => {
			// Set the event listener to check dimensions once the image is loaded
			img.onload = () => {
				const isDimensionsValid =
					img.width >= requireMinWidth &&
					img.height >= requireMinHeight &&
					img.width <= requireMaxWidth &&
					img.height <= requireMaxHeight;

				if (!isDimensionsValid) {
					// If dimensions are not valid, display a warning and reset the logo state
					handleInvalid(
						"logo",
						<div
							className='wrign-dimensions'
							style={errMsgStyle}
							dangerouslySetInnerHTML={{ __html: errorMes }}
						/>,
						() => setStoreLogoUpdate([])
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

				() => setStoreLogoUpdate([])
			);

			return;
		}

		// If all checks are valid, update the state
		setStoreLogoUpdate(imageList);
	};

	return (
		<div className='row d-flex justify-content-center align-items-center mb-3'>
			<div className='col-lg-6 col-12'>
				<div className='upload-logo-set d-flex justify-content-center align-items-center flex-column'>
					{/** Upload Image  */}
					<ImageUploading
						value={storeLogoUpdate}
						onChange={onChangeStoreLogo}
						dataURLKey='data_url'
						acceptType={["jpg", "png", "jpeg", "webp"]}>
						{({ onImageUpload, dragProps }) => (
							// Ui For Upload Log
							<Fragment>
								{/** Preview Image Box */}
								<div className='upload-image-wrapper'>
									{storeLogoUpdate[0] ? (
										<div className='upload-image-bx mb-2'>
											<img
												src={storeLogoUpdate?.[0]?.data_url}
												alt={""}
												className='img-fluid'
											/>
										</div>
									) : defaultStoreLogo ? (
										<div className='upload-image-bx mb-2'>
											<img
												src={defaultStoreLogo}
												alt={""}
												className='img-fluid'
											/>
										</div>
									) : (
										<div
											style={{ cursor: "pointer" }}
											onClick={() => {
												onImageUpload();
											}}
											className='h-100 d-flex flex-column align-items-center justify-content-center gap-3'
											{...dragProps}>
											<UploadIcon width='40px' height='40px' />
											<div className='add-image-btn'>
												<label htmlFor='add-image'> اسحب الصورة هنا</label>
											</div>
											<span className='upload_image_hint'>
												( سيتم قبول الصور jpeg & png & jpg & webp )
											</span>
										</div>
									)}
								</div>

								{/** upload btn */}

								<div
									style={{ whiteSpace: "normal" }}
									className='tax-text w-100 d-flex align-content-center gap-2 mb-2'>
									- ( المقاس الأنسب 160 بكسل عرض و 114 بكسل الارتفاع اذا كان
									الشعار مستطيل)
									<span className='wrapper'>
										<span className='simple-img rectangle-logo'> </span>
									</span>
								</div>
								<div
									style={{ whiteSpace: "normal" }}
									className='tax-text w-100 d-flex align-content-center gap-2 mb-2'>
									- (المقاس الأنسب 110 بكسل عرض و 110 بكسل الارتفاع اذا كان
									الشعار مربع)
									<span className='wrapper'>
										<span className='simple-img'> </span>
									</span>
								</div>

								<span className='tax-text w-100 '>
									- الحد الأقصى للشعار هو 1MB
								</span>
								<button
									className='upload-log-btn'
									onClick={onImageUpload}
									{...dragProps}>
									<span className='d-flex justify-content-center align-items-center gap-1 flex-wrap'>
										رفع الشعار
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
