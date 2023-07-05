import * as React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { addActivity } from '../store/slices/AddActivity';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';
// Icon
import { IoIosArrowDown } from 'react-icons/io';
import useFetch from '../Hooks/UseFetch';

export default function MultipleSelectCheckmarks() {
	const { fetchedData } = useFetch('https://backend.atlbha.com/api/Store/selector/activities');
	const { activity } = useSelector((state) => state.AddActivity);
	const dispatch = useDispatch();
	const [openSelectInput, setOpenSelectInput] = React.useState(false);
	return (
		<div>
			<FormControl sx={{ m: 1, width: 630 }}>
				<Select
					sx={{
						backgroundColor: '#fff',
						fontSize: '18px',
						'& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
							{
								paddingRight: '20px',
							},
						'& .MuiOutlinedInput-root': {
							'& :hover': {
								border: 'none',
							},
						},
						'& .MuiOutlinedInput-notchedOutline': {
							border: 'none',
						},
						'& .MuiSelect-icon': {
							right: '95%',
						},
					}}
					IconComponent={IoIosArrowDown}
					multiple
					displayEmpty
					value={activity}
					onChange={(e)=>dispatch(addActivity(e.target.value))}
					input={<OutlinedInput />}
					renderValue={(selected) => {
						if (activity?.length === 0) {
							return <span style={{ color: '#011723' }}>نشاط المتجر</span>;
						}
						return selected.map((item) => {
							const result = fetchedData?.data?.activities?.filter((service) => service?.id === parseInt(item));
							return `${result[0]?.name} , `;
						});
					}}
					open={openSelectInput}
					onClick={() => {
						setOpenSelectInput(true);
					}}
				>
					{fetchedData?.data?.activities?.map((act,index) => (
						<MenuItem key={index} value={act?.id}>
							<Checkbox checked={activity.indexOf(act?.id) > -1} />
							<ListItemText primary={act?.name} />
						</MenuItem>
					))}
					<MenuItem className='select-btn d-flex justify-content-center'>
						<Button
							className='button'
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								setOpenSelectInput(false);
							}}
						>
							أختر
						</Button>
					</MenuItem>
				</Select>
			</FormControl>
		</div>
	);
}
