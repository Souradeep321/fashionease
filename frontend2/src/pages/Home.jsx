import Categories from "../components/homepage/Categories";
import TrendingProducts from "../components/homepage/TrendingProduct";
import PromoBanner from "../components/homepage/PromoBanner";
import Newsletter from "../components/homepage/Newsletter";
import CustomSwiper from "../components/common/Swiper";


import homeImg1 from "../assets/home/homeImg1.png";
import homeImg2 from "../assets/home/homeImg2.png";
import homeImg3 from "../assets/home/homeImg3.png";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <div className=" h-screen overflow-auto hide-scrollbar">
        <CustomSwiper
          className="h-[60%] lg:h-[90%]  md:mt-[117px] mt-[70px]"
          slides={[
            {
              image: homeImg1,
              title: 'Stylish Elegance',
              description: 'Discover the latest in women’s fashion.',
            },
            {
              image: homeImg2,
              title: 'Comfort Meets Class',
              description: 'Explore outfits that define you.',
            },
            {
              image: homeImg3,
              title: 'Bold and Beautiful',
              description: 'Style that speaks for itself.',
            },
          ]}
        />


        <Categories />
        <TrendingProducts />
        <PromoBanner />
        <Newsletter />
        <Footer />
      </div>
    </>
  );
};

export default Home;