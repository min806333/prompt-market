import Link from "next/link";

interface Section {
  title: string;
  content?: string;
  items?: string[];
  steps?: string[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro?: string;
  backHomeLabel: string;
  sections: Section[];
}

export default function LegalPageLayout({
  title,
  lastUpdated,
  intro,
  backHomeLabel,
  sections,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backHomeLabel}
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            최종 수정일 / Last Updated: {lastUpdated}
          </p>
          {intro && (
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{intro}</p>
          )}
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 pb-2 border-b border-gray-100 dark:border-gray-800">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.content}</p>
              )}
              {section.items && (
                <ul className="mt-3 space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.steps && (
                <ol className="mt-3 space-y-2">
                  {section.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl text-sm text-gray-500 dark:text-gray-400 text-center">
          © {new Date().getFullYear()} PromptMarket — promto.kr
        </div>
      </div>
    </div>
  );
}
