class API {
  getData = async (body) => {
    return fetch(`https://www.olx.ua/ajax/search/list/`, {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0,Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36",
        accept: "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language":
          "en-US,en;q=0.9,ru-UA;q=0.8,ru-RU;q=0.7,ru;q=0.6,uk;q=0.5",
        dnt: "1",
        origin: "https://www.olx.ua",
        referer: "https://www.olx.ua/list/q-napa/",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "empty",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*",
      },
      method: "POST",
      body: `q=${body.q}&page=${body.page}&search[filter_float_price:from]=${body.minPrice}&search[filter_float_price:to]=${body.maxPrice}`,
    })
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
            };
          })
          .filter((item) => {
            if (item && !item.name) return false;
            console.log(item.name,body.q)
            return item.name
              .toLowerCase()
              .indexOf(body.q.toLocaleLowerCase()) >= 0;
          });

        return newData;
      });
  };

  getPostById = async () =>
    fetch(`https://rickandmortyapi.com/api/`).then((res) => {
      if (res.ok) {
        return res.json();
      }
    });
}

function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
}

export default new API();
