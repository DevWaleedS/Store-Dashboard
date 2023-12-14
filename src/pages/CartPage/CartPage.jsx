import React from 'react';
// Third party
import { Helmet } from "react-helmet";
import useFetch from "../../Hooks/UseFetch";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
// Components
import CircularLoading from "../../HelperComponents/CircularLoading";
// Icons
import { HomeIcon, Cross10 } from "../../data/Icons";

function CartPage() {
    const [cookies] = useCookies(["access_token"]);
    const { fetchedData, loading, reload, setReload } = useFetch(
        "https://backend.atlbha.com/api/Store/showImportCart"
    );
    // delete item from cart function 
    const deleteItemFromCart = (id) => {
        axios
            .get(`https://backend.atlbha.com/api/Store/deleteImportCart/${id}`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${cookies?.access_token}`,
                },
            })
            .then((res) => {
                if (res?.data?.success === true) {
                    toast.success(res?.data?.message?.ar, {
                        theme: "light",
                    });
                    setReload(!reload);
                } else {
                    toast.error(res?.data?.message?.ar, {
                        theme: "light",
                    });
                    setReload(!reload);
                }
            });
    }

    return (
        <>
            <Helmet>
                <title>لوحة تحكم أطلبها | سلة الاستيراد </title>
            </Helmet>
            <section className='coupon-page p-lg-3'>
                <div className='head-category'>
                    <div className='row'>
                        <nav aria-label='breadcrumb'>
                            <ol className='breadcrumb'>
                                <li className='breadcrumb-item'>
                                    <HomeIcon />
                                    <Link to='/' className='me-2'>
                                        الرئيسية
                                    </Link>
                                </li>
                                <li className='breadcrumb-item' aria-current='page'>
                                    <Link to='/Products/SouqOtlobha' className='me-2'>
                                        سوق أطلبها
                                    </Link>
                                </li>
                                <li className='breadcrumb-item active' aria-current='page'>
                                    سلة الاستيراد
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className='cart-page'>
                    <h3>سلة استيراد منتجات سوق أطلبها</h3>
                    <div className='block'>
                        <div className='container'>
                            {loading
                                ?
                                <CircularLoading />
                                :
                                fetchedData?.data?.cart ?
                                    <>
                                        <div className='table-responsive'>
                                            <table className='cart-table'>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '1px' }}>الصورة</th>
                                                        <th style={{ textAlign: "justify" }}>اسم المنتج</th>
                                                        <th>السعر</th>
                                                        <th>الكيمة</th>
                                                        <th>الاجمالي</th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fetchedData?.data?.cart?.cartDetail?.map((product) => (
                                                        <tr key={product?.id}>
                                                            <td>
                                                                <div className='image'>
                                                                    <a href={`${product?.product?.id}`}>
                                                                        <img src={product?.product?.cover} alt='product-img' />
                                                                    </a>
                                                                </div>
                                                            </td>
                                                            <td className='name'>
                                                                <a href={`${product?.product?.id}`}>{product?.product?.name}</a>
                                                            </td>
                                                            <td>{Number(product?.price)} ر.س</td>
                                                            <td>
                                                                <div className='qty'>
                                                                    <button >+</button>
                                                                    <input value={product?.qty} />
                                                                    <button >-</button>
                                                                </div>
                                                            </td>
                                                            <td>{product?.sum} ر.س</td>
                                                            <td>
                                                                <button className='remove' onClick={() => deleteItemFromCart(product?.id)}>
                                                                    <Cross10 />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='actions'>
                                            <div className='buttons'>
                                                <Link to="/Products/SouqOtlobha">العودة لسوق أطلبها</Link>
                                                <button type="button" className='update' disabled>تحديث السلة</button>
                                            </div>
                                        </div>
                                        <div className='row justify-content-end pt-md-5 pt-4'>
                                            <div className='col-12 col-md-7 col-lg-6 col-xl-5'>
                                                <div className='card'>
                                                    <div className='card-body'>
                                                        <h3>اجمالي السلة</h3>
                                                        <table>
                                                            <thead>
                                                                <tr>
                                                                    <th style={{ textAlign: "justify" }}>السعر</th>
                                                                    <td>{fetchedData?.data?.cart?.subtotal} ر.س</td>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr>
                                                                    <th>الضريبة</th>
                                                                    <td>{fetchedData?.data?.cart?.tax} ر.س</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>الشحن</th>
                                                                    <td>{fetchedData?.data?.cart?.shipping_price} ر.س</td>
                                                                </tr>
                                                            </tbody>
                                                            <tfoot>
                                                                <tr>
                                                                    <th>الاجمالي <span className='tax-text'>(شامل الضريبة)</span></th>
                                                                    <td>{fetchedData?.data?.cart?.total} ر.س</td>
                                                                </tr>
                                                            </tfoot>
                                                        </table>
                                                        <Link to="/Products/SouqOtlobha/Checkout" className='checkout-btn'>الاستمرار الى الدفع</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <div className='empty'>
                                        <span>
                                            سلة الاستيراد الخاصة بك فارغة!
                                        </span>
                                        <Link to="/Products/SouqOtlobha">العودة إلى سوق أطلبها</Link>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default CartPage;