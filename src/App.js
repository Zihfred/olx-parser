import React, { useEffect, useRef, useState } from "react";
import AddRequestForm from "./components/AddRequestForm/AddRequestForm";
import './App.css'
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
import { MIDISounds } from "midi-sounds-react";
import useSound from "use-sound";
import sound from "./sound/sound.mp3";
import Container from "@material-ui/core/Container";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function App() {
  const [disabledSearch, setDisabledSearch] = useState(false);
  const [showedData, setShowedData] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [requests, setRequests] = useState([]);
  const [play] = useSound(sound);

  let newDataToShow = [];

  const deleteRequest = (name) => {
    let newRequests = requests.filter(item=>item.name !== name)
    setRequests([...newRequests])
    localStorage.setItem("requests", JSON.stringify(newRequests));
  }

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
    const newData = JSON.parse(JSON.stringify(showedData));

    setShowedData([...showedData, ...data]);
  };

  useEffect(async () => {
    setDisabledSearch(true);
    let requests = JSON.parse(localStorage.getItem("requests"))|| [];

    if (requests.length) {
      setRequests(requests);

      const data = await Promise.all(
        requests.map((item) => {

          return[
          API.getData({
            q: item.name,
            page: 1,
            maxPrice: item.maxPrice,
            minPrice: item.minPrice,
          }),
          API.getData({
            q: item.name,
            page: 2,
            maxPrice: item.maxPrice,
            minPrice: item.minPrice,
          }),
          API.getData({
            q: item.name,
            page: 3,
            maxPrice: item.maxPrice,
            minPrice: item.minPrice,
          }),
        ]}).flat(1)
      );

      setFetchedData([...fetchedData, ...data.flat(1)]);
       setDisabledSearch(false);
    }else {
      setDisabledSearch(false);
    }
  }, []);

  useInterval(async () => {
    if (!disabledSearch) {
      const data = await Promise.all(
        requests.map((item) =>{
            console.log(item)
          return API.getData({
            q: item.name,
            page: 1,
            maxPrice: item.maxPrice,
            minPrice: item.minPrice,
          })
    })
      );
      let newValues = [];
      data.flat(1).forEach((item) => {
        if (fetchedData.map((item) => item.name).indexOf(item.name) === -1) {
          console.log(item);
          newValues.push(item);
          play();
        }
      });
      setFetchedData(fetchedData.concat(newValues));
      setShowedData(showedData.concat(newValues));
    }
  }, 5000);

  useEffect(() => {
    console.log(showedData);
  }, [showedData]);

  const addSearcher = async (q) => {
    setDisabledSearch(true);
    setSearch("");
    setMaxPrice("");
    setMinPrice("");
    const data = await Promise.all([
      API.getData({ q: q, page: 1, maxPrice: maxPrice, minPrice: minPrice }),
      API.getData({ q: q, page: 2, maxPrice: maxPrice, minPrice: minPrice }),
      API.getData({ q: q, page: 3, maxPrice: maxPrice, minPrice: minPrice }),
    ]);
    setFetchedData([...fetchedData, ...data.flat(1)]);
    setDisabledSearch(false);
  };

  const createSearcher = () => {
    addSearcher(search);
    localStorage.setItem("requests", JSON.stringify(requests.concat({
      minPrice: minPrice,
      maxPrice: maxPrice,
      name: search,
    })));
    setRequests(requests.concat({
      minPrice: minPrice,
      maxPrice: maxPrice,
      name: search,
    }));
  };

  useEffect(() => {}, []);
  return (
    <Container maxWidth="md" className="App">
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
      <StyledRequests>
        <Typography align="center" variant="h4">Requests List:</Typography>
        {requests && requests.map((item) => <StyledRequestItem onClick={()=>deleteRequest(item.name)}>{`${item.name} | ${item.minPrice}-${item.maxPrice}`}</StyledRequestItem>)}

      </StyledRequests>
      <StyledPaper>
        {showedData &&
          showedData.map((item) => (
            <FindedItem name={item.name} path={item.path} key={item.path} />
          ))}
      </StyledPaper>
    </Container>
  );
}

const StyledPaper = styled(Paper)`
  background: rgba(255, 255, 255, 0.3);;
  padding: 10px;
  display: flex;
  flex-direction: column-reverse;
  margin: 10px;
`
const StyledRequestItem = styled(Typography)`
cursor: pointer;

  border: 1px solid black;
  margin: 5px !important;
  padding: 5px;
  display: inline-block;
  :hover {
    background-color: black;
    color: white;
  }
`

const StyledRequests = styled(Paper)`
  padding: 10px;
  background: rgba(255, 255, 255, 0.3);
  margin: 10px;
`

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
