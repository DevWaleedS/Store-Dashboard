import React from 'react';

const formStyle = {
	background: '#FFFF',
	borderRadius: '8px',
	width: '866px',
	maxWidth:'100%',
	height: '330px',
	boxShadow: '3px 3px 6px #0000000A',
	padding: '26px',
	marginBottom: '10px',
};

const inputsStyle = {
	width: '100%',
	height: '56px',
	background: '#F4F5F7',
	border: ' 1px solid #E7ECEF',
	borderRadius: '4px',
};

const labelStyle = {
	fontSize: '18px',
	fontWeight: 400,
	color: '#02466A',
};
	const handleSubmit = (e) => {
		e.preventDefault();
	};
const PayPalFormWeight = () => {
	return (
		<form style={formStyle} onSubmit={handleSubmit}>
			<div className='row mb-3'>
				<div className='col-12'>
					<label style={labelStyle} htmlFor='payPal-name'>
						ادخل الاسم
					</label>
				</div>
				<div className='col-12'>
					<input id='payPal-name' type='text' name='owner-name' style={{ padding: '18px', ...inputsStyle }} />
				</div>
			</div>
			<div className='row mb-4'>
				<div className='col-12'>
					<label style={labelStyle} htmlFor='payPal-email'>
						ايميل باي بال
					</label>
				</div>
				<div className='col-12'>
					<input id='payPal-email' type='email' name='payPal-email' style={{ padding: '18px', ...inputsStyle }} />
				</div>
			</div>

			<div className='row justify-content-center'>
				<button
					style={{
						background: '#1DBBBE',
						borderRadius: '4px',
						width: '474px',
						height: '56px',
						fontSize: '22px',
						fontWeight: 500,
						color: '#FFFFFF',
					}}
				>
					حفظ
				</button>
			</div>
		</form>
	);
};

export default PayPalFormWeight;
