Shader "Custom/TextureShader"
{
    // The _BaseColor variable is visible in the Material's Inspector, as a field 
    // called Base Color. You can use it to select a custom color. This variable
    // has the default value (1, 1, 1, 1).
    Properties
    {
        _BaseColor("Base Color", Color) = (1, 1, 1, 1)
        // The texture sampler, which will appear in the inspector
        _MainTex("Texture", 2D) = "white" {}
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
                // object space vertex normal
                float4 normalOS : NORMAL;
                // the texture coordinates
                float2 uv: TEXCOORD0;
            };

            struct Varyings
            {
                // clip space vertex/fragment position
                float4 positionHCS  : SV_POSITION;
                // the texture coordinates
                float2 uv : TEXCOORD0;
            };

            // To make the Unity shader SRP Batcher compatible, declare all
            // properties related to a Material in a a single CBUFFER block with 
            // the name UnityPerMaterial.
            CBUFFER_START(UnityPerMaterial)
                // The following line declares the _BaseColor variable, so that you
                // can use it in the fragment shader.
                half4 _BaseColor;
                // the texture sampler that contains the texture and meta data
                sampler2D _MainTex;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;

                // do the standard vertex transforms 
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                // the UVs are interpolated over to the fragment shader
                OUT.uv = IN.uv;

                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                // get the colour from the shader using the UV coordinates
                half4 col = tex2D(_MainTex, IN.uv);
                return col;
            }
            ENDHLSL
        }
    }
}