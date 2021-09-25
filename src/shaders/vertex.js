const noise = `//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float getPerlinNoise2d(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}`

const generateElevation = /* glsl */ `
    ${noise}

    float generateElevation(vec2 _position)
    {
        float elevation = 0.0;

        //_ valley
        float valleyStrength = cos(_position.y * uWaves) * 0.5 + 0.5;
        elevation += uElevation * valleyStrength;

        //_ general elevation
        elevation += getPerlinNoise2d(_position * 0.1) * uElevationGeneral * (valleyStrength + 0.1);

        //_ smaller details
        elevation += getPerlinNoise2d(_position * 0.25 + 123.0) * uElevationDetail * (valleyStrength + 0.1);

        elevation *= uElevation;

        return elevation;
    }
`

export const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform float uElevation;
    uniform float uElevationDetail;
    uniform float uElevationGeneral; 
    uniform float uWaves; 

    varying float vElevation;
    varying vec2 vUv;

    ${generateElevation}
    
    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0); 

        float elevation = generateElevation(modelPosition.xz);
        modelPosition.y += elevation + (cos(uTime + modelPosition.x));

        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition; 

        gl_Position = projectionPosition;

        vElevation = elevation;
        vUv = uv;
    }
`
