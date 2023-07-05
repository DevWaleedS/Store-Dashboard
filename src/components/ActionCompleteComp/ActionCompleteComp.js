import React, { useContext, Fragment } from 'react';
import ReactDom from 'react-dom';
import styles from './ActionCompleteComp.module.css';
import Context from '../../Context/context';
import { ReactComponent as ClearIcon } from '../../data/Icons/icon-24-actioins-clear.svg';
import { ReactComponent as CheckMark } from '../../data/Icons/icon-36-actions-checkamark.svg';
import { ReactComponent as Rejected } from '../../data/Icons/icon-24-actions- fuals.svg';
import Box from '@mui/material/Box';

const BackDrop = ({ onClick }) => {
	return <div className={styles.backdrop}></div>;
};

const ActionComplete = ({ cancelEarly }) => {
	const contextStore = useContext(Context);
	const { title, actionWarning, setEndActionTitle } = contextStore;

	return (
		<Fragment>
			<BackDrop />
			<div className={`${styles.action_body} ${styles.fcc}`} style={{ height: '170px', width: '556px', maxWidth: '90%', top: '100px' }}>
				<Box
					onClick={() => {
						setEndActionTitle(null);
					}}
					style={{ position: 'absolute', left: '24px', top: '24px', cursor: 'pointer' }}
				>
					<ClearIcon></ClearIcon>
				</Box>
				<div
					className={` ${styles.line_anim}`}
					style={{
						backgroundColor: actionWarning ? 'rgba(255, 56, 56, 1)' : '#3AE374',
					}}
				></div>
				<div className={`${styles.action_box} d-flex align-items-center`}>
					<Box
						sx={{
							'& svg': {
								width: '2rem',
								height: '2rem',
							},
						}}
					>
						{actionWarning ? <Rejected></Rejected> : <CheckMark></CheckMark>}
					</Box>

					<h2 className={styles.title}>{title}</h2>
				</div>
			</div>
		</Fragment>
	);
};

const ActionCompleteComp = ({ title, cancelEarly }) => {
	return <Fragment>{ReactDom.createPortal(<ActionComplete title={title} cancelEarly={cancelEarly} />, document.getElementById('action_div'))}</Fragment>;
};

export default ActionCompleteComp;
