import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Vector3, TextureLoader, UniformsUtils, BufferGeometry } from 'three';
import { useLoader, useFrame } from '@react-three/fiber';
import referenceImg from './asset/image.jpg'
import { useControls } from 'leva'
import { useScroll } from '@react-three/drei';

import fragmentShader from './shader/fragmentShader.glsl?raw';
import vertexShader from './shader/vertexShader.glsl?raw';


export default function Particles() {
    // Load the texture
    const imageTexture = useLoader(TextureLoader, referenceImg);

    // Particle Grid Setup
    const multiplier = 20;
    const nbColumns = 8 * multiplier;
    const nbLines = 8 * multiplier;


    ////// CONTROLS
    const { attractorStrength, pointsize, frequency, radius, speed, offset, blurBG, velocity } = useControls({
        attractorStrength: { value: 35, min: 0, max: 200.0, step: 1 },
        pointsize: { value: 500.0, min: 0, max: 2000.0, step: 1 },
        radius: { value: 100, min: 0.0, max: 200.0, step: 0.1 },
        speed: { value: 1.5, min: 0.0, max: 5.0, step: 0.01 },
        offset: { value: 0.3, min: 0, max: 2.0, step: 0.01 },
        blurBG: { value: 0, min: 0.0, max: 100, step: 0.5 },
        velocity: { x: 1, y: 1, z: 1 },
    });

    let positions = useMemo(() => {
        let positions = [];

        for (let xi = 0; xi < nbColumns; xi++) {
            for (let yi = 0; yi < nbLines; yi++) {
                let x = (xi - nbColumns / 2);
                let y = (yi - nbLines / 2);
                let z = 0;
                positions.push(x, y, z);
                //positions.push(x , y + MathUtils.randFloatSpread(10), z + MathUtils.randFloatSpread(10))
            }
        }
        return new Float32Array(positions);
    },);


    //CSS Background Blur
    const [backgroundBlur, setBackgroundBlur] = useState(0);
    useEffect(() => {
        // Retrieve the CSS variable
        const rootStyle = getComputedStyle(document.documentElement);
        const blurValue = rootStyle.getPropertyValue('--background-blur').trim() || '0px';
        const blurValueInPixels = parseFloat(blurValue);
        setBackgroundBlur(blurValueInPixels);
        document.documentElement.style.setProperty('--background-blur', `${blurBG}px`);
    }, [blurBG]); // Empty dependency array to run only once


    // Uniform Setup
    const uniforms = useRef(UniformsUtils.merge([
        // UniformsLib common uniforms can be added here if needed
        {
            uPointSize: { value: pointsize },
            uTexture: { value: imageTexture },
            uNbLines: { value: nbLines },
            uNbColumns: { value: nbColumns },
            uProgress: { value: 1 },
            uFrequency: { value: frequency },
            uTime: { value: 0 },
            uSpeed: { value: speed },
            uRadius: { value: radius },
            uMouseX: { value: 0 },
            uMouseY: { value: 0 },
            uVelocity: { value: velocity },
        }
    ])).current;


    ///// ANIMATIONS

    // Scroll Hook
    const scroll = useScroll();

    const currentPointer = useRef({ x: 0, y: 0 });

    useFrame(({ clock, camera, pointer }) => {
        uniforms.uTime.value = (Math.sin(clock.getElapsedTime() * Math.pow(speed, 2) * 0.01) + 1) * offset + offset
        uniforms.uPointSize.value = pointsize;
        uniforms.uRadius.value = radius;
        uniforms.uVelocity.value.x = velocity.x; // Set the X component of velocity
        uniforms.uVelocity.value.y = velocity.y; // Set the Y component of velocity
        uniforms.uVelocity.value.z = velocity.z; // Set the Z component of velocity

        // Interpolate the current pointer towards the actual pointer position
        const easing = 0.04; // Easing factor for smooth transition
        currentPointer.current.x += (-pointer.x - currentPointer.current.x) * easing;
        currentPointer.current.y += (pointer.y - currentPointer.current.y) * easing;

        const pointerVector = new Vector3(currentPointer.current.x * attractorStrength, currentPointer.current.y * attractorStrength, 0.5);
        pointerVector.unproject(camera);
        pointerVector.project(camera);   // Then project into camera space

        uniforms.uMouseX.value = pointerVector.x;
        uniforms.uMouseY.value = pointerVector.y;

        // Get the scroll offset
        const scrollOffset = scroll.offset;

    });



    return (
        <points>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={nbColumns * nbLines}
                    itemSize={3}
                    array={positions}
                />
            </bufferGeometry>
            <shaderMaterial
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                uniforms={uniforms}
                depthTest={true}
                depthWrite={false}
                transparent={true}
            />
        </points>
    );
} 