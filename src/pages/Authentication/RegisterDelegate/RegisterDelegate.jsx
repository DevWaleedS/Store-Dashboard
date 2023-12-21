import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
// import this library to write media query with inline style
import Radium from "radium";
import { Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IoIosArrowDown } from "react-icons/io";
import "./RegisterDelegate.css";
import axios from "axios";
import TermsModal from "../TermsModal/TermsModal";
import Context from "../../../Context/context";
import AlertModal from "../Login/ResetPasswordPages/AlertModal/AlertModal";


/** -----------------------------------------------------------------------------------------------------------
 *  	=> TO HANDLE THE REG_EXPRESS <=
 *  ------------------------------------------------- */
const OWNER_REGEX = /^[\p{L}\p{M}\p{Zs}.'-]+(\s[\p{L}\p{M}\p{Zs}.'-]+){2,}$/u;
const PHONE_REGEX = /^(5\d{8})$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function RegisterDelegate() {
    const contextStore = useContext(Context);
    const {
        message,
        setMessage,
        showAlertModal,
        setShowAlertModal,
        setEmail,
        setResendButtonDisabled,
        setDisabledBtn,
    } = contextStore;

    /** -----------------------------------------------------------------------------------------------------------
     *  	=> TO OPEN THE TERMS AND CONDITIONS MODAL <=
     *  ------------------------------------------------- */

    const [showTermsModal, setShowTermsModal] = useState(false);

    // TO STORE DATA FROM SELECTORS API
    const [citiesList, setCitiesList] = useState([]);
    const [city, setCity] = useState("");
    const [isChecked, setIsChecked] = useState(0);

    /** -----------------------------------------------------------------------------------------------------------
     *  	=> TO  CREATE THE VALIDATION AND ERRORS <=
     *  ------------------------------------------------- */
    const [validOwnerName, setValidOwnerName] = useState(false);
    const [ownerNameFocus, setOwnerNameFocus] = useState(false);

    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [phonenumberError, setPhonenumberError] = useState("");
    const [nameError, setNameError] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [cityError, setCityError] = useState("");
    const [checkboxError, setCheckboxError] = useState("");

    // to assign the owner info into state
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        user_name: "",
        email: "",
        phonenumber: "",
    });

    const handleRegisterInfo = (e) => {
        const { name, value } = e.target;
        setRegisterInfo((prevStoreInfo) => {
            return { ...prevStoreInfo, [name]: value };
        });
    };

    /** -----------------------------------------------------------------------------------------------------------
     *  	=> THE SIDE EFFECTS <=
     *  ------------------------------------------------- */

    // TO HANDLE VALIDATION FOR OWNER NAME
    useEffect(() => {
        const ownerNameValidation = OWNER_REGEX.test(registerInfo?.name);
        setValidOwnerName(ownerNameValidation);
    }, [registerInfo?.name]);

    // TO HANDLE VALIDATION FOR EMAIL
    useEffect(() => {
        const emailValidation = EMAIL_REGEX.test(registerInfo?.email);
        setValidEmail(emailValidation);
    }, [registerInfo?.email]);

    // TO HANDLE VALIDATION STORE PHONE NUMBER
    useEffect(() => {
        const phoneNumberValidation = PHONE_REGEX.test(registerInfo?.phonenumber);
        setValidPhoneNumber(phoneNumberValidation);
    }, [registerInfo?.phonenumber]);

    // TO CALL CITIES API
    useEffect(() => {
        axios
            .get("https://backend.atlbha.com/api/selector/cities")
            .then((response) => {
                setCitiesList(response?.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    /** -----------------------------------------------------------------------------------------------------------
     *  	=> REGISTER FUNCTION  <=
     *  ------------------------------------------------- */
    const register = () => {
        setError("");
        setPhonenumberError("");
        setNameError("");
        setEmailError("");
        setCityError("");
        setCheckboxError("");

        let formData = new FormData();
        formData.append("user_type", "marketer");
        formData.append("name", registerInfo?.name);
        formData.append("email", registerInfo?.email);
        formData.append("phonenumber", "+966" + registerInfo?.phonenumber);
        formData.append("city_id", city);
        formData.append("checkbox_field", isChecked);

        axios
            .post("https://backend.atlbha.com/api/registerapi", formData)
            .then((res) => {
                if (res?.data?.success === true && res?.data?.data?.status === 200) {
                    setEmail(registerInfo?.email);
                    setResendButtonDisabled(true);
                    setDisabledBtn(true);
                    setMessage(res?.data?.message?.ar);
                    setShowAlertModal(true);
                    window.location.href = "https://atlbha.com";
                } else {
                    if (res?.data?.message.ar === "stop_registration_markter") {
                        setError(res?.data?.message.en);
                    } else {
                        setPhonenumberError(res?.data?.message?.en?.phonenumber?.[0]);
                        setNameError(res?.data?.message?.en?.name?.[0]);
                        setEmailError(res?.data?.message?.en?.email?.[0]);
                        setCityError(res?.data?.message?.en?.city_id?.[0]);
                        setCheckboxError(res?.data?.message?.en?.checkbox_field?.[0]);
                    }
                }
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
            <div className='register-form' dir='ltr'>
                <div className='user-form'>
                    <h4 className='title'>بيانات المندوب</h4>

                    <div className='content'>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <h5 className="d-flex flex-row">اسم المندوب <span style={{ color: "red" }}>*</span></h5>
                                <input
                                    name='name'
                                    type='text'
                                    value={registerInfo?.name}
                                    onChange={handleRegisterInfo}
                                    placeholder='ادخل اسمك بالكامل'
                                    required
                                    aria-invalid={validOwnerName ? "false" : "true"}
                                    aria-describedby='ownerName'
                                    onFocus={() => setOwnerNameFocus(true)}
                                    onBlur={() => setOwnerNameFocus(true)}
                                />
                                <p
                                    id='ownerName'
                                    className={
                                        ownerNameFocus &&
                                            registerInfo?.name &&
                                            !validOwnerName
                                            ? " d-block wrong-text "
                                            : "d-none"
                                    }
                                    style={{
                                        color: "red",
                                        direction: "rtl",
                                        background: "#ffffff5e",
                                        padding: "10px 10px 10px 20px",
                                        borderRadius: "8px",
                                    }}>
                                    <MdErrorOutline className='ms-1' />
                                    برجاء كتابة الاسم بالكامل كما هو موجود في الهوية
                                    <br />
                                </p>
                                {nameError && (
                                    <span
                                        className='wrong-text w-100'
                                        style={{ color: "red", direction: "rtl" }}>
                                        {nameError}
                                    </span>
                                )}
                            </div>

                            <div>
                                <h5 className="d-flex flex-row">البريد الإلكتروني <span style={{ color: "red" }}>*</span></h5>
                                <input
                                    name='email'
                                    value={registerInfo?.email}
                                    onChange={handleRegisterInfo}
                                    type='email'
                                    placeholder='atlbha@gmail.com'
                                    required
                                    aria-invalid={validEmail ? "false" : "true"}
                                    aria-describedby='email'
                                    onFocus={() => setEmailFocus(true)}
                                    onBlur={() => setEmailFocus(true)}
                                />
                                <p
                                    id='email'
                                    className={
                                        emailFocus && registerInfo?.email && !validEmail
                                            ? " d-block wrong-text "
                                            : "d-none"
                                    }
                                    style={{
                                        color: "red",
                                        direction: "rtl",
                                        background: "#ffffff5e",
                                        padding: "10px 10px 10px 20px",
                                        borderRadius: "8px",
                                    }}>
                                    <MdErrorOutline className='ms-1' />
                                    تأكد من ان البريد الالكتروني يتكون من حرف واحد او اكثر
                                    ويحتوي علي علامة الـ @
                                </p>
                                {emailError && (
                                    <span
                                        className='wrong-text w-100'
                                        style={{ color: "red", direction: "rtl" }}>
                                        {emailError}
                                    </span>
                                )}
                            </div>

                            <div className='phone'>
                                <h5 className="d-flex flex-row">رقم الجوال <span style={{ color: "red" }}>*</span></h5>

                                <section className='d-flex align-items-center flex-row input_wrapper for_owner'>
                                    <input
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            border: "none",
                                            outline: "none",
                                            boxShadow: "none",
                                            padding: " 0 25px",
                                            borderRadius: "none",
                                        }}
                                        name='phonenumber'
                                        maxLength='9'
                                        minLength='0'
                                        value={registerInfo?.phonenumber}
                                        onChange={handleRegisterInfo}
                                        type='tel'
                                        placeholder='500000000'
                                        required
                                        aria-invalid={validPhoneNumber ? "false" : "true"}
                                        aria-describedby='phoneNumber'
                                        onFocus={() => setPhoneNumberFocus(true)}
                                        onBlur={() => setPhoneNumberFocus(true)}
                                        className="phone_input"
                                    />
                                    <section className='country_key'>966</section>
                                </section>

                                <p
                                    id='phoneNumber'
                                    className={
                                        phoneNumberFocus &&
                                            registerInfo?.phonenumber &&
                                            !validPhoneNumber
                                            ? " d-block wrong-text "
                                            : "d-none"
                                    }
                                    style={{
                                        color: "red",
                                        direction: "rtl",
                                        background: "#ffffff5e",
                                        padding: "10px 10px 10px 20px",
                                        borderRadius: "8px",
                                    }}>
                                    <MdErrorOutline className='ms-1' />
                                    تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
                                </p>
                            </div>
                            {phonenumberError && (
                                <span
                                    className='wrong-text w-100 '
                                    style={{
                                        color: "red",
                                        marginTop: "-10px",
                                        direction: "rtl",
                                    }}>
                                    {phonenumberError}
                                </span>
                            )}

                            <div className='mb-3'>
                                <h5 className="d-flex flex-row">المدينة <span style={{ color: "red" }}>*</span></h5>

                                <Select
                                    sx={{
                                        height: "3.5rem",
                                        border: "1px solid rgba(167, 167, 167, 0.5)",
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            border: "none",
                                        },
                                    }}
                                    value={city}
                                    className='select-mu '
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                    }}
                                    IconComponent={IoIosArrowDown}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (city?.length === 0) {
                                            return <span>اختر المدينة</span>;
                                        }
                                        const result = citiesList?.data?.cities?.filter(
                                            (item) => item?.id === parseInt(selected)
                                        );
                                        return result[0]?.name;
                                    }}>
                                    {citiesList?.data?.cities?.map((city) => (
                                        <MenuItem value={`${city?.id}`} key={city?.id}>
                                            {city?.name}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {cityError && (
                                    <span
                                        className='wrong-text w-100 d-flex justify-content-start'
                                        style={{ color: "red", direction: "rtl" }}>
                                        {cityError}
                                    </span>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
                {/*--------------------------------------------------------------------*/}
                {/*  owner info  form */}
                <div className='owner-form'>
                    <div className='owner-form'>
                        <div className='box-pay'>
                            <div className='top'>
                                <FormControlLabel
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "flex-start",
                                    }}
                                    value={isChecked}
                                    control={
                                        <>
                                            <Checkbox
                                                className='form-check-input'
                                                id='flexCheckDefault'
                                                checked={isChecked}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setIsChecked(1);
                                                    } else {
                                                        setIsChecked(0);
                                                    }
                                                }}
                                            />

                                            <Typography
                                                sx={{
                                                    ml: 0,
                                                    mr: 1,
                                                    fontSize: "15px",
                                                    fontWeight: 400,
                                                    color: "#67747B",
                                                    marginTop: "-14px",
                                                    whiteSpace: "break-spaces"
                                                }}>
                                                بتسجيلك فإنك توافق على سياسة
                                                <Link onClick={() => setShowTermsModal(true)}>
                                                    {" "}
                                                    الشروط والأحكام
                                                </Link>{" "}
                                                الخاصة بمنصة اطلبها
                                            </Typography>
                                        </>
                                    }
                                />

                                {checkboxError && (
                                    <span
                                        className='wrong-text w-100'
                                        style={{ color: "red", direction: "rtl" }}>
                                        {checkboxError}
                                    </span>
                                )}
                            </div>

                            <button
                                disabled={
                                    !validOwnerName || !validPhoneNumber || !validEmail || isChecked === 0
                                        ? true
                                        : false
                                }
                                className='bt-main'
                                onClick={register}>
                                تسجيل حساب جديد
                            </button>
                            {error && (
                                <span
                                    className='wrong-text w-100 mb-3 text-center'
                                    style={{
                                        color: "red",
                                        direction: "rtl",
                                        marginTop: "-10px",
                                        fontSize: "18px",
                                    }}>
                                    {error}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/** terms modal*/}
            <TermsModal
                show={showTermsModal}
                closeModal={() => setShowTermsModal(false)}
            />
            <AlertModal show={showAlertModal} message={message} />
        </>
    );
};

export default Radium(RegisterDelegate);