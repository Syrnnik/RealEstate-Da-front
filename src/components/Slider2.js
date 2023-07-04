import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getRandomArticle } from "../API/news";
import { checkPhotoPath } from "../helpers/photo";
import usePagination from "../hooks/pagination";
import Article from "./Article";

SwiperCore.use([Navigation, Pagination]);

export const Slider2 = ({ filter }) => {
  const { page } = useParams();
  const articlesPag = usePagination(6);
  const [randomArticle, setRandomArticles] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);

  useEffect(() => {
    getRandomArticle(page, 5).then((result) => {
      console.log(result);
      setNewsArticles(result);
      setRandomArticles(result);
    });
    // getNews(articlesPag.currentPage, articlesPag.pageLimit).then((result) => {
    //   setNewsArticles(result.data);
    //   setRandomArticles(result.data);
    // });
  }, [page]);

  useEffect(() => {
    if (filter)
      setRandomArticles(
        newsArticles?.filter(
          (article) =>
            article.title.toLowerCase().includes(filter.toLowerCase()) ||
            article.description.toLowerCase().includes(filter.toLowerCase())
        )
      );
    else setRandomArticles(newsArticles);
  }, [filter]);

  return (
    <Swiper
      className="swiper-3"
      spaceBetween={0}
      slidesPerView={1}
      touchStartPreventDefault={false}
      grabCursor={true}
      breakpoints={{
        576: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
      }}
      pagination={{
        el: ".swiper-pagination",
        type: "bullets",
        clickable: true,
      }}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
    >
      {randomArticle?.map((article) => (
        <SwiperSlide key={article.id}>
          <Article
            imgUrl={checkPhotoPath(article.image)}
            title={article.title}
            text={article.description}
            articleUrl={article.slug}
          />
        </SwiperSlide>
      ))}
      <div className="swiper-button-prev">
        <img src="/img/icons/prev.svg" alt="предыдущий" className="w-100" />
      </div>
      <div className="swiper-button-next">
        <img src="/img/icons/next.svg" alt="следующий" className="w-100" />
      </div>
      <div className="swiper-pagination"></div>
    </Swiper>
  );
};
