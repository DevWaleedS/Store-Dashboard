import React, { Fragment } from 'react';
import AcademyWidget from '../components/AcademyWidget';
import useFetch from '../Hooks/UseFetch';
import CircularLoading from '../HelperComponents/CircularLoading';

const CoursesTraining = ({ searchCourses }) => {
	// to get all  data from server
	const { fetchedData, loading } = useFetch('https://backend.atlbha.com/api/Store/course');
	let courses = fetchedData?.data?.courses;

	if (searchCourses !== '') {
		courses = fetchedData?.data?.courses?.filter((item) => item?.name?.toLowerCase()?.includes(searchCourses?.toLowerCase()));
	} else {
		courses = fetchedData?.data?.courses;
	}

	return (
		<Fragment>
			{loading ? (
				<div className='d-flex justify-content-center align-items-center' style={{ height: '200px' }}>
					<CircularLoading />
				</div>
			) : courses?.length === 0 ? (
				<div className='d-flex justify-content-center align-items-center'>
					<p className='text-center'>لاتوجد بيانات</p>
				</div>
			) : (
				courses?.map((course) => (
					<div className='widget-bx mb-md-4 mb-3' key={course?.id}>
						<AcademyWidget id={course?.id} name={course?.name} image={course?.image} count={course?.count} duration={course?.duration} url={course?.url} />
					</div>
				))
			)}
		</Fragment>
	);
};

export default CoursesTraining;
