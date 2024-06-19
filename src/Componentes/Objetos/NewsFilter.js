import React, { useState, useEffect } from "react";
import { useGeneralContext } from "../Provider";
import { news } from "../news";
import { A } from "../Organizador";
import Reloj from "./Reloj";
import "../../Stylesheets/NewsFilter.css";

const getRandomNews = (industry, type) => {
  const industryNews = news[industry][type];
  const keys = Object.keys(industryNews);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { ...industryNews[randomKey], industry, type };
};

const getRandomInterval = (minimo, maximo) => {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo; // Entre 1 y 2 minutos
};
//(maximo-minimo+1)+minimo
const NewsFilter = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("random");
  const [selectedType, setSelectedType] = useState("random");
  const [newsList, setNewsList] = useState([]);
  const { state, dispatch } = useGeneralContext();
  const intervaloMinimo =
    state.time.news.minimo.minutos * 60 * 1000 +
    state.time.news.minimo.segundos * 1000;
  const intervaloMaximo =
    state.time.news.maximo.minutos * 60 * 1000 +
    state.time.news.maximo.segundos * 1000;
  const showNews = (bool) => {
    dispatch({ type: A.SHOW.news, show: bool });
  };

  useEffect(() => {
    const addNews = () => {
      let industry = selectedIndustry;
      let type = selectedType;

      if (industry === "random") {
        const industries = Object.keys(news);
        industry = industries[Math.floor(Math.random() * industries.length)];
      }

      if (type === "random") {
        type = Math.random() > 0.5 ? "positive" : "negative";
      }

      const newNews = getRandomNews(industry, type);

      setNewsList((prevNews) => {
        const updatedNews = [newNews, ...prevNews];
        if (updatedNews.length > state.show.cantidadNews) {
          updatedNews.pop();
        }
        return updatedNews;
      });

      // Establecer un nuevo intervalo aleatorio
      clearInterval(interval);
      interval = setInterval(
        addNews,
        getRandomInterval(intervaloMinimo, intervaloMaximo)
      );
    };

    let interval = setInterval(
      addNews,
      getRandomInterval(intervaloMinimo, intervaloMaximo)
    );

    return () => clearInterval(interval);
  }, [selectedIndustry, selectedType]);
  useEffect(() => {
    dispatch({ type: A.IMPACTONEWS, listaNews: newsList });
  }, [newsList]);

  return (
    <div className="news-filter">
      <div className="news-head">
        <Reloj nombre={"Pre"} />
        <h1>Latest News</h1>
        <Reloj nombre={"Open"} />
      </div>

      <div className="filter-controls">
        <label>
          Industry:
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
          >
            <option value="random">Random</option>
            <option value="Tech">Tech</option>
            <option value="Health">Health</option>
            <option value="Energy">Energy</option>
          </select>
        </label>
        <label>
          Type:
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="random">Random</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
          </select>
        </label>
      </div>
      <div className="news-list">
        {newsList.map((item, index) => (
          <div key={index} className={`news-item ${item.type}`}>
            <div>{item.industry}</div>
            <div>{item.type}</div>
            <div>{item.title}</div>
            <div>{item.description}</div>
            <div>Volatility: {item.volatility}</div>
            <div>Direction: {item.direction}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFilter;
