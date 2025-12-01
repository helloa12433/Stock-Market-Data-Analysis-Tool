# 📊 StockQueryX — Stock Market Range Query Analyzer (Mo's Algorithm)

StockQueryX ek high-performance **range-query analytics engine** hai jo stock price data par complex queries ko ultra-fast process karta hai using **Mo’s Algorithm**.  
Isme backend ki bilkul zarurat nahi hoti — sab kuch optimized frontend computation se hota hai.

---

## 🚀 Features Supported

StockQueryX total **6 advanced stock-analysis range queries** support karta hai:

### ✅ 1. Distinct Prices (L–R)
- Range me kitne unique price values the.

### ✅ 2. Max-Frequency Price (Mode)
- Jo price sabse zyada baar aaya ho L–R me.

### ✅ 3. Volatility Count
- Up → Down → Up → Down type direction change count.

### ✅ 4. U-D-U-D Pattern Count
- Zig-zag micro-patterns detect karta hai.

### ✅ 5. Trend Detection
- Uptrend  
- Downtrend  
- Flat trend

### ✅ 6. Peak Count
- Kitne local maxima (peaks) aaye is range me.

---

## ⚙️ Mo’s Algorithm — Core Engine

Mo’s Algorithm contiguous range queries ko optimize karta hai by minimizing operations.

### 📌 Time Complexity:
```
O((N + Q) * √N)
```
Boht speed optimization hota hai especially jab N aur Q bohot bade ho.

### 📌 Sorting Queries:
```
O(Q · log Q)
```

### 📌 Add / Remove Operations:
```
O(1) each
```

---

## 📏 Maximum Dataset Capacity

### ⚡ Smooth Performance:
```
N = 100,000 prices  
Q = 100,000 queries
```

### ⚡ Acceptable Performance:
```
N = 200,000  
Q = 200,000
```

### ⚠ Stress-tested Upper Limit:
```
N = 300,000+  
Q = 300,000+
```

> Real bottleneck = Browser + device RAM (JS single-threaded).  
Algorithmically, Mo’s 500k+ dataset bhi handle kar sakta hai.

---

## 🧠 Why Mo's Algorithm for Stocks?

Stock market analytics heavily depends on **range-based insights**:

- Intraday volatility  
- Local peaks / dips  
- Trend shifts  
- Micro-patterns  
- Clustering behavior  
- Price diversity  

Ye sab continuous segments par hote hain → Mo’s Algorithm = perfect match.

---

## 🧪 Performance Example

For:
```
N = 100,000  
Q = 20,000
```

Naive:
```
~2.5 billion operations → browser freeze
```

Mo’s Algorithm:
```
~6–7 million operations → fast & smooth
```

---

## 🖥️ Real-World Use Cases

- Trading platforms  
- Back-testing engines  
- Financial research dashboards  
- Market pattern detectors  
- Volatility monitors  
- Historical price analytics  
- Quantitative ML feature extraction  

---


