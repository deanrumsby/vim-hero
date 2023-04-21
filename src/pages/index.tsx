import Head from 'next/head';
import { useRef } from 'react';
import { Vim } from '@/components/Vim';

export default function Home() {
  const keyStrokes = useRef<KeyboardEvent[]>([]);

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
          onKeyDown={(e) => {
            keyStrokes.current.push(e);
            console.log(keyStrokes.current);
          }}
          onVimExit={() => console.log('exit')}
          />
      </main>
    </>
  )
}
