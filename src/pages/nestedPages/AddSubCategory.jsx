import React, { useState, useContext } from "react";

// Context
import Context from "../../Context/context";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeAddSubCategory } from "../../store/slices/AddSubCategory-slice";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// ICONS
import { AiOutlineCloseCircle } from "react-icons/ai";

// Modal style
const style = {
	position: "absolute",
	top: "120px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: "1062px",
	maxWidth: "90%",
};

const AddSubCategory = () => {
	const { isOpen } = useSelector((state) => state.AddSubCategorySlice);

	const dispatch = useDispatch(false);
	const contextStore = useContext(Context);
	const { setSubCategories } = contextStore;
	const [subcat, setSubCat] = useState("");
	const [subError, setSubError] = useState("");

	const addSubCat = () => {
		setSubCategories((subCategories) => [...subCategories, { name: subcat }]);
		setSubCat("");
		if (subcat) {
			dispatch(closeAddSubCategory());
		} else {
			setSubError("يرجى اضافة النشاط أولاً");
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<div className='add-category-form bg-white' open={isOpen}>
			<Modal open={isOpen} onClose={() => dispatch(closeAddSubCategory())}>
				<Box component={"div"} sx={style}>
					<div
						className='add-form-wrapper bg-white'
						style={{ borderRadius: "16px" }}>
						<div className='row'>
							<div className='col-12'>
								<div
									className='form-title  d-flex justify-content-center align-content-center'
									style={{
										borderRadius: "16px 16px 0 0",
										backgroundColor: "#1DBBBE",
										padding: "20px ",
									}}>
									<h5
										className='text-white text-center'
										style={{ fontSize: "22px", fontWeight: 400 }}>
										اضف نشاط فرعي
									</h5>

									<div className='close-icon-video-modal ps-2 ps-md-4'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={() => dispatch(closeAddSubCategory())}
										/>
									</div>
								</div>
							</div>
						</div>
						<form onSubmit={handleSubmit}>
							<div className='form-body bg-white'>
								<div className='row mb-5 mt-5 d-flex justify-content-center'>
									<div className='col-12 col-md-8'>
										<label htmlFor='category-name ' className='d-block mb-2'>
											اسم النشاط الفرعي
										</label>

										<input
											type='text'
											id='category-name'
											placeholder='ادخل اسم النشاط الفرعي'
											style={{ backgroundColor: "white" }}
											value={subcat}
											onChange={(e) => setSubCat(e.target.value.trimStart())}
										/>
										{subError && (
											<div className='text-danger' style={{ fontSize: "16px" }}>
												{subError}
											</div>
										)}
									</div>
								</div>
							</div>
							<div
								className='form-footer bg-white'
								style={{ borderRadius: "0 0 16px 16px" }}>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-4 col-6'>
										<button className='save-btn' onClick={addSubCat}>
											تأكيد
										</button>
									</div>
									<div className='col-lg-4 col-6'>
										<button
											className='close-btn'
											onClick={() => dispatch(closeAddSubCategory())}>
											إلغاء
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default AddSubCategory;
