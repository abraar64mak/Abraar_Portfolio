import { useEffect, useRef, useState, type RefObject } from 'react'

const base = import.meta.env.BASE_URL

const VERT = 'attribute vec2 p; varying vec2 uv; void main(){ uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }'
// the video is "packed": colour (premultiplied over black) on the left half, the matte on the right half
const FRAG = `precision mediump float; uniform sampler2D t; varying vec2 uv;
void main(){
  vec3 c = texture2D(t, vec2(uv.x * 0.5, uv.y)).rgb;
  float a = texture2D(t, vec2(uv.x * 0.5 + 0.5, uv.y)).r;
  gl_FragColor = vec4(min(c, vec3(a)), a);
}`

interface Props { videoRef: RefObject<HTMLVideoElement>; onMeta: (seconds: number) => void; onFail: () => void }

/**
 * Plays a "packed" hero video (see scripts/build-hero-assets.py) and shows it with a transparent background.
 * Browsers disagree about transparent video, so the matte travels as an ordinary picture and is applied here in WebGL.
 */
export default function AlphaVideo({ videoRef, onMeta, onFail }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const cv = canvas.current, v = videoRef.current
    if (!cv || !v) return
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
    if (!gl) { onFail(); return }

    const compile = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram()!
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { onFail(); return }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    let raf = 0, vfc = 0, alive = true, drawn = false
    const draw = () => {
      if (!alive || v.readyState < 2 || !v.videoWidth) return
      const w = Math.round(v.videoWidth / 2)
      if (cv.width !== w || cv.height !== v.videoHeight) { cv.width = w; cv.height = v.videoHeight; gl.viewport(0, 0, w, v.videoHeight) }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      if (!drawn) { drawn = true; setShown(true) }
    }
    const withRvfc = 'requestVideoFrameCallback' in v
    const tick = () => { draw(); schedule() }
    const schedule = () => {
      if (!alive) return
      if (withRvfc) vfc = (v as HTMLVideoElement & { requestVideoFrameCallback: (cb: () => void) => number }).requestVideoFrameCallback(tick)
      else raf = requestAnimationFrame(tick)
    }
    const onMetaLoaded = () => onMeta(v.duration || 0)
    const redraw = () => draw()
    v.addEventListener('loadedmetadata', onMetaLoaded)
    v.addEventListener('loadeddata', redraw)
    v.addEventListener('seeked', redraw)
    v.addEventListener('playing', redraw)
    if (v.readyState >= 1) onMetaLoaded()
    schedule()
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      if (withRvfc && vfc) (v as HTMLVideoElement & { cancelVideoFrameCallback: (id: number) => void }).cancelVideoFrameCallback(vfc)
      v.removeEventListener('loadedmetadata', onMetaLoaded)
      v.removeEventListener('loadeddata', redraw)
      v.removeEventListener('seeked', redraw)
      v.removeEventListener('playing', redraw)
    }
  }, [videoRef, onMeta, onFail])

  return (
    <>
      <video ref={videoRef} loop muted playsInline preload="auto" aria-hidden className="pointer-events-none absolute h-px w-px opacity-0">
        <source src={`${base}hero/hero.webm`} type="video/webm" />
        <source src={`${base}hero/hero.mp4`} type="video/mp4" onError={onFail} />
      </video>
      <canvas ref={canvas} role="img" aria-label="Abraar, animated" className={`relative h-full w-full object-contain transition-opacity duration-700 ${shown ? 'opacity-100' : 'opacity-0'}`} />
    </>
  )
}
