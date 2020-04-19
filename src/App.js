import React, { useEffect, useRef, useState } from "react";
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
import { MIDISounds } from "midi-sounds-react";
import useSound from "use-sound";
import sound from "./sound/sound.mp3";

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
    let newRequests = requests.filter(item=>item !== name)
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
    let requests = JSON.parse(localStorage.getItem("requests"));

    if (requests.length) {
      setRequests(requests);

      const data = await Promise.all(
        requests.map((requestName) => {

          return[
          API.getData({
            q: requestName,
            page: 1,
            maxPrice: maxPrice,
            minPrice: minPrice,
          }),
          API.getData({
            q: requestName,
            page: 2,
            maxPrice: maxPrice,
            minPrice: minPrice,
          }),
          API.getData({
            q: requestName,
            page: 3,
            maxPrice: maxPrice,
            minPrice: minPrice,
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
        requests.map((requestName) =>
          API.getData({
            q: requestName,
            page: 1,
            maxPrice: maxPrice,
            minPrice: minPrice,
          })
        )
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
        {requests && requests.map((item) => <Typography onClick={()=>deleteRequest(item)}>{item}</Typography>)}
      </Paper>
      <StyledPaper>
        {showedData &&
          showedData.map((item) => (
            <FindedItem name={item.name} path={item.path} key={item.path} />
          ))}
      </StyledPaper>
    </div>
  );
}

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column-reverse;
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
