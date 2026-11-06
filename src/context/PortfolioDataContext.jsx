import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config/api.js";
import { skillCategories as fallbackSkills } from "../data/skills.js";
import { experience as fallbackExperience } from "../data/experience.js";
import { reviews as fallbackReviews } from "../data/reviews.js";
import { about } from "../data/about.js";

function useSafeLocation() {
  try {
    return useLocation();
  } catch {
    return null;
  }
}

const fallbackEducation = about.education || [];

const fallbackCertificates = [
  {
    id: "00000000-0000-0000-0000-000000000401",
    category: "UI/UX DESIGN",
    title: "UI/UX Design Career Track Program",
    organization: "OSTAD",
    date: "Issued August 2026",
    dateIssued: "Issued August 2026",
    certificateType: "Certificate of Completion",
    image: "/images/certificates/ostad_marks_uiux.png",
    url: "https://ostad.app/share/certificate/c47328-sumaiya-jannat-arpa",
  },
  {
    id: "00000000-0000-0000-0000-000000000402",
    category: "UI/UX DESIGN",
    title: "UI/UX Design Career Track Program",
    organization: "OSTAD",
    date: "Issued August 2026",
    dateIssued: "Issued August 2026",
    certificateType: "Certificate of Assessment",
    image: "/images/certificates/ostad_certificate_uiux.png",
    url: "https://ostad.app/share/certificate/c47329-sumaiya-jannat-arpa",
  },
  {
    id: "00000000-0000-0000-0000-000000000403",
    category: "ACADEMIC HONOR",
    title: "100% Merit Scholarship",
    organization: "East West University",
    date: "March 2023",
    dateIssued: "March 2023",
    description: "Awarded for four years, from Fall 2022 to Summer 2026, on the basis of SSC and HSC results.",
    image: "/images/certificates/meritEWU.png",
    url: "https://www.ewubd.edu/storage/app/uploads/public/633/955/5d0/6339555d01897026666955.pdf",
  },
  {
    id: "00000000-0000-0000-0000-000000000404",
    category: "SCHOLARSHIP",
    title: "Medha Lalon Fund Scholarship",
    organization: "East West University",
    date: "September 2025",
    dateIssued: "September 2025",
    description: "Scholarship of BDT 45,000 covering Fall 2025, Spring 2026 and Summer 2026.",
  },
  {
    id: "00000000-0000-0000-0000-000000000405",
    category: "AI & DATA",
    title: "Data Analytics in the AI Era",
    organization: "Grameenphone Ltd.",
    date: "October 2026",
    dateIssued: "October 2026",
    certificateType: "Certificate of Completion",
    image: "/images/certificates/dataAnalytics_gp.png",
    url: "https://www.grameenphone.academy/cert/4d0d76a94ed7",
  },
  {
    id: "00000000-0000-0000-0000-000000000406",
    category: "AI & DATA",
    title: "Data Foundations with AI",
    organization: "Grameenphone Ltd.",
    date: "September 2026",
    dateIssued: "September 2026",
    certificateType: "Certificate of Completion",
    image: "/images/certificates/dataFoundations_gp.png",
    url: "https://www.grameenphone.academy/cert/8967ba193ae6",
  },
  {
    id: "00000000-0000-0000-0000-000000000407",
    category: "AI & DATA",
    title: "AI-Powered Analytics",
    organization: "Grameenphone Ltd.",
    date: "September 2026",
    dateIssued: "September 2026",
    certificateType: "Certificate of Completion",
    image: "/images/certificates/aiAnalytics_gp.png",
    url: "https://www.grameenphone.academy/cert/328de029d7fb",
  },
  {
    id: "00000000-0000-0000-0000-000000000408",
    category: "AI & DATA",
    title: "From Insights to Influence",
    organization: "Grameenphone Ltd.",
    date: "September 2026",
    dateIssued: "September 2026",
    certificateType: "Certificate of Completion",
    image: "/images/certificates/insights2influence_gp.png",
    url: "https://www.grameenphone.academy/cert/7acbf531d985",
  },
  {
    id: "00000000-0000-0000-0000-000000000409",
    category: "PROFESSIONAL DEVELOPMENT",
    title: "Unlock Career Opportunities – ERP Decoded",
    organization: "Dot BD Solutions Limited",
    date: "December 2025",
    dateIssued: "December 2025",
    certificateType: "Certificate of Participation",
    image: "/images/certificates/dotBD_career.png",
  },
  {
    id: "00000000-0000-0000-0000-000000000410",
    category: "COMPETITION",
    title: "1st IELC National English Language Carnival",
    organization: "Ideal English Language Club (IELC)",
    date: "January 2017",
    dateIssued: "January 2017",
    description: "Wall Magazine Competition. Associated with Ideal School and College.",
    certificateType: "Participation Certificate",
    image: "/images/certificates/ielcPrize.png",
  },
  {
    id: "00000000-0000-0000-0000-000000000411",
    category: "CERTIFICATE ARCHIVE",
    title: "Other Certificates and Crests",
    organization: "School achievements",
    date: "",
    dateIssued: "",
    description: "A collection of certificates and crests from school days.",
    image: "/images/certificates/otherCertficates.png",
  },
  {
    id: "00000000-0000-0000-0000-000000000412",
    category: "NATIONAL RECOGNITION",
    title: "Children's Gathering with the Honorable President",
    organization: "Bangladesh Shishu Academy",
    date: "2015",
    dateIssued: "2015",
    certificateType: "Official Participant Pass",
    description: "Selected as a trainee of Bangladesh Shishu Academy to participate in the special children’s gathering with the Honorable President at Bangabhaban (2015).",
    image: "/images/certificates/shishuAcademy.png",
  },
  {
    id: "00000000-0000-0000-0000-000000000413",
    category: "PERFORMING ARTS",
    title: "Classical Dance",
    organization: "Bangladesh Shishu Academy, Dhaka, Bangladesh",
    date: "July 2013 – June 2016",
    dateIssued: "July 2013 – June 2016",
    certificateType: "Completion Certificate",
    description: "Completed a three-year certificate course in Nrittyakala (Classical Dance), gaining experience in classical and contemporary dance forms. Performed in cultural programs and annual dance showcases, including events on BTV and Ittadi. Collaborated in choreography and group performances, strengthening teamwork, coordination and confidence.",
    image: "/images/certificates/dance_shishuAcademy.png",
  },
  {
    id: "00000000-0000-0000-0000-000000000414",
    category: "VISUAL ARTS",
    title: "Drawing and Painting",
    organization: "Bangladesh Shishu Academy, Dhaka, Bangladesh",
    date: "July 2010 – June 2013",
    dateIssued: "July 2010 – June 2013",
    certificateType: "Completion Certificate",
    description: "Completed a three-year certificate course in drawing and painting, focusing on visual composition, creativity and fine arts fundamentals. Participated in art exhibitions and creative workshops, including activities associated with Channel i.",
    image: "/images/certificates/art_shishuAcademy.png",
  },
];

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const location = useSafeLocation();
  const [skills, setSkills] = useState(fallbackSkills);
  const [experience, setExperience] = useState(fallbackExperience);
  const [education, setEducation] = useState(fallbackEducation);
  const [certificates, setCertificates] = useState(fallbackCertificates);
  const [reviews, setReviews] = useState(fallbackReviews);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [skillsRes, expRes, eduRes, certRes, revRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/skills`, { headers: { Accept: "application/json" } }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch(`${API_BASE_URL}/api/experience`, { headers: { Accept: "application/json" } }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch(`${API_BASE_URL}/api/education`, { headers: { Accept: "application/json" } }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch(`${API_BASE_URL}/api/certificates`, { headers: { Accept: "application/json" } }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
        fetch(`${API_BASE_URL}/api/reviews`, { headers: { Accept: "application/json" } }).then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        }),
      ]);

      let anySuccess = false;

      if (skillsRes.status === "fulfilled" && skillsRes.value?.success && Array.isArray(skillsRes.value.skills)) {
        setSkills(skillsRes.value.skills);
        anySuccess = true;
      }
      if (expRes.status === "fulfilled" && expRes.value?.success && Array.isArray(expRes.value.experience)) {
        setExperience(expRes.value.experience);
        anySuccess = true;
      }
      if (eduRes.status === "fulfilled" && eduRes.value?.success && Array.isArray(eduRes.value.education)) {
        setEducation(eduRes.value.education);
        anySuccess = true;
      }
      if (certRes.status === "fulfilled" && certRes.value?.success && Array.isArray(certRes.value.certificates)) {
        setCertificates(certRes.value.certificates);
        anySuccess = true;
      }
      if (revRes.status === "fulfilled" && revRes.value?.success && Array.isArray(revRes.value.reviews)) {
        setReviews(revRes.value.reviews);
        anySuccess = true;
      }

      if (anySuccess) {
        setHasLoaded(true);
        setError(null);
      } else {
        setError("Failed to fetch public portfolio data");
      }
    } catch (err) {
      console.warn("Public portfolio data API unavailable, using fallback:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Window focus listener: re-fetch if admin modified records in another tab or window
  useEffect(() => {
    const handleFocus = () => {
      loadData();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadData]);

  // Re-sync on public navigation
  useEffect(() => {
    if (location && !location.pathname.startsWith("/admin")) {
      loadData();
    }
  }, [location?.pathname, loadData]);

  const value = {
    skills,
    experience,
    education,
    certificates,
    reviews,
    loading,
    hasLoaded,
    error,
    refreshAll: loadData,
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const ctx = useContext(PortfolioDataContext);
  if (!ctx) {
    return {
      skills: fallbackSkills,
      experience: fallbackExperience,
      education: fallbackEducation,
      certificates: fallbackCertificates,
      reviews: fallbackReviews,
      loading: false,
      hasLoaded: false,
      error: null,
      refreshAll: () => {},
    };
  }
  return ctx;
}

export function useSkills() {
  const { skills, hasLoaded, loading, error, refreshAll } = usePortfolioData();
  return { skills, hasLoaded, loading, error, refreshSkills: refreshAll };
}

export function useExperience() {
  const { experience, hasLoaded, loading, error, refreshAll } = usePortfolioData();
  return { experience, hasLoaded, loading, error, refreshExperience: refreshAll };
}

export function useEducation() {
  const { education, hasLoaded, loading, error, refreshAll } = usePortfolioData();
  return { education, hasLoaded, loading, error, refreshEducation: refreshAll };
}

export function useCertificates() {
  const { certificates, hasLoaded, loading, error, refreshAll } = usePortfolioData();
  return { certificates, hasLoaded, loading, error, refreshCertificates: refreshAll };
}

export function useReviews() {
  const { reviews, hasLoaded, loading, error, refreshAll } = usePortfolioData();
  return { reviews, hasLoaded, loading, error, refreshReviews: refreshAll };
}

