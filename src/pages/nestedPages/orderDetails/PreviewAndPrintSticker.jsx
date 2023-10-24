import React, { Fragment, useContext } from "react";
import Context from "../../../Context/context";

const PreviewAndPrintSticker = () => {
	const previewStickerContext = useContext(Context);
	const { previewSticker } = previewStickerContext;

	return (
		<section className='preview-sticker-wrapper'>
			<Fragment
				dangerouslySetInnerHTML={{
					__html: previewSticker,
				}}
			/>
		</section>
	);
};

export default PreviewAndPrintSticker;
