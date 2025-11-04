import React from 'react'

const Title = ({ subTitle, Title }: { subTitle: string; Title: string }) => {
  return (
    <div className="mb-8">
      <h5 className="text-muted-foreground text-xs font-medium">{subTitle}</h5>
      <h1 className="text-foreground text-4xl font-bold">{Title}</h1>
    </div>
  )
}

export default Title