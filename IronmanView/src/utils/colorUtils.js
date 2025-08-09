// src/utils/colorUtils.js
// ✅ 기간/라벨 집합에 따라 "유동적으로" 색을 재매핑.
//    - 같은 기간/라벨셋이면 항상 동일, 기간/라벨이 바뀌면 자동으로 새 매핑.
//    - 충분히 큰 팔레트 + 부족분은 HSL 해시로 무한 생성.

export const BIG_PALETTE = [
    "#FF6B6B","#4D96FF","#6BCB77","#FFD166","#A66CFF","#45DFB1","#F06595","#2EC4B6",
    "#FFA69E","#5C7AEA","#8AC926","#F77F00","#C77DFF","#00C2A8","#FF8FAB","#00A8E8",
    "#F9C74F","#577590","#B8E986","#F94144","#90BE6D","#277DA1","#F3722C","#43AA8B",
    "#F8961E","#577399","#C2E812","#C8553D","#118AB2","#9B5DE5","#5DD9C1","#F15BB5",
    "#00BBF9","#FEE440","#4ECDC4","#E63946","#6A4C93","#06D6A0","#FFCA3A","#26547C",
    "#EF476F","#219EBC","#8D99AE","#2B9348","#A7C957","#5E60CE","#80ED99","#FF595E",
    "#1982C4","#6A994E","#FFBE0B","#9C89B8","#2AB7CA","#E76F51","#3A86FF","#8338EC",
    "#FFBF69","#B5179E","#4895EF","#4CAF50"
  ];
  
  // 문자열 해시 (32bit FNV-1a)
  const strHash = (s) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  
  // 시드 기반 xorshift32
  const xorshift32 = (seed) => {
    let x = seed || 123456789;
    return () => {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
      return (x >>> 0);
    };
  };
  
  // 시드 기반 Fisher–Yates 셔플
  const shuffleWithSeed = (arr, seedStr) => {
    const a = arr.slice();
    const rnd = xorshift32(strHash(seedStr) || 1);
    for (let i = a.length - 1; i > 0; i--) {
      const r = rnd() / 0xFFFFFFFF;
      const j = Math.floor(r * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  
  // 라벨명 → HSL (어두운 배경에서 잘 보이도록 채도/명도 범위 고정)
  const hashToHsl = (label, seedStr = "") => {
    const hSeed = strHash(label + "|" + seedStr);
    const sSeed = strHash(label + "|s|" + seedStr);
    const lSeed = strHash(label + "|l|" + seedStr);
    const h = hSeed % 360;                 // 0~359
    const s = 65 + (sSeed % 20);           // 65~84
    const l = 52 + (lSeed % 10);           // 52~61
    return `hsl(${h}deg, ${s}%, ${l}%)`;
  };
  
  // HEX → RGBA
  export const hexToRgba = (hex, a = 0.28) => {
    const m = hex.replace('#','');
    const bigint = parseInt(m.length === 3 ? m.split('').map(c=>c+c).join('') : m, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };
  
  // HSL 밝기 살짝 올리기
  export const lightenHsl = (hsl, delta = 8) => {
    const m = hsl.match(/hsl\((\d+)[^\d]+(\d+)%[^\d]+(\d+)%\)/i);
    if (!m) return hsl;
    const h = +m[1], s = +m[2], l = Math.min(95, +m[3] + delta);
    return `hsl(${h}deg, ${s}%, ${l}%)`;
  };
  
  // HEX 밝기 살짝 올리기
  export const lightenHex = (hex, amt = 12) => {
    let col = hex.replace('#','');
    if (col.length === 3) col = col.split('').map(c=>c+c).join('');
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0xFF) + amt;
    let b = (num & 0xFF) + amt;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `#${((r<<16)|(g<<8)|b).toString(16).padStart(6,'0')}`;
  };
  
  // ✅ 핵심: 주어진 라벨 배열 + 시그니처(기간/라벨셋)를 기반으로 동적 색 매핑.
  //  - 팔레트를 "시그니처로 셔플"해서 앞에서부터 배정 → 라벨셋/기간이 바뀌면 결과 색도 달라짐.
  //  - 팔레트가 모자라면 라벨명+시그니처로 HSL 생성.
  export const buildColorMap = (labels, signature = "") => {
    const shuffled = shuffleWithSeed(BIG_PALETTE, signature);
    const map = {};
    labels.forEach((label, idx) => {
      map[label] = idx < shuffled.length ? shuffled[idx] : hashToHsl(label, signature);
    });
    return map;
  };
  