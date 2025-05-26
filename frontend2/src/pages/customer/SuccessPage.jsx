import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClearCartMutation } from '../../redux/cartApi';
import { useNavigate } from 'react-router-dom';
import FButton from '../../components/Button';
import { ArrowRight } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const SuccessPage = () => {
  const [clearcart] = useClearCartMutation();
  const navigate = useNavigate();
  const isloading = false;
  const { width, height } = useWindowSize();

  const [showConfetti, setShowConfetti] = useState(true);
  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    clearcart();

    // Start fade out after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [clearcart]);

  // After fade-out animation (0.8s), remove confetti from DOM
  useEffect(() => {
    if (!showConfetti) {
      const timeout = setTimeout(() => setConfettiVisible(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  return (
    <div className='flex flex-col items-center gap-4 justify-center h-screen bg-gray-50 relative overflow-hidden'>

      <AnimatePresence>
        {confettiVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: showConfetti ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ position: 'fixed', top: 0, left: 0, width, height, pointerEvents: 'none', zIndex: 9999 }}
          >
            <Confetti
              width={width}
              height={height}
              numberOfPieces={800}
              recycle={false}
              gravity={0.2}
              wind={0.01}
              initialVelocityX={5}
              initialVelocityY={-15}
              colors={['#FFC700', '#FF0000', '#2E3191', '#41BBC7', '#7FFF00', '#FF69B4']}
              tweenDuration={10000}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.1
        }}
        className='flex flex-col items-center justify-center border border-gray-300 rounded-md 
        p-10 bg-white shadow-md'
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Congratulations! <span role="img" aria-label="sparkles">✨</span>
        </h1>
        <p className="text-lg text-gray-700 mb-1">
          Your order has been placed successfully.
        </p>
        <p className="text-sm text-gray-500">
          Thank you for shopping with us!
        </p>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.6
        }}
      >
        <FButton
          type="submit"
          disabled={isloading}
          onClick={() => navigate('/')}
        >
          <span className="flex items-center justify-center">
            Continue Shopping
            <ArrowRight className="h-5 w-7 ml-2" />
          </span>
        </FButton>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
