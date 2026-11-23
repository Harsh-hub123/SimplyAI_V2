import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LineIcon } from '../Icons';
import { Arrow } from './LessonVisuals';
import s from './Learn.module.css';
import e from './BlockOneExercise.module.css';

export const exerciseRoute = '/learn?exercise=delivery-time';
const storageKey = 'simply-ai:block-1-delivery:v1';
const order = '[Distance (km), Planned stops, Expected traffic delay (min)]';
const shortOrder = '[Distance, Planned stops, Expected traffic delay]';
const records = [
  { id: 'A', values: [8, 3, 10], target: 42 },
  { id: 'B', values: [5, 2, 4], target: 25 },
  { id: 'C', values: [12, 4, 15], target: 61 },
  { id: 'D', values: [7, 1, 6], target: 31 },
];
const features = [
  { name: 'Planned route distance', description: 'The distance the delivery is expected to travel.', feedback: 'Route distance may affect travel duration. It is also available before the delivery begins, making it a potentially useful feature.' },
  { name: 'Number of planned stops', description: 'How many stops are expected along the route.', feedback: 'Additional stops may increase delivery duration. Planned stops can be useful when they are known before departure.' },
  { name: 'Expected traffic delay', description: 'Estimated extra travel time due to traffic, available before departure.', feedback: 'Traffic conditions can affect travel time. A pre-departure estimate may help, although traffic forecasts are not always accurate.' },
  { name: 'Actual delivery duration', description: 'The time recorded after the delivery finishes.', feedback: "The actual delivery duration is the target we're trying to predict.\nFor a new delivery, this value is unknown before the trip begins.\nWe cannot use the unknown answer as an input." },
  { name: 'Order ID', description: 'A unique identifier assigned to each order.', feedback: "An order ID identifies a delivery, but its arbitrary numerical value generally doesn't tell us how long the journey will take.\nFor this exercise, we won't use it as a prediction feature." },
];
type Attempt = { choice: number | null; checked: number | null; attempts: number; done: boolean };
type State = {
  version: 1; stage: number; unlocked: number; target: Attempt;
  features: number[]; review: number[] | null; part: number; partUnlocked: number;
  vector: (number | null)[]; selected: number | null; vectorFeedback: 'correct' | 'retry' | null; vectorAttempts: number; vectorDone: boolean;
  inconsistent: Attempt; rows: number; finalValues: string[]; finalVectorFeedback: 'correct' | 'retry' | null; finalVectorAttempts: number; finalVectorDone: boolean;
  finalTarget: Attempt; assisted: boolean;
};
const emptyAttempt = (): Attempt => ({ choice: null, checked: null, attempts: 0, done: false });
const initial = (): State => ({ version: 1, stage: 1, unlocked: 1, target: emptyAttempt(), features: [], review: null, part: 0, partUnlocked: 0, vector: [null, null, null], selected: null, vectorFeedback: null, vectorAttempts: 0, vectorDone: false, inconsistent: emptyAttempt(), rows: 0, finalValues: ['', '', ''], finalVectorFeedback: null, finalVectorAttempts: 0, finalVectorDone: false, finalTarget: emptyAttempt(), assisted: false });
const integer = (value: unknown, min: number, max: number) => Number.isInteger(value) && Number(value) >= min && Number(value) <= max;
function readState(): State {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    const attempt = (value: Attempt) => value && [value.choice, value.checked].every(v => v === null || integer(v, 0, 2)) && integer(value.attempts, 0, 100000) && typeof value.done === 'boolean';
    const selections = (value: unknown) => Array.isArray(value) && value.every(v => integer(v, 0, 4)) && new Set(value).size === value.length;
    if (saved?.version === 1 && integer(saved.stage, 1, 5) && integer(saved.unlocked, saved.stage, 5) && attempt(saved.target) && attempt(saved.inconsistent) && attempt(saved.finalTarget)
      && selections(saved.features) && (saved.review === null || selections(saved.review)) && integer(saved.part, 0, 3) && integer(saved.partUnlocked, saved.part, 3)
      && Array.isArray(saved.vector) && saved.vector.length === 3 && saved.vector.every((v: unknown) => v === null || typeof v === 'number' && [8, 3, 10].includes(v)) && new Set(saved.vector.filter((v: unknown) => v !== null)).size === saved.vector.filter((v: unknown) => v !== null).length
      && (saved.selected === null || [8, 3, 10].includes(saved.selected)) && [saved.vectorFeedback, saved.finalVectorFeedback].every(v => [null, 'correct', 'retry'].includes(v))
      && [saved.vectorAttempts, saved.finalVectorAttempts].every(v => integer(v, 0, 100000)) && integer(saved.rows, 0, 4)
      && Array.isArray(saved.finalValues) && saved.finalValues.length === 3 && saved.finalValues.every((v: unknown) => typeof v === 'string' && v.length < 100)
      && [saved.vectorDone, saved.finalVectorDone, saved.assisted].every(v => typeof v === 'boolean')) return saved;
  } catch { /* Storage may be unavailable; the in-memory activity still works. */ }
  return initial();
}

