import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsForCustomer } from '../../../redux/productSlice';
import ProductCard from '../../../components/ProductCard';
import Loader from '../../../components/common/Loader';
import Container from '../../../components/common/Container';
import CustomSwiper from '../../../components/common/Swiper';


import menstrousers1 from '../../../assets/mens/mentrousers1.png';
import menstrousers2 from '../../../assets/mens/mentrousers2.png';
import menstrousers3 from '../../../assets/mens/mentrousers3.png';
import Footer from '../../../components/Footer';



const MensCasualTrousers = () => {
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
        <Container className=' overflow-auto hide-scrollbar'>
            <CustomSwiper
                className="h-[60%] lg:h-[75%] md:mt-[117px] mt-[70px] overflow-auto hide-scrollbar"
                slides={[
                    {
                        image: menstrousers1,
                        title: 'Refined Street Style',
                        description: 'Unleash confidence with every step you take.',
                    },
                    {
                        image: menstrousers2,
                        title: 'Tailored for Impact',
                        description: 'Find your perfect fit in every silhouette.',
                    },
                    {
                        image: menstrousers3,
                        title: 'Effortless Charm',
                        description: 'Elevate your look with modern essentials.',
                    },
                ]}
            />

            {productList
                .filter((product) => product.gender === 'men')
                .filter((product) => product.category === 'Casual-Trousers')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
                <Footer />
        </Container>
    );
};

export default MensCasualTrousers;
