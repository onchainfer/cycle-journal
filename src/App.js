import React from "react";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import Onboarding from "./components/Onboarding";
import HomeScreen from "./components/HomeScreen";
import JournalScreen from "./components/JournalScreen";
import LilithChatWithTriggers from "./components/LilithChatWithTriggers";
import CycleCalendar from "./components/CycleCalendar";
import ProfileSettings from "./components/ProfileSettings";
import { cycleManager } from "./utils/cycleManager";

// ═══════════════════════════════════════════════════════════════════════════════
// APP PRINCIPAL - Refactorizado con Estado Global Unificado
// ═══════════════════════════════════════════════════════════════════════════════

function AppContent() {
  const {
    // Estado unificado
    profile,
    currentCycle,
    currentCycleDay,
    currentPhase,
    cycleHistory,
    journalEntries,
    notes, // Legacy compatibility
    healthTeam,
    chatHistory,
    changes,
    activeNav,
    showSettings,
    isLoading,
    isInitialized,
    
    // Computed values
    todayNotes,
    todayKey,
    
    // Actions
    dispatch,
    AppActions,
    performHardReset,
    updateCycleDay
  } = useAppContext();

  // 🛡️ MODO INVENCIBLE: Monitorear cambios en profile
  React.useEffect(() => {
    if (profile && profile.onboardingCompleted) {
      console.log('✅ Profile state changed - Onboarding completed detected:', {
        name: profile.name,
        onboardingCompleted: profile.onboardingCompleted,
        timestamp: new Date().toISOString()
      });
    }
  }, [profile]);

  // ── HANDLERS ──────────────────────────────────────────────────────────────────
  
  // Completar onboarding e inicializar primer ciclo
  const handleOnboardingComplete = (profileData, language = 'en') => {
    console.log('🚨 ONBOARDING BUTTON CLICKED - handleOnboardingComplete called');
    console.log('📥 Received profile data (RAW):', profileData);
    
    // 🛡️ MODO INVENCIBLE: Normalizar datos con valores por defecto
    const today = new Date().toISOString().split('T')[0];
    
    const normalizedProfile = {
      // Datos del usuario (usar defaults si están vacíos)
      name: profileData.name || 'User',
      dob: profileData.dob || '',
      
      // 🛡️ CRÍTICO: Ciclo con valores por defecto obligatorios
      lastPeriod: profileData.lastPeriod || today,
      cycleLength: profileData.cycleLength || 'normal', // 'normal' = 28 días
      
      // Datos del período (opcionales, con defaults)
      periodFlow: profileData.periodFlow || '',
      periodColor: profileData.periodColor || [],
      periodPain: profileData.periodPain || '',
      
      // Condiciones de salud (opcionales)
      physicalConditions: profileData.physicalConditions || [],
      neuroConditions: profileData.neuroConditions || [],
      
      // Anticoncepción (opcional)
      contraception: profileData.contraception || '',
      contraceptionBrand: profileData.contraceptionBrand || '',
      contraceptionDuration: profileData.contraceptionDuration || '',
      
      // 🛡️ Medicaciones (asegurar array válido)
      medications: Array.isArray(profileData.medications) 
        ? profileData.medications.filter(m => m && (m.name || typeof m === 'string'))
        : [],
      noMeds: profileData.noMeds || false,
      
      // Estilo de vida (opcionales)
      kids: profileData.kids || '',
      sexualActivity: profileData.sexualActivity || '',
      exerciseFreq: profileData.exerciseFreq || '',
      exerciseTypes: profileData.exerciseTypes || [],
      sleep: profileData.sleep || '',
      nutrition: profileData.nutrition || [],
      nutritionExtra: profileData.nutritionExtra || '',
      
      // Objetivos (opcional)
      goal: profileData.goal || '',
      selfDescription: profileData.selfDescription || '',
      
      // 🛡️ FLAGS OBLIGATORIOS - SIEMPRE presentes
      onboardingCompleted: true,
      onboardingDate: new Date().toISOString()
    };
    
    console.log('🛡️ NORMALIZED PROFILE (con defaults):', {
      name: normalizedProfile.name,
      lastPeriod: normalizedProfile.lastPeriod,
      cycleLength: normalizedProfile.cycleLength,
      medications: normalizedProfile.medications.length,
      onboardingCompleted: normalizedProfile.onboardingCompleted
    });
    
    // 🛡️ GUARDAR PERFIL - ESTO SIEMPRE FUNCIONA
    console.log('💾 Dispatching SET_PROFILE (INVENCIBLE MODE)...');
    dispatch({ type: AppActions.SET_PROFILE, payload: normalizedProfile });
    
    console.log('🌍 Dispatching SET_LANGUAGE...');
    dispatch({ type: AppActions.SET_LANGUAGE, payload: language });
    
    console.log('✅ Profile saved successfully:', {
      name: normalizedProfile.name,
      onboardingCompleted: normalizedProfile.onboardingCompleted,
      medications: normalizedProfile.medications.length,
      lastPeriod: normalizedProfile.lastPeriod
    });
    
    // 🛡️ INICIALIZAR CICLO - Con try/catch para que NUNCA rompa
    try {
      const cycleLength = getCycleLengthFromProfile(normalizedProfile.cycleLength);
      const initialCycle = cycleManager.initializeFromOnboarding(
        normalizedProfile.lastPeriod, 
        cycleLength
      );
      
      dispatch({ type: AppActions.SET_CURRENT_CYCLE, payload: initialCycle });
      
      console.log('🧮 Cycle initialized:', {
        lastPeriod: new Date(normalizedProfile.lastPeriod).toDateString(),
        today: new Date().toDateString(),
        calculatedDay: initialCycle.currentDay,
        phase: initialCycle.phase
      });
      
    } catch (error) {
      console.warn('⚠️ Cycle initialization failed (non-critical):', error);
      console.log('✅ Profile still saved, continuing to Dashboard...');
    }
    
    console.log('🚀 Onboarding complete - Navigating to Dashboard...');
  };

  // Eventos de ciclo desde Lilith
  const handleCycleEvent = (action, data) => {
    console.log('📡 Cycle event received:', action, data);
    
    switch (action) {
      case "RESET_CYCLE":
      case "PERIOD_STARTED": {
        // Esta es la ÚNICA manera de marcar Día 1
        const newStartDate = data.fields?.startDate || new Date().toISOString();
        const additionalData = {
          flow: data.fields?.flow || null,
          source: 'lilith_confirmed',
          confirmedBy: 'user'
        };
        
        // FIX CRÍTICO: Capturar ciclo completado antes de crear nuevo
        const completedCycle = currentCycle ? { ...currentCycle } : null;
        
        const newCycle = cycleManager.startNewCycle(newStartDate, additionalData);
        dispatch({ type: AppActions.SET_CURRENT_CYCLE, payload: newCycle });
        
        // FIX CRÍTICO: Si había ciclo anterior, agregarlo al historial en el contexto también
        if (completedCycle) {
          // Sincronizar historial desde cycleManager
          dispatch({ 
            type: AppActions.ADD_TO_CYCLE_HISTORY, 
            payload: cycleManager.cycleHistory[cycleManager.cycleHistory.length - 1]
          });
        }
        
        dispatch({ 
          type: AppActions.ADD_CHANGE, 
          payload: {
            text: `New cycle started - Day 1${data.fields?.flow ? `. Flow: ${data.fields.flow}` : ''}`,
            type: "cycle",
            badge: "Period started",
          }
        });
        break;
      }

      case "LOG_PERIOD_END": {
        if (currentCycle) {
          const updatedCycle = {
            ...currentCycle,
            periodEndDate: new Date().toISOString(),
            phase: "follicular"
          };
          
          cycleManager.currentCycle = updatedCycle;
          cycleManager.saveCurrentCycle();
          dispatch({ type: AppActions.SET_CURRENT_CYCLE, payload: updatedCycle });
          
          dispatch({ 
            type: AppActions.ADD_CHANGE, 
            payload: {
              text: `Period ended. Duration: ${data.fields?.duration || "not specified"}`,
              type: "cycle",
              badge: "Period end",
            }
          });
        }
        break;
      }

      case "LOG_OVULATION": {
        if (currentCycle) {
          const updatedCycle = {
            ...currentCycle,
            ovulationDate: new Date().toISOString(),
            phase: "ovulation"
          };
          
          cycleManager.currentCycle = updatedCycle;
          cycleManager.saveCurrentCycle();
          dispatch({ type: AppActions.SET_CURRENT_CYCLE, payload: updatedCycle });
          
          dispatch({ 
            type: AppActions.ADD_CHANGE, 
            payload: {
              text: `Ovulation logged. Side: ${data.fields?.side || "not specified"}`,
              type: "cycle",
              badge: "Ovulation",
            }
          });
        }
        break;
      }

      case "LOG_SPOTTING":
      case "LOG_FLOW": {
        dispatch({ 
          type: AppActions.ADD_CHANGE, 
          payload: {
            text: action === "LOG_SPOTTING"
              ? `Spotting logged. Color: ${data.fields?.color || "not specified"}`
              : `Flow logged: ${data.fields?.flow || "not specified"}`,
            type: "cycle",
            badge: action === "LOG_SPOTTING" ? "Spotting" : "Flow",
          }
        });
        break;
      }

      case "UPDATE_CYCLE_DAY": {
        updateCycleDay();
        break;
      }

      default:
        console.log("Unknown cycle event:", action, data);
    }
  };

  // Usar las funciones del contexto (ya incluye el ID)
  const addNote = useAppContext().addNote;
  const deleteNote = useAppContext().deleteNote;
  const addNotes = useAppContext().addNotes;

  const addChange = (change) => {
    dispatch({ type: AppActions.ADD_CHANGE, payload: change });
  };

  // 💊 FIX CRÍTICO: setProfile debe soportar función updater
  const setProfile = (profileDataOrUpdater) => {
    // Si es una función (updater pattern), ejecutarla con el profile actual
    if (typeof profileDataOrUpdater === 'function') {
      const updatedProfile = profileDataOrUpdater(profile);
      
      console.log('💊 setProfile UPDATER MODE:', {
        previousMedications: profile?.medications?.length || 0,
        updatedMedications: updatedProfile?.medications?.length || 0,
        medicationsPreserved: updatedProfile?.medications
      });
      
      dispatch({ type: AppActions.SET_PROFILE, payload: updatedProfile });
    } else {
      // Modo directo (datos completos)
      console.log('💊 setProfile DIRECT MODE:', {
        medications: profileDataOrUpdater?.medications?.length || 0
      });
      
      dispatch({ type: AppActions.SET_PROFILE, payload: profileDataOrUpdater });
    }
  };

  const setActiveNav = (nav) => {
    dispatch({ type: AppActions.SET_ACTIVE_NAV, payload: nav });
  };

  // ── HELPER FUNCTIONS ──────────────────────────────────────────────────────────
  function getCycleLengthFromProfile(cycleLengthOption) {
    const cycleLengthMap = {
      "short": 23,
      "normal": 28,
      "long": 35,
      "irregular": 28,
      "unknown": 28
    };
    
    return cycleLengthMap[cycleLengthOption] || 28;
  }

  // ── SHARED PROPS para todos los componentes ──────────────────────────────────
  const sharedProps = {
    profile,
    setProfile,
    
    // Cycle data - UNIFICADO
    cycle: currentCycle, // Legacy compatibility
    currentCycle,
    currentCycleDay,
    currentPhase,
    cycleHistory,
    
    // Journal data
    notes,
    journalEntries,
    todayNotes,
    addNote,
    addNotes, // Para importación bulk
    deleteNote,
    
    // Health team & chat
    healthTeam,
    chatHistory,
    
    // Changes & navigation
    changes,
    addChange,
    activeNav,
    setActiveNav,
    
    // UI control
    onOpenSettings: () => dispatch({ type: AppActions.TOGGLE_SETTINGS }),
  };

  // ── LOADING STATE ─────────────────────────────────────────────────────────────
  if (!isInitialized || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0810',
        color: '#f0eaf8',
        fontFamily: 'DM Sans, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚸</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // ── ONBOARDING ────────────────────────────────────────────────────────────────
  // 🛡️ MODO INVENCIBLE: Si onboardingCompleted está presente, SIEMPRE mostrar Dashboard
  const needsOnboarding = !profile || !profile.onboardingCompleted;
  
  console.log('🔍 RENDER CHECK - App state:', {
    hasProfile: !!profile,
    profileName: profile?.name,
    onboardingCompleted: profile?.onboardingCompleted,
    hasLastPeriod: !!profile?.lastPeriod,
    needsOnboarding: needsOnboarding,
    willShow: needsOnboarding ? 'ONBOARDING' : 'DASHBOARD'
  });
  
  if (needsOnboarding) {
    console.log('🎯 Showing Onboarding screen');
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  console.log('✅ Showing Dashboard - User authenticated:', {
    name: profile.name,
    onboardingCompleted: profile.onboardingCompleted,
    medications: profile.medications?.length || 0,
    lastPeriod: profile.lastPeriod
  });

  // ── SETTINGS ──────────────────────────────────────────────────────────────────
  if (showSettings) {
    return (
      <ProfileSettings
        {...sharedProps}
        onBack={() => dispatch({ type: AppActions.TOGGLE_SETTINGS })}
        onReset={performHardReset}
        setActiveNav={(nav) => {
          dispatch({ type: AppActions.TOGGLE_SETTINGS });
          dispatch({ type: AppActions.SET_ACTIVE_NAV, payload: nav });
        }}
      />
    );
  }

  // ── MAIN APP NAVIGATION ──────────────────────────────────────────────────────
  switch (activeNav) {
    case "home":
      return <HomeScreen {...sharedProps} />;
      
    case "journal":
      return <JournalScreen {...sharedProps} />;
      
    case "lilith":
      return (
        <LilithChatWithTriggers
          {...sharedProps}
          onCycleEvent={handleCycleEvent}
        />
      );
      
    case "calendar":
      return <CycleCalendar {...sharedProps} />;
      
    default:
      return <HomeScreen {...sharedProps} />;
  }
}

// ── APP WRAPPER con Provider ──────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
