import React, { useState, useEffect } from 'react';
import "./Main.css";
// Third party
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useCookies } from "react-cookie";
// Components
import LogoHeader from '../LogoHeader/LogoHeader';
import Tabs from '../Tabs/Tabs';
import Login from '../Login/Login';
import RegisterStore from '../RegisterStore/RegisterStore';
// Icons
import { ReactComponent as SvgComponent } from "../../../data/Icons/Component 59 – 11.svg";
import { ReactComponent as Svgarrwos } from "../../../data/Icons/icon-30-arrwos back1.svg";
import RegisterDelegate from '../RegisterDelegate/RegisterDelegate';

const mainTitle = [{ id: 1, text: "قم بتسجيل الدخول الى حسابك" }, { id: 2, text: "أنشئ حسابك واستمتع بالتجارة الإلكترونية" }, { id: 3, text: "أنشئ حسابك واستمتع بالتجارة الإلكترونية" }];
const imgTitle = [{ id: 1, text: "مرحباً بعودتك" }, { id: 2, text: "منصة اطلبها" }, { id: 3, text: "منصة اطلبها" }];
const imgSubTitle = [{ id: 1, text: "منصة اطلبها للتجارة الإلكترونية" }, { id: 2, text: "معنى جديد للتجارة الإلكترونية" }, { id: 3, text: "معنى جديد للتجارة الإلكترونية" }];


function Main() {
    const navigate = useNavigate();
    const parm = useParams();
    const [cookies] = useCookies(["access_token"]);
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        if (parm?.type === "login" || parm?.type === "merchant" || parm?.type === "delegate") {
            setActiveTab(parm?.type === "login" ? 0 : parm?.type === "merchant" ? 1 : parm?.type === "delegate" ? 2 : 0);
        } else {
            navigate("*");
        }
    }, [parm?.type]);

    if (cookies.access_token) {
        return <Navigate to='/' />
    }

    return (
        <>
            <Helmet>
                <meta />
                <title>أطلبها</title>
                <meta name="description" content="معنى جديد للتجارة الإلكترونية" />
            </Helmet>
            <div className='main-in-box' dir='ltr'>
                <div className='all-content' dir='rtl'>
                    <div className='right-side'>
                        <LogoHeader />
                        <div className='all'>
                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                            <h2>{mainTitle?.[activeTab]?.text}</h2>
                            {activeTab === 0 ? <Login /> : activeTab === 1 ? <RegisterStore /> : <RegisterDelegate />}
                        </div>
                    </div>

                    <div className='left-side'>
                        <a href='https://atlbha.com' className='back'>
                            <span>
                                <Svgarrwos />
                            </span>
                            الرئيسية
                        </a>
                        <span className='over-info'>
                            <SvgComponent />
                        </span>
                        <div className='info-svg'>
                            <h4>{imgSubTitle?.[activeTab]?.text}</h4>
                            <h1>{imgTitle?.[activeTab]?.text}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main;