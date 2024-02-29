import { FormControl } from '@mui/material';
import React from 'react';

function ProductOptions({ attributes, selectedValues, updateSelectOptions, itemProduct }) {
    return (
        <div className="product-options">
            {attributes?.map((attribute, index) => (
                <FormControl key={index} sx={{ m: 0, width: "100%", display: "flex", flexDirection: "cloumn", alignItems: "start", gap: "0.5rem" }}>
                    <label>يرجى اختيار {attribute?.name} <span>*</span></label>
                    {attribute?.type === "نص و صورة" ?
                        <div className="radio-options">
                            {attribute?.values?.map(
                                (item, itemIndex) => item !== "" &&
                                    <div
                                        key={itemIndex}
                                        className={`option-image ${selectedValues?.[index] === item?.value?.[0] ? 'active' : ''}`}
                                    >
                                        <label htmlFor={item?.id}>
                                            <div className="image">
                                                <img src={item?.value?.[2]} alt={item?.value?.[0]} />
                                            </div>
                                            <span>{item?.value?.[0]}</span>
                                        </label>
                                        <input
                                            id={item?.id}
                                            type='radio'
                                            className='input'
                                            name='product-option'
                                            value={item?.value?.[0]}
                                            onChange={(e) => updateSelectOptions(e, index, itemProduct)}
                                        />
                                    </div>
                            )}
                        </div>
                        :
                        attribute?.type === "نص و لون" ?
                            <div className="radio-options">
                                {attribute?.values?.map(
                                    (item, itemIndex) => item !== "" &&
                                        <div className={`option-color ${selectedValues?.[index] === item?.value?.[0] ? 'active' : ''}`} key={itemIndex}>
                                            <label htmlFor={item?.id}>
                                                {item?.value?.[0]}
                                                <span style={{ backgroundColor: `${item?.value?.[2]}` }}></span>
                                            </label>
                                            <input
                                                id={item?.id}
                                                type='radio'
                                                className='input'
                                                name='product-option'
                                                value={item?.value?.[0]}
                                                onChange={(e) => updateSelectOptions(e, index, itemProduct)}
                                            />
                                        </div>
                                )}
                            </div>
                            :
                            <div className="radio-options">
                                {attribute?.values?.map(
                                    (item, itemIndex) => item !== "" &&
                                        <div className={`option ${selectedValues?.[index] === item?.value?.[0] ? 'active' : ''}`} key={itemIndex}>
                                            <label htmlFor={item?.id}>{item?.value?.[0]}</label>
                                            <input
                                                id={item?.id}
                                                type='radio'
                                                className='input'
                                                name='product-option'
                                                value={item?.value?.[0]}
                                                onChange={(e) => updateSelectOptions(e, index, itemProduct)}
                                            />
                                        </div>
                                )}
                            </div>
                    }
                </FormControl>
            ))}
        </div>
    )
}

export default ProductOptions