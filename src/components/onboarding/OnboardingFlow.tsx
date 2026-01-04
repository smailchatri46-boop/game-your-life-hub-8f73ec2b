import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingProgress } from "./OnboardingProgress";
import { IdentityStep } from "./steps/IdentityStep";
import { WhyWeExistStep } from "./steps/WhyWeExistStep";
import { TellUsAboutYouStep } from "./steps/TellUsAboutYouStep";
import { AboutYourselfStep } from "./steps/AboutYourselfStep";
import { HabitSuggestionsStep } from "./steps/HabitSuggestionsStep";
import { GoalsStep } from "./steps/GoalsStep";
import { CommitmentStep } from "./steps/CommitmentStep";
import { LoadingStep } from "./steps/LoadingStep";
import { SuccessStep } from "./steps/SuccessStep";

export function OnboardingFlow() {
  const navigate = useNavigate();
  const {
    currentStep,
    data,
    progress,
    goToNext,
    goToPrevious,
    goToStep,
    updateData,
    toggleFocusArea,
    toggleStruggle,
    toggleHabit,
    addCustomHabit,
    removeCustomHabit,
    toggleAffirmation,
    completeOnboarding,
    skipOnboarding,
  } = useOnboarding();

  const handleSkip = () => {
    skipOnboarding();
    navigate("/dashboard");
  };

  const handleSkipToWhyWeExist = () => {
    goToStep("why-we-exist");
  };

  const handleGoToDashboard = () => {
    completeOnboarding();
    navigate("/dashboard");
  };

  const handleAddMoreHabits = () => {
    completeOnboarding();
    navigate("/dashboard");
  };

  const handleStartJournaling = () => {
    completeOnboarding();
    navigate("/journal");
  };

  const handleCommitmentComplete = () => {
    goToNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case "about-focus":
        return (
          <AboutYourselfStep
            variant="focus"
            selectedItems={data.focusAreas}
            onToggleItem={toggleFocusArea}
            onNext={goToNext}
            onBack={goToPrevious}
            onSkip={handleSkip}
          />
        );

      case "about-struggle":
        return (
          <AboutYourselfStep
            variant="struggle"
            selectedItems={data.struggles}
            onToggleItem={toggleStruggle}
            onNext={goToNext}
            onBack={goToPrevious}
            onSkip={handleSkip}
          />
        );

      case "about-time":
        return (
          <AboutYourselfStep
            variant="time"
            selectedItems={[]}
            preferredTime={data.preferredTime}
            onToggleItem={() => {}}
            onSetTime={(time) => updateData({ preferredTime: time })}
            onNext={goToNext}
            onBack={goToPrevious}
            onSkip={handleSkip}
          />
        );

      case "tell-us-about-you":
        return (
          <TellUsAboutYouStep
            uniqueAbout={data.uniqueAbout}
            onSetUniqueAbout={(value) => updateData({ uniqueAbout: value })}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );

      case "why-we-exist":
        return (
          <WhyWeExistStep
            onNext={goToNext}
          />
        );

      case "goals":
        return (
          <GoalsStep
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );

      case "identity-1":
        return (
          <IdentityStep
            variant={1}
            onNext={goToNext}
            onSkip={handleSkipToWhyWeExist}
          />
        );

      case "identity-2":
        return (
          <IdentityStep
            variant={2}
            onNext={goToNext}
            onSkip={handleSkip}
          />
        );

      case "habit-suggestions":
        return (
          <HabitSuggestionsStep
            focusAreas={data.focusAreas}
            selectedHabits={data.selectedHabits}
            customHabits={data.customHabits}
            onToggleHabit={toggleHabit}
            onAddCustomHabit={addCustomHabit}
            onRemoveCustomHabit={removeCustomHabit}
            onNext={goToNext}
            onBack={goToPrevious}
          />
        );

      case "commitment":
        return (
          <CommitmentStep
            checkedAffirmations={data.checkedAffirmations}
            commitmentName={data.commitmentName}
            onToggleAffirmation={toggleAffirmation}
            onSetName={(name) => updateData({ commitmentName: name })}
            onComplete={handleCommitmentComplete}
            onBack={goToPrevious}
          />
        );

      case "loading":
        return <LoadingStep onComplete={goToNext} />;

      case "success":
        return (
          <SuccessStep
            commitmentName={data.commitmentName}
            onGoToDashboard={handleGoToDashboard}
            onAddMoreHabits={handleAddMoreHabits}
            onStartJournaling={handleStartJournaling}
          />
        );

      default:
        return null;
    }
  };

  const showProgress = currentStep !== "loading" && currentStep !== "success";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Progress bar */}
      {showProgress && <OnboardingProgress progress={progress} />}

      {/* Current step */}
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        {renderStep()}
      </div>
    </div>
  );
}
