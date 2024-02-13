import React from "react";

// Third party

import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// components
import useFetch from "../../Hooks/UseFetch";
import { TopBarSearchInput } from "../../global";
import {
	WalletQuickDetails,
	AddBankAccountModal,
	EditBankAccountModal,
	BankAccountsTable,
} from "./index.js";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Icons
import { HomeIcon } from "../../data/Icons";
import { FiPlus } from "react-icons/fi";
import { RiBankFill } from "react-icons/ri";

// Redux
import { useDispatch } from "react-redux";
import { openAddBankAccountModal } from "../../store/slices/AddBankAccountModal";

const Wallet = () => {
	const dispatch = useDispatch();

	// get supplierDashboard
	const { fetchedData: supplierDashboard } = useFetch(
		`https://backend.atlbha.com/api/Store/showSupplierDashboard`
	);

	// showSupplier bank account
	const { fetchedData: currentBankAccount, loading } = useFetch(
		`https://backend.atlbha.com/api/Store/indexSupplier`
	);

	//

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | المحفظة و الفواتير</title>
			</Helmet>
			<section className='payment-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>

								<li className='breadcrumb-item active' aria-current='page'>
									المحفظة و الفواتير
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='data-container wallet-data-container'>
					<>
						{loading ? (
							<div
								style={{ minHeight: "250px" }}
								className='d-flex justify-content-center align-items-center'>
								<CircularLoading />
							</div>
						) : (
							<>
								{/* Wallet quick details component */}
								<section className='row mb-3 mb-md-5'>
									<WalletQuickDetails
										loading={loading}
										supplierDashboard={
											supplierDashboard?.data?.SupplierDashboard
										}
									/>
								</section>

								{/* Bank Accounts */}
								<section className='bank-accounts'>
									<div className='d-flex justify-content-between bank-accounts-head'>
										<div className='d-flex align-items-center mb-3 mb-md-0'>
											<div className=' d-flex justify-content-start align-items-center gap-1 bank-acc-title'>
												<span>
													<RiBankFill />
												</span>
												<span>الحسابات البنكية</span>
											</div>
										</div>
										<div className=''>
											<button
												onClick={() => dispatch(openAddBankAccountModal())}
												className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
												<span>
													<FiPlus />
												</span>
												<span>اضافة حساب جديد</span>
											</button>
										</div>
									</div>

									<div className=' bank-accounts-box'>
										<BankAccountsTable bankAccount={currentBankAccount?.data} />
									</div>
								</section>
							</>
						)}
					</>
				</div>
			</section>
			{/* Add & Edit Bank Account Modal */}
			<AddBankAccountModal />
			<EditBankAccountModal />
		</>
	);
};

export default Wallet;
