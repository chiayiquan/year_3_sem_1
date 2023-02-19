Shader "Custom/StripeShader"
{
    Properties
    {
        _Scale("Scale",Float) = 10
    }

    SubShader
    {
        Tags { "RenderType" = "Opaque" "RenderPipeline" = "UniversalRenderPipeline"}

        Pass
        {
            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"  
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"          

            struct Attributes
            {
                float4 positionOS   : POSITION;
                float2 uv: TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionHCS  : SV_POSITION;
                float4 positionOS : POSITION1;
                float2 uv : TEXCOORD0;
            };

 
            CBUFFER_START(UnityPerMaterial)
                float _Scale;
            CBUFFER_END

            //vertex shader
            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.positionOS = IN.positionOS;
                OUT.uv = IN.uv;
                return OUT;
            }

            //fragment shader
            half4 frag(Varyings IN) : SV_Target
            {
                half4 colour = (1,1,1,1);
                if(fmod(IN.uv.y*_Scale,2)>1.0){
                     colour.xyz *= 0; 
                } 
                return colour;
            }
   
            ENDHLSL
        }
    }
}