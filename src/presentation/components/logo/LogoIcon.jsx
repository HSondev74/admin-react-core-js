import Logo from '../../assets/images/logo/logo.png';

export default function LogoIcon({ width = 90, height = 90 }) {
  return <img src={Logo} width={width} height={height} />;
}
