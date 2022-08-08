import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Component } from 'react'
import Layout from '../components/Layout'
import ConnectButton from '../components/ConnectButton'
import { useDisclosure } from '@chakra-ui/react'
import AccountModal from '../components/AccountModal'
import Currency from '../components/Currency'

function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const title = 'Nest-React-NextJs-ExpressJS-Mongoose-Redis-Etherium-Metamask'
  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/mbaglieri/react-nestjs-docker">{title}</a>
        </h1>

        <p className={styles.description}>
          A complete example integrating front-end / backend / metamask. 
        </p>

        {
        // Our connect button will only handle opening
        }
        <ConnectButton handleOpenModal={onOpen} />
        {
        // Our Account modal will handle open state & closing
        }
        <AccountModal isOpen={isOpen} onClose={onClose} />
        <Currency />
      </main>

      <footer className={styles.footer}>
        Powered by{' '}
        <img className={styles.logo} src="/logos/ethereum.png" alt="Ethereum Logo" width="144" height="32" />
        <img className={styles.logo} src="/logos/nextjs.png" alt="NextJS Logo" width="64" height="32" />
        <img className={styles.logo} src="/logos/metamask.png" alt="MetaMask Logo" width="128" height="32" />
        <img className={styles.logo} src="/logos/nestjs.png" alt="Nest" width="128" height="32" />
        <img className={styles.logo} src="/logos/mongo.png" alt="Mongo" width="128" height="32" />
      </footer>
    </Layout>
  )
}

export default Home
