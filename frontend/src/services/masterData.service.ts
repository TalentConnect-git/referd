// services/masterData.service.ts
import axiosInstance from "@/lib/axiosInstance";

export interface MasterData {
  _id: string;
  type: string;
  value: string;
  parent?: string;
  isActive: boolean;
  isCustom: boolean;
  createdBy?: string;
}

export const getMasterData = async (
  type: string,
  parent?: string
): Promise<{ success: boolean; data: MasterData[] }> => {
  try {
    const params: any = { type };
    if (parent) {
      params.parent = parent;
    }
    
    const { data } = await axiosInstance.get("/api/master-data", { params });
    return data;
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error;
  }
};

export const createMasterData = async (
  type: string,
  value: string,
  parent?: string
): Promise<{ success: boolean; data: MasterData; msg?: string }> => {
  try {
    const { data } = await axiosInstance.post("/api/master-data", {
      type,
      value,
      parent: parent || null,
    });
    return data;
  } catch (error) {
    console.error("Error creating master data:", error);
    throw error;
  }
};