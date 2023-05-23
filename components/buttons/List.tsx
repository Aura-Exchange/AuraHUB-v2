import { Currency, ListModal, ListStep, useTokens } from '@reservoir0x/reservoir-kit-ui';
import { Button } from 'components/primitives';
import {
  cloneElement,
  ComponentProps,
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  useContext,
} from 'react';
import { CSS } from '@stitches/react';
import { SWRResponse } from 'swr';
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ToastContext } from 'context/ToastContextProvider';
import { useMarketplaceChain } from 'hooks';
import va from '@vercel/analytics';

type ListingCurrencies = ComponentPropsWithoutRef<
  typeof ListModal
>['currencies'];

type Props = {
  token?: ReturnType<typeof useTokens>['data'][0];
  buttonCss?: CSS;
  buttonChildren?: ReactNode;
  buttonProps?: ComponentProps<typeof Button>;
  mutate?: SWRResponse['mutate'];
};

const List: FC<Props> = ({
  token,
  buttonCss,
  buttonChildren,
  buttonProps,
  mutate,
}) => {
  const { isDisconnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { addToast } = useContext(ToastContext);

  const marketplaceChain = useMarketplaceChain();
  const { switchNetworkAsync } = useSwitchNetwork({
    chainId: marketplaceChain.id,
  });

  const { data: signer } = useSigner();
  const { chain: activeChain } = useNetwork();

  const isInTheWrongNetwork = Boolean(
    signer && marketplaceChain.id !== activeChain?.id
  );

  let listingCurrencies: ListingCurrencies = undefined;

  const ethCurrencies:Currency[] | undefined = [
    {
      contract: '0x0000000000000000000000000000000000000000',
      symbol: activeChain?.nativeCurrency.name+"",
    },
    {
      contract: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
      symbol: 'PEPE',
      decimals: 18
    },
    {
      contract: '0xda9f05a3e133c2907e7173495022a936a3808d45',
      symbol: 'NELK',
      decimals: 18
    },
  ]

  const polyCurrencies:Currency[] | undefined = [
    {
      contract: '0x0000000000000000000000000000000000001010',
      symbol: activeChain?.nativeCurrency.name+"",
    },
  ]

  let currencyList;
  if(activeChain?.id == 137){
    currencyList = polyCurrencies
  }
  else{
    currencyList = ethCurrencies
  }
  

  const tokenId = token?.token?.tokenId;
  const contract = token?.token?.contract;

  const trigger = (
    <Button css={buttonCss} color="primary" {...buttonProps}>
      {buttonChildren}
    </Button>
  );

  const handleClick = async () => {
    va.track('List Token');
    if (switchNetworkAsync && activeChain) {
      const chain = await switchNetworkAsync(marketplaceChain.id);
      if (chain.id !== marketplaceChain.id) {
        return false;
      }
    }

    if (!signer) {
      openConnectModal?.();
    }
  };

  if (isDisconnected || isInTheWrongNetwork) {
    return cloneElement(trigger, {
      onClick: handleClick,
    });
  } else
    return (
      <ListModal
        trigger={cloneElement(trigger, {
          onClick: () => {
            va.track('List Token');
          },
        })}
        collectionId={contract}
        tokenId={tokenId}
        currencies={currencyList}
        onClose={(data, stepData, currentStep) => {
          if (mutate && currentStep == ListStep.Complete) mutate();
        }}
        onListingError={(err: any) => {
          if (err?.code === 4001) {
            addToast?.({
              title: 'User canceled transaction',
              description: 'You have canceled the transaction.',
            });
            return;
          }
          addToast?.({
            title: 'Could not list token',
            description: 'The transaction was not completed.',
          });
        }}
      />
    );
};

export default List;
