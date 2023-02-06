Shader "Custom/NormalMappedShader"
{
    Properties
    {
        // a colour texture map
        _MainTex("Texture", 2D) = "white" {}
        // a normal map
        _NormalTex("NormalMap", 2D) = "bump" {}
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
                // object space vertex tangent
                float4 tangentOS : TANGENT;
                // texture coordinates
                float2 uv: TEXCOORD0;
            };

            struct Varyings
            {
                // clip space vertex position
                float4 positionHCS  : SV_POSITION;
                float2 uv : TEXCOORD0;
                // world space normal, tangent and bitangent
                // used for transforming the normals from
                // the normal map
                half3 normalWS     : TEXCOORD1;
                half3 tangentWS    : TEXCOORD2;
                half3 bitangentWS  : TEXCOORD3;
            };

            // To make the Unity shader SRP Batcher compatible, declare all
            // properties related to a Material in a a single CBUFFER block with 
            // the name UnityPerMaterial.
            CBUFFER_START(UnityPerMaterial)
                // colour texture
                sampler2D _MainTex;
                // normal texture
                sampler2D _NormalTex;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                
                // get the transformed normal, tangent and bitangent
                VertexNormalInputs vertexNormalInput = GetVertexNormalInputs(IN.normalOS, IN.tangentOS);
                OUT.normalWS = vertexNormalInput.normalWS;
                OUT.tangentWS = vertexNormalInput.tangentWS;
                OUT.bitangentWS = vertexNormalInput.bitangentWS;

                OUT.uv = IN.uv;

                return OUT;
            }

            half4 frag(Varyings IN) : SV_Target
            {
                // get the colour from the colour texture
                half4 col = tex2D(_MainTex, IN.uv);

                // get the normal from the normal map and "unpack" it
                // (convert from a pixel representation to a vector)
                float3 normal = UnpackNormal(tex2D(_NormalTex, IN.uv));

                // transform the new normal using
                // surface tangent, bitangent and normal
                normal = TransformTangentToWorld(normal,
                    half3x3(IN.tangentWS, IN.bitangentWS, IN.normalWS));

                // use the resulting normal in the standard lighting calculations
                // (in this examples we are just using the main lights)
                Light mainLight = GetMainLight();
                float4 nl = max(0, dot(normal.xyz, mainLight.direction.xyz));
                float4 diffuse = float4(nl * mainLight.color, 1);

                // multiply the colour texture by the lighting
                return col*diffuse;
            }

            ENDHLSL
        }
    }
}
