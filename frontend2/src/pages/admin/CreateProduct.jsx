import React, { use, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, getAllProducts } from '../../redux/productSlice';
import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../../redux/authApi';


export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.products);
  const { data: user } = useGetProfileQuery();

  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    gender: '',
    category: '',
    image: null,
  });

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

    dispatch(createProduct(data));
    dispatch(getAllProducts());

    setFormData({
      title: '',
      description: '',
      price: '',
      gender: '',
      category: '',
      image: null,
    });
    setPreviewImage(null);
  };

  return (
    <div className="w-[100%] h-screen mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-purple-700 w-max mx-auto">Create New Product</h2>
      <form onSubmit={handleSubmit}
        className="space-y-4 w-screen md:w-[60%] mx-auto"
      >
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
                <span className="text-gray-400 text-center">No image selected</span>
              </div>
            )}
            <label className="ml-4 cursor-pointer">
              <span className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Choose File
              </span>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                required
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 rounded-md border-gray-300  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border "
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  border"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 ">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-10"
              required
            >
              <option value="">Select Gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium  text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-10"
              required
            >
              <option value="">Select Category</option>
              <option value="Shirts">Shirts</option>
              <option value="T-shirts">T-shirts</option>
              <option value="Shorts">Shorts</option>
              <option value="Jeans">Jeans</option>
              <option value="Casual-Trousers">Casual Trousers</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {user?.error ? (
          <div className="text-red-600 text-sm mt-2 text-center">
            {user.error} : please try again
          </div>
        ) : null}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {status === 'loading' ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}