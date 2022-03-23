import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";


const Registration = () => {

	let { registerUser } = useContext(AuthContext);

	const history = useHistory();
	if (localStorage.getItem("authTokens")) {
		history.push("/");
	}

	return (
		<div className="home">
			<center><h1>Registration</h1></center>
			<form onSubmit={registerUser} className="create">
				<input type="text" name="username" placeholder="Enter Username" />
				<input type="password" name="password" placeholder="Enter Password" />
				<input type="password" name="password2" placeholder="Confirm password" />

				<input type="submit" />
			</form>
		</div>
	);
}

export default Registration;