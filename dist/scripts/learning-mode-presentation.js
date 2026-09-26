const freeze = Object.freeze;

export const LEARNING_MODE_PRESENTATION = freeze({
  understand: freeze({ label: 'Understand', descriptor: 'Explore', kicker: 'Understand' }),
  memorise: freeze({ label: 'Memorise', descriptor: 'Recall', kicker: 'Memorise · Memory Lab' }),
  ao1: freeze({ label: 'AO1', descriptor: 'Practise', kicker: 'AO1' }),
  ao2: freeze({ label: 'AO2', descriptor: 'Reason', kicker: 'AO2' }),
  ao3: freeze({ label: 'AO3', descriptor: 'Apply', kicker: 'AO3' })
});

export function learningModePresentation(mode) {
  const presentation = LEARNING_MODE_PRESENTATION[mode];
  if (!presentation) throw new Error(`Unknown learning mode: ${mode}`);
  return presentation;
}

export function learningModeLabel(mode) {
  return learningModePresentation(mode).label;
}

export function learningModeDescriptor(mode) {
  return learningModePresentation(mode).descriptor;
}

export function learningModeKicker(mode) {
  return learningModePresentation(mode).kicker;
}
