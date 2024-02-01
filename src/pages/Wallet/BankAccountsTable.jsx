import React from "react";

const BankAccountsTable = () => {
	return (
		<div className='d-flex flex-col gap-4 flex-wrap mt-3 flex '>
			{/*
      {fetchedData?.data?.notifications?.map((not, index) => {
				const isItemSelected = isSelected(not.id);
				return (
					<div
						key={index}
						style={{ boxShadow: "3px 3px 6px #00000005" }}
						className='notification-box bg-white w-100 d-flex flex-md-row flex-col align-md-items-center align-items-start justify-content-between gap-2 px-md-4 py-md-3 py-3 px-2'>
						<div className='message w-100 d-flex flex-row align-items-center gap-md-4 gap-2'>
							<Checkbox
								checkedIcon={<CheckedSquare />}
								sx={{
									color: "#1DBBBE",
									"& .MuiSvgIcon-root": {
										color: "#ADB5B9",
									},
								}}
								checked={isItemSelected}
								onClick={(event) => handleClick(event, not.id)}
							/>
							<div className='w-100 d-flex flex-row align-items-center justify-content-between '>
								<div className='d-flex flex-column gap-1'>
									<div className='d-flex flex-row align-items-center'>
										<h2
											className='notifications-title'
											dangerouslySetInnerHTML={{
												__html: not?.message,
											}}></h2>
									</div>
									<p className='notification-user-name'>{not?.user[0]?.name}</p>
								</div>
							</div>
						</div>
						<div className='time-delete w-100 h-100 d-flex flex-md-row flex-column align-items-md-center align-items-end justify-content-end gap-md-5 gap-2'>
							<div className=''>
								<p className='notification-time'>
									{formatDate(not.created_at)}
								</p>
							</div>

							<div className='d-flex flex-row align-items-center gap-2'>
								<Reports
									title='قراءة المزيد'
									className='show-more'
									onClick={() => setShowMore(not?.message)}
								/>
								<DeleteIcon
									onClick={() => {
										setActionDelete(
											"سيتم حذف النشاط وهذة الخطوة غير قابلة للرجوع"
										);
										setDeleteMethod("get");
										setUrl(
											`https://backend.atlbha.com/api/Store/NotificationDelete/${not?.id}`
										);
									}}
									style={{ cursor: "pointer" }}
									title='حذف الإشعار'
								/>
							</div>
						</div>
					</div>
				);
			})}
      */}
		</div>
	);
};

export default BankAccountsTable;
