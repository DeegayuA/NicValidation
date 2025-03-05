import { Html, Head, Main, NextScript } from 'next/document';
import Script from "next/script";

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateInit"
          strategy="afterInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
