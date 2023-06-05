import { NextPage } from 'next'
import { Text, Flex, Box } from 'components/primitives'
import Layout from 'components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'

const Founders: NextPage = () => {
    return (
        <Layout>
            <Flex
                direction="column"
                align="center"
                css={{ py: '200px', px: '$3', textAlign: 'center' }}
            >
                <iframe
                    src="https://founders-portal-t3r9.vercel.app/"
                    width="1920px"
                    height="1080px"
                    style={{ overflow: 'hidden' }}
                ></iframe>
            </Flex>
        </Layout>
    )
}

export default Founders
