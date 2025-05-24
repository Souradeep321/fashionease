import React, { useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsForCustomer } from '../../redux/productSlice';
import Container from '../../components/common/Container';
import Loader from '../../components/common/Loader';
import { useGetProductsQuery } from '../../redux/productApi';

const Shop = () => {
    // const { products, status, error } = useSelector((state) => state.products);
    // const dispatch = useDispatch();

    // const productList = products?.products || [];

    // useEffect(() => {
    //     if (productList.length === 0) {
    //         dispatch(getProductsForCustomer());
    //     }
    // }, [dispatch, productList.length]);

    const {data:products,error,isError,isLoading,status} = useGetProductsQuery();
    console.log('products', products);
    

    console.log('status', status)
    const productList = products?.products || [];
    

    if (error || status === 'failed') {
        return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;
    }

    if (status === 'loading') return <Loader />;

    return (
        <Container className="  overflow-auto hide-scrollbar">
            {productList.map((product) => (
                <ProductCard key={product.id} {...product} />
            ))}
        </Container>
    )
}

export default Shop;
