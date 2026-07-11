import AdSlot from "./AdSlot";

// 반응형 광고 배치 (카카오 애드핏)
//   - 웹(데스크톱, lg 이상): 화면 좌·우 세로 광고 (160×600)
//   - 앱(모바일, lg 미만): 화면 하단 고정 가로 광고 (320×100)
//   광고 단위 ID는 애드핏 심사 통과분을 기본값으로 사용하며, 필요 시 env로 override.
//   (애드핏 광고 단위 ID는 공개 값이라 클라이언트에 그대로 노출됨)

const UNIT_SIDE_LEFT =
  process.env.NEXT_PUBLIC_ADFIT_UNIT_SIDE_LEFT || "DAN-exdHoDajScRCl2Jj";
const UNIT_SIDE_RIGHT =
  process.env.NEXT_PUBLIC_ADFIT_UNIT_SIDE_RIGHT || "DAN-46vNdoBrHisHxu8q";
const UNIT_MOBILE =
  process.env.NEXT_PUBLIC_ADFIT_UNIT_MOBILE || "DAN-j2N5MaHx5Aq2DO4d";

export default function AdRails() {
  return (
    <>
      {/* 데스크톱: 좌측 세로 광고 */}
      <div className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
        <AdSlot unit={UNIT_SIDE_LEFT} width={160} height={600} />
      </div>

      {/* 데스크톱: 우측 세로 광고 */}
      <div className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
        <AdSlot unit={UNIT_SIDE_RIGHT} width={160} height={600} />
      </div>

      {/* 모바일: 하단 고정 가로 광고 */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center border-t border-white/20 bg-black/10 py-1.5 backdrop-blur-sm lg:hidden">
        <AdSlot unit={UNIT_MOBILE} width={320} height={100} />
      </div>
    </>
  );
}
