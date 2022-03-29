import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext"
import { useContext } from "react";


const Navbar = () => {

	let { user, logoutUser } = useContext(AuthContext);


	return (
		<nav className="navbar">
			<h1>The dojo blog</h1>
			<div className="links">
				<Link to="/">Home</Link>

				{user ? (
					<div className="block__link">
						<div className="block__link"><Link onClick={logoutUser} >Logout</Link></div>
						<div className="block__link" ><Link to="/profile">Profile</Link></div>
					</div>

				) : (
					<div className="block__link">
						< Link to="/login" >Login</Link>
						< Link to="/registration" >Registration</Link>
					</div>
				)}

				<Link to="/create" style={{
					color: 'white',
					backgroundColor: '#f1356d',
					borderRadius: '8px'
				}}>New Blog</Link>
			</div>
		</nav >
	);
}

export default Navbar;