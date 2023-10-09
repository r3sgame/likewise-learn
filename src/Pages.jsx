import { Box, Button, CardContent, CardMedia, CircularProgress, Divider, Drawer, Grid, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, TextareaAutosize, TextField, Toolbar, Typography } from "@mui/material"
import React, { useState, useId, useEffect } from "react";
import axios from "axios";
import Banner from './logo.png';
import Branding1 from './Branding1.png';
import Branding2 from './Branding2.png';
import { NumberFormatBase } from "react-number-format";
import { Fade, Zoom } from "react-reveal";
import { isMobile } from "react-device-detect";
import { validate } from "email-validator";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { AccountCircleTwoTone, AddBoxTwoTone, ArrowCircleUpTwoTone, AssessmentTwoTone, DisabledByDefaultTwoTone, DownloadForOfflineTwoTone, ErrorTwoTone, FastForwardTwoTone, HomeTwoTone, InfoTwoTone, LinkedCameraOutlined, LocalOfferTwoTone, StarTwoTone, ThumbUpTwoTone } from "@mui/icons-material";
import { Element, scroller } from "react-scroll";
import * as tf from "@tensorflow/tfjs";
import { pipeline } from "@xenova/transformers";
import GoogleIcon from '@mui/icons-material/Google';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { authentication, provider } from "./firebase";
import { scrollToBottom } from "react-scroll/modules/mixins/animate-scroll";
import openai, { OpenAI } from 'openai';
import { CardElement, Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe('pk_test_51NZxrZCKDHE02IcOq0XtXAYg0sAxuzXXpOwgyeMdI76Fvn6WnFxTQS7wDI8FQISddzOnzEtXTSIAljvXtSqH25tw00lST8aNAo');

function KeepAPIsActive() {
  const sentiment = axios.post(
    "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
    {"inputs": "Hi"},
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HF_KEY}`,
        'Content-Type': 'application/json',
      },

    }
  );

  const hate = axios.post(
    "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-hate-latest",
    {"inputs": "Hi"},
    {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HF_KEY}`,
        'Content-Type': 'application/json',
      },

    }
  );
}

export function SideMenu() {

  const navigate = useNavigate();
  const signout = async () => {
    await signOut(authentication)
    console.log(authentication)
    navigate('/')
  }
  return(<Drawer variant="permanent" open PaperProps={{sx: {width: '25%'}}}>
        <Toolbar />
      <Divider />
      <List>
          <ListItem key='Dashboard' disablePadding>
            <ListItemButton href='/dashboard'>
              <ListItemIcon>
                <HomeTwoTone />
              </ListItemIcon>
              <ListItemText variant='p' primary='Dashboard' />
            </ListItemButton>
          </ListItem>

          <ListItem key='Twitter' disablePadding>
            <ListItemButton color="primary.text" href='/twitter'>
              <ListItemIcon>
                <AddBoxTwoTone />
              </ListItemIcon>
              <ListItemText variant='p' primary='Twitter' />
            </ListItemButton>
          </ListItem>

          <ListItem key='Mastodon' disablePadding>
            <ListItemButton color="primary.text" href='/mastodon'>
              <ListItemIcon>
                <AddBoxTwoTone />
              </ListItemIcon>
              <ListItemText variant='p' primary='Mastodon (Beta)' />
            </ListItemButton>
          </ListItem>

          <ListItem key='Blog' disablePadding>
            <ListItemButton href='https://r3sgame.github.io/likewise-learn-blog/'>
              <ListItemIcon>
                <DownloadForOfflineTwoTone />
              </ListItemIcon>
              <ListItemText variant='p' primary='Updates' />
            </ListItemButton>
          </ListItem>
      </List>
      <Divider />
      <ListItem key='Upgrade' disablePadding>
            <ListItemButton sx={{color: '#ff5400'}} href="/upgrade">
              <ListItemIcon>
                <ArrowCircleUpTwoTone />
              </ListItemIcon>
              <ListItemText variant='p' primary='Upgrade' />
            </ListItemButton>
          </ListItem>
      <ListItem key='Sign Out' disablePadding>
            <ListItemButton onClick={signout}>
              <ListItemIcon>
                <DisabledByDefaultTwoTone />
              </ListItemIcon>
              <ListItemText variant='p' primary='Sign Out' />
            </ListItemButton>
          </ListItem>
          <Divider/>
      <Typography variant="body2" color='text.secondary' sx={{position: "absolute", bottom: "0"}}>v2 Models</Typography>
        </Drawer>)
}

