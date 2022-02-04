import React, {CSSProperties, PropsWithChildren} from 'react'
import { useElementSize } from 'usehooks-ts'
import { ScaleProvider } from "./ScaleContext"

type AutoScalingProps = PropsWithChildren<{
  margin?: number
  childWidth: number
  maxChildWidth: number
  style?: CSSProperties
}>;

export const AutoScaling = ({children, childWidth, maxChildWidth, style, margin = 0}: AutoScalingProps) => {

  const [ref, { width }] = useElementSize()
  // "width" is element.offsetWidth, measured in pixels,
  // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth
  // For the scale to work, childWidth and maxChildWidth need to be in pixels as well.

  let scaledWidth = width - margin * 2
  if (scaledWidth > maxChildWidth) {
    scaledWidth = maxChildWidth
    margin = (width - scaledWidth) / 2
  }
  const scale = scaledWidth / childWidth

  return (
    <div
      ref={ref}
      style={style}
    >
      <ScaleProvider scale={scale}>
        <div
          style={{
            width: `${childWidth}px`,
            transformOrigin: "0 0",
            transform: `translate(${margin}px, 0) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </ScaleProvider>
    </div>
  )
}
