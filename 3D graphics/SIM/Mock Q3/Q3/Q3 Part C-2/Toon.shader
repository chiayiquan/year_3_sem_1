Shader "Custom/Toon"
{
    Properties
    {
        [Header(Ambient)]
        _Ambient("Intensity", Range(0,1)) = 0.1
        _AmbColour("Ambient Colour",color) = (1, 1, 1, 1)

    }

    SubShader
    {
        Tags { "RenderType" = "Opaque" "RenderPipeline" = "UniversalRenderPipeline" }

        Pass
        {
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl" 
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"  

            struct Attributes
            {
                // the object space position
                float4 positionOS   : POSITION;
                // the object space normal
                float4 normalOS : NORMAL;
            };

            struct Varyings
            {
                // clip space position
                float4 positionHCS  : SV_POSITION;
                // world space position
                float3 positionWS : TEXCOORD1;
                // world space norma
                float4 normalWS : NORMAL;
            };

            // To make the Unity shader SRP Batcher compatible, declare all
            // properties related to a Material in a a single CBUFFER block with 
            // the name UnityPerMaterial.
            CBUFFER_START(UnityPerMaterial)
                float _Ambient;
                float4 _AmbColour;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;

                // transform the vertex position to clip and world position
                VertexPositionInputs positionInputs = GetVertexPositionInputs(IN.positionOS.xyz);
                OUT.positionHCS = positionInputs.positionCS;
                OUT.positionWS =  positionInputs.positionWS;

                //transform Object space normal to world space normal
                OUT.normalWS = mul(UNITY_MATRIX_M, float4(IN.normalOS.xyz,0));

                return OUT;
            }

            half4 frag(Varyings inp) : SV_Target
            {
                // The main light affecting the object
                Light mainLight = GetMainLight();

                //Ambient light
                half4 amb = _Ambient * _AmbColour;

                // this is the dot product part of the lighting equation
                float intensity = max(0, dot(inp.normalWS.xyz, mainLight.direction.xyz));
                half4 toonShade;
               
                if (intensity > 0.95) {
                        toonShade = float4(1.0, 0.5, 0.5, 1.0);
                 } else if (intensity > 0.5) {
                        toonShade = float4(0.6, 0.3, 0.3, 1.0);
                } else if (intensity > 0.25) {
                       toonShade = float4(0.4, 0.2, 0.2, 1.0);
                } else {
                       toonShade = float4(0.2, 0.1, 0.1, 1.0);
                }

                return amb+toonShade;
            }
            ENDHLSL
        }
    }
}