export function Home() {
  const [user, loading, error] = useAuthState(authentication);
  const navigate = useNavigate();
  const signin = async () => {
    await signInWithPopup(authentication, provider)
    navigate('/dashboard')
}

  return (
    <React.Fragment>
      <img src={Banner} alt="Banner" className="App-banner"/>
      <Fade>
        <Typography variant="h2" sx={{marginTop: '1%'}}>Generate your following.</Typography>
        </Fade>
        <Fade>
        <Typography color="secondary" variant="body2">Likewise Learn gives you the tools to predict and refine social media engagement.</Typography>
        </Fade>
      
      <Grid container justifyContent="center">
      <Paper variant="outlined" sx={{marginTop: 2, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto'}}>

        {user == null && <Fade><Typography color="secondary" sx={{textAlign: "left"}} variant="body2">Sign in or create an account for free to get full access. Not sure yet? Check out our demo below.</Typography></Fade>}
        {user != null && <Fade><Typography color="secondary" sx={{textAlign: "left"}} variant="body2">It looks like you're signed in. Go to the dashboard to begin!</Typography></Fade>}

        <Divider sx={{marginTop: 2}}/>

        {user == null && <Button onClick={signin} sx={{marginTop: 3}}><GoogleIcon sx={{marginRight: 3}}/><Typography color="inherit" variant="body2">Sign in with Google</Typography></Button>}
        {user != null && <Button href="/dashboard" sx={{marginTop: 3}}><Typography color="inherit" variant="body2">Dashboard</Typography></Button>}

        
      </Paper>
      </Grid>

      <Divider sx={{marginTop: 4}}/>
      <Fade>
        <Typography variant="h5" sx={{marginTop: 8}}>Check it Out!</Typography>
        </Fade>
        <iframe width="37.5%" height="315" src="https://www.youtube.com/embed/2Xo5ysY2SPw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      <Divider sx={{marginTop: 4}}/>
      <Fade>
        <Typography variant="h5" sx={{marginTop: 8}}>The Easy-to-Use Growth Tool</Typography>
        </Fade>
      
      {isMobile && <React.Fragment>
      <Fade>
        <Typography color="secondary" variant="body2">Likewise Learn uses deep learning to predict a Tweet's performance through its text content and the follower count of the user. No need for unnecessary inputs!</Typography>
        </Fade>

      <Fade>
        <Typography color="secondary" variant="body2">Need an idea? Just enter some keywords/motives, and our AI will return stellar responses through LLM technology combined with the ranking system. Threads are welcome!</Typography>
        </Fade></React.Fragment>}

      {!isMobile && <Grid container justifyContent="center"><Paper variant="outlined" sx={{ display: 'flex', width: '62.5%', minHeight: 180, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  
          <CardContent sx={{ flex: '1 0 auto' }}>
          <Fade>
        <Typography sx={{textAlign: "left"}} color="secondary" variant="body2">Likewise Learn uses deep learning to predict a Tweet's performance through its text content and the follower count of the user. No need for unnecessary inputs!</Typography>
        </Fade>
        <br/>
      <Fade>
        <Typography sx={{textAlign: "left"}} color="secondary" variant="body2">Need an idea? Just enter some keywords/motives, and our AI will return stellar responses through LLM technology combined with the ranking system. Threads are welcome!</Typography>
        </Fade>
          </CardContent>
  
        </Box>
        <CardMedia component="img" sx={{ width: '25%'}} image={Branding1} alt="Vehicle"/>
      </Paper></Grid>}

      <Divider sx={{marginTop: 8}}/>
      <Fade>
        <Typography variant="h5" sx={{marginTop: 8}}>Not your Average Optimizer</Typography>
        </Fade>
      
        {isMobile && <Fade>
        <Typography color="secondary" variant="body2">We believe that posts should focus on quality, not quantity. Instead of using unreliable and opaque values (likes and views), Likewise learn ranks and generates posts based on the engagement rate, a ratio of user interactions to impressions.</Typography>
        </Fade>}

      {!isMobile && <Grid container justifyContent="center"><Paper variant="outlined" sx={{ display: 'flex', width: '62.5%', minHeight: 150, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  
          <CardContent sx={{ flex: '1 0 auto' }}>
          <Fade>
        <Typography sx={{textAlign: "left"}} color="secondary" variant="body2">We believe that posts should focus on quality, not quantity. Instead of using unreliable and opaque values (likes and views), Likewise learn ranks and generates posts based on the engagement rate, a ratio of user interactions to impressions.</Typography>
        </Fade>
          <br/>
        <Fade>
        <Typography sx={{textAlign: "left"}} color="secondary" variant="body2">For more information, check out the Likewise Learn <Link href="https://r3sgame.github.io/likewise-learn-blog">Blog</Link>.</Typography>
        </Fade>
          </CardContent>
  
        </Box>
        <CardMedia component="img" sx={{ width: '25%' }} image={Branding2} alt="Vehicle"/>
      </Paper></Grid>}

      <Divider sx={{marginTop: 8}}/>
      
      <Grid container sx={{marginTop: 2}} justifyContent="center">
      <Button target="_blank" href="https://r3sgame.github.io/likewise-learn-blog"><Typography variant="body2" color="inherit">Blog</Typography></Button>
      <Button target="_blank" href="https://twitter.com/r3sgame"><Typography variant="body2" color="inherit">Twitter</Typography></Button>
      <Button target="_blank" href="https://mastodon.social/@r3s"><Typography variant="body2" color="inherit">Mastodon</Typography></Button>
      <Button target="_blank" href="https://r3sgame.github.io/likewise-learn-blog/2023/07/23/privacypolicy/"><Typography variant="body2" color="inherit">Privacy</Typography></Button>
      <Button target="_blank" href="https://r3sgame.github.io/likewise-learn-blog/2023/07/23/tos/"><Typography variant="body2" color="inherit">TOS</Typography></Button>
    
      </Grid>
    </React.Fragment>
  )
}

function preprocessArray(arrays) {
  
    const numArrays = arrays.length;
    const arrayLength = arrays[0].length;
    const averages = new Array(arrayLength).fill(0);
  
    for (let i = 0; i < numArrays; i++) {
      for (let j = 0; j < arrayLength; j++) {
        averages[j] += arrays[i][j];
      }
    }
  
    for (let i = 0; i < arrayLength; i++) {
      averages[i] /= numArrays;
    }
  
    return averages;
}


export function Twitter() {

  const [count, setCount] = useState(0);
  const [loadState, setLoadState] = useState(0);
  const [likes, setLikes] = useState(10);
  const [text, setText] = useState("");
  const [followers, setFollowers] = useState("");
  const [mediaCount, setMediaCount] = useState("");
  const [refinedText, setRefinedText] = useState([]);
  const [sentiment, setSentiment] = useState([[{"label": "ERROR", "score": "ERROR"}]]);
  const [hate, setHate] = useState([[{"label": "ERROR", "score": "ERROR"}]]);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    KeepAPIsActive();
    const intervalId = setInterval(() => {
      KeepAPIsActive();
    }, 60000); // Interval in milliseconds (e.g., 1000ms = 1 second)

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  async function Predict() {
    setLoadState(1);
   try{
    /*let model = await tf.loadLayersModel('https://likewise-learn.web.app/models/v0.8js/model.json');
      let extraction = await axios.post('https://r3sgame.duckdns.org', {
        "key": import.meta.env.VITE_EXTRACTOR_KEY,
        "text": text
      })
      let tensor = await preprocessArray(extraction.data.data)
      console.log(tensor)
      tensor.push(parseFloat(followers), parseFloat(mediaCount))
      console.log(tensor)
      tensor = await tf.reshape(tf.cast(tensor, 'float32'), [1,770])
      const result = await model.predict(tensor).dataSync()
      setLikes(result);*/
      
      

        const sentimentResponse = await axios.post(
          "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
          {"inputs": text}
        );

        const hateResponse = await axios.post(
          "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-hate-latest",
          {"inputs": text}
        );

        setSentiment(sentimentResponse.data);
        setHate(hateResponse.data)
        setLoadState(2);

        scroller.scrollTo('firstResult', {
        duration: 100,
        delay: 100,
        smooth: true,
        offset: 50, // Scrolls to element + 50 pixels down the page
      })
   }
     catch (err) {
      console.log(err);
      }
    }

  async function RefineTweet() {
    setLoadState(3);
    let message;
    let iterations = [];

    scroller.scrollTo('secondResult', {
      duration: 100,
      delay: 100,
      smooth: true,
      offset: 50, // Scrolls to element + 50 pixels down the page
    })
    message = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
            {"role": "system", "content": "You are Likewise Learn, an AI that refines tweets to be more engaging."},
            {"role": "user", "content": `Refine the tweet below to be more engaging. Its original engagement rate was ${(likes*100).toFixed(2)}%. ONLY return the refined tweet, and keep the original goal, writing style, hashtags, and links. You can only have 280 characters AT MOST: \n \n ${text}`},
        ],
        temperature: 0.7
    })
    console.log(message)
    message = await message.choices[0].message.content


    await iterations.push({index: 0, text: message, engagement: 0.02});
    setRefinedText(iterations)
    console.log(iterations)

    for (let i = 1; i <= 2; i++) {
      message = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
              {"role": "system", "content": "You are Likewise Learn, an AI that refines tweets to be more engaging."},
              {"role": "user", "content": `Refine the tweet below to be more engaging. Its original engagement rate was ${(likes*100).toFixed(2)}%. ONLY return the refined tweet, and keep the original goal, writing style, hashtags, and links. You can only have 280 characters AT MOST: \n \n ${message}`},
          ],
          temperature: 0.7
      })

      message = message.choices[0].message.content

      iterations.push({index: iterations.length, text: message, engagement: 0.02});
      setRefinedText(iterations);
      console.log(iterations)
  }
      console.log(refinedText)

      setLoadState(4)
  }

  return (
    <React.Fragment>
      <Fade><Typography variant="h5" sx={{marginTop: '5%', marginLeft: '22.5%'}}>Rate/Refine Tweet</Typography></Fade>
      <Fade>
      <Box sx={{marginLeft: '25%'}}>
        <TextareaAutosize onChange={(e) => {setCount(e.target.value.trim().length) ; setText(e.target.value.trim())}} sx={{ width: '30%', flexDirection: 'row', overflow: 'auto'}} placeholder="What's going on? Keep it at 280 characters!" maxLength={280} minRows={7}></TextareaAutosize>
        <br/>
        {count !== 0 && <CircularProgress sx={{marginTop: 3, marginRight: 2}} variant="determinate" value={(count/280)*100} />}
        {count == 0 && <CircularProgress color="secondary" sx={{marginTop: 3, marginRight: 2}} variant="determinate" value={100} />}
        <TextField InputProps={{
          inputComponent: NumberFormatBase,
        }} onChange={(e) => setFollowers(e.target.value)} sx={{marginTop: 2.5}} id="followers" label="Follower Count" variant="outlined" />
        <TextField InputProps={{
          inputComponent: NumberFormatBase,
        }} onChange={(e) => setMediaCount(e.target.value)} sx={{marginTop: 2.5, marginLeft: 2}} id="followers" label="Media Count" variant="outlined" />
      {text != "" && followers != "" && <Button onClick={Predict} variant="outlined" sx={{height: 55, marginBottom: 3, marginLeft: 2}}><Typography variant="body1">Test Tweet</Typography></Button>}
      {(text == "" || followers == "") && <Button disabled variant="outlined" sx={{height: 55, marginBottom: 3, marginLeft: 2}}><Typography variant="body1">Test Tweet</Typography></Button>}

      </Box>
      </Fade>
    
     {loadState < 2 && <Paper variant="outlined" sx={{marginTop: 1, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '41%'}}>
        {loadState == 0 && <Fade><Typography variant="body2" sx={{textAlign: 'left'}}>Enter a tweet, and its engagement rate will be instantly predicted. Afterwards, refine it!</Typography></Fade>}
        {loadState == 1 && <CircularProgress/>}
      </Paper>}

      <Element name="firstResult">
      {loadState >= 2 && 
        <Paper variant="outlined" sx={{marginTop: 1, width: '30%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '46.5%'}}>
          {likes < 0.03 && <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Not Quite...</Typography></Fade>}
          {0.03 <= likes && likes <= 0.05 && <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Not Bad.</Typography></Fade>}
          {0.05 < likes && <Zoom><Typography variant="h5" sx={{textAlign: 'left'}}>Wow!</Typography></Zoom>}

          {likes < 0.03 && <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Your tweet wasn't very engaging.</Typography></Fade>}
          {0.03 <= likes && likes <= 0.05 && <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Your tweet was somewhat engaging.</Typography></Fade>}
          {0.05 < likes && <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Your tweet hooked your audience!</Typography></Fade>}

          <Divider sx={{marginTop: 1}}/>
          <Typography variant="h5" sx={{marginTop: 1, textAlign: 'left'}}>{(likes*100).toFixed(2)}%</Typography>
          <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>This value is the engagement rate, a ratio of likes/retweets/replies to impressions. It is predicted from week-old engagement rates of tweets with similar key words and follower/media counts.</Typography></Fade>
          <Divider sx={{marginTop: 1}}/>
          <Fade><Typography variant="h5" sx={{marginTop: 1, textAlign: 'left'}}>Advanced Metrics</Typography></Fade>
          <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Sentiment: {sentiment[0][0].label} ({(sentiment[0][0].score * 100).toFixed(2)}% Confidence)</Typography></Fade>
          <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Hate Speech: {hate[0][0].label} ({(hate[0][0].score * 100).toFixed(2)}% Confidence)</Typography></Fade>
          <Fade><Typography variant="body2" color="text.secondary" sx={{marginTop: 1, textAlign: 'left'}}>To succeed in the algorithm and attract users, your tweets should be nonviolent and factual.</Typography></Fade>
          <Divider sx={{marginTop: 1}}/>
          <Button onClick={RefineTweet} variant="outlined" sx={{height: 55, marginTop:2}}><Typography variant="body1">Refine</Typography></Button>
        </Paper>}
        </Element>

        <Element name="secondResult">
          {loadState > 2 && <React.Fragment><Paper variant="outlined" sx={{marginTop: 3, width: '30%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '46.5%'}}>
          {refinedText.map(message => (<><Divider/><Fade><Typography variant="h5" sx={{marginTop: 1, textAlign: 'left'}}>Iteration {message.index}</Typography></Fade><Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginTop: 1, marginBottom: 1}}>{message.text}</Typography></Fade></>))}
          {loadState == 3 && <React.Fragment><CircularProgress/><Typography variant="body2" color="text.secondary" sx={{marginTop: 1}}>Generating... Please Wait...</Typography></React.Fragment>}

          </Paper>
          </React.Fragment>}
          </Element>
        </React.Fragment>
  )
}

export function Mastodon() {

  const [count, setCount] = useState(0);
  const [loadState, setLoadState] = useState(0);
  const [likes, setLikes] = useState(10);
  const [text, setText] = useState("");
  const [followers, setFollowers] = useState("");
  const [mediaCount, setMediaCount] = useState("");
  const [refinedText, setRefinedText] = useState("");
    async function Predict() {
    setLoadState(1);
   try{
    let model = await tf.loadLayersModel('https://likewise-learn.web.app/models/v0.8js/model.json');
      let extraction = await axios.post('https://r3sgame.duckdns.org', {
        "key": import.meta.env.VITE_EXTRACTOR_KEY,
        "text": text
      })
      let tensor = await preprocessArray(extraction.data.data)
      console.log(tensor)
      tensor.push(parseFloat(followers), parseFloat(mediaCount))
      console.log(tensor)
      tensor = await tf.reshape(tf.cast(tensor, 'float32'), [1,770])
      const result = await model.predict(tensor).dataSync()
      setLikes(result);
      console.log(likes)
      scroller.scrollTo('firstResult', {
        duration: 100,
        delay: 100,
        smooth: true,
        offset: 50, // Scrolls to element + 50 pixels down the page
      })
      setLoadState(2);
   }
     catch (err) {
      console.log(err);
      }
    }

  function RefineTweet() {
    setLoadState(3);

    scroller.scrollTo('secondResult', {
      duration: 100,
      delay: 100,
      smooth: true,
      offset: 50, // Scrolls to element + 50 pixels down the page
    })

    axios.post('https://r3sgame.duckdns.org', {
      "key": import.meta.env.VITE_LLM_KEY,
      "text": text
    })
    .then(function (response) {
      setRefinedText(response.data.Tweet)
      console.log(refinedText)
      setLoadState(4)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <React.Fragment>
      <Fade><Typography variant="h5" sx={{marginTop: '5%', marginLeft: '22.5%'}}>Rate/Refine Toot</Typography></Fade>
      <Fade>
      <Box sx={{marginLeft: '25%'}}>
        <TextareaAutosize onChange={(e) => {setCount(e.target.value.trim().length) ; setText(e.target.value.trim())}} sx={{ width: '30%', flexDirection: 'row', overflow: 'auto'}} placeholder="What's going on? Keep it at 500 characters!" maxLength={500} minRows={7}></TextareaAutosize>
        <br/>
        {count !== 0 && <CircularProgress sx={{marginTop: 3, marginRight: 2}} variant="determinate" value={(count/500)*100} />}
        {count == 0 && <CircularProgress color="secondary" sx={{marginTop: 3, marginRight: 2}} variant="determinate" value={100} />}
        <TextField InputProps={{
          inputComponent: NumberFormatBase,
        }} onChange={(e) => setFollowers(e.target.value)} sx={{marginTop: 2.5}} id="followers" label="Follower Count" variant="outlined" />
        <TextField InputProps={{
          inputComponent: NumberFormatBase,
        }} onChange={(e) => setMediaCount(e.target.value)} sx={{marginTop: 2.5, marginLeft: 2}} id="followers" label="Media Count" variant="outlined" />
      {text != "" && followers != "" && mediaCount != "" && <Button onClick={Predict} variant="outlined" sx={{height: 55, marginBottom: 3, marginLeft: 2}}><Typography variant="body1">Test Toot</Typography></Button>}
      {(text == "" || followers == "" || mediaCount == "") && <Button disabled variant="outlined" sx={{height: 55, marginBottom: 3, marginLeft: 2}}><Typography variant="body1">Test Toot</Typography></Button>}

      </Box>
      </Fade>
    
     {loadState < 2 && <Paper variant="outlined" sx={{marginTop: 1, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '41%'}}>
        {loadState == 0 && <Fade><Typography variant="body2" sx={{textAlign: 'left'}}>Enter a toot, and its engagement rate will be instantly predicted. Afterwards, refine it!</Typography></Fade>}
        {loadState == 1 && <CircularProgress/>}
      </Paper>}

      <Element name="firstResult">
      {loadState >= 2 && 
        <Paper variant="outlined" sx={{marginTop: 1, width: '30%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '46.5%'}}>
          {likes < 0.03 && <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Not Quite...</Typography></Fade>}
          {0.03 <= likes && likes <= 0.05 && <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Not Bad.</Typography></Fade>}
          {0.05 < likes && <Zoom><Typography variant="h5" sx={{textAlign: 'left'}}>Wow!</Typography></Zoom>}

          {likes < 0.03 && <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Your toot wasn't very engaging.</Typography></Fade>}
          {0.03 <= likes && likes <= 0.05 && <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Your toot was somewhat engaging.</Typography></Fade>}
          {0.05 < likes && <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>Your toot hooked your audience!</Typography></Fade>}

          <Divider sx={{marginTop: 1}}/>
          <Typography variant="h5" sx={{marginTop: 1, textAlign: 'left'}}>{(likes*100).toFixed(2)}%</Typography>
          <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left'}}>This value is the engagement rate, a ratio of favorites/boosts/replies to impressions. It is predicted from week-old engagement rates of toots with similar key words and follower/media counts.</Typography></Fade>

          <Divider sx={{marginTop: 1}}/>
          <Button onClick={RefineTweet} variant="outlined" sx={{height: 55, marginTop:2}}><Typography variant="body1">Refine</Typography></Button>
        </Paper>}
        </Element>

        <Element name="secondResult">
          {loadState > 2 && <React.Fragment><Paper variant="outlined" sx={{marginTop: 3, width: '30%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '46.5%'}}>
          {loadState == 3 && <React.Fragment><CircularProgress/><Typography variant="body2" color="text.secondary" sx={{marginTop: 1}}>Generating... Please Wait...</Typography></React.Fragment>}
          {loadState == 4 && <React.Fragment>
            <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginTop: 1}}>{refinedText}</Typography></Fade></React.Fragment>}
          </Paper>
          </React.Fragment>}
          </Element>
        </React.Fragment>
  )
}

export function Dashboard() {
  console.log(authentication)
  return(
    <React.Fragment>
    <Fade><Typography variant="h5" sx={{marginTop: '5%', marginLeft: '22.5%'}}>Dashboard</Typography></Fade>

    <Paper variant="outlined" sx={{marginTop: 1, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '41%'}}>
        <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Nice to see you, {authentication.currentUser.displayName}!</Typography></Fade>
        <Divider/>
        <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginTop: 2}}>Which platform would you like to refine posts for?</Typography></Fade>
        <Button href="/twitter" sx={{marginBottom: 2, marginTop: 2}}><Typography color="inherit" variant="body2">Twitter</Typography></Button>
        <Button href="/mastodon" sx={{marginBottom: 2, marginTop: 2}}><Typography color="inherit" variant="body2">Mastodon</Typography></Button>
        <Divider/>
        <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginTop: 2}}>Need help? Check out some useful tips and updates.</Typography></Fade>
        <Link href="https://r3sgame.github.io/likewise-learn-blog/2023/06/15/engagementrate/"><Typography variant="body2" color="inherit" sx={{textAlign: 'left', marginTop: 1}}>Engagment Rate - The Number 1 Social Media Metric</Typography></Link>
        <Link href="https://r3sgame.github.io/likewise-learn-blog/2023/06/09/introduction/"><Typography variant="body2" color="inherit" sx={{textAlign: 'left', marginTop: 1}}>Welcome to the Likewise Learn Blog!</Typography></Link>
        <Divider sx={{marginTop: 2}}/>
        <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginTop: 1}}>Account Settings:</Typography></Fade>
        <Link href="https://billing.stripe.com/p/login/4gw29dcS3gh5fuwfYY"><Typography variant="body2" color="inherit" sx={{textAlign: 'left', marginTop: 1}}>Manage Payment Plan (For Premium Users)</Typography></Link>
      </Paper>
    </React.Fragment>
  )
}

export function Pricing() {
  console.log(authentication)
  return(
    <React.Fragment>
    <Fade><Typography variant="h5" sx={{marginTop: '5%', marginLeft: '22.5%'}}>Upgrade</Typography></Fade>

    <Paper variant="outlined" sx={{marginTop: 2, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '41%'}}>
        <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Plus</Typography></Fade>
        <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginBottom: 1}}>Take your engagement to the next level!</Typography></Fade>
        <Divider/>
        <List>
    <ListItem>
        <ListItemIcon><StarTwoTone/></ListItemIcon>
        <ListItemText>Engagement prediction model</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><ThumbUpTwoTone/></ListItemIcon>
        <ListItemText>Post refiner (200 uses per month)</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><AssessmentTwoTone/></ListItemIcon>
        <ListItemText>Sentiment/Hate-speech detection</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><FastForwardTwoTone/></ListItemIcon>
        <ListItemText>No ratelimits</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><LocalOfferTwoTone/></ListItemIcon>
        <ListItemText>$7.00/month (7-day free trial)</ListItemText>
      </ListItem>
    </List>
        <Divider/>
        <Button variant="outlined" href="/checkout" sx={{height: 55, marginTop: 2}}><Typography color="inherit" variant="body2">Upgrade</Typography></Button>
      </Paper>
    
      <Paper variant="outlined" sx={{marginTop: 2, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '41%'}}>
        <Fade><Typography variant="h5" sx={{textAlign: 'left'}}>Standard</Typography></Fade>
        <Fade><Typography variant="body2" color="text.secondary" sx={{textAlign: 'left', marginBottom: 1}}>Twitter/Mastodon engagement - for free.</Typography></Fade>
        <Divider/>
        <List>
        <ListItem>
        <ListItemIcon><StarTwoTone/></ListItemIcon>
        <ListItemText>Engagement prediction model</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon><LocalOfferTwoTone/></ListItemIcon>
        <ListItemText>Free</ListItemText>
      </ListItem>
    </List>
      </Paper>
    </React.Fragment>
  )
}

export function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const subscribe = async (email, paymentId) => {
    try {
      const response = await axios.post('http://localhost:5000/create-test-customer-and-subscription', {
        "email": email,
        "paymentId": paymentId,
      });
  
      console.log(response.data);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
    setIsLoading(false)
  };

  const handleSubmit = async (event) => {
    setIsLoading(true)
    event.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });


    if (!error) {
      subscribe(authentication.currentUser.email, paymentMethod.id);
    }
  };

  return(
    <React.Fragment>
    <Fade><Typography variant="h5" sx={{marginTop: '5%', marginLeft: '22.5%'}}>Upgrade</Typography></Fade>

    <Paper variant="outlined" sx={{marginTop: 2, width: '40%', p: 2.5, flexDirection: 'row', overflow: 'auto', marginLeft: '41%'}}>
        <CardElement options={{style: {base: {color: "#fff"}}}}/>

       {stripe && !isLoading && <Button sx={{marginTop: 1}} variant="outlined" onClick={handleSubmit}><Typography color="inherit" variant="body2">Subscribe</Typography></Button>}
       {!stripe || isLoading && <Button sx={{marginTop: 1}} variant="outlined" onClick={handleSubmit} disabled><Typography color="inherit" variant="body2">Subscribe</Typography></Button>}
       <br/>
       {isLoading && <CircularProgress sx={{marginTop: 1}}/>}
      </Paper>
    </React.Fragment>
  )
}