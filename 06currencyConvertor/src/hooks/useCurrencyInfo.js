import { useEffect, useState } from "react";

function useCurrencyInfo(currency) {
  const [data, setData] = useState({});
  
  useEffect(() => {
    fetch(
      `https://api.frankfurter.app/latest?from=${currency}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((res) => setData(res.rates))
      .catch((err) => {
        setData({});
        console.error("Fetch error:", err);
      });
  }, [currency]);
  return data;
}

export default useCurrencyInfo;