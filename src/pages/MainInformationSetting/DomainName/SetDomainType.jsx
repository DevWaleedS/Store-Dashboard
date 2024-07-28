import React, { useEffect, useState } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { PageHint } from "../../../components";

const SetDomainType = ({
	value,
	label,
	hint,
	domain,
	settingErr,
	setDomain,
	domainType,
	setDomainType,
}) => {
	// domain validation.
	const USER_REGEX =
		/^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}$/;
	const [domainNameFocus, setDomainNameFocus] = useState(false);
	const [validDomainName, setValidDomainName] = useState(false);
	const [domainNameValidFocus, setDomainNameValidFocus] = useState(false);

	// TO HANDLE VALIDATION FOR DOMAIN NAME
	useEffect(() => {
		const domainNameValidation = USER_REGEX.test(domain);
		setValidDomainName(domainNameValidation);
	}, [domain]);

	const handleOnChange = (e) => {
		setDomainType(e.target.value);
	};
	return (
		<>
			<div className='col-12'>
				<div className='row d-flex justify-content-center align-items-center'>
					<div className='col-lg-8 col-12'>
						<div className='store_email'>
							<RadioGroup
								name='domainType'
								value={domain}
								onChange={(e) => {
									handleOnChange(e);
								}}>
								<FormControlLabel
									sx={{
										marginRight: -1,
										"& .MuiTypography-root": {
											fontSize: 18,
											color: "#02466a",
										},
									}}
									value={value}
									className='label'
									control={
										<Radio
											checked={domainType === value}
											sx={{
												"& .MuiSvgIcon-root": {
													fontSize: 18,
													color: "#1dbbbe",
												},
											}}
										/>
									}
									label={label}
								/>
								{settingErr?.domain_type && (
									<div
										className='important-hint me-1'
										style={{ fontSize: "14px", whiteSpace: "normal" }}>
										{settingErr?.domain_type}
									</div>
								)}
							</RadioGroup>
						</div>

						{domainType === value && (
							<>
								<div className='row  mb-4 domain-wrapper'>
									<div className='col-12 '>
										<PageHint
											hint={hint}
											flex={
												"d-flex justify-content-start align-items-center gap-2"
											}
										/>
									</div>

									<div className=' w-100 domain-name col-12'>
										<label className='domain-input-label d-flex'>
											يجب أن يكون الدومين حروف انجليزية وأرقام فقط
										</label>
										<input
											className='direction-ltr'
											type='text'
											name='domain'
											id='domain'
											value={domain}
											onChange={(e) => {
												setDomain(
													e.target.value
														.replace(/[^A-Za-z0-9-.]/g, "")
														.toLowerCase()
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

										<div
											id='domainName'
											className={
												domainNameFocus && domain
													? " d-block important-hint me-1 "
													: "d-none"
											}
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											<> - </>قد يؤدي تغيير الدومين إلى حدوث خلل في ظهور أو عدم
											ظهور المتجر الخاص بك.
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
									</div>
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
		</>
	);
};

export default SetDomainType;
