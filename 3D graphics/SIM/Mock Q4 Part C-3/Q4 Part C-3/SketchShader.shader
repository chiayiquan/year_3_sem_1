Shader "Custom/SketchShader" {
    Properties {
        _MainTex ("Texture", 2D) = "white" {}
        _EdgeWidth ("Edge Width", Range(0, 1)) = 0.01
        _EdgeDarkness ("Edge Darkness", Range(0, 1)) = 0.5
        _SketchBrightness ("Sketch Brightness", Range(0, 1)) = 0.5
        _SketchContrast ("Sketch Contrast", Range(0, 1)) = 0.5
    }
    SubShader {
        Tags {"Queue"="Transparent" "RenderType"="Opaque"}
        LOD 100

        Pass {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            uniform sampler2D _MainTex;
            uniform float _EdgeWidth;
            uniform float _EdgeDarkness;
            uniform float _SketchBrightness;
            uniform float _SketchContrast;

            struct appdata {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            v2f vert (appdata v) {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag (v2f i) : SV_Target {
                float4 tex = tex2D(_MainTex, i.uv);
                float edge = fwidth(tex.rgb);
                edge = smoothstep(_EdgeWidth, _EdgeWidth + _EdgeDarkness, edge);
                float3 bwTex = dot(tex.rgb, float3(0.299, 0.587, 0.114));
                bwTex = (_SketchBrightness + _SketchContrast * (bwTex - _SketchBrightness));
                return float4(bwTex * (1.0 - edge), tex.a);
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
}