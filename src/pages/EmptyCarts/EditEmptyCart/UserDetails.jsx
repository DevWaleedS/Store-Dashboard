import React from "react";
import moment from "moment";

import { Location, Message, Phone } from "../../../data/Icons";
const UserDetails = ({ userData }) => {
	console.log(userData);
	return (
		<div className='userData-container'>
			<div className='container-title'>بيانات العميل</div>
			<div className='container-body'>
				<div className='row'>
					<div className='col-md-2 col-12 mb-md-0 mb-3'>
						<div className='client-date'>
							<img className='img-fluid' src={userData?.user?.image} alt={""} />
							<div className='text'>
								<div className='register-type mb-1'>
									{userData?.user_type === "store"
										? "	التسجيل في المتجر"
										: "	التسجيل في المتجر"}
								</div>

								<div className='register-date'>
									{moment(userData?.created_at).format("DD-MM-YYYY")}
								</div>
							</div>
						</div>
					</div>
					<div className='col-md-8 col-12  align-self-center'>
						<div className='row mb-4 '>
							<div className='col-12 col-md-5'>
								<div className='user-name '>
									{`${userData?.user?.name} ${userData?.user?.lastname}`}
								</div>
							</div>
						</div>
						<div className='user-info'>
							<div className='row user-info-row'>
								<div className='col-md-2 col-12 mb-md-0 mb-3'>
									<Location />
									<span className='location'>
										{userData?.user?.city?.name ?? "لا توجد مدينة"}
									</span>
								</div>
								<div className='col-md-4  col-12 mb-md-0 mb-3 d-flex justify-content-md-center align-items-center'>
									<Phone />
									<span className='location me-1' style={{ direction: "ltr" }}>
										{" "}
										{userData?.user?.phonenumber}{" "}
									</span>
								</div>
								<div className='col-md-3 me-md-4 col-12 p-md-0'>
									<Message />
									<span className='location me-1'>
										{userData?.user?.email}{" "}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserDetails;
