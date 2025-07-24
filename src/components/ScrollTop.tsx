import { ReactNode, useEffect } from 'react';

// ==============================|| NAVIGATION - SCROLL TO TOP ||============================== //

interface ScrollTopProps {
  children?: ReactNode;
}

/**
 * Component that scrolls the window to the top when mounted
 * @param children - Optional child elements to render
 */
const ScrollTop = ({ children }: ScrollTopProps): JSX.Element | null => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, []);

  return children ? <>{children}</> : null;
};

export default ScrollTop;
