import { create } from 'zustand';

export const useModalStore = create((set) => ({
  modals: {},
  
  openModal: (modalId, data = null) => set((state) => ({
    modals: { ...state.modals, [modalId]: { isOpen: true, data } },
  })),
  
  closeModal: (modalId) => set((state) => ({
    modals: { ...state.modals, [modalId]: { isOpen: false, data: null } },
  })),
  
  isModalOpen: (modalId) => (state) => state.modals[modalId]?.isOpen || false,
  
  getModalData: (modalId) => (state) => state.modals[modalId]?.data || null,
}));
