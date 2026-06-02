interface PagePlaceholderProps {
  title: string
  description: string
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-6 py-16">
      <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Placeholder
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{description}</p>
      </div>
    </section>
  )
}