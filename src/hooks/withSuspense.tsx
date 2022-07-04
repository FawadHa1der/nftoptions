import React, { FC, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type Props = {
  children: ReactNode
  fallback?: JSX.Element
  error?: JSX.Element
}

function EmptyFallback(): JSX.Element {
  return <></>
}

export const SafeSuspense = ({ children, fallback = <EmptyFallback />, error }: Props): JSX.Element => {
  return (
    <ErrorBoundary FallbackComponent={EmptyFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  )
}

export default function withSuspense<T>(SuspendedComponent: FC<T>, FallbackComponent?: FC<T>) {
  const Suspended = (props: T) => {
    return (
      <SafeSuspense fallback={FallbackComponent != null ? <FallbackComponent {...props} /> : undefined}>
        <SuspendedComponent {...props} />
      </SafeSuspense>
    )
  }
  return Suspended
}
