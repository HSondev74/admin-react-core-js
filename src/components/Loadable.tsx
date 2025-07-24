import { ComponentType, Suspense, LazyExoticComponent, ReactNode } from 'react';

// project imports
import Loader from './Loader';

// Type definitions
type LoadableProps = {
  [key: string]: unknown;
};

/**
 * A higher-order component that wraps a lazy-loaded component with Suspense and a fallback Loader
 * @param Component - The lazy-loaded component to wrap
 * @returns A component that renders the wrapped component with Suspense
 */
const Loadable = <P extends object>(
  Component: LazyExoticComponent<ComponentType<P>> | ComponentType<P>
): ((props: P) => ReactNode) => {
  return function LoadableComponent(props: P) {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...(props as P)} />
      </Suspense>
    );
  };
};

export default Loadable;
