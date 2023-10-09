import { AddBoxTwoTone, AirplanemodeActiveTwoTone, ArticleTwoTone, DownloadForOffline, DownloadForOfflineTwoTone, ErrorTwoTone, HomeTwoTone, InfoTwoTone, LocalOfferTwoTone, RouteTwoTone } from "@mui/icons-material";
import { createTheme, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ThemeProvider, Toolbar, Typography } from "@mui/material"
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import {Home, SideMenu, Twitter, Mastodon, Dashboard, Pricing, Checkout} from "./Pages";
import { authentication } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51NZxrZCKDHE02IcOq0XtXAYg0sAxuzXXpOwgyeMdI76Fvn6WnFxTQS7wDI8FQISddzOnzEtXTSIAljvXtSqH25tw00lST8aNAo");

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff5400',
      },
      secondary: {
        main: '#a7a7a7',
      },
    },
    typography: {
      h2: {
        color: 'white',
        fontFamily: "'Roboto Mono', monospace;",
        marginBottom: 10
      },
      h4: {
        color: 'white',
        fontFamily: "'Roboto Mono', monospace;",
        marginBottom: 10
      },
      h6: {
        color: 'white',
        fontFamily: "'Roboto Mono', monospace;",
        marginBottom: 10,
        textAlign: 'center'
      },
      h5: {
        color: 'white',
        fontFamily: "'Roboto Mono', monospace;",
        marginBottom: 10,
        textAlign: 'center'
      },
      p: {
        color: 'white',
        fontFamily: "'Roboto Mono', monospace;",
        marginBottom: 10,
        fontSize: 17.5
      },
      body2: {
        color: 'white',
        fontFamily: "'Roboto Mono', monospace;",
        fontSize: 17.5
      },
      body1: {
        fontFamily: "'Roboto Mono', monospace;",
      },
    }
  });

  const [user, loading, error] = useAuthState(authentication);

  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    {user != null &&<Routes>
    <Route path="/" exact element={<React.Fragment><Home/></React.Fragment>} />
    <Route path="/twitter" exact element={<React.Fragment><SideMenu/><Twitter /></React.Fragment>} />
    <Route path="/mastodon" exact element={<React.Fragment><SideMenu/><Mastodon /></React.Fragment>} />
    <Route path="/dashboard" exact element={<React.Fragment><SideMenu/><Dashboard /></React.Fragment>} />
    <Route path="/upgrade" exact element={<React.Fragment><SideMenu/><Pricing /></React.Fragment>} />
    <Route path="/checkout" exact element={<Elements stripe={stripePromise}><SideMenu/><Checkout /></Elements>} />
</Routes>}

{user == null &&<Routes>
    <Route path="/" exact element={<Home/>} />
</Routes>}
</BrowserRouter>
      </ThemeProvider>
  )
}

export default App
