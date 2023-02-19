Shader "Custom/CheckerShader"
{
    Properties
    {
        _Width("Width",Float) = 100
        _Height("Height",Float) = 100
        _Segment("Segment",Float) = 10
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
                float _Width;
                float _Height;
                float _Segment;
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

                float textureX = IN.uv.x*_Width;
                float textureY = IN.uv.y*_Height;

                int colX = int(textureX/_Segment);
                int rowY = int(textureY/_Segment);

                if(fmod(colX,2)==0 && fmod(rowY,2)==0 || fmod(colX,2)==1 && fmod(rowY,2)==1){
                     colour.xyz *= 0; 
                }
                
                return colour;
            }
           
            ENDHLSL
        }
    }
}
