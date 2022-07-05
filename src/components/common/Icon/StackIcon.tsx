import React from 'react'

import { CustomIconProps } from './IconSVG'

export default function StackIcon({ size, color }: CustomIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 1L16.5547 0.16795C16.2188 -0.0559832 15.7812 -0.0559832 15.4453 0.16795L16 1ZM31 11L31.5547 11.8321C31.8329 11.6466 32 11.3344 32 11C32 10.6656 31.8329 10.3534 31.5547 10.1679L31 11ZM16 21L15.4453 21.8321C15.7812 22.056 16.2188 22.056 16.5547 21.8321L16 21ZM1 11L0.4453 10.1679C0.167101 10.3534 0 10.6656 0 11C0 11.3344 0.167101 11.6466 0.4453 11.8321L1 11ZM15.4453 1.83205L30.4453 11.8321L31.5547 10.1679L16.5547 0.16795L15.4453 1.83205ZM30.4453 10.1679L15.4453 20.1679L16.5547 21.8321L31.5547 11.8321L30.4453 10.1679ZM16.5547 20.1679L1.5547 10.1679L0.4453 11.8321L15.4453 21.8321L16.5547 20.1679ZM1.5547 11.8321L16.5547 1.83205L15.4453 0.16795L0.4453 10.1679L1.5547 11.8321Z"
        fill={color}
      />
      <path
        d="M31.5914 17.8064C32.0367 17.4798 32.133 16.854 31.8064 16.4086C31.4798 15.9633 30.854 15.867 30.4086 16.1936L31.5914 17.8064ZM16 28L15.4086 28.8064C15.7606 29.0645 16.2394 29.0645 16.5914 28.8064L16 28ZM1.59136 16.1936C1.146 15.867 0.520196 15.9633 0.193595 16.4086C-0.133006 16.854 -0.0367289 17.4798 0.408636 17.8064L1.59136 16.1936ZM30.4086 16.1936L15.4086 27.1936L16.5914 28.8064L31.5914 17.8064L30.4086 16.1936ZM16.5914 27.1936L1.59136 16.1936L0.408636 17.8064L15.4086 28.8064L16.5914 27.1936Z"
        fill={color}
      />
      <path
        d="M31.5547 24.8321C32.0142 24.5257 32.1384 23.9048 31.8321 23.4453C31.5257 22.9858 30.9048 22.8616 30.4453 23.1679L31.5547 24.8321ZM16 34L15.4453 34.8321C15.7812 35.056 16.2188 35.056 16.5547 34.8321L16 34ZM1.5547 23.1679C1.09517 22.8616 0.474302 22.9858 0.16795 23.4453C-0.138403 23.9048 -0.0142289 24.5257 0.4453 24.8321L1.5547 23.1679ZM30.4453 23.1679L15.4453 33.1679L16.5547 34.8321L31.5547 24.8321L30.4453 23.1679ZM16.5547 33.1679L1.5547 23.1679L0.4453 24.8321L15.4453 34.8321L16.5547 33.1679Z"
        fill={color}
      />
    </svg>
  )
}
