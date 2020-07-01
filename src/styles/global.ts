import { createGlobalStyle } from 'styled-components';

import gitBG from '../assets/bg-git.svg'

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: #F0F0F5 url(${gitBG}) no-repeat 70% top;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 16px Roboto, sans-serif;
  }
  button{
    cursor: pointer;
  }

  #root{
    max-width: 960px;
    margin: auto;
    padding: 40px 20px;
  }
`