import React from "react";
import Slider from "../components/homepage/Slider";
import Categories from "../components/homepage/Categories";
import TrendingProducts from "../components/homepage/TrendingProduct";
import PromoBanner from "../components/homepage/PromoBanner";
import Newsletter from "../components/homepage/Newsletter";

// new slider  elegent wala

import img1 from "../components/Slider/a1.png";
import img2 from "../components/Slider/a2.png";
import img3 from "../components/Slider/a3.png";


const slidesData = [
  {
    image: img1,
    title: "Spring Break: How to Fashion Your Holiday",
    subtitle: "Your boarding pass to good fashion.",
  },
  {
    image: img2,
    title: "Summer Escapes: Stylish Getaways",
    subtitle: "Travel in trend this season.",
  },
  {
    image: img3,
    title: "City Vibes: Urban Fashion Tips",
    subtitle: "Turn heads in the streets.",
  },
];

const Home = () => {
  return (
    <>
      <div className="mt-[8%] ">
        <Slider slides={slidesData} />

  
      <Categories />
      <TrendingProducts />
      <PromoBanner />
      <Newsletter />
      </div>
    </>
  );
};

export default Home;