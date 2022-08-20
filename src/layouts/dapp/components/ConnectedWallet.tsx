import {
  Button,
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { DataSourceContext } from 'providers/blockchain/provider';
import { useFetch } from 'hooks';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useCallback } from 'react';
import { useState } from 'react';

export function ConnectedWallet() {
  const { state } = useContext(DataSourceContext);
  const { erc423, utils } = state.datasource!;

  const getAccount = useCallback(async () => {
    const agent = await utils.currentAccount();
    return await erc423.accountOf(agent);
  }, [erc423, utils]);

  const { data: account, loading: loadingAccount } = useFetch(getAccount());

  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const label = copiedToClipboard ? 'Copied!' : 'Copy to Clipboard';

  const handleCopy = useCallback(() => {
    setTimeout(() => setCopiedToClipboard(false), 3000);
    setCopiedToClipboard(true);
  }, [setCopiedToClipboard]);

  if (loadingAccount) {
    return (
      <Button>
        <Spinner />
      </Button>
    );
  }
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button>{processAddress(account!)}</Button>
        </PopoverTrigger>
        <PopoverContent cursor={`pointer`} maxWidth={180}>
          <PopoverArrow />
          <CopyToClipboard text={account!} onCopy={handleCopy}>
            <PopoverBody>
              <Center>{label}</Center>
            </PopoverBody>
          </CopyToClipboard>
        </PopoverContent>
      </Popover>
    </>
  );
}

function processAddress(address: string): string {
  return `${address.slice(0, 7)}...${address.slice(37)}`;
}