function Feedback({ children }: { children: ReactNode }) {
  return <div className={e.feedback} role="status" aria-live="polite" aria-atomic="true">{children}</div>;
}
function Copy({ text }: { text: string }) { return <>{text.split('\n').map(line => <p key={line}>{line}</p>)}</>; }

function Choice({ question, options, feedback, correct, value, onChange }: { question: string; options: string[]; feedback: string[]; correct: number; value: Attempt; onChange: (attempt: Attempt) => void }) {
  const id = useId();
  return <div>
    <fieldset className={e.choices} aria-describedby={value.checked !== null ? `${id}-feedback` : undefined}>
      <legend>{question}</legend>
      {options.map((option, index) => <label key={option}><input type="radio" name={id} checked={value.choice === index} onChange={() => onChange({ ...value, choice: index, checked: null, done: false })}/><span><b>{['A', 'B', 'C'][index]}.</b> {option}</span></label>)}
    </fieldset>
    <button className={e.action} type="button" disabled={value.choice === null} onClick={() => onChange({ ...value, checked: value.choice, attempts: value.attempts + 1, done: value.done || value.choice === correct })}>Check answer</button>
    <div id={`${id}-feedback`}><Feedback>{value.checked !== null && <Copy text={feedback[value.checked]}/>}</Feedback></div>
  </div>;
}

function DeliveryRecords() {
  return <>
    <table className={e.recordsTable}><caption>Illustrative records of completed deliveries</caption><thead><tr><th scope="col">Delivery</th><th scope="col">Distance</th><th scope="col">Planned stops</th><th scope="col">Expected traffic delay</th><th scope="col" className={e.target}>Actual duration</th></tr></thead><tbody>{records.map(record => <tr key={record.id}><th scope="row">{record.id}</th><td>{record.values[0]} km</td><td>{record.values[1]}</td><td>{record.values[2]} min</td><td className={e.target}>{record.target} min</td></tr>)}</tbody></table>
    <div className={e.mobileRecords}>{records.map(record => <section key={record.id}><h3>Delivery {record.id}</h3><dl><div><dt>Distance</dt><dd>{record.values[0]} km</dd></div><div><dt>Planned stops</dt><dd>{record.values[1]}</dd></div><div><dt>Expected traffic delay</dt><dd>{record.values[2]} min</dd></div><div className={e.target}><dt>Actual duration</dt><dd>{record.target} min</dd></div></dl></section>)}</div>
  </>;
}
function RecordReminder({ index }: { index: number }) {
  const record = records[index];
  return <aside className={e.reminder}><b>Delivery {record.id}</b><span>Distance: {record.values[0]} km</span><span>Planned stops: {record.values[1]}</span><span>Expected traffic delay: {record.values[2]} min</span></aside>;
}
function Order() { return <p className={e.order}><b>Chosen feature order</b><span>{order}</span></p>; }

export function ExerciseEntry() {
  return <aside className={e.entry}><div><b>Apply your Block 1 foundations</b><p>Work through a delivery-time problem using mathematics and data representation.</p></div><Link className={s.continueButton} to={exerciseRoute}>Start Block 1 exercise <Arrow/></Link></aside>;
}

