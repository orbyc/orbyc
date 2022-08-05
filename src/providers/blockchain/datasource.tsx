import { ethers } from 'ethers';
import { Asset, Certificate, Movement } from 'orbyc-core/pb/domain_pb';
import { AccountMetadata } from 'orbyc-core/pb/metadata_pb';

import ERC245 from 'orbyc-contracts/artifacts/contracts/tokens/ERC245/IERC245.sol/IERC245.json';
import ERC423 from 'orbyc-contracts/artifacts/contracts/security/ERC423/IERC423.sol/IERC423.json';
import { decodeHex } from 'orbyc-core/utils/encoding';

export interface DataSource {
  erc245: {
    getAsset: (id: number) => Promise<Asset>;
    getAssetComposition: (id: number) => Promise<[number[], number[]]>;
    getAssetCertificates: (id: number) => Promise<number[]>;
    getAssetTraceability: (id: number) => Promise<number[]>;
    getCertificate: (id: number) => Promise<Certificate>;
    getMovement: (id: number) => Promise<Movement>;
    getMovementCertificates: (id: number) => Promise<number[]>;
  };
  erc423: {
    currentAccount: () => Promise<string>;

    accountOf: (address: string) => Promise<string>;
    accountInfo: (address: string) => Promise<AccountMetadata>;
    hasRole: (address: string, role: number) => Promise<boolean>;
  };
}

/* ETHERS.JS Provider */

export function EthersDataSource(
  provider: ethers.providers.Web3Provider,
  address: string
): DataSource {
  const ERC245Contract = new ethers.Contract(address, ERC245.abi, provider);
  const ERC423Contract = new ethers.Contract(address, ERC423.abi, provider);

  return {
    erc245: {
      getAsset: async (id) => {
        const [owner, issuer, co2e, certId, metadata] = await ERC245Contract.assetInfo(id);

        const asset = new Asset();
        asset.setCertid(certId);
        asset.setCo2e(co2e);
        asset.setId(id);
        asset.setIssuer(issuer);
        asset.setMetadata(metadata);
        asset.setOwner(owner);

        return asset;
      },
      getAssetCertificates: (id) => ERC245Contract.assetCertificates(id),
      getAssetComposition: (id) => ERC245Contract.assetComposition(id),
      getAssetTraceability: (id) => ERC245Contract.assetTraceability(id),
      getCertificate: async (id) => {
        const [issuer, metadata] = await ERC245Contract.certificateInfo(id);

        const certificate = new Certificate();
        certificate.setIssuer(issuer);
        certificate.setMetadata(metadata);
        certificate.setId(id);

        return certificate;
      },
      getMovement: async (id) => {
        const [issuer, co2e, certId, metadata] = ERC245Contract.movementInfo(id);

        const movement = new Movement();
        movement.setCertid(certId);
        movement.setCo2e(co2e);
        movement.setId(id);
        movement.setIssuer(issuer);
        movement.setMetadata(metadata);

        return movement;
      },
      getMovementCertificates: (id) => ERC245Contract.movementCertificates(id),
    },
    erc423: {
      currentAccount: async () => {
        const signer = provider.getSigner();
        return await signer.getAddress();
      },

      accountInfo: async (address) => {
        const metadata = await ERC423Contract.accountInfo(address);

        return AccountMetadata.deserializeBinary(decodeHex(metadata));
      },

      accountOf: (address) => ERC423Contract.accountOf(address),
      hasRole: async (address, role) => ERC423Contract.hasRole(address, role),
    },
  };
}
