import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@mantine/core/styles.css';
import './index.css'
import { MantineProvider, createTheme } from '@mantine/core';

const theme  = createTheme({
  primaryShade: {light: 5, dark: 8},
  primaryColor: 'orange',
  fontFamily: 'Roboto',
  headings: {
    fontFamily: 'Roboto',
  },
  components: { "badge" :{
    
  } },
})


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
