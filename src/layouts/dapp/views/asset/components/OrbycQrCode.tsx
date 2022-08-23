import { QRCode } from "react-qrcode-logo";
interface OrbycQrCodeProps {
  assetId: number;
}
export function OrbycQrCode(props: OrbycQrCodeProps) {
  return (
    <QRCode
      value={`orbyc.github.io/#/${props.assetId}`}
      bgColor={`transparent`}
      logoImage={`https://orbyc.github.io/qr-logo.png`}
      fgColor="#0A785A"
      eyeRadius={10}
      size={240}
      quietZone={40}
      logoWidth={58}
      ecLevel="H"
      qrStyle="dots"
    />
  );
}
