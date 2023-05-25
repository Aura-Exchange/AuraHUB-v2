import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import {
  ComponentPropsWithoutRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useMediaQuery } from 'react-responsive'
import { useMarketplaceChain, useMounted } from 'hooks'
import { paths } from '@reservoir0x/reservoir-sdk'
import { useCollections } from '@reservoir0x/reservoir-kit-ui'
import fetcher from 'utils/fetcher'
import { NORMALIZE_ROYALTIES } from '../_app'
import supportedChains from 'utils/chains'
import { CollectionRankingsTable } from 'components/rankings/CollectionRankingsTable'
import { useIntersectionObserver } from 'usehooks-ts'
import LoadingSpinner from 'components/common/LoadingSpinner'
import CollectionsTimeDropdown, {
  CollectionsSortingOption,
} from 'components/common/CollectionsTimeDropdown'
import ChainToggle from 'components/common/ChainToggle'
import { Head } from 'components/Head'
import { ChainContext } from 'context/ChainContextProvider'
import { useRouter } from 'next/router'
import Slider from "react-slick";
import Image from 'next/image'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from 'next/link'

import { getDatabase, ref, set, push, child, get, remove } from "firebase/database";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

type Props = InferGetStaticPropsType<typeof getStaticProps>

interface fireBaseProject {
  name: string | null,
  iconURL: string,
  contractAddress: string,
  chain: string,
  embedURL: string
}

