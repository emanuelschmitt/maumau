import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

    body {
        margin: 0;
        padding: 0;
        font-family: 'Lato', sans-serif;
        font-size: 16px;
    }

    button:focus {
        outline: 1px solid lightblue;
        outline-offset: 4px;
    }
`;
