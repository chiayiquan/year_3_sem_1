Shader "Custom/NoiseShader"
{
    Properties
    {
        // the colour texture
        _MainTex("Texture", 2D) = "white" {}
        // Perlin noise can be input as a texture
        // this should be a greyscale image of noise
        _NoiseTex("Noise", 2D) = "white" {}
        // the frequency of the changes
        _Frequency("Frequency", float) = 1
        // how wide the border is
        _BorderWidth("Border Width", float) = 0.1
        // the colour of the border
        _BorderColor("Border Color", Color) = (1, 0, 0, 1)
    }

    SubShader
    {
        // we need to set up the Unity settings for transparency
        Tags { "Queue" = "Transparent" "RenderType" = "Transparent" "RenderPipeline" = "UniversalRenderPipeline" }
        ZWrite Off
        Blend SrcAlpha OneMinusSrcAlpha
        //Cull front 
        LOD 100

        Pass
        {
            HLSLPROGRAM
            #pragma vertex vert alpha
            #pragma fragment frag alpha

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl" 
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"  

            struct Attributes
            {
                // object space position
                float4 positionOS   : POSITION;
                // object space normal
                float4 normalOS : NORMAL;
                // texture coordinates
                float2 uv: TEXCOORD0;
            };

            struct Varyings
            {
                // clip space position
                float4 positionHCS  : SV_POSITION;
                //float4 colour : COLOR;
                float4 diffuse : COLOR;
                float2 uv : TEXCOORD0;
            };

            // To make the Unity shader SRP Batcher compatible, declare all
            // properties related to a Material in a a single CBUFFER block with 
            // the name UnityPerMaterial.
            CBUFFER_START(UnityPerMaterial)
                half4 _BorderColor;
                sampler2D _MainTex; // the colour texture
                sampler2D _NoiseTex; // the noise
                float _Frequency; // how fast it changes
                float _BorderWidth;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;

                // transform the vertex position
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);

                // transform the vertex normal
                float4 normalWS = mul(UNITY_MATRIX_M, float4(IN.normalOS.xyz,0));

                // doing the lighting calculations in the vertex shader
                Light mainLight = GetMainLight();
                float4 nl = max(0, dot(normalWS.xyz, mainLight.direction.xyz));
                OUT.diffuse = float4(nl * mainLight.color, 1);

                // copy the UVs across unchanged
                OUT.uv = IN.uv;

                return OUT;
            }

            half4 frag(Varyings inp) : SV_Target
            {
                // get the colour value from the colour texture
                half4 col = tex2D(_MainTex, inp.uv);
                // get the noise value from the noise texture
                half4 noise = tex2D(_NoiseTex, inp.uv);

                // multiply the colour by the lighting
                // (calcualted in the vertex shader)
                col = col*inp.diffuse;

                // alpha defaults to 1 (opaque)
                float alpha = 1;
                // animate the threshold noise value for transparency
                // using a sin function makes it oscillate 
                float threshold = (sin(_Frequency*_Time.w) + 1)/2.0;

                // if the noise is less than the threshold
                // and also the border set the alpha to 0 (transparent)
                if(noise.r < threshold-_BorderWidth) alpha = 0;
                // if it is under the threshold the colour is set to
                // the border colour
                // this is also true of the transparent part,
                // but that doesn't matter because you can't see it
                if(noise.r < threshold) col = _BorderColor;


                // pass the colour and alpha values out as the
                // fragment colour
                return half4(col.rgb, alpha);
            }
            ENDHLSL
        }
    }
}
