export const fragmentShader = /* glsl */ `
    varying float vElevation; 

    void main() {
        float elevation = vElevation * 0.1;
        float alpha = mod(elevation * 4.0, 1.0);
        alpha = step(0.5, alpha);

        gl_FragColor = vec4(elevation, 1.0, 1.0, alpha);
    }
`
