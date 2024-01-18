import React from "react";

// Mui
import { Button } from "@mui/material";

// Icons
import { RiTimerLine } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import { BsPlayCircle, BsPlayBtn } from "react-icons/bs";

// Third Party
import { useNavigate } from "react-router-dom";

// Components
import VideoOfCourseDuration from "./VideoOfCourseDuration/VideoOfCourseDuration";

const AcademyWidget = ({ name, image, count, duration, url, id }) => {
	const navigate = useNavigate();
	return (
		<div className='academy-widget'>
			<div className='row h-100 flex-grow-1'>
				{/** video-preview */}
				<div className='col-md-3 col-5'>
					<div className='video-preview'>
						<div className='img-wrapper'>
							<img className='img-fluid' src={image} alt={""} loading='lazy' />
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
				<div className='col-md-9 col-7 course-bx'>
					<div className='row course-details d-flex justify-content-start align-items-start text-overflow'>
						<h5 className='mb-4 text-overflow'> {name} </h5>
					</div>
					<div className='row course-info'>
						<div className='col-md-2 col-sm-6 col-12'>
							<div className='video-count'>
								<BsPlayBtn />
								<span className='text me-2 align-self-center'>
									{count} فيديو{" "}
								</span>
							</div>
						</div>
						<div className='col-md-2 col-sm-6 col-12'>
							<div className='video-hours '>
								<RiTimerLine />
								<span className='text me-2 align-self-center'>
									<VideoOfCourseDuration duration={duration} />
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
