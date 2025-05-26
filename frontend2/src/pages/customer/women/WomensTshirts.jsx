import Container from '../../../components/common/Container';
import Loader from '../../../components/common/Loader';
import CustomSwiper from '../../../components/common/Swiper';
import ProductCard from '../../../components/ProductCard';
import { useGetProductsQuery } from '../../../redux/productApi';

import tshirt1 from '../../../assets/womenstshirts/tshirt1.png';
import tshirt2 from '../../../assets/womenstshirts/tshirt2.png';
import tshirt3 from '../../../assets/womenstshirts/tshirt3.png';
import Footer from '../../../components/Footer';


const WomensTshirts = () => {
    const { data: products, error, isError, isLoading, status } = useGetProductsQuery();
    console.log('products', products);

    const productList = products?.products || [];


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
                        image: tshirt1,
                        title: 'Chic & Casual',
                        description: 'T-shirts that blend comfort with modern flair.',
                    },
                    {
                        image: tshirt2,
                        title: 'Effortless Style',
                        description: 'Go from laid-back to standout with ease.',
                    },
                    {
                        image: tshirt3,
                        title: 'Bold Basics',
                        description: 'Elevate your everyday with trendy essentials.',
                    },
                ]}
            />
            {productList
                .filter((product) => product.gender === 'women')
                .filter((product) => product.category === 'T-shirts')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            <Footer />
        </Container>
    );
};

export default WomensTshirts;
