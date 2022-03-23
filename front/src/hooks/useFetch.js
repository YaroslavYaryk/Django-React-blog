import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext"


const useFetch = (url) => {

	const [data, setData] = useState(null)
	const [isPending, setIsPending] = useState(true);

	const { authAccess, logoutUser } = useContext(AuthContext)

	const { authToken } = useContext(AuthContext)

	useEffect(() => {

		const abortCont = new AbortController();
		axios
			.get(url, {
				headers: {
					Authorization: `Bearer ${authToken.access}` //the token is a variable which holds the token
				}
			}, { signal: abortCont.signal })
			.then((res) => {
				if (!res.status === 200) {
					logoutUser()
					throw new Error("Could not fetch data");
				} else {
					const data = res.data
					setData(data)
					setIsPending(false);
				}
			}).catch(err => {
				if (err.name !== "AbortError") {
					setIsPending(false);
				}

			});

		return () => abortCont.abort();
	}, [url]);

	return {
		data, isPending
	}
}

export default useFetch;