import axios from "axios";

/* "1분", "30초", "없음" → 초 */
function timeToSec(v) {
  if (!v) return 0;
  const s = String(v).trim();
  if (s === "없음") return 0;
  const m = s.match(/(\d+)\s*(분|초)?/);
  if (!m) return 0;
  const n = parseInt(m[1], 10);
  return m[2] === "분" ? n * 60 : n;
}

/* 총 운동 시간(초) 계산: 각 운동의 (세트수 * 세트시간 + (세트수-1)*휴식) 합산 */
function calcDurationSec(korJson) {
  const list = korJson?.["루틴내 운동"] ?? [];
  return list.reduce((sum, e) => {
    const sets = Number(e["세트 수"] ?? 1);
    const perSet = timeToSec(e["세트당 운동시간"]);
    const rest = timeToSec(e["휴식시간"]);
    const workout = sets * perSet;
    const breaks = Math.max(sets - 1, 0) * rest;
    return sum + workout + breaks;
  }, 0);
}

/* 이름→ID 매핑 (백엔드에서 [ {id,name}, ... ] 반환한다고 가정) */
async function fetchExerciseMap() {
  const { data } = await axios.get("http://localhost:329/web/api/exercises", {
    withCredentials: true,
  });
  const map = {};
  (data ?? []).forEach((x) => {
    if (x?.name && x?.id != null) map[x.name] = x.id;
  });
  return map;
}

/* routine_exercise용 아이템 배열 생성 */
function buildRoutineExerciseItems(korJson, nameToId = {}) {
  const list = korJson?.["루틴내 운동"] ?? [];
  return list.map((e, i) => ({
    exercise_id: nameToId[e["운동 이름"]] ?? null,   // 매칭 실패 시 null 허용
    sets: Number(e["세트 수"] ?? 1),
    reps: Number(e["운동 횟수"] ?? 0),
    exercise_time: timeToSec(e["세트당 운동시간"]),
    order: i + 1,
    breaktime: timeToSec(e["휴식시간"]),
  }));
}

/* 최종 저장: routine → routine_exercise */
export async function saveRoutineFromChatbot(korJson, userEmail) {
  if (!korJson) throw new Error("루틴 데이터가 없습니다.");

  const title = korJson["루틴 이름"] ?? "추천 루틴";
  const summary = "챗봇 추천 루틴";
  const duration = calcDurationSec(korJson);

  // 1) routine 생성
  const { data: created } = await axios.post(
    "http://localhost:329/web/api/user-routines",   // ← routine 테이블 저장 API
    { email: userEmail, title, summary, duration },
    { withCredentials: true }
  );
  const routine_id = created?.routineId ?? created?.id;
  if (!routine_id) throw new Error("routine_id를 받지 못했습니다.");

  // 2) routine_exercise 일괄 저장
  const nameToId = await fetchExerciseMap(); // 백엔드 없으면 지우고 아래에서 exercise_id: null로 저장해도 됨
  const items = buildRoutineExerciseItems(korJson, nameToId);

  await axios.post(
    `http://localhost:329/web/api/user-routines/${routine_id}/exercises`, // ← 상세 저장 API
    { routineId: routine_id, items }, // [{exercise_id,sets,reps,exercise_time,order,breaktime}, ...]
    { withCredentials: true }
  );

  return routine_id;
}
