import { useEffect, useRef} from 'react';
import { useScroll } from '@react-three/drei';
import { useThree, useFrame} from '@react-three/fiber';
import gsap from 'gsap';


// Function for starting camera animation
export const useCameraStartAnimation = ({ duration = 5, toPosition = [20, 10, 30] }) => {
  const { camera } = useThree();

  useEffect(() => {
    gsap.to(camera.position, {
      duration: duration,
      x: toPosition[0],
      y: toPosition[1],
      z: toPosition[2],
      ease: "power1.inOut",
      onUpdate: () => camera.lookAt(0, 0, 200)
    });
  }, [camera, duration, toPosition]);
};