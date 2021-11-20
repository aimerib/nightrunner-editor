import React, { useRef } from 'react'
const useFocus = (): [React.RefObject<HTMLTextAreaElement & HTMLInputElement>, () => void] => {
  const htmlElRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)
  const setFocus = (): void => htmlElRef.current && htmlElRef.current.focus()

  return [htmlElRef, setFocus]
}
export default useFocus;
