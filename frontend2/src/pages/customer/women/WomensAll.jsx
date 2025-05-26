import Container from '../../../components/common/Container';
import Loader from '../../../components/common/Loader';
import ProductCard from '../../../components/ProductCard';
import CustomSwiper from '../../../components/common/Swiper';
import { useGetProductsQuery } from '../../../redux/productApi';



import tshirt1 from '../../../assets/womenstshirts/tshirt1.png';
import jeansImg1 from '../../../assets/womensjeans/jeansImg1.png';
import tshirt3 from '../../../assets/womenstshirts/tshirt3.png';
import Footer from '../../../components/Footer';


const WomensAll = () => {
    const { data: products, error, isError, isLoading, status } = useGetProductsQuery();
        console.log('products', products);
    
        console.log('status', status)
        const productList = products?.products || [];

    if (error || status === 'failed') {
        return <p className='w-full text-2xl flex h-screen justify-center items-center'>Error: {error}</p>;
    }

    if (status === 'loading') return <Loader />;

    return (
        <Container className='overflow-auto hide-scrollbar'>

            <CustomSwiper
                className="h-[60%] lg:h-[75%]  md:mt-[117px] mt-[70px] overflow-auto hide-scrollbar"
                slides={[
                    {
                        image: jeansImg1,
                        title: 'Stylish Elegance',
                        description: 'Discover the latest in women’s fashion.',
                    },
                    {
                        image: tshirt3,
                        title: 'Comfort Meets Class',
                        description: 'Explore outfits that define you.',
                    },
                    {
                        image: tshirt1,
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
                <Footer />
        </Container>
    );
};

export default WomensAll;
