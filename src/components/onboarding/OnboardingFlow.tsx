import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingProgress } from "./OnboardingProgress";
import { WhyWeExistStep } from "./steps/WhyWeExistStep";
import { TellUsAboutYouStep } from "./steps/TellUsAboutYouStep";
import { AboutYourselfStep } from "./steps/AboutYourselfStep";
import { HabitSuggestionsStep } from "./steps/HabitSuggestionsStep";
import { GoalCreationStep } from "./steps/GoalCreationStep";
import { CommitmentStep } from "./steps/CommitmentStep";
import { LoadingStep } from "./steps/LoadingStep";
import { SuccessStep } from "./steps/SuccessStep";
import { SurveyQuestionStep } from "./steps/SurveyQuestionStep";
import { FeatureShowcaseStep } from "./steps/FeatureShowcaseStep";
import { FeatureIntroStep } from "./steps/FeatureIntroStep";
import { FeatureOutroStep } from "./steps/FeatureOutroStep";

const SURVEY_QUESTIONS = {
  "survey-1": {
    emoji: "👋",
    title: "Do you currently use an app to track your goals?",
    options: [
      { label: "Yes" },
      { label: "No" },
      { label: "Yes, but I don't like it" },
      { label: "I tried before but stopped using it" },
    ],
  },
  "survey-2": {
    emoji: "🎯",
    title: "Do your current apps combine everything in one place?",
    description: "Habits, to-dos, journaling, reflections, progress & AI guidance",
    options: [
      { label: "I use different apps for each thing" },
      { label: "No, my app doesn't do all of that" },
      { label: "Yes, but it's not perfect" },
      { label: "I don't track these things yet" },
    ],
  },
  "survey-3": {
    emoji: "📣",
    title: "Where did you hear about us?",
    options: [
      { label: "TikTok" },
      { label: "Instagram" },
      { label: "YouTube Shorts" },
      { label: "YouTube (Long Videos)" },
      { label: "Snapchat" },
      { label: "Pinterest" },
    ],
  },
  "survey-4": {
    emoji: "✨",
    title: "Would you like one app to track your entire life?",
    description: "Keep everything organized in one place",
    options: [
      { label: "Yes, that would be perfect" },
      { label: "Maybe, I'd like to try it" },
      { label: "I prefer using multiple apps" },
    ],
  },
  "survey-5": {
    emoji: "💬",
    title: "Do you ever chat with AI for advice or motivation?",
    options: [
      { label: "Yes, regularly" },
      { label: "Sometimes" },
      { label: "No, but I'd like to" },
      { label: "No, and I'm not interested" },
    ],
  },
  "survey-6": {
    emoji: "🧠",
    title: "Would an AI that sees your daily routine give better advice?",
    options: [
      { label: "Yes, that would be amazing" },
      { label: "Maybe, I'd like to try it" },
      { label: "No, not interested" },
    ],
  },
};

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
    toggleTrackingStruggle,
    toggleHabit,
    addCustomHabit,
    removeCustomHabit,
    toggleAffirmation,
    setSurveyAnswer,
    setCreatedHabits,
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
      case "survey-1":
        return (
          <SurveyQuestionStep
            {...SURVEY_QUESTIONS["survey-1"]}
            selectedOption={data.surveyAnswers.survey1}
            onSelectOption={(answer) => setSurveyAnswer("survey1", answer)}
            onNext={() => {
              // If user selected "No" or "I tried before but stopped using it", skip survey-2
              if (data.surveyAnswers.survey1 === "No" || data.surveyAnswers.survey1 === "I tried before but stopped using it") {
                goToStep("survey-4");
              } else {
                goToNext();
              }
            }}
            showInputForOptions={["Yes", "Yes, but I don't like it"]}
            inputLabel="Which app(s) do you use?"
            inputPlaceholder="e.g. Habitica, Notion, Todoist..."
            inputValue={data.currentApps}
            onInputChange={(value) => updateData({ currentApps: value })}
          />
        );

      case "survey-2":
        return (
          <SurveyQuestionStep
            {...SURVEY_QUESTIONS["survey-2"]}
            selectedOption={data.surveyAnswers.survey2}
            onSelectOption={(answer) => setSurveyAnswer("survey2", answer)}
            onNext={goToNext}
          />
        );

      case "survey-3":
        return (
          <SurveyQuestionStep
            {...SURVEY_QUESTIONS["survey-3"]}
            selectedOption={data.surveyAnswers.survey3}
            onSelectOption={(answer) => setSurveyAnswer("survey3", answer)}
            onNext={goToNext}
          />
        );

      case "survey-4":
        return (
          <SurveyQuestionStep
            {...SURVEY_QUESTIONS["survey-4"]}
            selectedOption={data.surveyAnswers.survey4}
            onSelectOption={(answer) => setSurveyAnswer("survey4", answer)}
            onNext={goToNext}
          />
        );

      case "survey-5":
        return (
          <SurveyQuestionStep
            {...SURVEY_QUESTIONS["survey-5"]}
            selectedOption={data.surveyAnswers.survey5}
            onSelectOption={(answer) => setSurveyAnswer("survey5", answer)}
            onNext={goToNext}
          />
        );

      case "survey-6":
        return (
          <SurveyQuestionStep
            {...SURVEY_QUESTIONS["survey-6"]}
            selectedOption={data.surveyAnswers.survey6}
            onSelectOption={(answer) => setSurveyAnswer("survey6", answer)}
            onNext={goToNext}
          />
        );

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
            selectedItems={data.trackingStruggles}
            onToggleItem={toggleTrackingStruggle}
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

      case "feature-intro":
        return <FeatureIntroStep onComplete={goToNext} />;

      case "feature-goals":
        return (
          <FeatureShowcaseStep
            variant="goals"
            onNext={goToNext}
            currentIndex={0}
            totalFeatures={4}
          />
        );

      case "feature-ai-buddy":
        return (
          <FeatureShowcaseStep
            variant="ai-buddy"
            onNext={goToNext}
            currentIndex={1}
            totalFeatures={4}
          />
        );

      case "feature-habits":
        return (
          <FeatureShowcaseStep
            variant="habits"
            onNext={goToNext}
            currentIndex={2}
            totalFeatures={4}
          />
        );

      case "feature-insights":
        return (
          <FeatureShowcaseStep
            variant="insights"
            onNext={goToNext}
            currentIndex={3}
            totalFeatures={4}
          />
        );

      case "feature-outro":
        return <FeatureOutroStep onComplete={goToNext} />;

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
            onHabitsChange={setCreatedHabits}
          />
        );

      case "goal-creation":
        return (
          <GoalCreationStep
            onNext={goToNext}
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

  const isFeatureShowcase = currentStep.startsWith("feature-");
  const isFullScreenStep = isFeatureShowcase || currentStep === "success" || currentStep === "loading";
  const showProgress = currentStep !== "loading" && currentStep !== "success" && !isFeatureShowcase;

  // Feature showcase steps and success/loading render their own full-screen layout
  if (isFullScreenStep) {
    return renderStep();
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 gradient-hero overflow-hidden">
      {/* Progress bar */}
      {showProgress && <OnboardingProgress progress={progress} />}

      {/* Current step */}
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
        {renderStep()}
      </div>
    </div>
  );
}
