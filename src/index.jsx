import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, OrbitControls } from '@react-three/drei';
import Particles from './Particles.jsx'
import { useCameraStartAnimation } from './utils/CameraUtils.jsx';


const root = ReactDOM.createRoot(document.querySelector('#root'))

const Scene = () => {
    useCameraStartAnimation({ duration: 5, toPosition: [0, 0, -200] });
    return (
        <>
            <ScrollControls pages={3} damping={0.1}>
                    <Particles />
            </ScrollControls>
            <OrbitControls />
        </>
    );
};

root.render(
    <Canvas camera={{ position: [0, 0, 0] }}>
        <Scene />
    </Canvas>
)