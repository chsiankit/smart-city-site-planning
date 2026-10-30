import { useState, useEffect, useCallback, createContext, useContext, ReactNode, createElement } from 'react';
import initialProjectData from '../data/project.json';
import { ProjectData } from '../data/schema';
import { validateProjectData, ValidationErrorItem } from '../utils/validation';

const STORAGE_KEY = 'smart_city_project_data_override';

interface ProjectContextType {
  data: ProjectData;
  validationErrors: ValidationErrorItem[];
  isCustomized: boolean;
  updateProjectData: (newData: ProjectData) => void;
  resetProjectData: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => { success: boolean; error?: string };
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ProjectData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const val = validateProjectData(parsed);
        if (val.isValid && val.parsedData) {
          return val.parsedData;
        }
      }
    } catch {
      // fallback to initial
    }
    return initialProjectData as unknown as ProjectData;
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrorItem[]>([]);
  const [isCustomized, setIsCustomized] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    const val = validateProjectData(data);
    setValidationErrors(val.errors);
  }, [data]);

  const updateProjectData = useCallback((newData: ProjectData) => {
    setData(newData);
    setIsCustomized(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData, null, 2));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, []);

  const resetProjectData = useCallback(() => {
    setData(initialProjectData as unknown as ProjectData);
    setIsCustomized(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear localStorage:', e);
    }
  }, []);

  const exportJSON = useCallback(() => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-city-site-planning-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  const importJSON = useCallback((jsonString: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      const val = validateProjectData(parsed);
      if (!val.isValid || !val.parsedData) {
        const criticals = val.errors.filter((e) => e.category === 'Critical').map((e) => `${e.path}: ${e.message}`).join(', ');
        return { success: false, error: `Invalid project schema: ${criticals || 'Validation failed'}` };
      }
      setData(val.parsedData);
      setIsCustomized(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val.parsedData, null, 2));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Malformed JSON file' };
    }
  }, []);

  return createElement(
    ProjectContext.Provider,
    {
      value: {
        data,
        validationErrors,
        isCustomized,
        updateProjectData,
        resetProjectData,
        exportJSON,
        importJSON,
      },
    },
    children
  );
}

export function useProjectData(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectData must be used within a ProjectProvider');
  }
  return context;
}
