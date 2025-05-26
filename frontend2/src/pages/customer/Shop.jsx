import ProductCard from '../../components/ProductCard'
import Container from '../../components/common/Container';
import Loader from '../../components/common/Loader';
import CustomSwiper from '../../components/common/Swiper';
import { useGetProductsQuery } from '../../redux/productApi';

import homeImg1 from '../../assets/home/homeImg1.png';
import homeImg2 from '../../assets/home/homeImg2.png';
import homeImg3 from '../../assets/home/homeImg3.png';
import Footer from '../../components/Footer';

const Shop = () => {
  const { data: products, error, isError, isLoading, status } = useGetProductsQuery();
  console.log('products', products);

  const productList = products?.products || [];

  if (error || status === 'failed') {
    return (
      <Container className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-lg text-red-600">{error?.data?.error || 'Failed to load products'}</p>
        </div>
      </Container>
    );
  }

  if (status === 'loading') return <Loader />;

  return (
    <Container className="  overflow-auto hide-scrollbar">
      <CustomSwiper
        className="h-[60%] lg:h-[75%] md:mt-[117px] mt-[70px]"
        slides={[
          {
            image: homeImg2,
            title: 'Modern Grace',
            description: 'Step into a world of effortless sophistication.',
          },
          {
            image: homeImg1,
            title: 'Chic & Comfortable',
            description: 'Redefine comfort with timeless fashion staples.',
          },
          {
            image: homeImg3,
            title: 'Confidently You',
            description: 'Make a statement with every outfit you wear.',
          },
        ]}
      />


      {productList.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
      <Footer />
    </Container>
  )
}

export default Shop;
