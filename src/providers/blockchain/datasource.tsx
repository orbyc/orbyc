import { ethers } from "ethers";
import { Asset, Certificate, Movement } from "orbyc-core/pb/domain_pb";
import { AccountMetadata } from "orbyc-core/pb/metadata_pb";

import ERC245 from "orbyc-contracts/artifacts/contracts/tokens/ERC245/IERC245.sol/IERC245.json";
import ERC423 from "orbyc-contracts/artifacts/contracts/security/ERC423/IERC423.sol/IERC423.json";
import { decodeHex } from "orbyc-core/utils/encoding";

export interface DataSource {
  erc245: {
    getAsset: (id: number) => Promise<Asset>;
    getAssetComposition: (id: number) => Promise<[number[], number[]]>;
    getAssetCertificates: (id: number) => Promise<number[]>;
    getAssetTraceability: (id: number) => Promise<number[]>;
    getCertificate: (id: number) => Promise<Certificate>;
    getMovement: (id: number) => Promise<Movement>;
    getMovementCertificates: (id: number) => Promise<number[]>;

    issueAsset: (asset: Asset) => Promise<boolean>;
    issueCertificate: (cert: Certificate) => Promise<boolean>;
    issueMovement: (move: Movement) => Promise<boolean>;

    addAssetCertificates: (
      assetId: number,
      certificates: number[]
    ) => Promise<boolean>;
    addMovementCertificates: (
      moveId: number,
      certificates: number[]
    ) => Promise<boolean>;
    addMovements: (assetId: number, movements: number[]) => Promise<boolean>;
    addParents: (
      assetId: number,
      parents: number[],
      composition: number[]
    ) => Promise<boolean>;
  };
  erc423: {
    accountOf: (address: string) => Promise<string>;
    accountInfo: (address: string) => Promise<AccountMetadata>;
    hasRole: (address: string, role: number) => Promise<boolean>;
  };
  utils: {
    currentAccount: () => Promise<string>;
  };
}

/* ETHERS.JS Provider */

export function EthersDataSource(
  provider: ethers.providers.Provider,
  address: string
): DataSource {
  const ERC245Contract = new ethers.Contract(address, ERC245.abi, provider);
  const ERC423Contract = new ethers.Contract(address, ERC423.abi, provider);

  const getSigner = (provider: ethers.providers.Provider) =>
    (provider as ethers.providers.Web3Provider).getSigner();

  return {
    erc245: {
      getAsset: async (id) => {
        const [owner, issuer, co2e, certId, metadata] =
          await ERC245Contract.assetInfo(id);
        const asset = new Asset();
        asset.setId(id);
        asset.setCertid(certId);
        asset.setCo2e(co2e);
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
        certificate.setId(id);
        certificate.setIssuer(issuer);
        certificate.setMetadata(metadata);
        return certificate;
      },
      getMovement: async (id) => {
        const [issuer, co2e, certId, metadata] =
          await ERC245Contract.movementInfo(id);
        const movement = new Movement();
        movement.setId(id);
        movement.setCertid(certId);
        movement.setCo2e(co2e);
        movement.setIssuer(issuer);
        movement.setMetadata(metadata);
        return movement;
      },
      getMovementCertificates: (id) => ERC245Contract.movementCertificates(id),

      /*  Mutations */
      issueAsset: async (asset) =>
        await ERC245Contract.connect(getSigner(provider)).issueAsset(
          asset.getId(),
          asset.getOwner(),
          asset.getCo2e(),
          asset.getCertid(),
          asset.getMetadata()
        ),

      issueCertificate: async (cert) =>
        await ERC245Contract.connect(getSigner(provider)).issueCertificate(
          cert.getId(),
          cert.getMetadata()
        ),

      issueMovement: async (move) =>
        await ERC245Contract.connect(getSigner(provider)).issueMovement(
          move.getId(),
          move.getCo2e(),
          move.getCertid(),
          move.getMetadata()
        ),

      addAssetCertificates: async (assetId, certificates) =>
        await ERC245Contract.connect(getSigner(provider)).addAssetCertificates(
          assetId,
          certificates
        ),

      addMovementCertificates: async (moveId, certificates) =>
        await ERC245Contract.connect(
          getSigner(provider)
        ).addMovementCertificates(moveId, certificates),

      addMovements: async (assetId, movements) =>
        await ERC245Contract.connect(getSigner(provider)).addMovements(
          assetId,
          movements
        ),

      addParents: async (assetId, parents, composition) =>
        await ERC245Contract.connect(getSigner(provider)).addParents(
          assetId,
          parents,
          composition
        ),
    },
    erc423: {
      accountInfo: async (address) => {
        const metadata = await ERC423Contract.accountInfo(address);
        return AccountMetadata.deserializeBinary(decodeHex(metadata));
      },
      accountOf: async (address) => ERC423Contract.accountOf(address),
      hasRole: async (address, role) => ERC423Contract.hasRole(address, role),
    },
    utils: {
      currentAccount: async () => {
        const signer = getSigner(provider);
        return await signer.getAddress();
      },
    },
  };
}
