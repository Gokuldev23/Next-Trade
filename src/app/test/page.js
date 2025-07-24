import React from 'react'

export default async function  Page() {
  await new Promise((r) => setTimeout(r, 2000)) // 2s fake delay
  return <div>Test Page Loaded</div>
}
