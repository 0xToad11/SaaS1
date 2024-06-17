import '@/styles/globals.css';
import Head from 'next/head';
import Header from '../components/header';
import Footer from '../components/footer';

export default function App({ Component, pageProps }) {
  return (
    <>
    
      <Head>
        <title>CreatAI</title>
        <link rel="icon" href="/images/logo/LogoCreatAI1.png" />
      </Head>
      <div style={{ backgroundColor: 'black', color: 'white' }}>
      <div className='bg-gradient-to-b from-slate-900 from-70% to-slate-800 to-95%'>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
      </div>
    </>
  );
}
