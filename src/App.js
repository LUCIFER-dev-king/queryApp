import "./App.css";
import countryCodes from "./countryCodes";
import React, { useState } from "react";
import axios from "axios";
const json2xls = require("json2xls");
const filename = "sample.xlsx";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [answerQuery, setAnserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState("");
  var dofileDownload;

  const onSubmit = async (e) => {
    var time = 0;
    setLoading(true);
    e.preventDefault();
    var q = "";
    for (var i = 0; i < searchQuery.length; i++) {
      if (searchQuery.charAt(i) === " ") {
        q = q + "+";
      } else {
        q += searchQuery.charAt(i);
      }
    }
    var ans = [{}];
    var i = 0;
    for (const code in countryCodes) {
      time++;
      var k = await axios.get(
        `https://stark-reaches-56730.herokuapp.com/https://itunes.apple.com/search?term=${q}&entity=software&country=${code}`
      );
      k = k.data.results;
      ans.push({
        country_code: code,
        country: countryCodes[code],
        result: k,
      });

      if (code === "zw") {
        setAnserQuery(JSON.stringify(ans, undefined, 4));
        setLoading(false);
      }
      setLoadingTime(time);
    }
  };

  const onDownload = () => {
    const blob = new Blob([answerQuery]);
    const fileDownload = URL.createObjectURL(blob);
    setQuery(fileDownload);
    console.log(query);
    dofileDownload.click();
  };

  const makeCSV = (content) => {};

  return (
    <div className='app'>
      <h2>Query App</h2>
      <section id='query' className='p-2' style={{ width: "50%" }}>
        <form action=''>
          <label htmlFor='' className='form-label'>
            Search
          </label>
          <input
            type='text'
            name='search'
            id='searchquery'
            className='form-control'
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type='button'
            style={{ width: "100%" }}
            className='btn btn-block btn-outline-light my-2'
            onClick={onSubmit}
          >
            Search
          </button>
        </form>
      </section>

      {loading ? (
        <div>Loading results{loadingTime}...</div>
      ) : (
        <section id='answer'>
          <pre id='answerQuery'>{answerQuery}</pre>
          <button
            type='button'
            style={{ width: "100%" }}
            className='btn btn-block btn-outline-dark my-2'
            onClick={onDownload}
          >
            Dowload
          </button>
        </section>
      )}
      <a
        style={{ visibility: "hidden" }}
        download={"results.json"}
        href={query}
        ref={(e) => (dofileDownload = e)}
      >
        download it
      </a>
    </div>
  );
}

export default App;
