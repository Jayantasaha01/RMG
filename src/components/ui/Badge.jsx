import clsx from 'clsx'

export default function Badge({ color = 'neutral', children }) {
  return (
    <span className={clsx('badge', color)}>
      {children}
    </span>
  )
}
