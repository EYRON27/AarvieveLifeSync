import { HiOutlineCheckCircle } from 'react-icons/hi';

export default function IncludedSection() {
  return (
    <section className="py-24 px-5 sm:px-8 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold text-[#5c7cfa] uppercase tracking-widest mb-3">Included</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-snug mb-4">
              Everything, no subscription.
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              No tiers. No paywalls. Every feature is available from day one, completely free.
            </p>

            <ul className="space-y-3">
              {[
                'Unlimited tasks, expenses & time entries',
                'Encrypted password vault',
                'Daily nutrition & calorie tracking',
                'PDF export for all your data',
                'Dark & light mode',
                'Installable PWA — works offline',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                  <HiOutlineCheckCircle className="w-4 h-4 text-[#5c7cfa] flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual card mock */}
          <div className="relative hidden md:block">
            <div className="rounded-2xl border border-white/[0.07] p-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="flex-1 h-px bg-white/[0.06] ml-2" />
              </div>
              <div className="space-y-3">
                {['Complete onboarding task', 'Review weekly budget', 'Log 3 meals today', 'Update portfolio passwords'].map((t, i) => (
                  <div key={t} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${i < 2 ? 'border-[#5c7cfa] bg-[#5c7cfa]' : 'border-white/20'}`}>
                      {i < 2 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-xs ${i < 2 ? 'text-white/30 line-through' : 'text-white/60'}`}>{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-white/30">2 of 4 complete</span>
                <div className="flex gap-1">
                  {[0,1,2,3].map((n) => (
                    <div key={n} className={`h-1 w-8 rounded-full ${n < 2 ? 'bg-[#5c7cfa]' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>
            {/* Subtle glow under card */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-12 bg-[#5c7cfa]/20 blur-2xl rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
