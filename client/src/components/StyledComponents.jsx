import styled, { createGlobalStyle } from 'styled-components';
import { motion } from 'framer-motion';
import defaultBg from '../assets/images/default_bg.jpg';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'CustomFont';
    src: url('./assets/fonts/BOGLEBLACK.OTF') format('OTF');
    font-weight: normal;
    font-style: normal;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;




const LoginOptions = styled.div`
  flex: 3;
  display: flex;
  gap: 0;
  background-image: url(${defaultBg});
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease;
`;

const LoginOption = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease, opacity 0.5s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:last-of-type {
    border-right: none;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Icon = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

const Button = styled(motion.button)`
  padding: 15px 30px;
  font-size: 1rem;
  font-family: 'CustomFont', sans-serif;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #0056b3;
    transform: scale(1.1);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.9);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonText = styled.div`
  font-family: 'CustomFont', sans-serif;
  font-size: 1.5rem;
  color: transparent;
  background-color: 	#ffc220;
  background-clip: text;
  -webkit-background-clip: text;
  transition: text-shadow 0.3s ease, transform 0.3s ease;
  position: relative;
`;

export { GlobalStyle, Container, ButtonText, LoginOptions, LoginOption, Icon, Button };
