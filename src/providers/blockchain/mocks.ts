import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { Asset, Certificate, Movement } from "orbyc-core/pb/domain_pb";
import { AccountMetadata, AssetMetadata, CertificateMetadata, Image, Link, Location, MovementMetadata } from "orbyc-core/pb/metadata_pb";
import { encodeHex } from "orbyc-core/utils/encoding";
import { DataSource } from "./datasource";

/*
    MOCK DATA SOURCE
*/

export interface ERC245Collection {
    assets: { [id: number]: Asset }
    assetCertificates: { [id: number]: number[] }
    certificates: { [id: number]: Certificate }
    movements: { [id: number]: Movement }
    movementCertificates: { [id: number]: number[] }
    parents: { [id: number]: number[] }
    compositions: { [id: number]: number[] }
    traceabilities: { [id: number]: number[] }

}
export interface ERC423Collection {
    accounts: { [address: string]: AccountMetadata }
    agents: { [address: string]: string }
    roles: { [role: number]: string[] }
}


export function mockDataSource(erc245: ERC245Collection, erc423: ERC423Collection, timeout: number = 1000): DataSource {
    return {
        erc245: {
            /* getters */
            getAsset: (id) => {
                return new Promise(resolve => setTimeout(() => resolve(erc245.assets[id]), timeout))
            },
            getAssetCertificates: (id) => {
                return new Promise(resolve => setTimeout(() => resolve(erc245.assetCertificates[id]), timeout))
            },
            getAssetComposition: (id) => {
                return new Promise(resolve => setTimeout(() => resolve([erc245.parents[id], erc245.compositions[id]]), timeout))
            },
            getAssetTraceability: (id) => {
                return new Promise(resolve => setTimeout(() => resolve(erc245.traceabilities[id]), timeout))
            },
            getCertificate: (id) => {
                return new Promise(resolve => setTimeout(() => resolve(erc245.certificates[id]), timeout))
            },
            getMovement: (id) => {
                return new Promise(resolve => setTimeout(() => resolve(erc245.movements[id]), timeout))
            },
            getMovementCertificates: (id) => {
                return new Promise(resolve => setTimeout(() => resolve(erc245.movementCertificates[id]), timeout))
            },
        },
        erc423: {
            accountInfo: (address) => Promise.resolve(erc423.accounts[address]),
            accountOf: (address) => Promise.resolve(erc423.agents[address]),
            hasRole: (address, role) => Promise.resolve(erc423.roles[role].includes(address)),
        },
        utils: {
            currentAccount: () => Promise.resolve("0x024269e2057b904d1fa6a7b52056a8580a85180f"),
        }
    }
}

/*
    MOCK DATA GENERATORS
*/
export function getMockAsset() {
    var assetMetadata = new AssetMetadata()
    assetMetadata.setCreation(getMockLocation("HAVANA", "CU", "Fri Jul 02 2021", "22.7527022", "-81.8880248"))
    assetMetadata.setBackground(getMockImage("TestAssetMetadataBackground Name", "https://picsum.photos/500/200/?blur"))
    assetMetadata.setDescription("Test Asset Metadata Description")
    assetMetadata.setHeader("Test Asset Metadata Header")

    assetMetadata.setImagesList([
        getMockImage("Image1", "https://picsum.photos/500/500"),
        getMockImage("Image2", "https://picsum.photos/500/500"),
        getMockImage("Image3", "https://picsum.photos/500/500"),
        getMockImage("Image4", "https://picsum.photos/500/500"),
    ])

    assetMetadata.setLinksList([
        getMockLink("", "Link1", ""),
        getMockLink("", "Link2", ""),
        getMockLink("", "Link3", ""),
        getMockLink("", "Link4", ""),
    ])
    assetMetadata.setName("Asset Name")
    assetMetadata.setPropertiesList([])

    var asset = new Asset()
    asset.setCertid(1000)
    asset.setCo2e(2500)
    asset.setId(1)
    asset.setIssuer("0x024269E2057b904d1Fa6a7B52056A8580a85180F")
    asset.setOwner("0xdE93B2D1D277e5cD874312F653Ccf0793c363081")
    asset.setMetadata(encodeHex(assetMetadata.serializeBinary()))

    return asset
}

export function getMockMovement(id: number) {
    var movementMetadata = new MovementMetadata()
    movementMetadata.setType(0)
    movementMetadata.setFrom(getMockLocation("HAV", "CU", "Jan 21 2018", "", ""))
    movementMetadata.setTo(getMockLocation("HAV", "CU", "Jan 22 2018", "", ""))

    var movement = new Movement()
    movement.setCertid(1)
    movement.setCo2e(200)
    movement.setId(id)
    movement.setIssuer("0x024269E2057b904d1Fa6a7B52056A8580a85180F")
    movement.setMetadata(encodeHex(movementMetadata.serializeBinary()))

    return movement
}

export function getMockCertificate(id: number): Certificate {
    const metadata = new CertificateMetadata()
    metadata.setAttachment("attachment")
    metadata.setDate(new Timestamp().setSeconds(new Date().getUTCSeconds()))
    metadata.setUrl("url")

    const certificate = new Certificate()
    certificate.setId(id)
    certificate.setIssuer("0x024269E2057b904d1Fa6a7B52056A8580a85180F")
    certificate.setMetadata(encodeHex(metadata.serializeBinary()))

    return certificate
}

export function getMockImage(name: string, url: string): Image {
    var image = new Image()
    image.setAttachment(url)
    image.setName(name)
    return image
}

export function getMockLink(icon: string, name: string, url: string): Link {
    var link = new Link()
    link.setIcon(icon)
    link.setName(name)
    link.setUrl(url)
    return link
}

export function getMockTimestamp(date: string): Timestamp {
    return new Timestamp()
        .setSeconds(Date.parse(date))
}

export function getMockLocation(city: string, country: string, start: string, lat: string, lng: string): Location {
    var location = new Location()
    location.setCountry(country)
    location.setDate(getMockTimestamp(start))
    location.setLat(lat)
    location.setLng(lng)
    location.setLocation(city)
    return location
}

export function getMockAccount(): AccountMetadata {
    var account = new AccountMetadata()
    account.setDescription("Trans Circular account metadata")
    account.setLinksList([])
    account.setLogo(getMockImage("", ""))
    account.setName("Orbyc CO.")
    return account
}

/* MOCKS */

export const mockERC245: ERC245Collection = {
    assets: { 1: getMockAsset() },
    assetCertificates: { 1: [1, 2, 3] },
    compositions: { 1: [] },
    parents: { 1: [] },
    traceabilities: { 1: [1, 2] },

    certificates: { 1: getMockCertificate(1), 2: getMockCertificate(2), 3: getMockCertificate(3) },

    movements: {
        1: getMockMovement(1),
        2: getMockMovement(2),
    },
    movementCertificates: {},
};

export const mockERC423: ERC423Collection = {
    accounts: {
        "0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F": getMockAccount(),
    },
    agents: {
        "0x024269e2057b904d1fa6a7b52056a8580a85180f": "0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F",
        "0x7B997BD00599a87334a4187e51A2320D740d14bb": "0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F",
    },
    roles: {
        0: ["0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F"],
        1: ["0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F"],
        2: ["0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F"],
        4: ["0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F"],
        8: ["0xe375639d0Fa6feC13e6F00A09A3D3BAcf18A354F"],
    },
};

