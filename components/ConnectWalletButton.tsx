import { ConnectButton } from '@rainbow-me/rainbowkit'
import Box from 'components/primitives/Box'
import Button from 'components/primitives/Button'
import { FC } from 'react'
import va from '@vercel/analytics'

type Props = {}

export const ConnectWalletButton: FC<Props> = () => {

  const trackClick = () =>{
    va.track('Connect Wallet')
  }
  
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        return (
          <Box
            style={{
              flex: '1',
              display: 'flex',
              justifyContent: 'flex',
            }}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                return (
                  <Button
                    css={{ flex: 1, justifyContent: 'center'}}
                    corners="rounded"
                    onClick={openConnectModal}
                    onClickCapture={trackClick}
                    type="button"
                  >
                    Connect Wallet
                  </Button>
                )
              }
            })()}
          </Box>
        )
      }}
    </ConnectButton.Custom>
  )
}
