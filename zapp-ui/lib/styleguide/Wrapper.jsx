import React from 'react';
import ThemeProvider from '../../src/theme/ThemeProvider';
import Theme from '../../src/theme/Theme';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
`;

const Wrapper = ({ children }) => {
    return (
        <>
        <GlobalStyles />
        <ThemeProvider theme={ Theme }>
            { children }
        </ThemeProvider>
        </>
    );
};
export default Wrapper;
