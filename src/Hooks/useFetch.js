import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(url)
    .then(res=>setData(res.data))
    .catch(error=>console.error(error))
   
  }, [url]);

  return [data];
};

export default useFetch;