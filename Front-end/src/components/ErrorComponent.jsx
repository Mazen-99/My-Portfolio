import React from 'react'

const ErrorComponent = ({ onRetry }) => {
  return (
    <div className="bg-red-600 text-white p-4 text-center">
      <p>السيرفر غير متاح حالياً — حاول إعادة التحميل.</p>
      <button
        onClick={onRetry}
        className="mt-2 inline-block bg-white text-red-600 px-3 py-1 rounded"
      >
        إعادة المحاولة
      </button>
    </div>
  )
}

export default ErrorComponent
