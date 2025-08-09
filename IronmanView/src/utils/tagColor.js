// src/utils/tagColor.js
const TAG_COLORS = [
    '#3E8E41', '#2A9D8F', '#7B61FF', '#F4A261', '#E76F51',
    '#00B4D8', '#FF6B6B', '#B8DE6F', '#9C89B8', '#F1C40F',
    '#6C5CE7', '#20BF6B', '#E84393', '#1ABC9C', '#E67E22'
  ];
  
  /**
   * 태그(예: "#하체")를 항상 동일한 색상으로 매핑
   * @param {string} tag
   * @returns {string} hex color
   */
  export const colorForTag = (tag) => {
    const s = String(tag);
    let h = 2166136261 >>> 0; // FNV-1a 해시
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return TAG_COLORS[h % TAG_COLORS.length];
  };
  