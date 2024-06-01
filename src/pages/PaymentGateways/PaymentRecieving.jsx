import { Switch } from "@mui/material";
import React from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

const PaymentRecieving = ({
  cashOnDelivery,
  handleChangeCashOnDeliveryStatus,
  switchStyle,
}) => {
  return (
    <div className="row other-shipping-company mb-4">
      <div className="mb-4 option-info-label d-flex d-md-none  justify-content-start align-items-center gap-2">
        <IoMdInformationCircleOutline />
        <span>
          يمكنك استخدام خيار الدفع عند الاستلام كطريقة من ضمن طرق الدفع المختلفة
          التي نوفرها لك
        </span>
      </div>
      {cashOnDelivery?.map((item) => (
        <div className="col-xl-3 col-lg-6 col-12" key={item.id}>
          <div className="data-widget">
            <div className="data">
              <div className="image-box">
                <img
                  className="img-fluid"
                  src={item?.image}
                  alt={item?.name}
                  style={{ width: "110px" }}
                />
              </div>
              {item?.name ? (
                <div className="current-price mt-1 w-100 d-flex justify-content-center">
                  {item?.name}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
      {cashOnDelivery?.length !== 0 && (
        <div className="col-xl-8 col-lg-6 col-12">
          <div className="mb-5 option-info-label d-none d-md-flex  justify-content-start align-items-center gap-2">
            <IoMdInformationCircleOutline />
            <span>
              يمكنك استخدام خيار الدفع عند الاستلام كطريقه من ضمن طرق الدفع
              المختلفة التي نوفرها لك
            </span>
          </div>
          <div className="">
            <div className="tax-text">تفعيل/تعطيل الدفع عند الاستلام </div>
            <div
              className="switch-box d-flex justify-content-center align-items-center mb-2"
              style={{
                height: "50px",
                backgroundColor: "#f7f8f8",
              }}
            >
              <Switch
                onChange={() => {
                  handleChangeCashOnDeliveryStatus(cashOnDelivery[0]?.id);
                }}
                checked={cashOnDelivery[0]?.status === "نشط" ? true : false}
                sx={switchStyle}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRecieving;
