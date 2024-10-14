'use client'

import React from 'react'
import { diff } from 'deep-object-diff'

interface JsonDiffViewerProps {
  left: { [key: string]: any }
  right: { [key: string]: any }
}

export const JsonDiffViewer: React.FC<JsonDiffViewerProps> = ({ left, right }) => {
  const difference = diff(left, right)

  const renderDifference = (oldValue: any, newValue: any) => {
    return (
      <div className="flex items-center">
        <span className="text-red-600 bg-red-100 font-mono">{JSON.stringify(oldValue)}</span>
        <span className="mx-2">=&gt;</span>
        <span className="text-green-600 bg-green-100 font-mono">{JSON.stringify(newValue)}</span>
      </div>
    )
  }

  const renderValue = (key: string, oldValue: any, newValue: any) => {
    if (oldValue !== newValue) {
      return (
        <div key={key} className="mb-2">
          <span className="font-mono mr-2">&quot;{key}&quot;:</span>
          {renderDifference(oldValue, newValue)}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mt-4 mb-2">Unterschiede</h3>
      <div className="bg-gray-100 p-2 rounded">
        {Object.keys(difference).map(key => renderValue(key, left[key], right[key]))}
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Vorher</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm font-medium">{JSON.stringify(left, null, 2)}</pre>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Nachher</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm font-medium">{JSON.stringify(right, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
