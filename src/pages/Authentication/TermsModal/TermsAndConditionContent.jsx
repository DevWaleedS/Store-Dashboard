import React, { Fragment, useEffect } from "react";
import "./TermsModal.css";
import { ImArrowRight } from "react-icons/im";
import { useGetAtlhaPagesDataQuery } from "../../../store/apiSlices/atlbhaPagesApi";
import CircularLoading from "../../../HelperComponents/CircularLoading";

const BackDrop = ({ closeModal }) => {
	return <div className='backdrop' onClick={closeModal}></div>;
};

const TermsAndConditionContent = ({ closeModal }) => {
	const {
		data: AtlbhaHomePage,
		isLoading,
		refetch,
	} = useGetAtlhaPagesDataQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	const termsAndConditionPage = AtlbhaHomePage?.find(
		(page) => page?.id === 568
	);

	return (
		<Fragment>
			<BackDrop closeModal={closeModal} />
			<div className='terms_and_condition_body'>
				{isLoading ? (
					<div
						style={{
							height: "600px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<CircularLoading />
					</div>
				) : (
					<>
						<div className='modal_title'>
							<span onClick={closeModal}>
								<ImArrowRight />
							</span>
							<h5 className='mb-0'>{termsAndConditionPage?.title}</h5>
						</div>
						<div
							className='modal_content'
							dangerouslySetInnerHTML={{
								__html: termsAndConditionPage?.page_content,
							}}
						/>
					</>
				)}
			</div>
		</Fragment>
	);
};

export default TermsAndConditionContent;
