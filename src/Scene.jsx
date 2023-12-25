import './style.css'
import './canvas.css'
import ReactDOM from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, OrbitControls } from '@react-three/drei';
import Particles from './Particles.jsx'
import { useCameraStartAnimation } from './utils/CameraUtils.jsx';
import { Leva } from 'leva';


const root = ReactDOM.createRoot(document.querySelector('#root'))
const hello = "this is a new variable"
const Scene = () => {
    useCameraStartAnimation({ duration: 5, toPosition: [0, 0, 110] });
    return (
        <>
            <ScrollControls pages={3} damping={0.1}>
                <Leva hidden></Leva>
                <Particles />
            </ScrollControls >
            <OrbitControls maxDistance={150} />
        </>
    );
};

root.render(
    <Canvas camera={{ position: [0, 0, 0] }}>
        <Scene />
    </Canvas>
)