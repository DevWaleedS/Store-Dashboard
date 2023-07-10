import React, { Fragment } from 'react';
import MultipleSelectCheckmarks from '../../components/MultipleSelectCheckmarks';

const ActivityType = () => {
	return (
		<Fragment>
			<div className='row d-flex justify-content-between align-items-start mb-2 '>
				<div className='col-md-4 col-12 d-flex pt-md-4'>
					<h5 className='label'>نوع النشاط<span className='text-danger'>*</span></h5>
				</div>
				<div className='col-md-8 col-12'>
					<div>
						<MultipleSelectCheckmarks  />
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default ActivityType;