const IndexPage: NextPage<Props> = ({ ssr }) => {
  const router = useRouter()
  const isSSR = typeof window === 'undefined'
  const isMounted = useMounted()
  const compactToggleNames = useMediaQuery({ query: '(max-width: 800px)' })
  const [sortByTime, setSortByTime] =
    useState<CollectionsSortingOption>('1DayVolume')
  const marketplaceChain = useMarketplaceChain()

  let collectionQuery: Parameters<typeof useCollections>['0'] = {
    limit: 20,
    sortBy: sortByTime,
    includeTopBid: true,
  }

  const { chain, switchCurrentChain } = useContext(ChainContext)
  const [featuredProjects, setFeaturedProjects] = useState<fireBaseProject[]>([])

  useEffect(() => {
    if (router.query.chain) {
      let chainIndex: number | undefined
      for (let i = 0; i < supportedChains.length; i++) {
        if (supportedChains[i].routePrefix == router.query.chain) {
          chainIndex = supportedChains[i].id
        }
      }
      if (chainIndex !== -1 && chainIndex) {
        switchCurrentChain(chainIndex)
      }
    }
  }, [router.query])

  if (chain.collectionSetId) {
    collectionQuery.collectionsSetId = chain.collectionSetId
  } else if (chain.community) {
    collectionQuery.community = chain.community
  }

  const { data, fetchNextPage, isFetchingPage, isValidating } = useCollections(
    collectionQuery,
    {
      fallbackData: [ssr.collections[marketplaceChain.id]],
    }
  )

  let collections = data || []

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const getProjectList = async () => {
    const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId:process.env.FIREBASE_PROJECT_ID,
    storageBucket:process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const dbref = ref(db)


    get(child(dbref, 'Projects')).then((snapshot) => {
      if (snapshot.exists()) {
        const projects: fireBaseProject[] = [];
        snapshot.forEach((childSnapshot) => {
          const projectName = childSnapshot.key;
          const projectData = childSnapshot.val();

          // Create a new fireBaseProject object and add it to the projects array
          const newProject: fireBaseProject = {
            name: projectName,
            iconURL: projectData.ICON,
            contractAddress: projectData.CONTRACT_ADDRESS,
            chain: projectData.CHAIN,
            embedURL: projectData.EMBED,
          };
          projects.push(newProject)
        })
        setFeaturedProjects(projects)
      }
    })
  }

  useEffect(() => {
    let isVisible = !!loadMoreObserver?.isIntersecting
    
    getProjectList()
    if (isVisible) {
      fetchNextPage()

    }
  }, [loadMoreObserver?.isIntersecting])

  let volumeKey: ComponentPropsWithoutRef<
    typeof CollectionRankingsTable
  >['volumeKey'] = 'allTime'

  switch (sortByTime) {
    case '1DayVolume':
      volumeKey = '1day'
      break
    case '7DayVolume':
      volumeKey = '7day'
      break
    case '30DayVolume':
      volumeKey = '30day'
      break
  }

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
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Text style="h4" as="h4"> Featured Collections</Text>
          <Slider {...settings}>
            {featuredProjects.map((project) => (
              <div key={project.name} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
              <div style={{ display: 'flex', backgroundColor: 'white', justifyContent: 'center', width: '100%', paddingTop: '20%', position: 'relative',objectFit:"cover",objectPosition:"center" }}>
                <Image
                  src={project.iconURL}
                  // src = '/Tree.png'
                  alt={project.name + ' icon'}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                />
              </div>
                <div style={{ display: 'flex', width: '100%', position:'sticky' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%', }}>

                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', paddingTop:'2.3%'}}>
                      <Text style='h4'>{project.name}</Text>
                    </div>

                    <div style={{width:"300vw"}}> 
                      {/* Empty Space */}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop:'1%' }}>
                      <Link
                        href={{
                          pathname: `/featured/${project.name}/${project.contractAddress}`,
                          query: { embed: project.embedURL }
                        }}
                        style={{ display: 'inline-block', minWidth: 0, marginBottom: 24 }}
                      >
                        <button style={{ borderRadius: '50em', backgroundColor: '#202425', fontSize: '1.5em', padding: '20px' }}>
                          Mint Here
                        </button>
                      </Link>
                    </div>

                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>

        <Flex css={{ my: '$6', gap: 65 }} direction="column">
          <Flex
            justify="between"
            align="start"
            css={{
              flexDirection: 'column',
              gap: 24,
              '@bp800': {
                alignItems: 'center',
                flexDirection: 'row',
              },
            }}
          >

            <Text style="h4" as="h4">
              Collection Rankings
            </Text>
            <Flex align="center" css={{ gap: '$4' }}>
              <CollectionsTimeDropdown
                compact={compactToggleNames && isMounted}
                option={sortByTime}
                onOptionSelected={(option) => {
                  setSortByTime(option)
                }}
              />
              <ChainToggle />
            </Flex>
          </Flex>
          {isSSR || !isMounted ? null : (
            <CollectionRankingsTable
              collections={collections}
              volumeKey={volumeKey}
              loading={isValidating}
            />
          )}
          <Box
            ref={loadMoreRef}
            css={{
              display: isFetchingPage ? 'none' : 'block',
            }}
          ></Box>
        </Flex>
        {(isFetchingPage || isValidating) && (
          <Flex align="center" justify="center" css={{ py: '$4' }}>
            <LoadingSpinner />
          </Flex>
        )}
      </Box>
    </Layout>
  )
}

type CollectionSchema =
  paths['/collections/v5']['get']['responses']['200']['schema']
type ChainCollections = Record<string, CollectionSchema>

export const getStaticProps: GetStaticProps<{
  ssr: {
    collections: ChainCollections
  }
}> = async () => {

  const collectionQuery: paths['/collections/v5']['get']['parameters']['query'] =
  {
    sortBy: '1DayVolume',
    normalizeRoyalties: NORMALIZE_ROYALTIES,
    limit: 20,
    includeTopBid: true,
  }

  const promises: ReturnType<typeof fetcher>[] = []
  supportedChains.forEach((chain) => {
    const query = { ...collectionQuery }
    if (chain.collectionSetId) {
      query.collectionsSetId = chain.collectionSetId
    } else if (chain.community) {
      query.community = chain.community
    }
    promises.push(
      fetcher(`${chain.reservoirBaseUrl}/collections/v5`, query, {
        headers: {
          'x-api-key': chain.apiKey || '',
        },
      })
    )
  })
  const responses = await Promise.allSettled(promises)
  const collections: ChainCollections = {}
  responses.forEach((response, i) => {
    if (response.status === 'fulfilled') {
      collections[supportedChains[i].id] = response.value.data
    }
  })

  return {
    props: { ssr: { collections }},
    revalidate: 5,
  }
}
export default IndexPage