export function BlockOneExercise() {
  const [state, setState] = useState<State>(readState);
  const [params, setParams] = useSearchParams();
  const rawStage = Number(params.get('stage') ?? state.stage);
  const stage = integer(rawStage, 1, 5) ? Math.min(rawStage, state.unlocked) : state.stage;
  const heading = useRef<HTMLHeadingElement>(null);
  const taskHeading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(stage);
  const patch = (update: Partial<State>) => setState(previous => ({ ...previous, ...update }));

  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Keep using in-memory state. */ } }, [state]);
  useEffect(() => { if (state.stage !== stage) setState(previous => ({ ...previous, stage })); }, [stage, state.stage]);
  useLayoutEffect(() => {
    const target = previousStage.current === stage && stage === 3 ? taskHeading.current : heading.current;
    target?.focus({ preventScroll: true });
    if (target === taskHeading.current && target) target.scrollIntoView({ block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    previousStage.current = stage;
  }, [stage, state.part]);
  const go = (next: number, unlock = false) => {
    setState(previous => ({ ...previous, stage: next, unlocked: unlock ? Math.max(previous.unlocked, next) : previous.unlocked }));
    setParams({ exercise: 'delivery-time', stage: String(next) });
  };
  const goPart = (part: number) => patch({ part, partUnlocked: Math.max(state.partUnlocked, part) });
  const restart = () => { setState(initial()); setParams({ exercise: 'delivery-time', stage: '1' }); };
  const back = () => stage === 3 && state.part > 0 ? goPart(state.part - 1) : go(stage - 1);
  const action = (label: string, callback: () => void, disabled = false) => <button type="button" className={s.continueButton} onClick={callback} disabled={disabled}>{label}<Arrow/></button>;
  const footer = (label: string, callback: () => void, disabled = false) => <footer className={e.footer}>{stage === 1 ? <Link to="/learn?topic=data-representation&step=4" className={e.secondary}>Back to Block 1</Link> : <button className={e.secondary} type="button" onClick={back}>‹ Back</button>}{action(label, callback, disabled)}</footer>;
  const finalComplete = state.finalVectorDone && state.finalTarget.done;
  const canOfferExplanation = state.finalVectorAttempts > 0 && state.finalTarget.attempts > 0 && (state.finalVectorAttempts >= 3 || state.finalTarget.attempts >= 3);
  const partNames = ['Delivery records', 'Build a vector', 'Check consistency', 'Build a dataset'];

  return <div className={e.exercise}>
    <p className={e.exerciseTitle}>From Reality to Data: A Delivery-Time Problem <span>5–8 minutes</span></p>
    <nav className={e.progress} aria-label="Application stages"><ol>{['Understand', 'Choose', 'Represent'].map((label, index) => <li key={label}><button type="button" disabled={state.unlocked < index + 1} aria-current={stage === index + 1 ? 'step' : undefined} onClick={() => go(index + 1)}><span>{String(index + 1).padStart(2, '0')}</span> {label}{state.unlocked > index + 1 && <small>Reviewed</small>}</button></li>)}</ol></nav>
    <p className={e.eyebrow}>{stage <= 3 ? `Stage ${stage} of 3` : stage === 4 ? 'Concluding step · Final check' : 'Block 1 · The bigger picture'}</p>
    <h1 ref={heading} tabIndex={-1}>{['How long will a delivery take?', 'What information should we use?', 'Give the information a structure', 'One more delivery', "You've applied your Block 1 foundations."][stage - 1]}</h1>

    {stage === 1 && <>
      <p>Think about how a delivery app estimates when your order will arrive. Before the trip starts, the company already knows a few basic details about the delivery, even though they don't know the exact arrival time yet.</p>
      <p><strong>Our job is to pick the details that actually affect the delivery time and organize them cleanly so the model can make a good guess.</strong></p>
      <p>For this exercise, we'll focus on estimating how many minutes a delivery will take.</p>
      <Choice question="What are we trying to predict?" options={['How far the delivery needs to travel.', 'How many stops the delivery has.', 'How many minutes the delivery will take.']} correct={2} value={state.target} onChange={target => patch({ target })} feedback={[
        "Route distance might help us estimate delivery time, but it isn't what we're trying to predict.\nThink about what the customer wants to know.",
        "The number of stops might affect how long a delivery takes, but it isn't our prediction target.\nWe're interested in the total delivery duration.",
        "Correct!\nWe're trying to estimate the delivery duration in minutes.\nThis is our target — the value we want the model to predict.",
      ]}/>
      {state.target.done && <p className={e.transition}>Now that we know what we're trying to predict, let's decide what information might help us.</p>}
      {footer('Continue', () => go(2, true), !state.target.done)}
    </>}

    {stage === 2 && <>
      <p>To estimate delivery time, we need information that could help us make a reasonable prediction.</p><p>Before choosing a feature, think about two things:</p>
      <div className={e.principles}><p><b>Relevance:</b> Could this information help explain how long the delivery might take?</p><p><b>Availability:</b> Would we know this information before the delivery begins?</p></div>
      <p>Not every detail is useful for every prediction task.</p>
      <fieldset className={e.features}><legend>Which details would you choose as features for predicting delivery time?</legend><p>Select all the options you think would be useful.</p><div className={e.featureGrid}>{features.map((feature, index) => <label key={feature.name}><input type="checkbox" checked={state.features.includes(index)} onChange={() => patch({ features: state.features.includes(index) ? state.features.filter(value => value !== index) : [...state.features, index], review: null })}/><span><strong>{feature.name}</strong><small>{feature.description}</small><em>{state.features.includes(index) ? 'Selected' : 'Not selected'}</em></span></label>)}</div></fieldset>
      <p aria-live="polite">{state.features.length} of 5 features selected</p>
      <button type="button" className={e.action} onClick={() => patch({ review: [...state.features] })}>Review my choices</button>
      <Feedback>{state.review !== null && <p>Your choices are ready to review below. You can reconsider them before continuing.</p>}</Feedback>
      {state.review !== null && <div className={e.review}>
        <h2>Review the reasoning</h2>{features.map((feature, index) => <section key={feature.name}><h3>{feature.name}</h3><b className={index < 3 ? e.useful : e.target}>{index < 3 ? state.review!.includes(index) ? 'Selected · Potentially useful' : 'Overlooked · Potentially useful' : state.review!.includes(index) ? 'Selected · Reconsider as an input' : 'Not selected · Kept out of the inputs'}</b><Copy text={feature.feedback}/></section>)}
        <h2>Let's bring our choices together.</h2><p>For this problem, we'll use three features:</p><ol><li>Planned route distance</li><li>Number of planned stops</li><li>Expected traffic delay</li></ol>
        <p>Each could be relevant to delivery time, and each can be known or estimated before the delivery begins.</p><p>The actual delivery duration remains our target, not an input.</p><p>Other information, such as weather or vehicle type, might also be useful in a more detailed prediction task.</p>
        <div className={e.transition}><p>We've decided what information to use.</p><p>But selecting useful information is only part of the process.</p><p><strong>How do we organize it so a model can work with it consistently?</strong></p></div>
      </div>}
      {footer('Continue to Representation', () => go(3, true), state.review === null)}
    </>}

    {stage === 3 && <>
      <p>Remember how we represented a house using a vector such as <strong>[1200, 3, 8]</strong>?</p><p>We can use the same mathematical idea for deliveries.</p><p>We've selected three features. Let's give them a fixed order.</p><Order/>
      <p>Each position represents a specific feature. Every delivery must follow the same structure.</p>
      <nav className={e.parts} aria-label="Representation tasks">{partNames.map((name, index) => <button type="button" key={name} disabled={index > state.partUnlocked} aria-current={state.part === index ? 'step' : undefined} onClick={() => goPart(index)}>{String.fromCharCode(65 + index)}. {name}</button>)}</nav>
      {state.part === 0 && <section className={e.workspace}>
        <h2 ref={taskHeading} tabIndex={-1}>Examine delivery records</h2><DeliveryRecords/>
        <p>These are records of four completed deliveries.</p><p>For each delivery, we know the information available before departure and the actual duration recorded afterward.</p><p>Our goal is to organize the selected inputs while keeping the target separate.</p>
        {footer('Build a feature vector', () => goPart(1))}
      </section>}
      {state.part === 1 && <section className={e.workspace}>
        <h2 ref={taskHeading} tabIndex={-1}>Represent Delivery A</h2><p>Let's organize the information for Delivery A using our chosen feature order.</p><RecordReminder index={0}/>
        <p><strong>{shortOrder}</strong></p><p>Select a value, then select its destination. Select an occupied position with no value selected to clear it.</p>
        <div className={e.chips} role="group" aria-label="Available delivery values">{[{ value: 10, label: '10 min' }, { value: 8, label: '8 km' }, { value: 3, label: '3 stops' }].map(chip => <button key={chip.value} type="button" aria-pressed={state.selected === chip.value} onClick={() => patch({ selected: state.selected === chip.value ? null : chip.value })}>{chip.label}{state.vector.includes(chip.value) && <small>Placed</small>}</button>)}</div>
        <div className={e.positions} role="group" aria-label="Delivery A vector positions">{['Distance', 'Planned stops', 'Expected traffic delay'].map((label, index) => <button key={label} type="button" aria-label={`${label} position: ${state.vector[index] ?? 'empty'}`} onClick={() => {
          const next = state.vector.map(value => state.selected !== null && value === state.selected ? null : value);
          next[index] = state.selected;
          patch({ vector: next, selected: null, vectorFeedback: null, vectorDone: false });
        }}><small>{index + 1}. {label}</small><strong>{state.vector[index] ?? 'Place a value'}</strong></button>)}</div>
        <div className={e.actions}><button type="button" className={e.action} disabled={state.vector.some(value => value === null)} onClick={() => { const correct = state.vector.every((value, index) => value === records[0].values[index]); patch({ vectorFeedback: correct ? 'correct' : 'retry', vectorDone: correct, vectorAttempts: state.vectorAttempts + 1 }); }}>Check vector</button><button className={e.secondary} type="button" onClick={() => patch({ vector: [null, null, null], selected: null, vectorFeedback: null, vectorDone: false })}>Reset vector</button></div>
        <Feedback>{state.vectorFeedback === 'correct' ? <><p>Correct!</p><p>You've represented Delivery A as <strong>[8, 3, 10]</strong>.</p><p>Each number follows our chosen feature order:</p><ul><li>8 → Distance</li><li>3 → Planned stops</li><li>10 → Expected traffic delay</li></ul><p>Together, these values form a feature vector.</p></> : state.vectorFeedback === 'retry' ? <><p>Check the meaning of each position.</p><p>The first value should represent distance, the second planned stops, and the third expected traffic delay.</p><p>The numbers may all be present, but placing them in different positions changes what they mean.</p></> : state.selected !== null && <p>Value {state.selected} selected. Choose its destination position.</p>}</Feedback>
        {state.vectorAttempts >= 2 && !state.vectorDone && <details className={e.hint}><summary>View additional guidance</summary><p>Delivery A travels 8 km, has 3 planned stops, and has 10 minutes of expected traffic delay. Match the units on each chip to the position label.</p></details>}
        <p>A different feature order could also work if it were used consistently across every example. For this exercise, we are following one agreed structure.</p>
        <details className={e.hint}><summary>View all delivery records</summary><DeliveryRecords/></details>
        {footer('Check another delivery', () => goPart(2), !state.vectorDone)}
      </section>}
      {state.part === 2 && <section className={e.workspace}>
        <h2 ref={taskHeading} tabIndex={-1}>Keep the meaning consistent</h2><RecordReminder index={1}/><p>Someone represented it as: <strong className={e.vectorText}>[5, 4, 2]</strong></p><p>Our feature order remains: <strong>{shortOrder}</strong></p>
        <Choice question="What's wrong with this representation?" options={['Nothing. All the values are present.', 'The second and third values are in the wrong positions.', 'We should include the actual delivery duration as another feature.']} correct={1} value={state.inconsistent} onChange={inconsistent => patch({ inconsistent })} feedback={[
          "Having the correct numbers isn't enough.\nEach position must preserve its intended meaning.\nCheck what the second and third positions represent.",
          "Correct!\nThe values are present, but their positions don't match our chosen feature order.\nThe correct representation is [5, 2, 4].\nThe second position represents planned stops, while the third represents expected traffic delay.",
          'The actual delivery duration is our prediction target.\nIt belongs separately from the input features.\nLook again at the chosen feature order.',
        ]}/>
        {footer('Bring examples together', () => goPart(3), !state.inconsistent.done)}
      </section>}
      {state.part === 3 && <section className={e.workspace}>
        <h2 ref={taskHeading} tabIndex={-1}>Bring the examples together</h2><p>We've seen how one delivery can be represented using a vector.</p><p>Now let's organize all four deliveries using the same feature order.</p>
        <p><strong>{order}</strong></p>
        <ol className={e.vectorList} aria-label="Individual delivery vectors">{records.map(record => <li key={record.id}><b>{record.id}</b> <span>[{record.values.join(', ')}]</span></li>)}</ol>
        <p>Add each delivery in order to see its vector become a row in X, with its target kept separately in y.</p>
        <div className={e.matrix}>
          <table className={e.recordsTable}><caption>Feature matrix (X) with matched targets (y)</caption><thead><tr><th scope="col" rowSpan={2}>Delivery</th><th scope="colgroup" colSpan={3}>Feature matrix (X)</th><th className={e.target}>Targets (y)</th></tr><tr><th scope="col">Distance (km)</th><th scope="col">Planned stops</th><th scope="col">Expected traffic delay (min)</th><th scope="col" className={e.target}>Actual duration (min)</th></tr></thead><tbody>{records.slice(0, state.rows).map(record => <tr key={record.id}><th scope="row">{record.id}</th>{record.values.map((value, index) => <td key={index}>{value}</td>)}<td className={e.target}>{record.target}</td></tr>)}</tbody></table>
          <div className={e.mobileRecords} aria-label="Feature matrix X and matched targets y">{records.slice(0, state.rows).map(record => <section key={record.id}><h3>Delivery {record.id}</h3><p><b>X row:</b> [{record.values.join(', ')}]</p><p className={e.target}><b>Matched target (y):</b> {record.target} min</p></section>)}</div>
          <Feedback><p>{state.rows === 0 ? 'No rows added yet.' : `Delivery ${records[state.rows - 1].id} added. ${state.rows} of 4 rows are represented.`}</p></Feedback>
        </div>
        {state.rows < 4 && <button className={e.action} type="button" onClick={() => patch({ rows: state.rows + 1 })}>Add Delivery {records[state.rows].id}</button>}
        {state.rows === 4 && <><p className={e.target}><strong>Targets (y): [42, 25, 61, 31] minutes</strong></p><p>Each row represents one delivery.</p><p>Each column represents the same feature across all deliveries.</p><p>The target values are kept separately, with each value matched to its corresponding delivery.</p><p><strong>Together, these feature vectors and their recorded target values form a labeled dataset.</strong></p><div className={e.transition}><p>We now have multiple examples organized in a consistent way.</p><p>But what happens when we encounter a new delivery whose duration we don't yet know?</p></div></>}
        {footer('Continue to the Final Check', () => go(4, true), state.rows !== 4)}
      </section>}
    </>}

    {stage === 4 && <>
      <p>A new delivery is about to begin.</p><p>Let's see if you can represent its information using what you've learned.</p>
      <dl className={e.newDelivery}><div><dt>Planned route distance</dt><dd>6 km</dd></div><div><dt>Planned stops</dt><dd>2</dd></div><div><dt>Expected traffic delay</dt><dd>8 minutes</dd></div><div className={e.target}><dt>Actual delivery duration</dt><dd>Unknown</dd></div></dl>
      <section className={e.workspace}>
        <h2>Represent the new delivery</h2><p>How would you represent this delivery using our chosen feature order?</p><p><strong>{shortOrder}</strong></p>
        <form onSubmit={event => { event.preventDefault(); const correct = state.finalValues.every((value, index) => value.trim() !== '' && Number(value) === [6, 2, 8][index]); patch({ finalVectorFeedback: correct ? 'correct' : 'retry', finalVectorDone: correct, finalVectorAttempts: state.finalVectorAttempts + 1 }); }}>
          <fieldset className={e.finalInputs}><legend>Feature vector</legend>{['Distance (km)', 'Planned stops', 'Expected traffic delay (min)'].map((label, index) => <label key={label}><span>{label}</span><input type="number" inputMode="numeric" min="0" step="1" required aria-describedby="final-vector-feedback" value={state.finalValues[index]} onChange={event => patch({ finalValues: state.finalValues.map((value, i) => i === index ? event.target.value : value), finalVectorFeedback: null, finalVectorDone: false, assisted: false })}/></label>)}</fieldset>
          <button className={e.action} type="submit" disabled={state.finalValues.some(value => !value.trim())}>Check my vector</button>
        </form>
        <div id="final-vector-feedback"><Feedback>{state.finalVectorFeedback === 'correct' ? <Copy text={"Well done!\nYou've represented the available information using the same feature structure as our earlier examples."}/> : state.finalVectorFeedback === 'retry' && <Copy text={'Check the feature order again.\nDistance comes first, planned stops second, and expected traffic delay third.\nTry matching each value to its intended position.'}/>}</Feedback></div>
        {state.finalVectorAttempts > 0 && !state.finalVectorDone && <details className={e.hint}><summary>View a hint</summary><p>Match each position to the information above: the delivery travels 6 km, has 2 planned stops, and has 8 minutes of expected traffic delay.</p></details>}
      </section>
      <section className={e.workspace}><h2>Separate inputs from the target</h2><Choice question="Why haven't we included the actual delivery duration in this vector?" options={['Because delivery duration is never useful in AI.', "Because it is the unknown target we're trying to predict.", 'Because vectors can only contain three values.']} correct={1} value={state.finalTarget} onChange={finalTarget => patch({ finalTarget, assisted: false })} feedback={[
        "Think about the difference between the information we already know and the value we're trying to predict.\nThe actual duration is useful as a target for completed deliveries, but it isn't available as an input for a new delivery.",
        "Exactly!\nFor a new delivery, we don't yet know its actual duration.\nThat's what we want the model to estimate using the available information.",
        "Think about the difference between the information we already know and the value we're trying to predict.\nThe actual duration is useful as a target for completed deliveries, but it isn't available as an input for a new delivery.",
      ]}/>{state.finalTarget.attempts > 0 && !state.finalTarget.done && <details className={e.hint}><summary>View a target hint</summary><p>For completed deliveries, duration is recorded after the trip. For this new delivery, which value is still unknown?</p></details>}</section>
      {canOfferExplanation && !finalComplete && <div className={e.support}><p>You can keep trying, or review an explanation of both tasks and continue.</p><button className={e.action} type="button" onClick={() => patch({ assisted: true })}>View an explanation and continue</button>{state.assisted && <><p>The vector is <strong>[6, 2, 8]</strong>: distance, planned stops, then expected traffic delay.</p><p>Actual duration is the unknown target. For completed deliveries we record it separately; for this new delivery we want the model to estimate it.</p><p>You can now continue, or change your answers and try again.</p></>}</div>}
      {footer('Continue to completion', () => go(5, true), !finalComplete && !state.assisted)}
    </>}

    {stage === 5 && <>
      <p>You started with a real-world problem and worked through the decisions needed to represent it as data.</p>
      <h2>What you practiced</h2><ul>{['Identifying a prediction target', 'Choosing potentially useful features', 'Distinguishing inputs from the target', 'Organizing information into vectors', 'Preserving feature meaning across examples', 'Understanding how vectors and targets form a dataset'].map(item => <li key={item}>{item}</li>)}</ul>
      <aside className={s.mentalModel}><LineIcon name="intuition"/><div><b>Key takeaway</b><p>Before a model can learn from data, we need to understand the problem, choose meaningful information, and represent it consistently.</p></div></aside>
      <h2>The bigger picture</h2><p>We've learned how to turn real-world information into organized examples.</p><p>But we haven't yet explored how a model uses those examples to learn relationships and make predictions.</p>
      <aside className={e.nextBlock}><b>Next · Block 2 — Models and Mistakes</b><p>Coming soon</p></aside>
      <p>This marks the end of the guided activity. You can return to the lessons or try the exercise again whenever you like.</p>
      <footer className={e.footer}><Link className={s.continueButton} to="/learn?topic=mathematics&step=1">Return to Block 1 <Arrow/></Link><button className={e.secondary} type="button" onClick={restart}>Try the exercise again</button><button className={e.secondary} type="button" onClick={() => go(4)}>Review final check</button></footer>
    </>}
  </div>;
}
