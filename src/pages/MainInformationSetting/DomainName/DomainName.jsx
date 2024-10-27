import React from "react";
import SetDomainType from "./SetDomainType";

const DomainName = ({
	domain,
	isHasDomain,
	settingErr,
	setDomain,
	domainType,
	setDomainType,
}) => {
	return (
		<>
			<div className='row d-flex justify-content-center align-items-center'>
				<div className='col-lg-8 col-12'>
					<div className='store_email'>
						<label htmlFor='domain' className='setting_label gap-0 mb-1'>
							الدومين
							<span className='important-hint ps-1'>*</span>
							<span className='tax-text ps-1'>(رابط المتجر)</span>
							<span
								style={{
									fontSize: "14px",
									color: "#ff3838",
								}}>
								قم بتحديد نوع الدومين
							</span>
						</label>
					</div>
				</div>

				{/* has domain name */}
				<SetDomainType
					domain={domain}
					value='has_domain'
					setDomain={setDomain}
					settingErr={settingErr}
					domainType={domainType}
					isHasDomain={isHasDomain}
					setDomainType={setDomainType}
					label={"لدي الدومين الخاص بي"}
					hint={`قم بادخال اسم الدومين الخاص بك ثم انسخ الـ DNS ثم قم بتغيير اعدادات الدومين وسيتم التواصل معك لإتمام إجراءات التفعيل.`}
					title={"Nameservers"}
					dns1={`ns1909215958.a2dns.com (190.92.159.58)`}
					dns2={`ns1909215959.a2dns.com (190.92.159.59)`}
				/>

				{/* pay domain name */}
				<SetDomainType
					domain={domain}
					value='pay_domain'
					setDomain={setDomain}
					settingErr={settingErr}
					domainType={domainType}
					isHasDomain={isHasDomain}
					label={"أريد شراء دومين"}
					setDomainType={setDomainType}
					hint={`يمكنك كتابة دومين لمتجرك أو ابحث عن دومين في https://godaddy.com  ثم تواصل معنا لحجز الدومين وربطة مع المتجر .`}
				/>

				{/* later time */}
				<SetDomainType
					hint={""}
					domain={domain}
					value='later_time'
					label={"في وقت لاحق"}
					setDomain={setDomain}
					settingErr={settingErr}
					domainType={domainType}
					isHasDomain={isHasDomain}
					setDomainType={setDomainType}
				/>
			</div>
		</>
	);
};

export default DomainName;
