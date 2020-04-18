import React, { useEffect, useState } from "react";
import AddRequestForm from "./components/AddRequestForm/AddRequestForm";
import API from "./server/Api";

function App() {
  const [dataState, setDataState] = useState([]);
  const [showedData, setShowedData] = useState([]);
  useEffect(() => {
    let dataFetched = [];
    let id = 1;
    for (let i = 1; i < 4; i++) {
      setTimeout(() => {
        API.getData({ q: "телефон", page: i })
          .then((data) => data.text())
          .then((data) => {
            const parser = new DOMParser();
            const newData = Array.from(
              parser
                .parseFromString(data.toString(), "text/html")
                .querySelectorAll(".fixed .breakword")
            )
              .filter((item) => !item.querySelector(".paid"))
              .map((item) => item.querySelector(".detailsLink"))
              .map((item) => {
                return {
                  path: item.pathname,
                  name: item.childNodes[1].alt,
                  price: 1,
                  id: id++,
                };
              });
            console.log(newData);
             dataFetched.push(...newData);
             setDataState(Array.from(new Set(dataFetched)));
          });
      }, 1500 * i);
    }
    setInterval(() => {
      API.getData({ q: "телефон", page: 1 })
        .then((data) => data.text())
        .then((data) => {
          const parser = new DOMParser();
          const newData = Array.from(
            parser
              .parseFromString(data.toString(), "text/html")
              .querySelectorAll(".fixed .breakword")
          )
            .filter((item) => !item.querySelector(".paid"))
            .map((item) => item.querySelector(".detailsLink"))

            .map((item) => {
              return {
                path: item.pathname,
                name: item.childNodes[1].alt,
                price: 1,
                id: id++,
              };
            });
          console.log(dataFetched);
          console.log(newData)
          const nowShowedData = [...showedData]


          newData.forEach(item=>{
             if(dataFetched.map(item => item.name).indexOf(item.name) === -1){
               console.log(item.path);
               dataFetched.push(item)
               setShowedData(prevArray => [...prevArray, item])
             }
            })

        });
    }, 1500 * 4);
  }, []);
  return (
    <div className="App">
      <AddRequestForm />
      {showedData && showedData.reverse().map(item=><div>
        <h2>{item.name}</h2>
        <a href={`https://www.olx.ua/${item.path}`}>{item.path}</a>
      </div>)}
    </div>
  );
}

export default App;
