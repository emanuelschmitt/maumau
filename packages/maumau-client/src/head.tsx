import React from 'react';
import Helmet from 'react-helmet';

function Head() {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>maumau24.de - Mau-Mau online spielen</title>
      <meta name="author" content="maumau24.de"></meta>
      <meta name="description" content="Mau-Mau online kostenfrei spielen." />
      <meta
        name="keywords"
        content="maumau, spiel, mau-mau spiel, maumau online, online, gratis, kostenlos, crazy eights, mau-mau"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Helmet>
  );
}

export default Head;
