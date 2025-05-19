import React, { useEffect } from 'react';
import Container from '../../../components/common/Container';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/common/Loader';
import { getProductsForCustomer } from '../../../redux/productSlice';
import ProductCard from '../../../components/ProductCard';
import CustomSwiper from '../../../components/common/Swiper';

import women1 from '../../../assets/women1.png';
import women2 from '../../../assets/women2.png';
import women3 from '../../../assets/women3.png';

const WomensAll = () => {
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
        <Container className=''>

            <CustomSwiper
                className="h-[60%] lg:h-[90%]"
                slides={[
                    {
                        image: women1,
                        title: 'Stylish Elegance',
                        description: 'Discover the latest in women’s fashion.',
                    },
                    {
                        image: women2,
                        title: 'Comfort Meets Class',
                        description: 'Explore outfits that define you.',
                    },
                    {
                        image: women3,
                        title: 'Bold and Beautiful',
                        description: 'Style that speaks for itself.',
                    },
                ]}
            />

            {productList
                .filter((product) => product.gender === 'women')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
        </Container>
    );
};

export default WomensAll;
