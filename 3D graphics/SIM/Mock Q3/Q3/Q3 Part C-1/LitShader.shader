Shader "Custom/LitShader"
{
    Properties
    {
        [Header(Ambient)]
        _Ambient("Intensity", Range(0,1)) = 0.1
        _AmbColour("Ambient Colour",color) = (1, 1, 1, 1)

        [Header(Diffuse)]
        _Diffuse("Val", Range(0,1)) = 1.0
        _DiffColour("Diffuse Colour",color) = (1, 1, 1, 1)

        [Header(Specular)]
        _Shininess("Shininess", Range(0.1,10)) = 1.0
        _SpecColour("Specular Colour",color) = (1, 1, 1, 1)
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
                float _Diffuse;
                float4 _DiffColour;
                float _Shininess;
                float4 _SpecColour;
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
                float4 nl = max(0, dot(inp.normalWS.xyz, mainLight.direction.xyz));
                // factor in the light intensity
                half4 diffuse = nl * float4(mainLight.color,1) * _DiffColour * _Diffuse;

                //Phong specular
                float3 viewDir = normalize(_WorldSpaceCameraPos.xyz - inp.positionWS);
                float3 r = -reflect(viewDir,inp.normalWS);
                float rdotv = max(0,dot(r,viewDir));
                float4 spec = pow(rdotv,_Shininess)*float4(mainLight.color,1)*_SpecColour;

                //Blinn-Phong specular
                /*float3 lightDir = mainLight.direction.xyz;
                float3 viewDir = normalize(_WorldSpaceCameraPos.xyz - inp.positionWS);
                float3 h = (viewDir+lightDir)/length(viewDir+lightDir);
                float hdotn = max(0,dot(h,inp.normalWS.xyz));
                float4 spec = pow(hdotn,_Shininess)*float4(mainLight.color,1)*_SpecColour;
                */

                // repeat for all of the other lights
                int lightCount = GetAdditionalLightsCount();
                float4 otherLightDiffuse = 0;
                for (int i=0; i < lightCount; i++){
                    //Note only diffuse, no specular
                    Light light = GetAdditionalLight(i,  inp.positionWS);
                    float4 nl = max(0, dot(inp.normalWS.xyz, light.direction.xyz));
                    otherLightDiffuse += float4(nl * light.color, 1);
                }

                half4 light = amb+diffuse+spec+otherLightDiffuse; 
                return light;
            }
            ENDHLSL
        }
    }
}


/*Shader "Custom/LitShader"
{
    // The _BaseColor variable is visible in the Material's Inspector, as a field 
    // called Base Color. You can use it to select a custom color. This variable
    // has the default value (1, 1, 1, 1).
    // The ambient light is the ambient light intensity
    Properties
    {
        _BaseColor("Base Color", Color) = (1, 1, 1, 1)
        _Ambient("Ambient Light", Color) = (1, 1, 1, 1)
    }

    SubShader
    {
        Tags { "RenderType" = "Opaque" "RenderPipeline" = "UniversalPipeline"  "LightMode"="UniversalForward"}
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
                //float4 colour : COLOR;
                // world space normal
                float4 normalWS : NORMAL;
            };

            // To make the Unity shader SRP Batcher compatible, declare all
            // properties related to a Material in a a single CBUFFER block with 
            // the name UnityPerMaterial.
            CBUFFER_START(UnityPerMaterial)
                // The following line declares the _BaseColor variable, so that you
                // can use it in the fragment shader.
                half4 _BaseColor;
                // this is a variable for the ambient light
                half4 _Ambient;
            CBUFFER_END

            Varyings vert(Attributes IN)
            {
                Varyings OUT;
                // transform the vertex position
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS);

                // transform the normal by the modelling matrix to
                // to get the world space normal
                // note that the final coordinate we are using is a 0
                // because the normal is a direction and should not be
                // affected by translations
                OUT.normalWS = mul(UNITY_MATRIX_M, float4(IN.normalOS.xyz,0));

                return OUT;
            }

            half4 frag(Varyings inp) : SV_Target
            {
                // The main light affecting the object
                Light mainLight = GetMainLight();
                //return float4(mainLight.color.rgb,1);

                // this is the dot product part of the lighting equation
                float4 nl = max(0, dot(inp.normalWS.xyz, mainLight.direction.xyz));
                // factor in the light intensity
                float diffuse = float4(nl * mainLight.color, 1);

                // add in the ambient term (a uniform variable)
                float lighting = diffuse+ _Ambient;

                // multiply the lighting by the object colour
                return _BaseColor*lighting;
                //return float4(mainLight.color.rgb,1);//half4(mainLight.color,1);
            }

            

            ENDHLSL
        }
    }
}*/