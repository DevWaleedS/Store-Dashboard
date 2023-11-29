import React from "react";

// Components
import useFetch from "../../Hooks/UseFetch";
import SliderUploader from "./SliderUploader/SliderUploader";
import BannerUploader from "./BannerUploader/BannerUploader";
import UpdateComments from "./UpdateComments/UpdateComments";

const TemplateUpdate = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/homepage"
	);

	return (
		<>
			{/** upload sliders */}
			<SliderUploader
				reload={reload}
				loading={loading}
				setReload={setReload}
				sliders={fetchedData?.data?.Homepages}
			/>

			{/** upload banner */}
			<BannerUploader
				reload={reload}
				loading={loading}
				setReload={setReload}
				Banners={fetchedData?.data?.Homepages}
			/>

			{/** UpdateComments */}
			<UpdateComments
				reload={reload}
				setReload={setReload}
				Comments={fetchedData?.data?.Homepages}
			/>
		</>
	);
};

export default TemplateUpdate;
