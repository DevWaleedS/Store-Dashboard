import React, { useContext, Fragment } from 'react';
import ReactDom from 'react-dom';
import { LoadingContext } from '../../Context/LoadingProvider';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './LoadingRequest.module.css';

const BackDrop = () => {
	return <div className={styles.backdrop}></div>;
};
const LoadingRequest = () => {
	const LoadingProvider = useContext(LoadingContext);
	const { loadingTitle } = LoadingProvider;

	return (
		<Fragment>
			<BackDrop />
			<div className={styles.background}>
				<CircularProgress size='48px' />
				<p classNam='text=black'>{loadingTitle}</p>
			</div>
		</Fragment>
	);
};

const LoadingRequestComp = ({ title }) => {
	return <Fragment>{ReactDom.createPortal(<LoadingRequest title={title} />, document.getElementById('action_div'))}</Fragment>;
};
export default LoadingRequestComp;
