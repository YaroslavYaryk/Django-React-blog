import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

const Login = () => {

	let { loginUser } = useContext(AuthContext);

	const history = useHistory();
	if (localStorage.getItem("authTokens")) {
		history.push("/");
	}
	return (
		<div className="home">
			<center><h1>Login</h1></center>
			<form onSubmit={loginUser} className="create">
				<input type="text" name="username" placeholder="Enter Username" />
				<input type="password" name="password" placeholder="Enter Password" />

				<input type="submit" />
			</form>
		</div>
	);
}

export default Login;