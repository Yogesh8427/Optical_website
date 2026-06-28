'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'none';
}

export default function FadeIn({ children, delay = 0, className, direction = 'up' }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const hiddenY = direction === 'up' ? 24 : 0;
  const hiddenX = direction === 'left' ? -24 : direction === 'right' ? 24 : 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: hiddenY, x: hiddenX }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: hiddenY, x: hiddenX }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
