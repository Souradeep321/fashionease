import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProduct, fetchSingleProduct } from '../../redux/productSlice';

export default function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { status, error, singleProduct } = useSelector((state) => state.products);
    const [previewImage, setPreviewImage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        gender: '',
        category: '',
        image: null,
    });

    useEffect(() => {
        dispatch(fetchSingleProduct(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (singleProduct) {
            setFormData({
                title: singleProduct.title || '',
                description: singleProduct.description || '',
                price: singleProduct.price?.toString() || '',
                gender: singleProduct.gender || '',
                category: singleProduct.category || '',
                image: null,
            });
            setPreviewImage(singleProduct.image || '');
        }
    }, [singleProduct]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('gender', formData.gender);
        data.append('category', formData.category);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await dispatch(updateProduct({ id, data })).unwrap();
            navigate("/adminDashboard/products");
        } catch (error) {
            // Error handled by Redux
        }
    };

    if (status === 'loading' && !singleProduct) {
        return <div className="text-center p-8">Loading product details...</div>;
    }
    
    return (
        <div className="w-[100%] mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-purple-700 w-max mx-auto">Update Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4 w-[100%] md:w-[60%] mx-auto">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="mt-1 flex items-center">
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="h-32 w-32 object-cover rounded-md"
                            />
                        ) : (
                            <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                                <span className="text-gray-400">Current product image</span>
                            </div>
                        )}
                        <label className="ml-4 cursor-pointer">
                            <span className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                Change Image
                            </span>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData?.title || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData?.description || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData?.price || ''}
                        onChange={handleInputChange}
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={formData?.gender || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="unisex">Unisex</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={formData?.category || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="clothing">Clothing</option>
                            <option value="shoes">Shoes</option>
                            <option value="accessories">Accessories</option>
                            <option value="Shirts">Shirts</option>
                            <option value="Saree">Saree</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="text-red-600 text-sm mt-2">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                    {status === 'loading' ? 'Updating...' : 'Update Product'}
                </button>
            </form>
        </div>
    );
}