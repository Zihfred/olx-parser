import React, { useEffect, useState } from "react";
import AddRequestForm from "./components/AddRequestForm/AddRequestForm";
import API from "./server/Api";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import styled from "styled-components";
import FindedItem from "./components/FindedItem/FindedItem";
import TagEditor from "react-tageditor/lib/TagEditor";


function App() {

  const [disabledSearch, setDisabledSearch] = useState(false);
  const [showedData, setShowedData] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [requests, setRequests] = useState([]);
  let newDataToShow = [];

  const handleChange = (e) => {
    setSearch(e.target.value);
  };
  const handleChangeMinPrice = (e) => {
    setMinPrice(e.target.value);
  };
  const handleChangeMaxPrice = (e) => {
    setMaxPrice(e.target.value);
  };

  const updateShowedData = (data) => {
    const newData = JSON.parse(JSON.stringify(showedData))

      setShowedData([...showedData,...data])
  }

  const addSearcher = (q) => {
    setDisabledSearch(true);
    setSearch("");
    setMaxPrice("");
    setMinPrice("");
    Promise.all([
      API.getData({ q: q, page: 1, maxPrice: maxPrice, minPrice: minPrice }),
      API.getData({ q: q, page: 2, maxPrice: maxPrice, minPrice: minPrice }),
      API.getData({ q: q, page: 3, maxPrice: maxPrice, minPrice: minPrice }),
    ])
      .then((values) => {
        setDisabledSearch(false);
        return { [q]: values.flat(1) };
      })
      .then((newState) => {
        console.log(newState);
        setInterval(()=>{
          API.getData({
            q: q,
            page: 6,
            maxPrice: maxPrice,
            minPrice: minPrice,
          }).then((data) => {
            console.log(newState);
            console.log(data);

            data.forEach((item) => {
              if (
                newState[q].map((item) => item.name).indexOf(item.name) === -1
              ) {
                console.log(item);
                newState[q].push(item);
                newDataToShow.push(item);
              }
            });
            return newDataToShow;
          }).then(updateShowedData);
        },5000)

      });
  };

  const createSearcher = () => {
    addSearcher(search);
    localStorage.setItem("requests", JSON.stringify(requests.concat(search)));
    setRequests(requests.concat(search));
  };

  useEffect(() => {}, []);
  return (
    <div className="App">
      <AddRequestForm
        value={search}
        onChange={handleChange}
        onClick={createSearcher}
        disabled={disabledSearch}
        onMinChange={handleChangeMinPrice}
        onMaxChange={handleChangeMaxPrice}
        maxPrice={maxPrice}
        minPrice={minPrice}
      />
      <Paper>
        {requests && requests.map((item) => <Typography>{item}</Typography>)}
      </Paper>
      <Paper>
        {showedData &&
        showedData
          .reverse()
            .map((item) => (
              <FindedItem name={item.name} path={item.path} key={item.path} />
            ))}
      </Paper>
    </div>
  );
}

export default App;



// .reduce(
//   (acc, city) => {
//     if (acc.map[city.name])
//       // если данный город уже был
//       return acc; // ничего не делаем, возвращаем уже собранное
//
//     acc.map[city.name] = true; // помечаем город, как обработанный
//     acc.cities.push(city); // добавляем объект в массив городов
//     return acc; // возвращаем собранное
//   },
//   {
//     map: {}, // здесь будут отмечаться обработанные города
//     cities: [], // здесь конечный массив уникальных городов
//   }).cities
