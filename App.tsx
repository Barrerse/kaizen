import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Step = {
  id: number;
  title: string;
  done: boolean;
};

const KAIZEN_TIPS = [
  'Shrink the task until it feels impossible to fail.',
  'Attach your new action to an existing habit.',
  'Track completion, not perfection.',
  'Reflect on the process at the end of each day.',
  'Celebrate tiny wins to build identity momentum.',
];

export default function App(): React.JSX.Element {
  const [goal, setGoal] = useState('Run a 5K race in 12 weeks');
  const [stepDraft, setStepDraft] = useState('');
  const [reflection, setReflection] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: 'Walk 10 minutes after lunch', done: true },
    { id: 2, title: 'Prepare running clothes tonight', done: false },
    { id: 3, title: 'Do 5 minutes of stretching', done: false },
  ]);

  const completedCount = steps.filter((step) => step.done).length;
  const progressPercent = steps.length ? Math.round((completedCount / steps.length) * 100) : 0;

  const coachMessage = useMemo(() => {
    if (!steps.length) {
      return 'Start by adding one tiny step. Kaizen works best when you begin small.';
    }

    if (progressPercent === 100) {
      return 'Amazing consistency. Raise the challenge by 5–10% tomorrow.';
    }

    if (progressPercent >= 50) {
      return 'Solid momentum. Keep repeating what is already working.';
    }

    return 'Don\'t worry about speed. Focus on finishing one tiny step today.';
  }, [progressPercent, steps.length]);

  const addStep = (): void => {
    const normalized = stepDraft.trim();
    if (!normalized) {
      return;
    }

    const nextStep: Step = {
      id: Date.now(),
      title: normalized,
      done: false,
    };

    setSteps((current) => [nextStep, ...current]);
    setStepDraft('');
  };

  const toggleStep = (id: number): void => {
    setSteps((current) =>
      current.map((step) =>
        step.id === id
          ? {
              ...step,
              done: !step.done,
            }
          : step,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Kaizen Coach</Text>
        <Text style={styles.subheading}>One tiny improvement at a time (web + mobile)</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Main goal</Text>
          <TextInput
            style={styles.input}
            value={goal}
            onChangeText={setGoal}
            placeholder="What are you trying to improve?"
            placeholderTextColor="#64748b"
          />
          <Text style={styles.goalPreview}>Current focus: {goal}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Today's tiny steps</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.rowInput]}
              value={stepDraft}
              onChangeText={setStepDraft}
              placeholder="Add a 2-minute action"
              placeholderTextColor="#64748b"
              onSubmitEditing={addStep}
            />
            <Pressable style={styles.addButton} onPress={addStep}>
              <Text style={styles.addButtonLabel}>Add</Text>
            </Pressable>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>{progressPercent}% complete</Text>
          </View>

          {steps.map((step) => (
            <Pressable
              key={step.id}
              style={[styles.stepItem, step.done && styles.stepItemDone]}
              onPress={() => toggleStep(step.id)}
            >
              <Text style={[styles.stepStatus, step.done && styles.stepStatusDone]}>
                {step.done ? '✓' : '○'}
              </Text>
              <Text style={[styles.stepTitle, step.done && styles.stepTitleDone]}>{step.title}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>End-of-day reflection</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={reflection}
            onChangeText={setReflection}
            multiline
            placeholder="What helped? What felt difficult? What tiny improvement will you make tomorrow?"
            placeholderTextColor="#64748b"
          />
          <Text style={styles.coachMessage}>{coachMessage}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Kaizen prompts</Text>
          {KAIZEN_TIPS.map((tip) => (
            <Text key={tip} style={styles.tipItem}>
              • {tip}
            </Text>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    gap: 16,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f172a',
  },
  subheading: {
    fontSize: 16,
    color: '#334155',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
  },
  goalPreview: {
    color: '#0f172a',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  rowInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  addButtonLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  progressWrap: {
    gap: 6,
  },
  progressTrack: {
    height: 8,
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#dbeafe',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  progressText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
  },
  stepItemDone: {
    backgroundColor: '#ecfdf5',
    borderColor: '#86efac',
  },
  stepStatus: {
    fontSize: 18,
    color: '#475569',
  },
  stepStatusDone: {
    color: '#15803d',
  },
  stepTitle: {
    color: '#0f172a',
    flexShrink: 1,
  },
  stepTitleDone: {
    textDecorationLine: 'line-through',
    color: '#166534',
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  coachMessage: {
    color: '#4338ca',
    fontWeight: '600',
  },
  tipItem: {
    color: '#1e293b',
    lineHeight: 22,
  },
});
