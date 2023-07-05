import { useRouteError } from 'react-router-dom';
import { Helmet } from "react-helmet";

export default function ErrorPage() {
	const error = useRouteError();
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | صفحة غير موجودة</title>
			</Helmet>
			<div id='error-page' className=' d-flex justify-content-center align-items-center flex-column' style={{ height: "100vh" }}>
				<h1>خطأ!</h1>
				<p>حصل خطأ ما , يرجى المحاولة لاحقاً</p>
				<p>
					<i>{error.statusText || error.message}</i>
				</p>
			</div>
		</>
	);
}
