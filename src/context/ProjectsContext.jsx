import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { API_BASE_URL } from "../config/api.js";
import { projects as fallbackProjects, categories as fallbackCategories } from "../data/projects.js";

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(fallbackProjects);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load projects: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
        if (data.categories && typeof data.categories === "object") {
          setCategories(data.categories);
        }
        setError(null);
      }
    } catch (err) {
      // Retain fallback data gracefully if API is temporarily unavailable
      console.warn("Public projects API unavailable, using local fallback:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const value = {
    projects,
    categories,
    loading,
    error,
    refreshProjects: fetchProjects,
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    // Graceful fallback if consumed outside ProjectsProvider
    return {
      projects: fallbackProjects,
      categories: fallbackCategories,
      loading: false,
      error: null,
      refreshProjects: () => {},
    };
  }
  return context;
}

