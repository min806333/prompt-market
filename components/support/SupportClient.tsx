"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import Link from "next/link";

const faqs = [
  {
    category: "구매 및 결제",
    items: [
      {
        q: "구매한 프롬프트는 어디서 다운로드하나요?",
        a: "결제 완료 후 마이페이지 > 구매 내역에서 다운로드할 수 있습니다. 결제 완료 이메일에도 다운로드 링크가 포함됩니다.",
      },
      {
        q: "어떤 결제 수단을 지원하나요?",
        a: "Stripe를 통해 국내외 신용카드/체크카드를 지원합니다. 카카오페이, 네이버페이 등은 추후 지원 예정입니다.",
      },
      {
        q: "환불은 어떻게 신청하나요?",
        a: "구매일로부터 7일 이내에 support@promto.kr로 주문번호와 환불 사유를 보내주세요. 디지털 상품 특성상 다운로드 완료 후에는 환불이 제한될 수 있습니다.",
      },
      {
        q: "구독 요금제는 어떻게 취소하나요?",
        a: "마이페이지 > 설정 > 구독 관리에서 언제든지 취소할 수 있습니다. 취소 후에도 현재 구독 기간 종료까지 이용 가능합니다.",
      },
    ],
  },
  {
    category: "프롬프트 판매",
    items: [
      {
        q: "누구나 프롬프트를 판매할 수 있나요?",
        a: "네, 회원가입 후 '판매하기' 메뉴에서 바로 상품을 등록할 수 있습니다. 첫 판매 시 수익의 30%가 플랫폼 수수료로 적용됩니다.",
      },
      {
        q: "수익 정산은 언제 이루어지나요?",
        a: "매월 1일 전월 판매 수익이 정산됩니다. 정산을 받으려면 크리에이터 프로필에서 정산 계좌를 등록해야 합니다.",
      },
      {
        q: "프롬프트 심사 기간은 얼마나 걸리나요?",
        a: "일반적으로 영업일 기준 1~3일 이내에 검토됩니다. 콘텐츠 정책에 부합하는 상품은 빠르게 승인됩니다.",
      },
    ],
  },
  {
    category: "계정 및 보안",
    items: [
      {
        q: "비밀번호를 잊어버렸어요.",
        a: "로그인 페이지에서 '비밀번호 찾기'를 클릭하면 이메일로 재설정 링크가 발송됩니다.",
      },
      {
        q: "계정을 삭제하고 싶어요.",
        a: "계정 삭제는 support@promto.kr로 요청해 주세요. 구매 내역 및 판매 정산이 완료된 후 처리됩니다.",
      },
      {
        q: "소셜 로그인 계정을 연결할 수 있나요?",
        a: "현재 Google 소셜 로그인을 지원합니다. 추후 더 많은 소셜 로그인이 추가될 예정입니다.",
      },
    ],
  },
  {
    category: "Playground & AI 기능",
    items: [
      {
        q: "Playground 무료 테스트 횟수는 얼마나 되나요?",
        a: "무료 계정은 하루 3회 테스트가 가능합니다. Pro 플랜은 하루 20회, Premium 플랜은 무제한 테스트가 가능합니다.",
      },
      {
        q: "Playground에서 지원하는 AI 모델은 무엇인가요?",
        a: "현재 텍스트 생성(GPT-4o), 이미지 생성(DALL-E 3), 영상 프롬프트 최적화를 지원합니다.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-6 py-4 text-left"
      >
        <span className="font-medium text-gray-900 dark:text-white text-sm">{q}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function SupportClient() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">고객센터</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              궁금하신 내용을 아래에서 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: "📧",
                title: "이메일 문의",
                desc: "support@promto.kr",
                sub: "영업일 기준 1~2일 내 답변",
                href: "mailto:support@promto.kr",
              },
              {
                icon: "💬",
                title: "실시간 채팅",
                desc: "채팅 상담",
                sub: "평일 오전 10시 ~ 오후 6시",
                href: "#contact",
              },
              {
                icon: "📋",
                title: "1:1 문의",
                desc: "문의 남기기",
                sub: "아래 양식으로 접수",
                href: "#contact",
              },
            ].map((card) => (
              <a
                key={card.title}
                href={card.href}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-3">{card.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">{card.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </a>
            ))}
          </div>

          <div className="space-y-8 mb-16">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-indigo-600 rounded-full inline-block" />
                  {section.category}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <FaqItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            id="contact"
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">1:1 문의하기</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              FAQ에서 해결되지 않은 문제가 있으시면 아래 양식으로 문의해 주세요.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-400">
                ✅ 문의가 접수되었습니다. 영업일 기준 1~2일 내로 답변 드리겠습니다.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    이름
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  문의 유형
                </label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm">
                  <option>구매/결제 문의</option>
                  <option>환불 신청</option>
                  <option>판매자 문의</option>
                  <option>계정 문제</option>
                  <option>버그 신고</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  문의 내용
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="문의 내용을 자세히 적어주세요."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                문의 접수하기
              </button>
            </form>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
