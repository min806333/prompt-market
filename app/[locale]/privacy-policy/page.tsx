import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Daily Battle 2048",
  description: "Daily Battle 2048 앱의 개인정보처리방침입니다.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "2026년 3월 13일";
  const appName = "Daily Battle 2048";
  const devName = "DailyBattle Dev";
  const contactEmail = "dailybattle2048@gmail.com";

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-3">
            개인정보처리방침
          </h1>
          <p className="text-gray-400 text-sm">
            Privacy Policy · 최종 업데이트: {lastUpdated}
          </p>
          <div className="mt-4 h-1 w-20 rounded-full bg-orange-500" />
        </div>

        <div className="space-y-10 text-gray-300 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              1. 개요
            </h2>
            <p>
              <strong className="text-white">{appName}</strong>（이하 "앱"）은 {devName}（이하 "개발자"）가 운영합니다.
              본 개인정보처리방침은 앱 이용 중 수집되는 정보의 종류, 이용 목적, 보관 방법 및 이용자의 권리를 설명합니다.
            </p>
            <p className="mt-3">
              앱을 사용함으로써 본 방침에 동의하는 것으로 간주합니다.
              동의하지 않으시면 앱 사용을 중단하십시오.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              2. 수집하는 정보
            </h2>
            <p className="mb-3">앱은 다음 정보를 수집할 수 있습니다.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 pr-4 text-gray-400 font-semibold w-1/3">항목</th>
                    <th className="text-left py-2 pr-4 text-gray-400 font-semibold w-1/3">수집 방식</th>
                    <th className="text-left py-2 text-gray-400 font-semibold">목적</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    ["익명 사용자 ID (UUID)", "앱 최초 실행 시 자동 생성", "랭킹 등록 및 점수 식별"],
                    ["게임 점수·통계", "게임 플레이 완료 시", "리더보드·통계 제공"],
                    ["플레이 날짜·모드", "게임 플레이 완료 시", "Daily Battle 시드 검증"],
                    ["기기 언어·지역 (선택)", "시스템 정보 자동 수집", "서비스 언어 설정"],
                    ["광고 식별자 (GAID)", "광고 SDK 자동 수집", "맞춤형 광고 제공"],
                  ].map(([item, method, purpose]) => (
                    <tr key={item}>
                      <td className="py-2 pr-4 text-white text-sm">{item}</td>
                      <td className="py-2 pr-4 text-gray-400 text-sm">{method}</td>
                      <td className="py-2 text-gray-400 text-sm">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              * 실명, 이메일, 전화번호 등 개인 식별 정보는 <strong className="text-gray-300">수집하지 않습니다.</strong>
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              3. 정보 이용 목적
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-sm">
              {[
                "글로벌 리더보드 및 순위 제공",
                "Daily Battle 동일 시드 보드 검증",
                "일일·주간 미션 달성 여부 확인",
                "서비스 품질 개선 및 오류 분석",
                "광고 노출 (Google AdMob)",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              4. 제3자 서비스
            </h2>
            <p className="mb-3 text-sm">앱은 다음 제3자 서비스를 사용합니다. 각 서비스의 개인정보처리방침을 확인하세요.</p>
            <div className="space-y-3">
              {[
                {
                  name: "Supabase",
                  purpose: "게임 점수·랭킹 데이터 저장",
                  link: "https://supabase.com/privacy",
                },
                {
                  name: "Google AdMob",
                  purpose: "인앱 광고 제공",
                  link: "https://policies.google.com/privacy",
                },
                {
                  name: "Google Play Services",
                  purpose: "앱 배포 및 업데이트",
                  link: "https://policies.google.com/privacy",
                },
              ].map(({ name, purpose, link }) => (
                <div
                  key={name}
                  className="flex items-start justify-between bg-gray-900 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{purpose}</p>
                  </div>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 text-xs hover:underline ml-4 mt-0.5 shrink-0"
                  >
                    방침 보기 →
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              5. 데이터 보관 및 삭제
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-sm">
              <li>게임 점수 및 랭킹 데이터는 서비스 운영 기간 동안 보관됩니다.</li>
              <li>기기 내 로컬 데이터(설정·스트릭)는 앱 삭제 시 자동 삭제됩니다.</li>
              <li>데이터 삭제를 요청하시려면 아래 이메일로 문의하세요. 30일 이내 처리됩니다.</li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              6. 아동 개인정보 보호
            </h2>
            <p className="text-sm">
              본 앱은 만 13세 미만 아동을 대상으로 하지 않습니다.
              만 13세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다.
              해당 사실이 확인될 경우 즉시 관련 데이터를 삭제합니다.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              7. 이용자 권리
            </h2>
            <p className="text-sm mb-2">이용자는 다음 권리를 가집니다.</p>
            <ul className="list-disc list-inside space-y-1.5 text-sm">
              <li>수집된 데이터 열람 요청</li>
              <li>수집된 데이터 삭제 요청</li>
              <li>광고 개인화 거부 (기기 설정 → 광고 → 광고 ID 재설정)</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              8. 방침 변경
            </h2>
            <p className="text-sm">
              본 방침은 서비스 변경에 따라 업데이트될 수 있습니다.
              중요한 변경이 있을 경우 앱 내 공지 또는 이 페이지를 통해 안내합니다.
              변경 후 계속 앱을 사용하면 변경된 방침에 동의한 것으로 간주합니다.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              9. 문의
            </h2>
            <div className="bg-gray-900 rounded-2xl p-5">
              <p className="text-sm mb-1">
                <span className="text-gray-400">개발자:</span>{" "}
                <span className="text-white font-semibold">{devName}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-400">이메일:</span>{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-orange-400 hover:underline"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </section>

        </div>

        {/* 하단 */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
          © 2026 {devName} · {appName} · 최종 업데이트: {lastUpdated}
        </div>
      </div>
    </main>
  );
}
