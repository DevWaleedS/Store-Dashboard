import React from "react";
import { Button } from "@mui/material";

// Icnos
import { BsPlayCircle } from "react-icons/bs";
import { BsPlayBtn } from "react-icons/bs";
import { RiTimerLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";

// IMPORT IMAGES
import { useNavigate } from "react-router-dom";
import CustomDate from "../HelperComponents/CustomDate";

const AcademyWidget = ({ name, image, count, duration, url, id }) => {
	const navigate = useNavigate();
	return (
		<div className='academy-widget'>
			<div className='row h-100'>
				{/** video-preview */}
				<div className='col-md-3 col-4'>
					<div className='video-preview'>
						<div className='img-wrapper'>
							<img className='img-fluid' src={image} alt={name} />
							<div className='play-video-icon'>
								<BsPlayCircle
									onClick={() => {
										navigate(`CourseDetails/${id}`);
									}}
								/>
							</div>
						</div>
					</div>
				</div>

				{/**course info */}
				<div className='col-8 course-bx'>
					<div className='row course-details d-flex justify-content-start align-items-start text-overflow'>
						<h5 className='mb-4 text-overflow'> {name} </h5>
					</div>
					<div className='row course-info'>
						<div className='col-md-2 col-sm-3 col-6'>
							<div className='video-count'>
								<BsPlayBtn />
								<span className='text me-2 align-self-center'>
									{count} فيديو{" "}
								</span>
							</div>
						</div>
						<div className='col-md-2 col-sm-3 col-6'>
							<div className='video-hours '>
								<RiTimerLine />
								<span className='text me-2 align-self-center'>
									{CustomDate(duration)} ساعة{" "}
								</span>
							</div>
						</div>

						<div className='col-md-8 col-12'>
							<div className='watch-course-btn  d-flex justify-content-md-end align-items-start'>
								<div className='d-flex justify-content-md-end btn-wrapper'>
									<Button
										variant='outlined'
										onClick={() => {
											navigate(`CourseDetails/${id}`);
										}}>
										<AiOutlineEye />
										<span className='me-2'>مشاهدة المحتوي </span>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AcademyWidget;
