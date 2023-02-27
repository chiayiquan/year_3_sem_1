Shader "Custom/EnvironmentShader"
{
    Properties
    {
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
               sampler2D _Texure; 
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
         
                float3 viewDir = normalize(_WorldSpaceCameraPos.xyz - inp.positionWS);
                float3 r = -reflect(viewDir,inp.normalWS);
                
                float m = 2. * sqrt( 
                                pow( r.x, 2. ) + 
                                pow( r.y, 2. ) + 
                                pow( r.z + 1., 2. ));
            
                float2 vn = r.xy / m + .5;

                half4 col = tex2D(_Texure,vn.xy);
                return col;
            }
            ENDHLSL
        }
    }
}