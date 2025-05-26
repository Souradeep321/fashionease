import Container from '../../../components/common/Container';
import Loader from '../../../components/common/Loader';
import CustomSwiper from '../../../components/common/Swiper';
import ProductCard from '../../../components/ProductCard';
import { useGetProductsQuery } from '../../../redux/productApi';

import ment1 from '../../../assets/mens/ment1.png';
import ment2 from '../../../assets/mens/ment2.png';
import tshirt1 from '../../../assets/womenstshirts/tshirt1.png';
import Footer from '../../../components/Footer';

const MensTshirts = () => {
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
                        image: ment1,
                        title: 'Urban Essentials',
                        description: 'Stay cool and confident in everyday tees.',
                    },
                    {
                        image: tshirt1,
                        title: 'Casual Comfort',
                        description: 'Soft, breathable fabrics built for your lifestyle.',
                    },
                    {
                        image: ment2,
                        title: 'Effortlessly Cool',
                        description: 'Make a bold statement with minimal effort.',
                    },
                ]}
            />

            {productList
                .filter((product) => product.gender === 'men')
                .filter((product) => product.category === 'T-shirts')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
                <Footer />
        </Container>
    );
};

export default MensTshirts;
