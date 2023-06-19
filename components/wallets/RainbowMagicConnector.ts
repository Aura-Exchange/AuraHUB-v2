// RainbowMagicConnector.ts

import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector';

export const rainbowMagicConnector = ({ chains }: any) => ({
  id: 'magic',
  name: 'Magic',
  iconUrl: 'https://svgshare.com/i/iJK.svg',
  iconBackground: '',
  createConnector: () => {
    const connector = new MagicConnectConnector({
      chains: chains,
      options: {
        apiKey: 'pk_live_F73AA70C179329DB',
        magicSdkConfiguration: {
          network: {
            rpcUrl: 'https://ethereum.rpc.thirdweb.com', // your ethereum, polygon, or optimism mainnet/testnet rpc URL
            chainId: 1,
          },
        },
        //...Other options (check out full API below)
      },
    });
    return {
      connector,
    };
  },
});