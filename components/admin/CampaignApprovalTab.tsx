'use client'

import { useState } from 'react'
import {
  ClipboardList,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  MessageSquare,
  FileText,
  Filter,
  Send,
  ArrowRight,
  Eye,
  RotateCcw,
  ChevronRight,
  Calendar,
  MapPin,
  Target,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type ApprovalStage = 'submitted' | 'handler' | 'approver' | 'final' | 'approved' | 'rejected'

interface HistoryEntry {
  id: string
  stage: ApprovalStage
  action: 'submitted' | 'assigned' | 'reviewed' | 'approved' | 'rejected' | 'returned' | 'commented' | 'registered'
  actor: string
  actorRole: string
  comment: string
  timestamp: string
}

interface CampaignRequest {
  id: string
  title: string
  missionary: string
  email: string
  phone: string
  country: string
  organization: string
  goalAmount: number
  duration: number
  description: string
  submittedAt: string
  stage: ApprovalStage
  handlerName: string | null
  approverName: string | null
  finalApproverName: string | null
  history: HistoryEntry[]
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: CampaignRequest[] = [
  {
    id: 'req-001',
    title: '인도네시아 수라바야 지역 청소년 복음화 및 직업 훈련 사역',
    missionary: '김태양',
    email: 'taeyang.kim@ywam.org',
    phone: '010-3821-5540',
    country: '인도네시아',
    organization: 'YWAM 수라바야',
    goalAmount: 12_000_000,
    duration: 90,
    description: '수라바야 빈민 지역 청소년 200명에게 직업 훈련과 복음을 전하는 6개월 사역입니다. 재봉·목공·전기 기술 교육과 주 2회 성경 공부를 병행합니다.',
    submittedAt: '2026-07-10 09:14',
    stage: 'handler',
    handlerName: '정민아',
    approverName: null,
    finalApproverName: null,
    history: [
      {
        id: 'h1',
        stage: 'submitted',
        action: 'submitted',
        actor: '김태양',
        actorRole: '선교사',
        comment: '캠페인 등록 신청합니다. 현지 NGO 협약서와 예산 계획서를 첨부했습니다.',
        timestamp: '2026-07-10 09:14',
      },
      {
        id: 'h2',
        stage: 'handler',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '담당자 정민아님께 자동 배정되었습니다.',
        timestamp: '2026-07-10 09:15',
      },
      {
        id: 'h3',
        stage: 'handler',
        action: 'commented',
        actor: '정민아',
        actorRole: '담당자',
        comment: '신청서 및 첨부서류 1차 검토 완료. 목표 금액 산정 근거 자료 추가 요청드립니다.',
        timestamp: '2026-07-11 14:32',
      },
      {
        id: 'h4',
        stage: 'handler',
        action: 'commented',
        actor: '김태양',
        actorRole: '선교사',
        comment: '요청하신 예산 세부 내역 및 현지 물가 기준표 추가 첨부했습니다.',
        timestamp: '2026-07-12 10:05',
      },
    ],
  },
  {
    id: 'req-002',
    title: '네팔 카트만두 고산지역 교회 개척 및 리더십 양성 3기',
    missionary: '박소율',
    email: 'soyul.park@gms.or.kr',
    phone: '010-5512-8834',
    country: '네팔',
    organization: 'GMS 네팔',
    goalAmount: 8_000_000,
    duration: 60,
    description: '카트만두 외곽 고산 마을 3곳에 소그룹 교회를 개척하고 현지 리더 12명을 양성하는 프로그램입니다.',
    submittedAt: '2026-07-08 16:44',
    stage: 'approver',
    handlerName: '최재원',
    approverName: '오수진',
    finalApproverName: null,
    history: [
      {
        id: 'h1',
        stage: 'submitted',
        action: 'submitted',
        actor: '박소율',
        actorRole: '선교사',
        comment: '3기 캠페인 신청합니다. 2기 결과보고서도 함께 첨부합니다.',
        timestamp: '2026-07-08 16:44',
      },
      {
        id: 'h2',
        stage: 'handler',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '담당자 최재원님께 자동 배정되었습니다.',
        timestamp: '2026-07-08 16:44',
      },
      {
        id: 'h3',
        stage: 'handler',
        action: 'reviewed',
        actor: '최재원',
        actorRole: '담당자',
        comment: '2기 결과보고서 확인 완료. 목표 달성률 94%로 양호합니다. 승인자 검토 요청합니다.',
        timestamp: '2026-07-09 11:20',
      },
      {
        id: 'h4',
        stage: 'approver',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '승인자 오수진님께 전달되었습니다.',
        timestamp: '2026-07-09 11:21',
      },
      {
        id: 'h5',
        stage: 'approver',
        action: 'commented',
        actor: '오수진',
        actorRole: '승인자',
        comment: '이전 캠페인 실적 우수. 홍보 문구 일부 수정 후 최종 승인 요청 예정입니다.',
        timestamp: '2026-07-10 09:55',
      },
    ],
  },
  {
    id: 'req-003',
    title: '필리핀 민다나오 분쟁 지역 어린이 심리 치료 및 교육 사역',
    missionary: '윤혜원',
    email: 'hyewon.yoon@ccc.co.kr',
    phone: '010-9900-2281',
    country: '필리핀',
    organization: 'CCC 필리핀',
    goalAmount: 15_000_000,
    duration: 120,
    description: '민다나오 분쟁 피해 아동 150명을 위한 트라우마 회복 프로그램과 대안 교육 운영.',
    submittedAt: '2026-07-05 13:00',
    stage: 'final',
    handlerName: '정민아',
    approverName: '오수진',
    finalApproverName: '한경수',
    history: [
      {
        id: 'h1',
        stage: 'submitted',
        action: 'submitted',
        actor: '윤혜원',
        actorRole: '선교사',
        comment: '심리치료 전문가 현지 파트너 MOU 체결 완료. 서류 첨부합니다.',
        timestamp: '2026-07-05 13:00',
      },
      {
        id: 'h2',
        stage: 'handler',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '담당자 정민아님께 자동 배정되었습니다.',
        timestamp: '2026-07-05 13:01',
      },
      {
        id: 'h3',
        stage: 'handler',
        action: 'approved',
        actor: '정민아',
        actorRole: '담당자',
        comment: '서류 검토 완료. 분쟁 지역 사역이라 리스크 평가서 추가 확인 필요하나 기본 요건 충족. 승인자로 이관합니다.',
        timestamp: '2026-07-06 10:44',
      },
      {
        id: 'h4',
        stage: 'approver',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '승인자 오수진님께 전달되었습니다.',
        timestamp: '2026-07-06 10:44',
      },
      {
        id: 'h5',
        stage: 'approver',
        action: 'approved',
        actor: '오수진',
        actorRole: '승인자',
        comment: 'MOU 문서 및 리스크 평가서 모두 적합. 목표 금액 및 일정 타당성 확인됨. 최종 승인자로 이관합니다.',
        timestamp: '2026-07-07 15:30',
      },
      {
        id: 'h6',
        stage: 'final',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '최종 승인자 한경수님께 전달되었습니다.',
        timestamp: '2026-07-07 15:31',
      },
    ],
  },
  {
    id: 'req-004',
    title: '에티오피아 아디스아바바 여성 자립 지원 및 복음 전도 사역',
    missionary: '송지수',
    email: 'jisu.song@operation-mobilization.org',
    phone: '010-2244-7890',
    country: '에티오피아',
    organization: 'OM 에티오피아',
    goalAmount: 9_500_000,
    duration: 75,
    description: '아디스아바바 저소득 여성 80명에게 재봉 기술 교육과 소액 창업 지원, 성경 공부를 제공합니다.',
    submittedAt: '2026-07-01 11:22',
    stage: 'approved',
    handlerName: '최재원',
    approverName: '오수진',
    finalApproverName: '한경수',
    history: [
      {
        id: 'h1',
        stage: 'submitted',
        action: 'submitted',
        actor: '송지수',
        actorRole: '선교사',
        comment: '현지 파트너 교회 추천서 및 예산 계획서 첨부합니다.',
        timestamp: '2026-07-01 11:22',
      },
      {
        id: 'h2',
        stage: 'handler',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '담당자 최재원님께 자동 배정되었습니다.',
        timestamp: '2026-07-01 11:22',
      },
      {
        id: 'h3',
        stage: 'handler',
        action: 'approved',
        actor: '최재원',
        actorRole: '담당자',
        comment: '서류 적합. 이관합니다.',
        timestamp: '2026-07-02 09:10',
      },
      {
        id: 'h4',
        stage: 'approver',
        action: 'approved',
        actor: '오수진',
        actorRole: '승인자',
        comment: '내용 및 예산 타당. 이관합니다.',
        timestamp: '2026-07-03 14:00',
      },
      {
        id: 'h5',
        stage: 'final',
        action: 'approved',
        actor: '한경수',
        actorRole: '최종 승인자',
        comment: '사역 목적 및 실행 계획 모두 우수합니다. 최종 승인합니다.',
        timestamp: '2026-07-04 10:15',
      },
      {
        id: 'h6',
        stage: 'approved',
        action: 'registered',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '캠페인이 플랫폼에 등록되어 공개되었습니다.',
        timestamp: '2026-07-04 10:16',
      },
    ],
  },
  {
    id: 'req-005',
    title: '몽골 울란바토르 노숙인 쉼터 운영 및 직업 재활 사역',
    missionary: '강민호',
    email: 'minho.kang@compassion.or.kr',
    phone: '010-8811-3392',
    country: '몽골',
    organization: '컴패션 몽골',
    goalAmount: 6_000_000,
    duration: 45,
    description: '울란바토르 영하 40도의 혹한기 노숙인 60명에게 쉼터·식사·직업 훈련을 제공합니다.',
    submittedAt: '2026-07-13 08:30',
    stage: 'submitted',
    handlerName: null,
    approverName: null,
    finalApproverName: null,
    history: [
      {
        id: 'h1',
        stage: 'submitted',
        action: 'submitted',
        actor: '강민호',
        actorRole: '선교사',
        comment: '혹한기 쉼터 운영 긴급 캠페인 신청합니다. 파트너 단체 협약서 첨부합니다.',
        timestamp: '2026-07-13 08:30',
      },
    ],
  },
  {
    id: 'req-006',
    title: '베트남 다낭 지역 농촌 교회 개척 사역',
    missionary: '임수연',
    email: 'suyeon.lim@ywam.org',
    phone: '010-7723-4401',
    country: '베트남',
    organization: 'YWAM 다낭',
    goalAmount: 7_200_000,
    duration: 60,
    description: '다낭 외곽 농촌 5개 마을에 소그룹 교회를 개척합니다.',
    submittedAt: '2026-07-11 15:44',
    stage: 'rejected',
    handlerName: '정민아',
    approverName: null,
    finalApproverName: null,
    history: [
      {
        id: 'h1',
        stage: 'submitted',
        action: 'submitted',
        actor: '임수연',
        actorRole: '선교사',
        comment: '캠페인 신청합니다.',
        timestamp: '2026-07-11 15:44',
      },
      {
        id: 'h2',
        stage: 'handler',
        action: 'assigned',
        actor: '이시스템',
        actorRole: '시스템',
        comment: '담당자 정민아님께 자동 배정되었습니다.',
        timestamp: '2026-07-11 15:45',
      },
      {
        id: 'h3',
        stage: 'handler',
        action: 'rejected',
        actor: '정민아',
        actorRole: '담당자',
        comment: '현지 파트너 공문 및 사역자 비자 사본이 누락되어 반려합니다. 서류 보완 후 재신청 부탁드립니다.',
        timestamp: '2026-07-12 11:00',
      },
    ],
  },
]

const STAGE_SEQUENCE: ApprovalStage[] = ['submitted', 'handler', 'approver', 'final', 'approved']

const STAGE_META: Record<ApprovalStage, { label: string; shortLabel: string; color: string; bgColor: string; borderColor: string }> = {
  submitted:  { label: '신청 접수',    shortLabel: '접수',    color: 'text-muted-foreground', bgColor: 'bg-muted',               borderColor: 'border-border'   },
  handler:    { label: '담당자 검토',  shortLabel: '담당자',  color: 'text-amber-700',         bgColor: 'bg-amber-50',            borderColor: 'border-amber-200' },
  approver:   { label: '승인자 검토',  shortLabel: '승인자',  color: 'text-blue-700',          bgColor: 'bg-blue-50',             borderColor: 'border-blue-200'  },
  final:      { label: '최종 승인',    shortLabel: '최종',    color: 'text-violet-700',        bgColor: 'bg-violet-50',           borderColor: 'border-violet-200'},
  approved:   { label: '등록 완료',    shortLabel: '완료',    color: 'text-primary',           bgColor: 'bg-accent',              borderColor: 'border-primary/30'},
  rejected:   { label: '반려',         shortLabel: '반려',    color: 'text-destructive',       bgColor: 'bg-destructive/10',      borderColor: 'border-destructive/30'},
}

const ACTION_META: Record<HistoryEntry['action'], { label: string; icon: React.ElementType; iconColor: string }> = {
  submitted:  { label: '신청 접수',     icon: ClipboardList,  iconColor: 'text-muted-foreground' },
  assigned:   { label: '배정',          icon: User,           iconColor: 'text-blue-500'         },
  reviewed:   { label: '검토 완료',     icon: Eye,            iconColor: 'text-amber-500'        },
  approved:   { label: '승인',          icon: CheckCircle2,   iconColor: 'text-primary'          },
  rejected:   { label: '반려',          icon: XCircle,        iconColor: 'text-destructive'      },
  returned:   { label: '반려 후 반송',  icon: RotateCcw,      iconColor: 'text-amber-600'        },
  commented:  { label: '의견 등록',     icon: MessageSquare,  iconColor: 'text-blue-500'         },
  registered: { label: '플랫폼 등록',   icon: CheckCircle2,   iconColor: 'text-primary'          },
}

const FILTER_OPTIONS: { label: string; value: ApprovalStage | 'all' }[] = [
  { label: '전체',      value: 'all'      },
  { label: '신청 접수', value: 'submitted' },
  { label: '담당자',    value: 'handler'  },
  { label: '승인자',    value: 'approver' },
  { label: '최종 승인', value: 'final'    },
  { label: '등록 완료', value: 'approved' },
  { label: '반려',      value: 'rejected' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: ApprovalStage }) {
  const m = STAGE_META[stage]
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border', m.color, m.bgColor, m.borderColor)}>
      {stage === 'approved'  && <CheckCircle2 size={11} />}
      {stage === 'rejected'  && <XCircle size={11} />}
      {stage === 'submitted' && <Clock size={11} />}
      {stage === 'handler'   && <AlertCircle size={11} />}
      {stage === 'approver'  && <AlertCircle size={11} />}
      {stage === 'final'     && <AlertCircle size={11} />}
      {m.label}
    </span>
  )
}

function StepBar({ stage }: { stage: ApprovalStage }) {
  const steps: { key: ApprovalStage; label: string }[] = [
    { key: 'submitted', label: '신청 접수' },
    { key: 'handler',   label: '담당자 검토' },
    { key: 'approver',  label: '승인자 검토' },
    { key: 'final',     label: '최종 승인' },
    { key: 'approved',  label: '등록 완료' },
  ]
  const currentIdx = stage === 'rejected' ? -1 : STAGE_SEQUENCE.indexOf(stage)

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((s, i) => {
        const isDone    = stage !== 'rejected' && currentIdx > i
        const isCurrent = stage !== 'rejected' && currentIdx === i
        const isRejected = stage === 'rejected'

        return (
          <div key={s.key} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                isDone    ? 'bg-primary border-primary text-primary-foreground'        : '',
                isCurrent ? 'bg-white border-primary text-primary ring-2 ring-primary/20' : '',
                !isDone && !isCurrent && !isRejected ? 'bg-muted border-border text-muted-foreground' : '',
                isRejected ? 'bg-muted border-border text-muted-foreground' : '',
              )}>
                {isDone ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
              </div>
              <span className={cn(
                'text-[10px] mt-1 text-center font-medium leading-tight whitespace-nowrap',
                isCurrent ? 'text-primary' : isDone ? 'text-primary/70' : 'text-muted-foreground',
              )}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                'h-0.5 flex-1 mx-1 rounded transition-colors',
                isDone ? 'bg-primary' : 'bg-border',
              )} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function HistoryTimeline({ entries }: { entries: HistoryEntry[] }) {
  return (
    <ol className="relative pl-6 border-l-2 border-border space-y-5">
      {entries.map((e, i) => {
        const am = ACTION_META[e.action]
        const Icon = am.icon
        const isLast = i === entries.length - 1
        return (
          <li key={e.id} className="relative">
            <span className={cn(
              'absolute -left-[1.625rem] top-0 w-6 h-6 rounded-full border-2 border-card flex items-center justify-center',
              isLast ? 'bg-primary/10' : 'bg-muted',
            )}>
              <Icon size={12} className={am.iconColor} />
            </span>
            <div className="bg-card rounded-xl border border-border p-3 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-foreground">{e.actor}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{e.actorRole}</span>
                  <span className={cn('text-[10px] font-medium', am.iconColor)}>{am.label}</span>
                </div>
                <time className="text-[10px] text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock size={10} />
                  {e.timestamp}
                </time>
              </div>
              {e.comment && (
                <p className="text-xs text-foreground/80 leading-relaxed mt-1 pl-1 border-l-2 border-border">
                  {e.comment}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function DetailModal({
  request,
  onClose,
  onAction,
}: {
  request: CampaignRequest
  onClose: () => void
  onAction: (id: string, action: 'approve' | 'reject' | 'comment', comment: string, actor: string, actorRole: string) => void
}) {
  const [comment, setComment] = useState('')
  const [actor, setActor] = useState('')
  const [activeSection, setActiveSection] = useState<'info' | 'history'>('history')

  const canAct = request.stage !== 'approved' && request.stage !== 'rejected'

  const currentStageLabel =
    request.stage === 'handler'  ? `담당자 (${request.handlerName ?? '미배정'})` :
    request.stage === 'approver' ? `승인자 (${request.approverName ?? '미배정'})` :
    request.stage === 'final'    ? `최종 승인자 (${request.finalApproverName ?? '미배정'})` :
    STAGE_META[request.stage].label

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-2xl h-full bg-background flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-start gap-3 px-6 py-5 border-b border-border">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <StageBadge stage={request.stage} />
              <span className="text-xs text-muted-foreground">{request.id}</span>
            </div>
            <h2 className="text-base font-bold text-foreground leading-snug line-clamp-2">{request.title}</h2>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User size={11} />{request.missionary}</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{request.country}</span>
              <span className="flex items-center gap-1"><Calendar size={11} />{request.submittedAt}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Stage progress */}
        <div className="px-6 pt-4 pb-3 border-b border-border">
          <StepBar stage={request.stage} />
          {request.stage !== 'rejected' && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              현재 단계: <span className="font-semibold text-foreground">{currentStageLabel}</span>
            </p>
          )}
          {request.stage === 'rejected' && (
            <p className="text-xs text-destructive mt-3 text-center font-semibold flex items-center justify-center gap-1">
              <XCircle size={12} /> 이 캠페인은 반려 처리되었습니다.
            </p>
          )}
        </div>

        {/* Tab toggle */}
        <div className="flex border-b border-border">
          {(['info', 'history'] as const).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                activeSection === s
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {s === 'info' ? '신청 정보' : '처리 이력'}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {activeSection === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '선교사', value: request.missionary },
                  { label: '연락처', value: request.phone },
                  { label: '이메일', value: request.email },
                  { label: '파송 단체', value: request.organization },
                  { label: '사역 국가', value: request.country },
                  { label: '모금 기간', value: `${request.duration}일` },
                ].map(row => (
                  <div key={row.label} className="bg-muted/60 rounded-xl p-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{row.label}</p>
                    <p className="text-sm font-semibold text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground mb-0.5">목표 모금액</p>
                <p className="text-xl font-bold text-primary">₩ {request.goalAmount.toLocaleString()}</p>
              </div>
              <div className="bg-muted/60 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground mb-1">사역 설명</p>
                <p className="text-sm text-foreground leading-relaxed">{request.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: '담당자',    value: request.handlerName    ?? '미배정', done: !!request.handlerName    },
                  { label: '승인자',    value: request.approverName   ?? '미배정', done: !!request.approverName   },
                  { label: '최종 승인자', value: request.finalApproverName ?? '미배정', done: !!request.finalApproverName },
                ].map(r => (
                  <div key={r.label} className={cn('rounded-xl p-3 border', r.done ? 'border-primary/30 bg-accent' : 'border-border bg-muted/40')}>
                    <p className="text-[10px] text-muted-foreground mb-0.5">{r.label}</p>
                    <p className={cn('text-sm font-semibold', r.done ? 'text-primary' : 'text-muted-foreground')}>{r.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'history' && (
            <HistoryTimeline entries={request.history} />
          )}
        </div>

        {/* Action footer */}
        {canAct && (
          <div className="border-t border-border px-6 py-4 space-y-3 bg-card">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">처리자 이름</label>
                <input
                  type="text"
                  value={actor}
                  onChange={e => setActor(e.target.value)}
                  placeholder="본인 이름 입력"
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">현재 처리 단계</label>
                <div className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-muted/50 text-muted-foreground">
                  {currentStageLabel}
                </div>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-muted-foreground mb-1 block">처리 의견 <span className="text-destructive">*</span></label>
              <textarea
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="검토 의견, 요청 사항 또는 반려 사유를 입력하세요."
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                disabled={!comment.trim() || !actor.trim()}
                onClick={() => { onAction(request.id, 'comment', comment, actor, currentStageLabel); setComment(''); setActor('') }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors disabled:opacity-40"
              >
                <MessageSquare size={14} /> 의견 등록
              </button>
              <button
                disabled={!comment.trim() || !actor.trim()}
                onClick={() => { onAction(request.id, 'reject', comment, actor, currentStageLabel); onClose() }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-40"
              >
                <XCircle size={14} /> 반려
              </button>
              <button
                disabled={!comment.trim() || !actor.trim()}
                onClick={() => { onAction(request.id, 'approve', comment, actor, currentStageLabel); onClose() }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-[oklch(0.44_0.12_195)] transition-colors disabled:opacity-40 ml-auto"
              >
                {request.stage === 'final' ? (
                  <><CheckCircle2 size={14} /> 최종 승인 및 등록</>
                ) : (
                  <><ArrowRight size={14} /> 승인 후 이관</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── KPI Strip ─────────────────────────────────────────────────────────────────

function ApprovalKPI({ requests }: { requests: CampaignRequest[] }) {
  const counts = {
    total:    requests.length,
    pending:  requests.filter(r => ['submitted','handler','approver','final'].includes(r.stage)).length,
    approved: requests.filter(r => r.stage === 'approved').length,
    rejected: requests.filter(r => r.stage === 'rejected').length,
  }
  const kpis = [
    { label: '전체 신청',     value: counts.total,    icon: ClipboardList, color: 'text-foreground',    bg: 'bg-muted'         },
    { label: '처리 대기',     value: counts.pending,  icon: Clock,         color: 'text-amber-700',     bg: 'bg-amber-50'      },
    { label: '등록 완료',     value: counts.approved, icon: CheckCircle2,  color: 'text-primary',       bg: 'bg-accent'        },
    { label: '반려',          value: counts.rejected, icon: XCircle,       color: 'text-destructive',   bg: 'bg-destructive/10'},
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map(k => {
        const Icon = k.icon
        return (
          <div key={k.label} className={cn('rounded-2xl p-4 flex items-center gap-3 border border-border', k.bg)}>
            <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center shadow-sm border border-border flex-shrink-0">
              <Icon size={18} className={k.color} />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">{k.label}</p>
              <p className={cn('text-2xl font-bold', k.color)}>{k.value}<span className="text-sm font-normal ml-0.5">건</span></p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CampaignApprovalTab() {
  const [requests, setRequests] = useState<CampaignRequest[]>(INITIAL_REQUESTS)
  const [filter, setFilter] = useState<ApprovalStage | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const selected = requests.find(r => r.id === selectedId) ?? null

  const filtered = requests.filter(r => {
    const matchStage  = filter === 'all' || r.stage === filter
    const matchSearch = !search || r.title.includes(search) || r.missionary.includes(search) || r.country.includes(search)
    return matchStage && matchSearch
  })

  function toggleExpand(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleAction(
    id: string,
    action: 'approve' | 'reject' | 'comment',
    comment: string,
    actor: string,
    actorRole: string,
  ) {
    setRequests(prev => prev.map(r => {
      if (r.id !== id) return r

      const now = new Date().toLocaleString('ko-KR', { hour12: false }).replace(/\. /g, '-').replace('.', '').trim()

      const newEntry: HistoryEntry = {
        id: `h${r.history.length + 1}`,
        stage: r.stage,
        action: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'commented',
        actor,
        actorRole,
        comment,
        timestamp: now,
      }

      if (action === 'comment') {
        return { ...r, history: [...r.history, newEntry] }
      }

      if (action === 'reject') {
        return { ...r, stage: 'rejected' as ApprovalStage, history: [...r.history, newEntry] }
      }

      // approve → advance stage
      const stageIdx = STAGE_SEQUENCE.indexOf(r.stage)
      const nextStage = STAGE_SEQUENCE[stageIdx + 1] ?? 'approved'

      const extraEntries: HistoryEntry[] = [newEntry]

      if (nextStage === 'approved') {
        extraEntries.push({
          id: `h${r.history.length + 2}`,
          stage: 'approved',
          action: 'registered',
          actor: '이시스템',
          actorRole: '시스템',
          comment: '캠페인이 플랫폼에 등록되어 공개되었습니다.',
          timestamp: now,
        })
      } else {
        const stageLabel = STAGE_META[nextStage].label
        extraEntries.push({
          id: `h${r.history.length + 2}`,
          stage: nextStage,
          action: 'assigned',
          actor: '이시스템',
          actorRole: '시스템',
          comment: `${stageLabel} 단계로 이관되었습니다.`,
          timestamp: now,
        })
      }

      return { ...r, stage: nextStage as ApprovalStage, history: [...r.history, ...extraEntries] }
    }))
  }

  return (
    <div className="space-y-5">
      <ApprovalKPI requests={requests} />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="캠페인 제목, 선교사, 국가 검색"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={13} className="text-muted-foreground mr-1" />
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors',
                filter === f.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground',
              )}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className="ml-1 opacity-70">
                  {requests.filter(r => r.stage === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            조건에 맞는 신청 건이 없습니다.
          </div>
        )}
        {filtered.map(req => {
          const isExpanded = expandedIds.has(req.id)
          const lastEntry  = req.history[req.history.length - 1]

          return (
            <div key={req.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* Row header */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <StageBadge stage={req.stage} />
                    <span className="text-[11px] text-muted-foreground">{req.id}</span>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">접수: {req.submittedAt}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{req.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={11} />{req.missionary}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} />{req.country}</span>
                    <span className="flex items-center gap-1"><Target size={11} />₩ {req.goalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Mini step indicator */}
                <div className="hidden lg:flex items-center gap-1">
                  {(['submitted','handler','approver','final','approved'] as ApprovalStage[]).map((s, i, arr) => {
                    const stageIdx   = req.stage === 'rejected' ? -1 : STAGE_SEQUENCE.indexOf(req.stage)
                    const stepIdx    = STAGE_SEQUENCE.indexOf(s)
                    const isDone     = req.stage !== 'rejected' && stageIdx > stepIdx
                    const isCurrent  = req.stage !== 'rejected' && stageIdx === stepIdx
                    return (
                      <div key={s} className="flex items-center">
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          isDone    ? 'bg-primary'          : '',
                          isCurrent ? 'bg-primary ring-2 ring-primary/30 ring-offset-1' : '',
                          !isDone && !isCurrent ? 'bg-border' : '',
                          req.stage === 'rejected' ? 'bg-border' : '',
                        )} />
                        {i < arr.length - 1 && <div className={cn('w-3 h-px', isDone ? 'bg-primary' : 'bg-border')} />}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleExpand(req.id)}
                    className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                    title="이력 펼치기"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => setSelectedId(req.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-[oklch(0.44_0.12_195)] transition-colors"
                  >
                    <FileText size={13} /> 처리
                  </button>
                </div>
              </div>

              {/* Inline step bar */}
              <div className="px-5 pb-3 pt-1 border-t border-border/50 bg-muted/30">
                <StepBar stage={req.stage} />
              </div>

              {/* Collapsed quick-history */}
              {!isExpanded && lastEntry && (
                <div className="px-5 pb-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 flex-shrink-0">
                    {(() => { const am = ACTION_META[lastEntry.action]; const Icon = am.icon; return <Icon size={12} className={am.iconColor} /> })()}
                  </span>
                  <p className="line-clamp-1">{lastEntry.comment || '— 의견 없음'}</p>
                  <time className="ml-auto whitespace-nowrap">{lastEntry.timestamp}</time>
                </div>
              )}

              {/* Expanded full timeline */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mt-4 mb-3 flex items-center gap-1.5">
                    <Clock size={12} /> 전체 처리 이력 ({req.history.length}건)
                  </p>
                  <HistoryTimeline entries={req.history} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          request={selected}
          onClose={() => setSelectedId(null)}
          onAction={handleAction}
        />
      )}
    </div>
  )
}
