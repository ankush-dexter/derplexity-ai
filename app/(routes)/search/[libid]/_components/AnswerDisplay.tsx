import React from 'react'
import SourceList from './SourceList'
import DisplaySummary from './DisplaySummary'

function AnswerDisplay({chat, loadingSearch}: {chat: any, loadingSearch: boolean}):React.JSX.Element {

  return (
    <div>
      <div className='flex flex-wrap gap-2 mt-4'>
        <SourceList webResult={chat} loadingSearch={loadingSearch}/>
        <DisplaySummary aiResp={chat.aiResp}/>
      </div>
    </div>
  )
}

export default AnswerDisplay