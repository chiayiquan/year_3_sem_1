Shader "Custom/DotsShader"
{
    Properties
    {
        _Width("Width",Float) = 100
        _Height("Height",Float) = 100
        _Segment("Segment",Float) = 10
        _Radius("_Radius",Float) = 5
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
                float _Radius;
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

                float textureX = IN.uv.x*_Width;
                float textureY = IN.uv.y*_Height;

                float2 center = float2(int(textureX/_Segment)*_Segment+_Segment/2.0,int(textureY/_Segment)*_Segment+_Segment/2.0);

                float firstFactor = pow(textureX-center.x,2);
                float secondFactor = pow(textureY-center.y,2);
                float thirdFactor = pow(_Radius,2);

                half4 colour = (1,1,1,1);

                if(firstFactor+secondFactor<thirdFactor){
                     colour.xyz *= 0; 
                }
                             
                return colour;
            }
           
            ENDHLSL
        }
    }
}