import React, { useState } from "react";
import "./app.css";

function StockQueryTool() {
  const [pricesInput, setPricesInput] = useState("120,121,119,125,130,130,129,140,133,150");
  const [queries, setQueries] = useState([
    { id: 1, l: 1, r: 10, type: "distinct" }
  ]);
  const [results, setResults] = useState([]);

  const parsePrices = () => {
    return pricesInput
      .split(/[\s,]+/)
      .map(x => Number(x))
      .filter(x => !isNaN(x));
  };

  const addQuery = () => {
    setQueries(prev => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        l: 1,
        r: parsePrices().length,
        type: "distinct"
      }
    ]);
  };

  const handleQueryChange = (id, field, value) => {
    setQueries(prev =>
      prev.map(q => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const deleteQuery = id => {
    setQueries(prev => prev.filter(q => q.id !== id));
  };

  const runMoAlgorithm = () => {
    const arr = parsePrices();
    const n = arr.length;

    const validQueries = [];
    queries.forEach((q, idx) => {
      const l = Number(q.l) - 1;
      const r = Number(q.r) - 1;
      if (l >= 0 && r >= 0 && l <= r && r < n) {
        validQueries.push({ ...q, l, r, idx });
      }
    });

    if (!validQueries.length) {
      alert("Invalid queries.");
      return;
    }

    const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));

    validQueries.sort((a, b) => {
      const blockA = Math.floor(a.l / blockSize);
      const blockB = Math.floor(b.l / blockSize);
      if (blockA !== blockB) return blockA - blockB;
      return blockA % 2 === 0 ? a.r - b.r : b.r - a.r;
    });

    const freq = new Map();
    let distinct = 0;
    let maxFreq = 0;
    let maxFreqValue = null;

    let volatility = 0;
    const inRange = new Array(n).fill(false);

    const getDirection = (x, y) => {
      if (x < y) return "U";
      if (x > y) return "D";
      return "F";
    };

    let peakCount = 0;

    const checkPeak = (i) => {
      if (i <= 0 || i >= n - 1) return 0;
      if (!inRange[i] || !inRange[i - 1] || !inRange[i + 1]) return 0;
      if (arr[i] > arr[i - 1] && arr[i] > arr[i + 1]) return 1;
      return 0;
    };

    const addIndex = (i) => {
      if (inRange[i]) return;

      const v = arr[i];
      const prev = freq.get(v) || 0;
      freq.set(v, prev + 1);

      if (prev === 0) distinct++;
      if (prev + 1 > maxFreq) {
        maxFreq = prev + 1;
        maxFreqValue = v;
      }

      if (i > 0 && inRange[i - 1]) {
        if (getDirection(arr[i - 1], arr[i]) !== getDirection(arr[i - 1], arr[i - 1 + (arr[i] !== arr[i - 1])])) {
          volatility++;
        }
      }

      if (i + 1 < n && inRange[i + 1]) {
        if (getDirection(arr[i], arr[i + 1]) !== getDirection(arr[i + 1], arr[i + 1])) {
          volatility++;
        }
      }

      peakCount += checkPeak(i) + checkPeak(i - 1) + checkPeak(i + 1);
      inRange[i] = true;
    };

    const removeIndex = (i) => {
      if (!inRange[i]) return;

      const v = arr[i];
      const prev = freq.get(v) || 0;
      freq.set(v, prev - 1);

      if (prev === 1) distinct--;
      if (v === maxFreqValue && freq.get(v) < maxFreq) {
        maxFreq = 0;
        maxFreqValue = null;
        for (const [key, value] of freq) {
          if (value > maxFreq) {
            maxFreq = value;
            maxFreqValue = key;
          }
        }
      }

      peakCount -= checkPeak(i) + checkPeak(i - 1) + checkPeak(i + 1);
      inRange[i] = false;
    };

    const resultsArr = new Array(queries.length).fill("-");

    let curL = 0,
      curR = -1;

    for (const q of validQueries) {
      while (curL > q.l) addIndex(--curL);
      while (curR < q.r) addIndex(++curR);
      while (curL < q.l) removeIndex(curL++);
      while (curR > q.r) removeIndex(curR--);

      if (q.type === "distinct") {
        resultsArr[q.idx] = distinct;
      } else if (q.type === "maxfreq") {
        resultsArr[q.idx] = `${maxFreqValue} (${maxFreq})`;
      } else if (q.type === "volatility") {
        resultsArr[q.idx] = volatility;
      } else if (q.type === "pattern") {
        const dir = [];
        for (let i = q.l; i < q.r; i++) dir.push(getDirection(arr[i], arr[i + 1]));
        const target = ["U", "D", "U", "D"];
        let count = 0;
        for (let i = 0; i + 3 < dir.length; i++) {
          if (
            dir[i] === target[0] &&
            dir[i + 1] === target[1] &&
            dir[i + 2] === target[2] &&
            dir[i + 3] === target[3]
          )
            count++;
        }
        resultsArr[q.idx] = count;
      } else if (q.type === "trend") {
        let ups = 0,
          downs = 0;
        for (let i = q.l; i < q.r; i++) {
          if (arr[i] < arr[i + 1]) ups++;
          if (arr[i] > arr[i + 1]) downs++;
        }
        if (ups > downs) resultsArr[q.idx] = "Uptrend";
        else if (downs > ups) resultsArr[q.idx] = "Downtrend";
        else resultsArr[q.idx] = "Flat";
      } else if (q.type === "peak") {
        resultsArr[q.idx] = peakCount;
      }
    }

    setResults(resultsArr);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Stock Market Range Query Analyzer (Mo's Algorithm)</h1>

        <div className="section">
          <h2>Price Data</h2>
          <textarea
            rows={4}
            value={pricesInput}
            onChange={(e) => setPricesInput(e.target.value)}
            placeholder="Enter prices separated by comma"
          />
        </div>

        <div className="section">
          <div className="section-header">
            <h2>Queries</h2>
            <button className="btn btn-add" onClick={addQuery}>
              Add Query
            </button>
          </div>

          <div className="queries-list">
            {queries.map((q, idx) => (
              <div key={q.id} className="query-row">
                <span className="query-label">Query #{idx + 1}</span>
                <input
                  type="number"
                  value={q.l}
                  onChange={(e) => handleQueryChange(q.id, "l", Number(e.target.value))}
                  placeholder="L"
                />
                <input
                  type="number"
                  value={q.r}
                  onChange={(e) => handleQueryChange(q.id, "r", Number(e.target.value))}
                  placeholder="R"
                />
                <select
                  value={q.type}
                  onChange={(e) => handleQueryChange(q.id, "type", e.target.value)}
                >
                  <option value="distinct">Distinct Prices</option>
                  <option value="maxfreq">Max-Frequency Price</option>
                  <option value="volatility">Volatility Count</option>
                  <option value="pattern">U-D-U-D Pattern Count</option>
                  <option value="trend">Trend Detection</option>
                  <option value="peak">Peak Count</option>
                </select>
                <button className="btn-delete" onClick={() => deleteQuery(q.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button className="btn btn-run" onClick={runMoAlgorithm}>
            Run Queries
          </button>
        </div>

        {results.length > 0 && (
          <div className="section">
            <h2>Results</h2>
            <div className="results-list">
              {results.map((r, i) => (
                <div key={i} className="result-item">
                  <span className="result-number">Result #{i + 1}:</span>
                  <span className="result-value">{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockQueryTool;
