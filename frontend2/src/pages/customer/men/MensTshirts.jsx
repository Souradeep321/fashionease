import React, { useEffect } from 'react';
import Container from '../../../components/common/Container';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/common/Loader';
import { getProductsForCustomer } from '../../../redux/productSlice';
import ProductCard from '../../../components/ProductCard';

const MensTshirts = () => {
    const { products, status, error } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    const productList = products?.products || [];

    useEffect(() => {
        if (productList.length === 0) {
            dispatch(getProductsForCustomer());
        }
    }, [dispatch, productList.length]);


    if (error || status === 'failed') {
        return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;
    }

    if (status === 'loading') return <Loader />;

    return (
        <Container className='lg:py-[130px]'>
            {productList
                .filter((product) => product.gender === 'men')
                .filter((product) => product.category === 'T-shirts')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
        </Container>
    );
};

export default MensTshirts;
