import React, { useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

// Components
import useFetch from "../../Hooks/UseFetch";
import ShippingCompaniesData from "./ShippingCompaniesData";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Context
import Context from "../../Context/context";

// ICONS
import { AiOutlineSearch } from "react-icons/ai";
import howIcon from "../../data/Icons/icon_24_home.svg";

const ShippingCompanies = () => {
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/shippingtype`
	);
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// change Comment Status
	const changeStatus = (id) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/changeShippingtypeStatus/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				}
			});
	};
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | شركات الشحن</title>
			</Helmet>
			<section className='shipping-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
					</div>
				</div>
				<div className='head-category mb-md-5 mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' loading='lazy' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									بيانات المتجر
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									شركات الشحن
								</li>
							</ol>
						</nav>
					</div>
				</div>

				{/* Shipping Companies Data Components */}
				<div className='data-container'>
					<div className='row'>
						{loading ? (
							<div
								className='d-flex justify-content-center align-items-center'
								style={{ height: "200px" }}>
								<CircularLoading />
							</div>
						) : (
							fetchedData?.data?.shippingtypes.map((item) => (
								<div className='col-xl-3 col-lg-4 col-6' key={item?.id}>
									<ShippingCompaniesData
										data={item?.name}
										image={item?.image}
										changeStatus={() => changeStatus(item?.id)}
										checked={item?.status === "نشط" ? true : false}
									/>
								</div>
							))
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default ShippingCompanies;
