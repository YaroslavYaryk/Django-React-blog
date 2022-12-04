import Navbar from "./components/home/Navbar";
import Home from "./pages/Home";
import Create from "./pages/Create";
import BlogDetails from "./pages/BlogDetails";
import NotFound from "./pages/NotFound";
import Login from "./pages/Authentication/Login";
import Registration from "./pages/Authentication/Registration";
import PrivateRoute from "./utils/PrivateRoute";
import UpdateBlog from "./pages/UpdateBlog";
import Profile from "./pages/Profile";

import { AuthProvider } from "./context/AuthContext";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <div className="content">
            <Switch>
              <PrivateRoute component={Home} path="/" exact />
              <PrivateRoute exact path="/create" component={Create} />
              <PrivateRoute exact path="/blogs/:id" component={BlogDetails} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/registration" component={Registration} />
              <PrivateRoute exact path="/update/:id" component={UpdateBlog} />
              <PrivateRoute exact path="/profile" component={Profile} />

              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
