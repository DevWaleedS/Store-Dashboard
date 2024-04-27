import React from "react";

// Components
import SliderUploader from "./SliderUploader/SliderUploader";
import BannerUploader from "./BannerUploader/BannerUploader";
import UpdateComments from "./UpdateComments/UpdateComments";

// RTK Query
import { useGetTemplateSettingQuery } from "../../store/apiSlices/templateSettingApi";

const TemplateUpdate = () => {
	// get template data
	const { data: template, isLoading } = useGetTemplateSettingQuery();

	return (
		<>
			{/** upload sliders */}
			<SliderUploader loading={isLoading} sliders={template} />

			{/** upload banner */}
			<BannerUploader loading={isLoading} Banners={template} />

			{/** UpdateComments */}
			<UpdateComments loading={isLoading} Comments={template} />
		</>
	);
};

export default TemplateUpdate;
