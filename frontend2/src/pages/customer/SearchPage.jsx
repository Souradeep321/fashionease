import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsForCustomer } from '../../redux/productSlice';
import ProductCard from '../../components/ProductCard';
import Container from '../../components/common/Container';
import Loader from '../../components/common/Loader';

const SearchPage = () => {
  const { products, status, error, searchData } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products.products || products.products.length === 0) {
      dispatch(getProductsForCustomer());
    }
  }, [dispatch, products.products]);

  if (error) return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;

  if (status === 'failed') return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;

  if (status === 'loading') return <Loader />;

  // Safe default
  const allProducts = products.products || [];

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/gi, '');

  const query = normalize((searchData || '').toString().trim());

  const filteredProducts = allProducts.filter((product) => {
    if (!product?.title) return false;
    const combined = normalize(
      `${product.title} ${product.description} ${product.gender} ${product.category}`
    );
    return combined.includes(query);
  });

  return (
    <Container className='py-[130px]'>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))
      ) : (
        <p className='w-full lg:text-3xl text-2xl flex h-screen justify-center items-center'>No products found</p>
      )}
    </Container>
  );
};

export default SearchPage;
