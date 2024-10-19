import * as React from "react";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const buttonStyle = {
	width: "100%",
	backgroundColor: "#1dbbbe",
	":hover": {
		backgroundColor: "#1dbbbe",
	},
	"& .MuiButton-startIcon": {
		marginLeft: "4px",
		marginRight: "0",
	},
	"& .MuiButton-endIcon": {
		marginLeft: "0",
		marginRight: "4px",
	},
};

const StyledMenu = styled((props) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: "bottom",
			horizontal: "right",
		}}
		transformOrigin={{
			vertical: "top",
			horizontal: "right",
		}}
		{...props}
	/>
))(({ theme }) => ({
	"& .MuiPaper-root": {
		borderRadius: 4,
		marginTop: theme.spacing(1),
		minWidth: 240,
		left: "65px",
		color: "rgb(55, 65, 81)",
		boxShadow:
			"rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
		"& .MuiMenu-list": {
			padding: "4px 0",
		},
		"& .MuiMenuItem-root": {
			gap: "10px",
			fontSize: 18,
			"& .MuiSvgIcon-root": {
				color: theme.palette.text.secondary,
			},
		},

		"@media(max-width:1400px)": {
			minWidth: "92%",
			left: "18px",
		},
	},
}));

export default function PagesDropdown({ dropDownData }) {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const navigateToPage = (pageUrl) => {
		setAnchorEl(null);
		navigate(pageUrl);
	};

	const menuItems = dropDownData.subMenu.map((item, index) => {
		return (
			<div key={item.id}>
				<MenuItem
					onClick={() => {
						navigateToPage(item.sub_path);
					}}>
					{item.icon}
					{item.sub_title}
				</MenuItem>
				{index === dropDownData.subMenu.length - 1 ? null : (
					<Divider sx={{ py: 0.1 }} />
				)}
			</div>
		);
	});

	return (
		<>
			<Button
				sx={buttonStyle}
				disableElevation
				variant='contained'
				aria-haspopup='true'
				onClick={handleClick}
				id='demo-customized-button'
				aria-expanded={open ? "true" : undefined}
				aria-controls={open ? "demo-customized-menu" : undefined}
				endIcon={<KeyboardArrowDownIcon />}
				startIcon={<IoIosAddCircle />}>
				{dropDownData.main_title}
			</Button>
			<StyledMenu
				id='demo-customized-menu'
				MenuListProps={{
					"aria-labelledby": "demo-customized-button",
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}>
				{menuItems}
			</StyledMenu>
		</>
	);
}
