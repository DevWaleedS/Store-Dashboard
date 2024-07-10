import { IconButton, Switch } from "@mui/material";
import Zoom from "@mui/material/Zoom";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React from "react";
import { EditIcon } from "../../../data/Icons";

const BootstrapTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: "#1dbbbe",
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#1dbbbe",

		whiteSpace: "normal",
	},
}));
const MadfuPaymentGateway = ({
	madfou3,
	infoIsSend,
	switchStyle,
	showMadfou3Modal,
	handleChangePaymentStatus,
}) => {
	return (
		<div className='col-xl-3 col-6' key={madfou3?.id}>
			<div className='data-widget'>
				<div className='data'>
					<div className='image-box'>
						<img
							className='img-fluid'
							src={madfou3?.image}
							alt={madfou3?.name}
							style={{ width: "110px" }}
						/>
					</div>
				</div>

				<div className='switch-box flex-row '>
					<Switch
						name={madfou3?.name}
						checked={madfou3?.status === "نشط" ? true : false}
						onChange={() => handleChangePaymentStatus(madfou3?.id)}
						sx={switchStyle}
					/>

					{infoIsSend && (
						<BootstrapTooltip
							className={"p-0"}
							TransitionProps={{ timeout: 300 }}
							TransitionComponent={Zoom}
							title='يمكنك التعديل علي بيانات تفعيل الحساب في حال كان هناك خطأ في هذه البيانات.'
							placement='top'>
							<IconButton onClick={showMadfou3Modal}>
								<EditIcon />
							</IconButton>
						</BootstrapTooltip>
					)}
				</div>
			</div>
		</div>
	);
};

export default MadfuPaymentGateway;
