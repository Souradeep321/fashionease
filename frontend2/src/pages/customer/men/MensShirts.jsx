import Container from '../../../components/common/Container';
import Loader from '../../../components/common/Loader';
import CustomSwiper from '../../../components/common/Swiper';
import ProductCard from '../../../components/ProductCard';
import { useGetProductsQuery } from '../../../redux/productApi';


import ment1 from '../../../assets/mens/ment1.png';
import ment2 from '../../../assets/mens/ment2.png';
import ment3 from '../../../assets/mens/ment3.png';
import Footer from '../../../components/Footer';

const MensShirts = () => {
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
                        title: 'Classic Cuts',
                        description: 'Discover timeless shirts tailored for every man.',
                    },
                    {
                        image: ment2,
                        title: 'Everyday Comfort',
                        description: 'Breathe easy in styles made for daily wear.',
                    },
                    {
                        image: ment3,
                        title: 'Bold Statements',
                        description: 'Stand out with patterns and fits that impress.',
                    },
                ]}
            />

            {productList
                .filter((product) => product.gender === 'men')
                .filter((product) => product.category === 'Shirts')
                .map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
                <Footer />
        </Container>
    );
};

export default MensShirts;
