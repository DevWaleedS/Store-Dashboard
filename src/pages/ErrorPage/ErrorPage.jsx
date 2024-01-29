import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// css styles
import styles from "./ErrorPage.module.css";

export default function ErrorPage() {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | صفحة غير موجودة</title>
			</Helmet>
			<div
				id='error-page'
				className={`${styles.error_page} d-flex justify-content-center align-items-center flex-column`}
				style={{ height: "100vh" }}>
				<h1>خطأ!</h1>
				<p> حدث خطأ ما , يرجى المحاولة لاحقاً</p>
				<section>
					<Link to='/'>الصفحة الرئيسية</Link>
				</section>
			</div>
		</>
	);
}
