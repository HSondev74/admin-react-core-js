import { JSX, ReactNode } from 'react';
import { motion, useCycle, Variants } from 'framer-motion';

// Type definitions
type AnimateButtonProps = {
  children: ReactNode;
  type?: 'slide' | 'scale' | 'rotate';
  direction?: 'up' | 'down' | 'left' | 'right';
  offset?: number;
  scale?: {
    hover: number;
    tap: number;
  };
};

/**
 * Component that adds animation effects to its children
 * @param children - Child elements to animate
 * @param type - Type of animation: 'slide', 'scale', or 'rotate'
 * @param direction - Direction of animation: 'up', 'down', 'left', or 'right'
 * @param offset - Distance to animate (in pixels)
 * @param scale - Scale values for hover and tap states
 */
const AnimateButton = ({
  children,
  type = 'scale',
  direction = 'right',
  offset = 10,
  scale = { hover: 1.05, tap: 0.954 }
}: AnimateButtonProps): JSX.Element => {
  // Calculate offsets based on direction
  let offset1: number;
  let offset2: number;
  
  switch (direction) {
    case 'up':
    case 'left':
      offset1 = offset;
      offset2 = 0;
      break;
    case 'right':
    case 'down':
    default:
      offset1 = 0;
      offset2 = offset;
      break;
  }

  const [x, cycleX] = useCycle(offset1, offset2);
  const [y, cycleY] = useCycle(offset1, offset2);

  // Animation variants for different types
  const variants: Record<string, Variants> = {
    rotate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        repeatType: 'loop' as const,
        duration: 2,
        repeatDelay: 0
      }
    },
    slide: {
      x: direction === 'left' || direction === 'right' ? x : 0,
      y: direction === 'up' || direction === 'down' ? y : 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 10
      }
    },
    scale: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150
      },
      whileHover: {
        scale: scale.hover
      },
      whileTap: {
        scale: scale.tap
      }
    }
  };

  // Handle mouse enter/leave for slide animation
  const handleMouseEnter = () => {
    if (type === 'slide') {
      cycleX();
      cycleY();
    }
  };

  const handleMouseLeave = () => {
    if (type === 'slide') {
      cycleX();
      cycleY();
    }
  };

  return (
    <motion.div
      animate={type}
      variants={variants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default AnimateButton;
