import React, { useState } from "react";

// Icons
import { ListIcon, Print } from "../../../../data/Icons";

const PrintShippingSticker = ({ currentOrder }) => {
	const [printError, setPrintError] = useState("");

	// Handle print sticker Function
	const printSticker = () => {
		setPrintError("");
		window.open(currentOrder?.orders?.shipping?.sticker, "_blank");
	};

	return (
		<>
			{currentOrder?.orders?.shipping &&
				currentOrder?.orders?.shippingtypes?.name !== "اخرى" && (
					<button
						disabled={
							currentOrder?.orders?.status === "تم الشحن" ||
							currentOrder?.orders?.status === "ملغي" ||
							currentOrder?.orders?.status === "مكتمل"
								? true
								: false
						}
						style={{
							cursor:
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
									? "not-allowed"
									: "pointer",
						}}
						onClick={() => printSticker()}
						className='order-action-box mb-3'>
						<div className='action-title'>
							<ListIcon className='list-icon' />
							<span className='me-2 ms-2' style={{ fontSize: "18px" }}>
								{" "}
								طباعة بوليصة الشحن
							</span>
							{printError && (
								<span className='fs-6 text-danger'>({printError})</span>
							)}
						</div>
						<div className='action-icon'>
							<Print
								style={{
									cursor:
										currentOrder?.orders?.status === "تم الشحن" ||
										currentOrder?.orders?.status === "ملغي" ||
										currentOrder?.orders?.status === "مكتمل"
											? "not-allowed"
											: "pointer",
								}}
							/>
						</div>
					</button>
				)}
		</>
	);
};

export default PrintShippingSticker;
