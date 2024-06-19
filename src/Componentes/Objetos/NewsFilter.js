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

const getRandomInterval = () => {
  return Math.floor(Math.random() * (12000 - 10000 + 1)) + 10000; // Entre 1 y 2 minutos
};

const NewsFilter = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("random");
  const [selectedType, setSelectedType] = useState("random");
  const [newsList, setNewsList] = useState([]);
  const { state, dispatch } = useGeneralContext();
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
        if (updatedNews.length > 10) {
          updatedNews.pop();
        }
        return updatedNews;
      });

      // Establecer un nuevo intervalo aleatorio
      clearInterval(interval);
      interval = setInterval(addNews, getRandomInterval());
    };

    let interval = setInterval(addNews, getRandomInterval());

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
