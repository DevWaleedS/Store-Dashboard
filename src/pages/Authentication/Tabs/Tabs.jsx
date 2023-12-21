import React from 'react';
import {useNavigate } from "react-router-dom";

const tabs = [{ id: 1, text: "تسجيل الدخول",link:"login" }, { id: 2, text: "تسجيل تاجر",link:"merchant" }, { id: 3, text: "تسجيل مندوب",link:"delegate" }];

function Tabs({ activeTab, setActiveTab }) {
    const navigate = useNavigate();
    return (
        <div className='tabs'>
            {tabs?.map((tab, index) =>
                <button onClick={() => {setActiveTab(index);navigate(`/auth/${tab?.link}`);}} key={tab?.id} className={`tab ${index === activeTab ? "active" : ""}`}>{tab?.text}</button>
            )}
        </div>
    )
}

export default Tabs