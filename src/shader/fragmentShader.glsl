uniform sampler2D uTexture;
uniform float uNbLines;
uniform float uNbColumns;
uniform float uProgress;
varying vec2 vTexCoords;

varying float vPointSize;
varying float vDepth;

float circle(vec2 uv, float border) {
    float radius = 0.5;
    float dist = radius - distance(uv, vec2(0.5));
    return smoothstep(0.0, border, dist);
}

void main() {

    vec2 uv = gl_PointCoord;
    uv.y *= -1.;

    uv /= vec2(uNbColumns, uNbLines);

    float texOffsetU = vTexCoords.x / uNbColumns;
    float texOffsetV = vTexCoords.y / uNbLines;
    uv += vec2(texOffsetU, texOffsetV);
    uv += vec2(0.5);

    vec4 texture = texture2D(uTexture, uv);

    gl_FragColor = texture;
            //Kill too dark particles
    if((gl_FragColor.r < 0.3) && (gl_FragColor.g < 0.3) && (gl_FragColor.b < 0.3)) {
        discard;
    }

            // Constants for depth-based blurring thresholds
    float nearStart = 0.0; // Start blurring slightly closer than this
    float nearEnd = 0.45;   // Maximum blur at this depth and closer
    float farStart = 0.8;  // Start blurring slightly farther than this
    float farEnd = 0.9;    // Maximum blur at this depth and farther
    float maxPointSize = 20000.0;    // Maximum size for point size-based blur

            // Depth-based blur
    float depthBlur = smoothstep(nearStart, nearEnd, vDepth) + (1.0 - smoothstep(farStart, farEnd, vDepth));

            // Calculate size-based blur amount
    float sizeBlur = pow(vPointSize / maxPointSize, 6.0); // More blur for larger particles

            // Combine both blur factors
    float combinedBlur = mix(sizeBlur, depthBlur, 0.5);

            // Apply combined blur
    gl_FragColor.a *= circle(gl_PointCoord, combinedBlur);

            // Reduce opacity for closer particles
    float opacityFactor = 1.0 - smoothstep(0.0, nearEnd, vDepth); // More transparent when closer
    gl_FragColor.a *= opacityFactor;

    gl_FragColor.a *= uProgress;
}
