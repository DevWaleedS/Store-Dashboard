import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React, { useState } from "react";

const DomainName = ({
	domain,
	settingErr,
	domainNameValidFocus,
	setDomainNameFocus,
	setDomain,
	setDomainNameValidFocus,
	validDomainName,
	domainNameFocus,
}) => {
	const [openIsHasDomainInput, setOpenIsHasDomainInput] = useState(false);
	const [openPuyDomain, setOpenPuyDomain] = useState(false);
	const handleOnChange = (e) => {
		console.log(e);
	};
	return (
		<div className='col-12 mb-4'>
			<div className='row d-flex justify-content-center align-items-center'>
				<div className='col-lg-8 col-12'>
					<div className='store_email'>
						<RadioGroup
							aria-labelledby='demo-radio-buttons-group-label'
							name='verification_type'
							value={domain}
							onChange={(e) => {
								handleOnChange(e);
							}}>
							<FormControlLabel
								sx={{
									marginRight: -1,
								}}
								value={"commercialregister"}
								checked={domain === "commercialregister"}
								className='label'
								control={
									<Radio
										onClick={() => {
											setOpenIsHasDomainInput(!openIsHasDomainInput);
											setOpenPuyDomain(false);
										}}
										sx={{
											"& .MuiSvgIcon-root": {
												fontSize: 18,
												marginLeft: "10px",
											},
										}}
									/>
								}
								label='السجل التجاري'
							/>
							{settingErr?.verification_type && (
								<div
									className='important-hint me-1'
									style={{ fontSize: "14px", whiteSpace: "normal" }}>
									{settingErr?.verification_type}
								</div>
							)}
						</RadioGroup>
					</div>
					{openPuyDomain && (
						<>
							<div className='domain-name direction-ltr d-flex align-content-center justify-content-between'>
								<div className='main-domain-hint'>template.atlbha.com/</div>
								<input
									type='text'
									name='domain'
									id='domain'
									value={domain}
									onChange={(e) => {
										setDomain(
											e.target.value.replace(/[^A-Za-z0-9_]/g, "").toLowerCase()
										);
										setDomainNameFocus(true);
									}}
									aria-describedby='domainName'
									onFocus={() => {
										setDomainNameFocus(true);
										setDomainNameValidFocus(true);
									}}
									onBlur={() => {
										setDomainNameFocus(false);
										setDomainNameValidFocus(true);
									}}
									aria-invalid={validDomainName ? "false" : "true"}
								/>
							</div>
							<div
								id='domainName'
								className={
									domainNameFocus && domain
										? " d-block important-hint me-1 "
										: "d-none"
								}
								style={{ fontSize: "16px", whiteSpace: "normal" }}>
								<> - </>قد يؤدي تغيير الدومين إلى حدوث خلل في ظهور أو عدم ظهور
								المتجر الخاص بك.
							</div>

							<div
								id='domainName'
								className={
									domainNameValidFocus && domain && !validDomainName
										? " d-block important-hint me-1 "
										: "d-none"
								}
								style={{ fontSize: "16px", whiteSpace: "normal" }}>
								<> - </> يجب أن يكون الدومين حروف انجليزية وأرقام فقط.
							</div>

							{settingErr?.domain && (
								<span className='fs-6 w-100 text-danger'>
									{settingErr?.domain}
								</span>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default DomainName;
