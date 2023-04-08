import Head from 'next/head';
import { Vim } from '@/components/Vim';

export default function Home() {
  const onFileExport = (str: string, buf: ArrayBuffer) => {
    console.log('str', str);
    console.log('buf', buf);
  };

  return (
    <>
      <Head>
        <title>Vim Hero</title>
        <meta name="description" content="Hone your Vim skills and become a Vim Hero" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Vim
          style={{
            width: '800px',
          }}
          worker="/vim-wasm/vim.js"
          files={{
            "vim-hero": "hello",
          }}
          />
      </main>
    </>
  )
}
