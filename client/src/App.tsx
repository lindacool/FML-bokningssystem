import React from "react";
import "./App.scss";
import Home from "./components/home/home";
import Booking from "./components/booking/booking";
import Admin from "./components/admin/admin";
import NoMatch from "./components/noMatch/noMatch";
import Footer from "./components/footer/footer";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className='App'>
        <Switch>
          
          <Route exact path='/'>
            <Home />
          </Route>

          <Route path='/booking'>
            <Booking />
          </Route>

          <Route path='/admin'>
            <Admin />
          </Route>

          <Route path='*'>
            <NoMatch />
          </Route>

        </Switch>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
