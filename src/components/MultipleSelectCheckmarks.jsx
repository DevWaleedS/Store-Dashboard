import React from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { addActivity } from "../store/slices/AddActivity";
import { addSubActivity } from "../store/slices/AddSubActivity";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

// Icon
import { IoIosArrowDown } from "react-icons/io";

// Third Party
import useFetch from "../Hooks/UseFetch";

const selectStyle = {
	backgroundColor: "#fff",
	fontSize: "18px",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "20px",
		},
	"& .MuiOutlinedInput-root": {
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},
	"& .MuiSelect-icon": {
		right: "95%",
	},
};

export default function MultipleSelectCheckmarks({ showErr, setShowErr }) {
	const { fetchedData } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/etlobahCategory"
	);
	const { activity } = useSelector((state) => state.AddActivity);
	const { subActivities } = useSelector((state) => state.AddSubActivity);
	const queryParams = activity?.map((id) => `category_id[]=${id}`).join("&");
	const { fetchedData: subActivitiesList } = useFetch(
		`https://backend.atlbha.com/api/Store/selector/subcategories?${queryParams}`
	);
	const dispatch = useDispatch();
	return (
		<>
			<div className='row d-flex justify-content-between align-items-start mb-2 '>
				<div className='col-md-4 col-12 d-flex pt-md-4'>
					<h5 className='label'>
						نوع النشاط الرئيسي
						<span className='important-hint'>*</span>
					</h5>
				</div>
				<div className='col-md-8 col-12'>
					<FormControl sx={{ m: 1, width: 630 }}>
						<Select
							sx={selectStyle}
							IconComponent={IoIosArrowDown}
							multiple
							displayEmpty
							value={activity}
							onChange={(e) => dispatch(addActivity(e.target.value))}
							input={<OutlinedInput />}
							renderValue={(selected) => {
								if (activity?.length === 0) {
									return (
										<span style={{ color: "#011723" }}>
											نشاط المتجر الرئيسي
										</span>
									);
								}
								return selected?.map((item) => {
									const result = fetchedData?.data?.categories?.filter(
										(service) => service?.id === parseInt(item)
									);
									return `${result[0]?.name} , `;
								});
							}}>
							{fetchedData?.data?.categories?.map((act, index) => (
								<MenuItem
									key={index}
									value={act?.id}
									sx={{
										backgroundColor:
											act?.store === null
												? " #dfe2aa"
												: " rgba(211, 211, 211, 1)",
										height: "3rem",
										"&:hover": {},
									}}>
									<Checkbox checked={activity.indexOf(act?.id) > -1} />
									<ListItemText primary={act?.name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					{showErr && (
						<div className='text-danger me-1' style={{ fontSize: "16px" }}>
							يرجي اختيار نوع النشاط أولاّّ
						</div>
					)}
				</div>
			</div>
			<div className='row d-flex justify-content-between align-items-start mb-2 '>
				<div className='col-md-4 col-12 d-flex pt-md-4'>
					<h5 className='label'>
						نوع النشاط الفرعي
						<span className='important-hint'>*</span>
					</h5>
				</div>
				<div className='col-md-8 col-12'>
					<FormControl sx={{ m: 1, width: 630 }}>
						<Select
							sx={{
								backgroundColor: "#fff",
								fontSize: "18px",
								"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
									{
										paddingRight: "20px",
									},
								"& .MuiOutlinedInput-root": {
									"& :hover": {
										border: "none",
									},
								},
								"& .MuiOutlinedInput-notchedOutline": {
									border: "none",
								},
								"& .MuiSelect-icon": {
									right: "95%",
								},
							}}
							IconComponent={IoIosArrowDown}
							multiple
							displayEmpty
							value={subActivities}
							onChange={(e) => dispatch(addSubActivity(e.target.value))}
							input={<OutlinedInput />}
							renderValue={(selected) => {
								if (subActivities?.length === 0) {
									return (
										<span style={{ color: "#011723" }}>
											نشاط المتجر الفرعي
										</span>
									);
								}
								return selected?.map((item) => {
									const result = subActivitiesList?.data?.categories?.filter(
										(sub) => sub?.id === parseInt(item)
									);
									return `${result?.[0]?.name} , `;
								});
							}}>
							{subActivitiesList?.data?.categories?.map((sub, index) => (
								<MenuItem key={index} value={sub?.id}>
									<Checkbox checked={subActivities?.indexOf(sub?.id) > -1} />
									<ListItemText primary={sub?.name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
			</div>
		</>
	);
}
