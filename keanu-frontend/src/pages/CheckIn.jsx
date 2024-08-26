import React, {useEffect, useState} from 'react';
import {useAppDispatch} from "../redux/hooks.js";
import {apiCatcher} from "../utils/apiChecker";
import {checkInProuctItem, listProductNeedCheckIn} from "../services/API/resource";
import {Link} from "react-router-dom";

export default function CheckIn() {
    const [products, setProducts] = useState([]);

    const dispatch = useAppDispatch();

    const fetchData = _ => {
        apiCatcher(dispatch, listProductNeedCheckIn)
            .then((result) => {
                setProducts(result)
            })
    }

    const checkIn = (uuid,button) => {
        apiCatcher(dispatch, checkInProuctItem, uuid)
            .then((result) => {
                button.innerHTML = '<span class="text-green-700">Success</span>';
                button.className = 'w-auto px-3 border border-green-400 bg-green-100 rounded flex gap-3 items-center justify-center py-1';
                button.disabled = true;
            })
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="px-4 py-6 bg-gray-50 min-h-screen">
            <div className="mx-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                    <tr>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Name</th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Type</th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Quantity</th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Duration</th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Currency</th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Unit
                            Amount
                        </th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Discount
                            Ratio
                        </th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Product
                            Title
                        </th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Create
                            Time
                        </th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">Update
                            Time
                        </th>
                        <th className="px-5 py-3 bg-gray-100 border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-normal">
                            CheckIn
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {products && products.map((item) => (
                        <tr key={item.uuid} className="border-b border-gray-200">
                            <td className="px-5 py-5 bg-white text-sm">
                                <Link
                                    to={`/@${item.product.resource.user.username}/${item.product_uuid}`}
                                    className="no-underline hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                                >{item.name}
                                </Link>
                            </td>
                            <td className="px-5 py-5 bg-white text-sm">{item.type}</td>
                            <td className="px-5 py-5 bg-white text-sm">{item.quantity}</td>
                            <td className="px-5 py-5 bg-white text-sm">{item.duration}</td>
                            <td className="px-5 py-5 bg-white text-sm">{item.currency}</td>
                            <td className="px-5 py-5 bg-white text-sm">{item.unit_amount}</td>
                            <td className="px-5 py-5 bg-white text-sm">{item.discount_ratio}</td>
                            <td className="px-5 py-5 bg-white text-sm">{item.product.resource.title}</td>
                            <td className="px-5 py-5 bg-white text-sm">{new Date(item.create_time).toLocaleString()}</td>
                            <td className="px-5 py-5 bg-white text-sm">{new Date(item.update_time).toLocaleString()}</td>
                            <td className="px-5 py-5 bg-white text-sm">
                                <button
                                    onClick={evt => {
                                        checkIn(item.uuid,evt.target)
                                    }}
                                    className="w-auto px-3 border border-gray-400 rounded flex gap-3 items-center justify-center py-1">
                                    Check In
                                </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

);
};