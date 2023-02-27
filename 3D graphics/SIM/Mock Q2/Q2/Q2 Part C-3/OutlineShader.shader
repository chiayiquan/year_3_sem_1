Shader "Custom/OutlineShader"
{

    Properties
    {
        _BaseColor("Base Color", Color) = (0, 0, 0, 1)
    }

    SubShader
    {

        Tags { "RenderType" = "Opaque" "RenderPipeline" = "UniversalRenderPipeline" }

        Pass
        {
            Cull Front
       
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"          

            struct Attributes
            {
                // the position of the vertex in object space
                float4 positionOS   : POSITION;
            };

            struct Varyings
            {
                float4 positionHCS  : SV_POSITION;
                // the object space position of the vertex
                // used for drawing stripes
                //float4 positionOS : POSITION1;
            };


            CBUFFER_START(UnityPerMaterial)
                half4 _BaseColor;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                IN.positionOS.xyz *= 1.2;
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                return OUT;
            }
            
            half4 frag(Varyings IN) : SV_Target
            {
                return _BaseColor;
            }
           
            ENDHLSL
        }
    }
}