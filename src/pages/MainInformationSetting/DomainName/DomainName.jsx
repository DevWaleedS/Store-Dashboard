import React from "react";
import SetDomainType from "./SetDomainType";

const DomainName = ({
	domain,
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
					setDomainType={setDomainType}
					label={"لدي الدومين الخاص بي"}
					hint={`قم بادخال اسم الدومين الخاص بك وسيتم التواصل معك لإتمام إجراءات التفعيل.`}
				/>

				{/* pay domain name */}
				<SetDomainType
					domain={domain}
					value='pay_domain'
					setDomain={setDomain}
					settingErr={settingErr}
					domainType={domainType}
					setDomainType={setDomainType}
					label={"أريد شراء دومين"}
					hint={`قم  بكتابه اسم الدومين الذي تريد الحصول عليه وإذا كان متوفر لدينا سيتم التواصل معك لإتمام إجراءات الشراء والتفعيل .`}
				/>
			</div>
		</>
	);
};

export default DomainName;
