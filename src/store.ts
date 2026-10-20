import { createStore } from 'vuex';

export interface RootState {
  // 原有状态
  activeCategory: 'park' | 'enterprise';
  activeMainTab: 'general' | 'operation' | 'environment' | 'energy';
  selectedYear: '2025' | '2026';
  activeWaterRiver: 'tongcungang' | 'xinjinghe';
  activePark: 'center' | 'east' | 'west';
  customToast: string | null;

  // 新增：地图筛选
  mapFilterZone: 'all' | 'east' | 'center' | 'west';
  mapFilterIndustry: 'all' | 'crystal' | 'support';
  mapFilterScale: 'all' | 'large' | 'medium' | 'small';

  // 新增：企业选择（一企一档）
  selectedEnterpriseId: string | null;
  selectedBuildingId: string | null;
  showEnterprisePanel: boolean;
}

export default createStore<RootState>({
  state() {
    return {
      activeCategory: 'park',
      activeMainTab: 'general',
      selectedYear: '2025',
      activeWaterRiver: 'tongcungang',
      activePark: 'center',
      customToast: null,
      mapFilterZone: 'center',
      mapFilterIndustry: 'all',
      mapFilterScale: 'all',
      selectedEnterpriseId: null,
      selectedBuildingId: null,
      showEnterprisePanel: false,
    };
  },
  mutations: {
    setCategory(state, cat: 'park' | 'enterprise') {
      state.activeCategory = cat;
    },
    setMainTab(state, tab: 'general' | 'operation' | 'environment' | 'energy') {
      state.activeMainTab = tab;
    },
    setYear(state, year: '2025' | '2026') {
      state.selectedYear = year;
    },
    setWaterRiver(state, river: 'tongcungang' | 'xinjinghe') {
      state.activeWaterRiver = river;
    },
    setPark(state, park: 'center' | 'east' | 'west') {
      state.activePark = park;
    },
    setToast(state, msg: string | null) {
      state.customToast = msg;
    },
    // 新增 mutations
    setMapFilterZone(state, zone: 'all' | 'east' | 'center' | 'west') {
      state.mapFilterZone = zone;
    },
    setMapFilterIndustry(state, industry: 'all' | 'crystal' | 'support') {
      state.mapFilterIndustry = industry;
    },
    setMapFilterScale(state, scale: 'all' | 'large' | 'medium' | 'small') {
      state.mapFilterScale = scale;
    },
    setSelectedEnterprise(state, id: string | null) {
      state.selectedEnterpriseId = id;
      state.showEnterprisePanel = id !== null;
    },
    setSelectedBuilding(state, id: string | null) {
      state.selectedBuildingId = id;
    },
    setShowEnterprisePanel(state, show: boolean) {
      state.showEnterprisePanel = show;
      if (!show) {
        state.selectedEnterpriseId = null;
      }
    },
  },
  actions: {
    triggerToast({ commit }, msg: string) {
      commit('setToast', msg);
    },
    selectEnterprise({ commit }, id: string) {
      commit('setSelectedEnterprise', id);
    },
    closeEnterprisePanel({ commit }) {
      commit('setShowEnterprisePanel', false);
    },
  }
});
