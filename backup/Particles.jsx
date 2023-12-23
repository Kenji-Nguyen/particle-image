import React, { useMemo, useRef } from 'react';
import {MathUtils, TextureLoader, UniformsUtils } from 'three';
import { useLoader, useFrame} from '@react-three/fiber';
import circleImg from './asset/circle.png';
import referenceImg from './asset/image.jpg'
import { useControls } from 'leva'


import fragmentShader from './fragmentShader';
import vertexShader from './vertexShader';

export default function Particles() {
    // Load the texture
    const circleTexture = useLoader(TextureLoader, circleImg);
    const imageTexture = useLoader(TextureLoader, referenceImg);

    // Hover Helper
    const hover = useRef(false);
    let hoverIntensity = 0; // Intensity when hovered


    const multiplier = 16;
    const nbColumns = 16 * multiplier;
    const nbLines = 9 * multiplier;

    let positions = useMemo(() => {
        let positions = [];

        for (let xi = 0; xi < nbColumns; xi++) {
            for (let yi = 0; yi < nbLines; yi++) {
                let x = (xi - nbColumns / 2);
                let y = (yi - nbLines / 2);
                let z = 0;
                positions.push(time, factor, speed, x, y, z);
            }
        }
        return new Float32Array(positions);
    }, [nbColumns, nbLines]);

    ////// CONTROLS
    const { pointsize, progress, frequency } = useControls({
        pointsize: { value: 10.0, min: 0, max: 100.0, step: 0.01 },
        progress: { value: 1.0, min: 0, max: 3, step: 0.01 },
        frequency: { value: 0, min: 0.0, max: 5.0, step: 0.1 },
    });

    const uniforms = useRef(UniformsUtils.merge([
        // UniformsLib common uniforms can be added here if needed
        {
            uPointSize: {value: pointsize},
            uTexture: { value: imageTexture},
            uNbLines: { value: nbLines},
            uNbColumns: { value: nbColumns},
            uProgress: { value: 1},
            uFrequency: { value: frequency},
            uTime: { value: 0}
        }
    ])).current;

    useFrame(({ clock }) => {
          hoverIntensity = MathUtils.lerp(hoverIntensity, hover.current ? 0.8 : 0, 0.1)
          uniforms.uTime.value = clock.getElapsedTime() + (1 + hoverIntensity / 10);
          uniforms.uPointSize.value = pointsize;
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
            />
            {/*<pointsMaterial
                map={circleTexture}
                color={0x00aaff}
                size={1.5}
                sizeAttenuation
                transparent
                alphaTest={0.5}
                opacity={1.0}
            /> */}
        </points>
    );
}
