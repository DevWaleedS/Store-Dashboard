import ReactDOM from "react-dom";
import MadfuCredentials from "./MadfuCredentials";
import SendStoresInfo from "./SendStoresInfo";

const Madfou3Modal = ({ isShowing, hide, infoIsSend }) => {
	return isShowing
		? ReactDOM.createPortal(
				<div className='Madfou3Modal-overlay'>
					<div className='Madfou3Modal' onClick={(e) => e.stopPropagation()}>
						<button onClick={hide} className='closebtn'>
							<svg
								width='16'
								height='16'
								viewBox='0 0 16 16'
								xmlns='http://www.w3.org/2000/svg'>
								<path d='M15.2806 14.2193C15.3502 14.289 15.4055 14.3717 15.4432 14.4628C15.4809 14.5538 15.5003 14.6514 15.5003 14.7499C15.5003 14.8485 15.4809 14.9461 15.4432 15.0371C15.4055 15.1281 15.3502 15.2109 15.2806 15.2806C15.2109 15.3502 15.1281 15.4055 15.0371 15.4432C14.9461 15.4809 14.8485 15.5003 14.7499 15.5003C14.6514 15.5003 14.5538 15.4809 14.4628 15.4432C14.3717 15.4055 14.289 15.3502 14.2193 15.2806L7.99993 9.06024L1.78055 15.2806C1.63982 15.4213 1.44895 15.5003 1.24993 15.5003C1.05091 15.5003 0.860034 15.4213 0.719304 15.2806C0.578573 15.1398 0.499512 14.949 0.499512 14.7499C0.499512 14.5509 0.578573 14.36 0.719304 14.2193L6.93962 7.99993L0.719304 1.78055C0.578573 1.63982 0.499512 1.44895 0.499512 1.24993C0.499512 1.05091 0.578573 0.860034 0.719304 0.719304C0.860034 0.578573 1.05091 0.499512 1.24993 0.499512C1.44895 0.499512 1.63982 0.578573 1.78055 0.719304L7.99993 6.93962L14.2193 0.719304C14.36 0.578573 14.5509 0.499512 14.7499 0.499512C14.949 0.499512 15.1398 0.578573 15.2806 0.719304C15.4213 0.860034 15.5003 1.05091 15.5003 1.24993C15.5003 1.44895 15.4213 1.63982 15.2806 1.78055L9.06024 7.99993L15.2806 14.2193Z'></path>
							</svg>
						</button>

						{!infoIsSend ? (
							<SendStoresInfo />
						) : (
							<MadfuCredentials hide={hide} />
						)}
					</div>
				</div>,
				document.getElementById("madfou3-modal")
		  )
		: null;
};

export default Madfou3Modal;
