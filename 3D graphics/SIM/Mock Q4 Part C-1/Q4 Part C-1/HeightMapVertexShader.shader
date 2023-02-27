Shader "Custom/HeightMapVertexShader"
{
    Properties
    {

        _HeightTex("HeightMap", 2D) = "bump" {}

        _Texure("Texture", 2D) = "bump" {}
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
                // object space vertex position
                float4 positionOS   : POSITION;

                // texture coordinates
                float2 uv: TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionHCS  : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 positionWS : TEXCOORD4;
        
            };

            // To make the Unity shader SRP Batcher compatible, declare all
            // properties related to a Material in a a single CBUFFER block with 
            // the name UnityPerMaterial.
            CBUFFER_START(UnityPerMaterial)
                sampler2D _HeightTex;
                sampler2D _Texure;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;

                //read the height map value
                half4 h = tex2Dlod(_HeightTex, float4(IN.uv,0,0));
                //add height map value to object vertex y
                IN.positionOS.y += h.r;

                OUT.uv = IN.uv;
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                
                VertexPositionInputs positionInputs = GetVertexPositionInputs(IN.positionOS.xyz);
                OUT.positionWS = positionInputs.positionWS;
                
                return OUT;
            }




            half4 frag(Varyings IN) : SV_Target
            {
            
                half4 c = tex2D(_Texure,IN.uv);
                
                return c;
            }

            ENDHLSL
        }
    }
}
