import React from "react";
// TO print this page
import ReactToPrint from "react-to-print";

import { ListIcon, PDFIcon } from "../../../../data/Icons";

const ExportOrder = ({ componentRef }) => {
	return (
		<div className='order-action-box mb-3'>
			<div className='action-title'>
				<ListIcon className='list-icon' />
				<span className='me-2' style={{ fontSize: "18px" }}>
					تصدير الطلب
				</span>
			</div>

			<ReactToPrint
				trigger={() => {
					return (
						<div className='action-icon'>
							<PDFIcon className='pdf-icon' />
						</div>
					);
				}}
				content={() => componentRef.current}
				documentTitle='order-details-report'
				bodyClass='order-details-print'
			/>
		</div>
	);
};

export default ExportOrder;
