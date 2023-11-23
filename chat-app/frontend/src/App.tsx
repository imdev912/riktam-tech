import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import ErrorPage from './pages/ErrorPage';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './context/ChatProvider';
import './App.css';


const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ChakraProvider>
        <BrowserRouter>
          <ChatProvider>
            <div className="App">
              <Routes>
                <Route
                  path="/"
                  element={<HomePage />}
                  errorElement={<ErrorPage />}
                />

                <Route
                  path="/chat"
                  element={<ChatPage />}
                />
              </Routes>
            </div>
          </ChatProvider>
        </BrowserRouter>
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default App;
