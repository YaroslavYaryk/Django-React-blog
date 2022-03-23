



const registerUser = async (e) => {
	e.preventDefault();
	const res = await axios.post("http://127.0.0.1:8000/api/users/create/",
		{ username: String(e.target.username.value), password: String(e.target.password.value) }, {
		"Content-Type": "application/json"
	})

	let data = res.data;
	if (res.status === 201) {
		setAuthToken(data)
		setUser(jwt_decode(data.access))
		localStorage.setItem('authTokens', JSON.stringify(data))
		history.push("/")
	} else {
		console.log(res.status)
		alert("Something went wrong")
	}
}
