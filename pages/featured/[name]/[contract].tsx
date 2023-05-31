import {
  NextPage,
} from 'next'
import { Box, } from '../../../components/primitives'
import Layout from 'components/Layout'
import {useRef, } from 'react'

import { useRouter } from 'next/router'

import { NAVBAR_HEIGHT } from 'components/navbar'

import { Head } from 'components/Head'


const FeaturedPage: NextPage = () => {

  const scrollRef = useRef<HTMLDivElement | null>(null)

  const scrollToTop = () => {
    let top = (scrollRef.current?.offsetTop || 0) - (NAVBAR_HEIGHT + 16)
    window.scrollTo({ top: top })
  }
  const router = useRouter()
  const {
    query: { embed },
  } = router

  console.log(embed)


  return (
    <Layout>
      <Head />
      <Box
        css={{
          p: 24,
          height: '100%',
          '@bp800': {
            p: '$6',
          },
        }}
      >
        <div style={{ display: 'flex', height: '100vh', width: '100&' }}>
          <iframe
            src={embed+""}
            width="100%"
            height="100%"
          ></iframe>
        </div>
      </Box>
    </Layout>
  )
}


export default FeaturedPage
