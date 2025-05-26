import Container from '../../../components/common/Container';
import Loader from '../../../components/common/Loader';
import ProductCard from '../../../components/ProductCard';
import CustomSwiper from '../../../components/common/Swiper';
import { useGetProductsQuery } from '../../../redux/productApi';

import ment1 from '../../../assets/mens/ment1.png';
import ment2 from '../../../assets/mens/ment2.png';
import ment3 from '../../../assets/mens/ment3.png';
import Footer from '../../../components/Footer';


const MensAll = () => {
    const { data: products, error, isError, isLoading, status } = useGetProductsQuery();
    console.log('products', products);

    const productList = products?.products || [];


    if (error || status === 'failed') {
        return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;
    }

    if (status === 'loading') return <Loader />;

    return (
        <>
            <Container className=' overflow-auto hide-scrollbar'>
                <CustomSwiper
                    className="h-[60%] lg:h-[75%] md:mt-[117px] mt-[70px] overflow-auto hide-scrollbar"
                    slides={[
                        {
                            image: ment1,
                            title: 'Refined Masculinity',
                            description: 'Step out in confidence with modern men’s wear.',
                        },
                        {
                            image: ment2,
                            title: 'Smart. Sharp. Stylish.',
                            description: 'Experience comfort without compromising on class.',
                        },
                        {
                            image: ment3,
                            title: 'Elevate Your Everyday',
                            description: 'From casual to classic — own every look.',
                        },
                    ]}
                />

                {productList
                    .filter((product) => product.gender === 'men')
                    .map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                    <Footer />
            </Container>
        </>
    );
};

export default MensAll;
