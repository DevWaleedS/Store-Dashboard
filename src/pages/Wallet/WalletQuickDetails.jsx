import React, { Fragment } from "react";

// Icons
import { IoWallet } from "react-icons/io5";
const WalletQuickDetails = ({ supplierDashboard, loading }) => {
	const details = [
		{
			id: 1,
			icon: <IoWallet />,
			title: " إجمالي قيمة المعاملات ",
			numbers: supplierDashboard?.TotalNumberOfTransactions,
			color: "#3ae374",
		},
		{
			id: 2,
			icon: <IoWallet />,
			title: " إجمالي عدد المعاملات ",
			numbers: supplierDashboard?.TotalNumberOfTransactions,
			color: "#ff9f1a",
		},

		{
			id: 4,
			icon: <IoWallet />,
			title: "إجمالي الانتظار للتحويل",
			numbers: supplierDashboard?.TotalAwaitingToTransfer,
			color: "#b6be34",
		},

		{
			id: 7,
			icon: <IoWallet />,
			title: "إجمالي المورد إنفويسي",
			numbers: supplierDashboard?.TotalDepositedAmount,
			color: "#02466a",
		},
	];

	const walletTotalBalance = [
		{
			id: 3,
			icon: <IoWallet />,
			title: "إجمالي المبلغ المودع",
			numbers: supplierDashboard?.TotalDepositedAmount,
			color: "#02466a",
		},
		{
			id: 8,
			icon: <IoWallet />,
			title: "اجمالي رصيد المحفظة",
			numbers: supplierDashboard?.TotalBalance,
			color: "#b6be34",
		},
	];

	return (
		<Fragment>
			{details?.map((detail) => (
				<div className='col-xl-3 col-lg-6 col-sm-6' key={detail.id}>
					<div className='wallet-data-box data-box mb-4'>
						<div className='d-flex flex-row align-items-center'>
							<div className='col-3 d-flex justify-content-md-start justify-content-center align-items-center'>
								<div
									className='icon'
									style={{ backgroundColor: `${detail.color}` }}>
									{detail.icon}
								</div>
							</div>

							<div className='col-9'>
								<div className='data'>
									<h4>{loading ? "..." : detail.numbers}</h4>
									<p>{detail.title}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}

			{walletTotalBalance?.map((wallet) => (
				<div className=' col-lg-6 col-md-12' key={wallet.id}>
					<div className='wallet-data-box data-box mb-4'>
						<div className='d-flex flex-row align-items-center'>
							<div className='col-3 d-flex justify-content-md-start justify-content-center align-items-center'>
								<div
									className='icon'
									style={{ backgroundColor: `${wallet.color}` }}>
									{wallet.icon}
								</div>
							</div>

							<div className='col-9'>
								<div className='data'>
									<h4>{loading ? "..." : wallet.numbers}</h4>
									<p>{wallet.title}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</Fragment>
	);
};

export default WalletQuickDetails;
