export const fragmentShader = /* glsl */ `
    varying float vElevation; 

    void main() {
        float elevation = vElevation;
        float alpha = mod(elevation * 5.0, 1.0);
        alpha = step(0.9, alpha);

        gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
`
