/* eslint-disable @next/next/no-document-import-in-page */
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { Helmet } from 'react-helmet';

// Via https://github.com/vercel/next.js/blob/canary/examples/with-react-helmet/pages/_document.js

export default class MyDocument extends Document {
  static async getInitialProps(...args) {
    const documentProps = await super.getInitialProps(...args);
    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it
    return { ...documentProps, helmet: Helmet.renderStatic() };
  }

  // should render on <html>
  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent();
  }

  // should render on <body>
  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent();
  }

  // should render on <head>
  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map((el) => this.props.helmet[el].toComponent());
  }

  render() {
    return (
      <Html {...this.helmetHtmlAttrComponents}>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@200;300;400;500;600;700;900&display=swap"
            rel="stylesheet"
          />
          {this.helmetHeadComponents}
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
