import React from 'react';
import { Button } from '@mui/material';

// Icnos
import { ReactComponent as StarIcon } from '../data/Icons/icon-20-star.svg';
import { BsPlayCircle } from 'react-icons/bs';
import { BsPlayBtn } from 'react-icons/bs';
import { RiTimerLine } from 'react-icons/ri';
import { AiOutlineEye } from 'react-icons/ai';

// IMPORT IMAGES
import { useNavigate } from 'react-router-dom';
import CustomDate from '../HelperComponents/CustomDate';

const AcademyWidget = ({ name, image, count, duration, url, id }) => {
	const navigate = useNavigate();
	return (
		<div className='academy-widget'>
			<div className='row p-md-0 p-2 h-100'>
				{/** video-preview */}
				<div className='col-md-2 col-4'>
					<div className='video-preview'>
						<img className='w-100' src={image} alt={name} />
						<div className='play-video-icon'>
							<a href={url} target='_blank' rel='noreferrer'>
								<BsPlayCircle />
							</a>
						</div>
					</div>
				</div>

				{/**course info */}
				<div className='col-md-6 col-8 course-bx'>
					<div className='row course-details d-flex justify-content-start align-items-start'>
						<h5 className='mb-4'> {name} </h5>
					</div>
					<div className='row course-info'>
						<div className='col-md-3 col-6'>
							<div className='video-count'>
								<BsPlayBtn />
								<span className='text me-2 align-self-center'>{count} فيديو </span>
							</div>
						</div>
						<div className='col-md-3 col-6'>
							<div className='video-hours '>
								<RiTimerLine />
								<span className='text me-2 align-self-center'>{CustomDate(duration)} ساعة </span>
							</div>
						</div>
						<div className='col-md-6 col-12'>
							<span className='course-stars mb-2 d-flex justify-content-md-end'>
								<StarIcon />
								<StarIcon />
								<StarIcon />
								<StarIcon />
								<StarIcon />
							</span>
						</div>
					</div>
				</div>

				<div className='col-md-4 col-12 d-flex justify-content-md-end flex-column mt-md-0 mt-1'>
					<div className='row watch-course-btn  d-flex justify-content-md-end align-items-start'>
						<div className='col-12 d-flex justify-content-md-end'>
							<Button
								variant='outlined'
								onClick={() => {
									navigate(`CourseDetails/${id}`);
								}}
							>
								<AiOutlineEye />
								<span className='me-2'>مشاهدة المحتوي </span>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AcademyWidget;
