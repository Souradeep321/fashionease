import Container from '../../../components/common/Container';
import Loader from '../../../components/common/Loader';
import CustomSwiper from '../../../components/common/Swiper';
import ProductCard from '../../../components/ProductCard';
import { useGetProductsQuery } from '../../../redux/productApi';

import jeansImg1 from '../../../assets/womensjeans/jeansImg1.png';
import jeansImg2 from '../../../assets/womensjeans/jeansImg2.png';
import jeansImg3 from '../../../assets/womensjeans/jeansImg3.png';
import Footer from '../../../components/Footer';



const WomensJeans = () => {
    const { data: products, error, isError, isLoading, status } = useGetProductsQuery();
    console.log('products', products);

    const productList = products?.products || [];


    if (error || status === 'failed') {
        return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;
    }

    if (status === 'loading') return <Loader />;

    return (
        <Container className='overflow-auto hide-scrollbar'>
            <CustomSwiper
                className="h-[60%] lg:h-[75%] md:mt-[117px] mt-[70px] overflow-auto hide-scrollbar"
                slides={[
                    {
                        image: jeansImg1,
                        title: 'Denim Redefined',
                        description: 'Flatter your figure with the perfect fit.',
                    },
                    {
                        image: jeansImg2,
                        title: 'Everyday Confidence',
                        description: 'Stay comfortable, look unstoppable.',
                    },
                    {
                        image: jeansImg3,
                        title: 'Effortless Edge',
                        description: 'Make your mark in bold, stylish denim.',
                    },
                ]}
            />

            {productList
                .filter((product) => product.gender === 'women')
                .filter((product) => product.category === 'Jeans')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            <Footer />
        </Container>
    );
};

export default WomensJeans;
