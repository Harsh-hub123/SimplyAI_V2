import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LineIcon } from '../components/Icons';
import { Arrow, Bars, BigPicture, InformationVisual, lessonImage, Matrix, Vector } from '../components/learn/LessonVisuals';
import s from '../components/learn/Learn.module.css';

const titles = [<>Why does AI need <mark>mathematics</mark>?</>, <>How do we <mark>organize information</mark> for an AI model?</>, <>Understanding <mark>relationships and change</mark></>, <>A prediction is <mark>not the truth.</mark></>, <>The <mark>big picture.</mark></>];
const nextCopy = [
  ['Numbers are useful. But one number cannot describe everything.', 'So how can mathematics organize many pieces of information together?'],
  ['Now we can organize information mathematically. But AI is not only about storing numbers.', 'How can mathematics help us describe relationships and change?'],
  ['Mathematics helps us organize information, describe relationships and understand change.', 'But how does it help when the answer is uncertain?'],
  ["We’ve now met four different roles mathematics plays in AI.", 'Let’s put the whole picture together.'],
  ['You now have the language. But there is still an important question:', 'How does the real world become something a model can work with?'],
];

function MentalModel({ children, final = false }: { children: React.ReactNode; final?: boolean }) {
  return <aside className={s.mentalModel}><LineIcon name={final ? 'intuition' : 'brain'}/><div><b>{final ? 'Key takeaway' : 'Mental model'}</b><p>{children}</p></div></aside>;
}

function ScreenOne() {
  return <>
    <div className={s.twoColumns}><div>
      <p>Look around you.</p>
      <ul><li>A house has a size, a location, an age and a price.</li><li>An image contains colours, shapes and patterns.</li><li>A sentence contains words and meaning.</li><li>A sound changes over time.</li></ul>
      <p>We understand these things naturally.</p>
      <p>But a computer needs information to be described in a precise form before it can work with it.</p>
      <p>This is where mathematics becomes useful.</p>
      <p>Mathematics gives us ways to describe information using numbers and to work with those numbers in a consistent way.</p>
      <p>It helps us turn things from the real world into something a computer can process, compare and eventually learn from.</p>
      <h2 className={s.editorialHeading}>Think of mathematics as a <mark>language.</mark></h2>
      <p>Just as we use words to describe ideas to each other, AI systems use mathematical structures to describe and work with information.</p>
      <p>We don’t need to master all of mathematics before understanding AI.<br/>For now, we only need to understand why it is there and what role it plays.</p>
    </div><InformationVisual/></div>
    <MentalModel>Mathematics gives AI a precise language for working with information.</MentalModel>
  </>;
}

function HouseDetailIcon({ name }: { name: 'size' | 'bedrooms' | 'age' }) {
  const paths = {
    size: <><path d="m2 11 10-8 10 8M5 9v12h14V9M9 21v-7h6v7"/></>,
    bedrooms: <><path d="M3 4v17M3 14h18v7M3 10h7a3 3 0 0 1 3 3v1M13 11h6a2 2 0 0 1 2 2v1"/></>,
    age: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h1M12 14h1M16 14h1M8 18h1M12 18h1"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function ScreenTwo() {
  return <div className={s.screenTwo}>
    <section className={s.houseProfile} aria-label="House example">
      <img className={s.profilePhoto} src={`${import.meta.env.BASE_URL}images/learn/house-dusk.png`} alt="A modern two-storey house with warm illuminated windows at dusk"/>
      <div className={s.profileCopy}>
        <p>Imagine building a model that estimates house prices. To make a prediction, it can use details such as:</p>
        <ul className={s.profileDetails}>
          <li><HouseDetailIcon name="size"/><span>Size: <strong>1,200 sq ft</strong></span></li>
          <li><HouseDetailIcon name="bedrooms"/><span>Bedrooms: <strong>3</strong></span></li>
          <li className={s.ageDetail}><HouseDetailIcon name="age"/><span>Age: <strong>8 years</strong></span></li>
        </ul>
        <p>Mathematics gives us ways to organize these numbers. Let’s start with a single value.</p>
      </div>
    </section>

    <section className={`${s.teachingSection} ${s.scalarPanel}`} aria-labelledby="scalar-heading">
      <div className={s.scalarCopy}>
        <h2 id="scalar-heading">1. <mark>A scalar:</mark> one number</h2>
        <p>Suppose a house is 8 years old.</p>
        <p>The number 8 is a <strong>scalar</strong>. A scalar is simply a single numerical value.</p>
        <p>It could describe a house’s age, its size or its price. Here, it represents just one detail about our house.</p>
      </div>
      <div className={s.scalarExample}><span>8</span><small>Age (years)</small></div>
      <p className={s.scalarCaption}><span><strong>8</strong> <span aria-hidden="true">→</span> One value describing the house’s age</span></p>
    </section>

    <div className={s.teachingPair}>
      <section className={`${s.teachingSection} ${s.pairedPanel}`} aria-labelledby="vector-heading">
        <h2 id="vector-heading">2. <mark>A vector:</mark> an ordered list of numbers</h2>
        <p>To estimate the price, our model can use several details about the same house:</p>
        <ul><li>Size: 1,200 sq ft</li><li>Bedrooms: 3</li><li>Age: 8 years</li></ul>
        <p>We can arrange these numbers into a <strong>vector</strong>:</p>
        <Vector labeled/>
        <p>A vector keeps the values together in a specific order. Here, the first position means size, the second means bedrooms, and the third means age.</p>
        <p>The model can use these values together as information about one house.</p>
        <p className={s.visualCaption}><strong>[1200, 3, 8]</strong> <span aria-hidden="true">→</span> Several details describing one house</p>
      </section>
      <section className={`${s.teachingSection} ${s.pairedPanel}`} aria-labelledby="matrix-heading">
        <h2 id="matrix-heading">3. <mark>A matrix:</mark> numbers arranged in rows and columns</h2>
        <p>Now suppose we have information about several houses:</p>
        <div className={s.matrixScroll}><Matrix detailed/></div>
        <p>The numbers form a <strong>matrix</strong>: a rectangular arrangement of values in rows and columns.</p>
        <p>Here, each row describes one house, and each column holds the same type of detail across houses.</p>
        <p>Arranging the numbers this way gives an AI model a consistent format for working with information about many houses.</p>
      </section>
    </div>

    <aside className={s.whyNote}><LineIcon name="brain"/><div><h2>Why does this matter for AI?</h2><p>The model needs these details arranged consistently. If the first position represents size for one house, it should represent size for every house. Changing the order would mix up what the values represent.</p></div></aside>
    <MentalModel>Mathematics gives us ways to represent and organize data, turning individual details into a structure that AI models can work with.</MentalModel>
  </div>;
}

function ScreenThree() {
  return <div className={s.screenThree}>
    <div className={s.relationshipIntro}>
      <p>So far, we have seen how mathematics can help us organize information. But AI also needs to understand how different pieces of information are related.</p>
      <p>Suppose we are looking at houses. A larger house may often have a higher price than a smaller one. That means there is some relationship between:</p>
      <p className={s.relationshipAccent}>House size <Arrow/> House price</p>
      <p>Mathematics gives us a way to describe relationships like this.</p>
    </div>
    <div className={s.relationshipPanels}>
      <section className={s.relationshipPanel} aria-labelledby="function-heading">
        <header><span aria-hidden="true">01</span><h2 id="function-heading">A relationship can be described as a <em>function</em></h2></header>
        <p>Imagine a simple rule: “Double the number.”</p>
        <div className={s.doublingExamples}>
          <p>Give it 3, and you get 6.</p>
          <p>Give it 5, and you get 10.</p>
        </div>
        <p>The number you provide is the input. The answer you get is the output. The rule connecting them is called a function.</p>
        <div className={s.doublingFlow} role="group" aria-label="Doubling function example">
          <div className={s.relationshipStage}><span className={s.functionNumber}>3</span><small>Input</small></div>
          <Arrow/>
          <div className={s.relationshipStage}><span>Double it</span><small>Function</small></div>
          <Arrow/>
          <div className={s.relationshipStage}><span className={s.functionNumber}>6</span><small>Output</small></div>
        </div>
        <p>An AI model works with the same basic idea. For example:</p>
        <div className={s.houseModelFlow} role="group" aria-label="House-price model example">
          <span>Information about a house</span><Arrow/><span>Model</span><Arrow/><span>Estimated price</span>
        </div>
        <p>In our doubling example, we chose the rule ourselves. During training, an AI model learns how to connect inputs to useful outputs from examples.</p>
      </section>
      <section className={s.relationshipPanel} aria-labelledby="change-heading">
        <header><span aria-hidden="true">02</span><h2 id="change-heading">What happens when the input <em>changes?</em></h2></header>
        <p>Now consider a simple house-price model. Keeping the model unchanged, let’s compare two inputs:</p>
        <p className={s.sameModel}>Same model</p>
        <div className={s.priceComparison}>
          <table>
            <caption className="sr-only">Estimated prices from the same model. The final row shows the change between the two examples.</caption>
            <thead><tr><th scope="col">House size</th><th scope="col">Estimated price</th></tr></thead>
            <tbody><tr><td>1,200 sq ft</td><td>₹50 lakh</td></tr><tr><td>1,500 sq ft</td><td>₹60 lakh</td></tr></tbody>
            <tfoot><tr><td>+300 sq ft</td><td>+₹10 lakh</td></tr></tfoot>
          </table>
        </div>
        <p>The house size increased by 300 sq ft, and the estimated price increased by ₹10 lakh.</p>
        <p>This raises a useful question:</p>
        <p className={s.relationshipAccent}>How much does the result change when we change the input?</p>
        <p><strong>Calculus</strong> is a branch of mathematics that helps us study change, including how a small change in one quantity affects another.</p>
        <p>Later, we’ll use this idea to understand how small adjustments to a model can help reduce its error.</p>
        <p>We don’t need formulas yet. For now, remember:</p>
        <p className={s.relationshipConclusion}>Calculus helps us understand how a small change can affect a result.</p>
      </section>
    </div>
    <MentalModel>Mathematics helps us describe <mark>relationships</mark> and understand how a <mark>change</mark> in one quantity affects another.</MentalModel>
  </div>;
}

function ScreenFour() {
  return <div className={s.screenFour}>
    <div className={s.uncertaintyIntro}>
      <p>So far, we have seen how mathematics helps us:</p>
      <ul><li>organize information</li><li>describe relationships</li><li>understand change</li></ul>
      <div className={s.uncertaintyBridge}>
        <p>But there is one more idea that matters deeply in AI:</p>
        <p className={s.uncertaintyPremise}>A model does not know the correct answer in advance.</p>
      </div>
      <p>When it sees something new, it uses what it has learned to estimate what the answer is most likely to be. That estimate is a prediction.</p>
      <p>Sometimes the prediction is right. Sometimes it is wrong.</p>
    </div>
    <p className={s.uncertaintyLabel}>Uncertainty and probability</p>
    <div className={s.uncertaintyPanels}>
      <section className={s.uncertaintyPanel} aria-labelledby="best-guess-heading">
        <header><span aria-hidden="true">01</span><h2 id="best-guess-heading">A model’s best guess can still be wrong</h2></header>
        <p>The model’s estimated probabilities are:</p>
        <figure className={s.initialEstimates} aria-label="Illustrative estimates for a photograph showing a dog: Cat 58%, Dog 37%, Fox 5%.">
          <div className={s.estimateMedia}>
            <div className={s.dogPortrait}><img src={lessonImage('dog')} alt="A golden retriever’s face. The actual animal is a dog."/></div>
            <div className={s.estimateChart}><Bars/><p className={s.estimatesCaption}>Illustrative model estimates</p></div>
          </div>
          <figcaption className={s.predictedActual}><span>Predicted: <strong>Cat</strong></span><span aria-hidden="true"> · </span><span>Actual: <strong>Dog</strong></span></figcaption>
        </figure>
        <p>Cat has the highest percentage, so the model predicts Cat. But the image shows a Dog.</p>
        <p>The model chose the answer it considered most likely and still made a mistake.</p>
        <p className={s.uncertaintyEmphasis}>‘Most likely’ does not mean ‘definitely correct.’</p>
        <p>But how strongly does a model favor its chosen answer? Let’s compare two examples.</p>
      </section>
      <section className={s.uncertaintyPanel} aria-labelledby="different-uncertainty-heading">
        <header><span aria-hidden="true">02</span><h2 id="different-uncertainty-heading">The same prediction can carry different uncertainty</h2></header>
        <p>Imagine a model choosing between Cat and Dog:</p>
        <figure className={s.probabilityCases} aria-label="Comparison of illustrative Cat and Dog probabilities on the same 0–100% scale">
          <section className={s.uncertaintyCase} aria-labelledby="case-a-heading">
            <h3 id="case-a-heading"><span>Case A</span> — Cat: 99% · Dog: 1%</h3>
            <Bars values={[["Cat", 99], ["Dog", 1]]}/>
            <p>The model strongly favors Cat.</p>
          </section>
          <section className={s.uncertaintyCase} aria-labelledby="case-b-heading">
            <h3 id="case-b-heading"><span>Case B</span> — Cat: 51% · Dog: 49%</h3>
            <Bars values={[["Cat", 51], ["Dog", 49]]}/>
            <p>The model is almost evenly split.</p>
          </section>
        </figure>
        <p>Both cases produce the prediction Cat, but the probabilities show a very different level of uncertainty.</p>
        <p>The answer alone doesn’t tell us how strongly the model favors it.</p>
      </section>
    </div>
    <section className={s.uncertaintyInsights} aria-label="Probability and AI">
      <section className={s.uncertaintyInsight} aria-labelledby="probability-core-heading">
        <LineIcon name="intuition"/>
        <div><h2 id="probability-core-heading">Core Idea</h2><p>Probability gives us a way to describe and reason about uncertainty. It helps us look beyond the model’s final answer and understand how strongly it favors different possibilities.</p></div>
      </section>
      <section className={s.uncertaintyInsight} aria-labelledby="probability-relevance-heading">
        <LineIcon name="brain"/>
        <div><h2 id="probability-relevance-heading">Why does this matter in AI?</h2><p>AI often makes predictions from incomplete or unclear information.</p><p>Probability helps us describe the uncertainty in those predictions.</p><p>We’ll explore this step by step as we learn how AI models work.</p></div>
      </section>
    </section>
    <MentalModel><strong className={s.uncertaintyTakeaway}>A prediction is an estimate, not a guarantee.</strong> Probability gives us a way to express uncertainty in numbers and compare how likely different outcomes are.</MentalModel>
  </div>;
}

function ScreenFive() {
  return <>
    <p className={s.summaryIntro}>We have seen four important roles mathematics plays in AI. Together, they give AI a precise language<br className={s.wideOnly}/> for working with information, relationships, change and uncertainty.</p>
    <BigPicture/>
    <div className={s.reflections}><aside><LineIcon name="feedback"/><div><h2>You don’t need to master the formulas yet.</h2><p>At this stage, the important thing is that when mathematics appears later in AI, it no longer feels disconnected. You know why it is there.</p></div></aside><aside><LineIcon name="why"/><div><p>Before moving on, can you explain in your own words why AI needs mathematics?</p><p className={s.thinkingPrompt}>Take a moment to think about it...</p></div></aside></div>
    <MentalModel final><mark>Mathematics gives AI a precise language</mark> for working with information, relationships, change and uncertainty.</MentalModel>
  </>;
}

function DataOne() {
  return <>
    <p>In Mathematics, we learned how to represent a house using numbers.<br/>Now let’s put that information to use.</p>
    <p>Suppose we want a model to estimate a house’s selling price.</p>
    <h2 className={s.editorialHeading}>What would the model need to know?</h2>
    <div className={s.twoColumns}><div>
      <p>Let’s start with a house that has already been sold.</p>
      <p>These details give us clues about the house. The model can use them to estimate its price.</p>
      <p>In machine learning, we call these clues <em>features</em>. They are the <em>inputs</em> we provide to the model.</p>
      <p>Other details, such as location and condition, might also help.</p>
      <p>The selling price is our <mark><strong>target</strong></mark>: the value we want the model to predict.</p>
      <p>Because this house has already been sold, we know both its features and its actual selling price.</p>
    </div><figure className={s.dataHouse}>
      <img src={`${import.meta.env.BASE_URL}images/learn/house-dusk.png`} alt="A house with warm illuminated windows at dusk"/>
      <figcaption>A house already sold</figcaption><h3>Features / inputs</h3>
      <dl><div><dt>Size</dt><dd>1,200 sq ft</dd></div><div><dt>Bedrooms</dt><dd>3</dd></div><div><dt>Age</dt><dd>8 years</dd></div></dl>
      <div className={s.dataTarget}><b>Target</b><span>Recorded selling price</span><strong>₹50 lakh</strong></div>
    </figure></div>
    <p className={s.dataClosing}>For a new house, we can provide the same kinds of features and ask the model to estimate the price.</p>
    <MentalModel>Features are the information we give the model to make a prediction.<br/>The target is the value we want the model to predict.</MentalModel>
  </>;
}

function DataTwo() {
  return <><p>One sold house gives us one example. To learn useful patterns, a model needs many examples.</p><p>Let’s bring several houses together, keeping the same details in the same order.</p>
    <div className={s.matrixScroll}><table className={s.dataTable}><caption>Illustrative examples of houses already sold</caption><thead><tr><th>Size (sq ft)</th><th>Bedrooms</th><th>Age (years)</th><th>Price (₹ lakh)</th></tr></thead><tbody>{[['1,200', '3', '8', '50'], ['1,500', '4', '5', '65'], ['900', '2', '12', '35']].map(row => <tr key={row[0]}>{row.map((value, i) => <td key={i}>{value}</td>)}</tr>)}</tbody></table></div>
    <div className={s.teachingPair}><section className={s.relationshipPanel}><h2>Each row is an example</h2><p>One row describes one house: its features and the recorded price we want the model to learn to predict.</p><p>A collection of examples is called a <em>dataset</em>.</p></section><section className={s.relationshipPanel}><h2>Each column has a purpose</h2><p>Size, bedrooms and age are feature columns. Selling price is the target column.</p><p>The features form a matrix, with each target paired with its matching row.</p></section></div>
    <p className={s.dataClosing}>During training, a model learns patterns connecting features with targets. Later, we check its predictions on examples it did not learn from.</p><MentalModel>A dataset brings examples together in a consistent structure. Each example pairs useful inputs with a known target.</MentalModel></>;
}

function DataThree() {
  return <><p>A list of numbers is useful only when we know what each number represents.</p><Vector labeled/>
    <div className={s.teachingPair}><section className={s.relationshipPanel}><h2>Keep the meaning consistent</h2><p>The first position always means size in square feet, the second means bedrooms, and the third means age in years.</p><p>Changing the order or mixing square feet with square metres would change what the model receives.</p></section><section className={s.relationshipPanel}><h2>Choose a representation for the task</h2><p>Location can help too. We need a consistent way to encode it, such as separate indicators for different neighbourhoods.</p><p>An arbitrary number for a neighbourhood does not mean one location is “twice” another.</p></section></div>
    <h2 className={s.editorialHeading}>Use information available when predicting</h2><p>For a new house, we do not know the selling price yet. It is the target, rather than an input feature.</p><p>Missing values and different numerical scales also need care. Any preparation learned from data should be fitted on training examples, then applied consistently to new examples.</p><MentalModel>A useful representation preserves meaning: consistent features, positions, units and preparation for every example.</MentalModel></>;
}

function DataFour() {
  return <><p>Data representation connects the real world to the task we want an AI model to perform.</p><div className={s.dataOverview}>{[
    ['Start with a purpose', 'Estimate a house’s selling price. The task tells us what information may be useful.'],
    ['Choose features and a target', 'Size, bedrooms and age are inputs. The recorded selling price is the target.'],
    ['Bring examples together', 'Arrange sold houses in consistent rows and columns, pairing each input with its target.'],
    ['Preserve meaning', 'Use the same feature order, units and preparation when representing a new house.'],
  ].map(([title, copy], i) => <section className={s.relationshipPanel} key={title}><header><span>{i + 1}</span><h2>{title}</h2></header><p>{copy}</p></section>)}</div><p className={s.dataClosing}>The model receives a representation of information about a house. Our choices determine which clues it can use and which details it cannot see.</p><MentalModel final>Data representation turns real world information into consistent inputs for a specific task. Next comes the model that learns from those examples.</MentalModel></>;
}

const dataScreens = [DataOne, DataTwo, DataThree, DataFour];
const dataTitles = [<>Give the information a <mark>purpose</mark></>, <>Bring <mark>examples together</mark></>, <>Give numbers <mark>meaning</mark></>, <>The <mark>big picture.</mark></>];
const dataLabels = ['Give information a purpose', 'Bring examples together', 'Give numbers meaning', 'The big picture'];
const dataNext = [ ['This is just one house. What happens when', 'we bring several examples together?'], ['Our examples now have a consistent structure.', 'How do we make sure the numbers carry the right meaning?'], ['We have useful information in a consistent form.', 'Let’s put the whole picture together.'], ['You now know how to represent examples for a task.', 'Next, we’ll explore how a model learns from them.'] ];
const screens = [ScreenOne, ScreenTwo, ScreenThree, ScreenFour, ScreenFive];
const stepLabels = ['Why mathematics?', 'Organizing information', 'Relationships and change', 'Uncertainty', 'The big picture'];

export function LearnPage() {
  const [params, setParams] = useSearchParams();
  const requestedTopic = params.get('topic') ?? params.get('concept') ?? 'mathematics';
  const isData = requestedTopic === 'data-representation';
  const isPlanned = requestedTopic !== 'mathematics' && !isData;
  const topicTitle = isData ? 'Data Representation' : 'Mathematics';
  const activeScreens = isData ? dataScreens : screens;
  const rawStep = Number(params.get('step') ?? '1');
  const step = Number.isInteger(rawStep) && rawStep >= 1 && rawStep <= activeScreens.length ? rawStep : 1;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const navigationRef = useRef<HTMLButtonElement>(null);
  const [topicsOpen, setTopicsOpen] = useState(false);
  const [mathematicsOpen, setMathematicsOpen] = useState(!isPlanned);
  const [dataOpen, setDataOpen] = useState(isData);
  const [blocksOpen, setBlocksOpen] = useState([true, false, false]);
  const Screen = activeScreens[step - 1];

  useLayoutEffect(() => {
    setTopicsOpen(false);
    if (!isPlanned) { setMathematicsOpen(!isData); setDataOpen(isData); setBlocksOpen(previous => [true, previous[1], previous[2]]); }
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step, requestedTopic]);

  const goToStep = (value: number) => {
    if (value === 0 && isData) setParams({ topic: 'mathematics', step: '5' });
    else if (value === 6 && !isData) setParams({ topic: 'data-representation', step: '1' });
    else setParams({ topic: requestedTopic, step: String(value) });
  };
  const selectStep = () => {
    setTopicsOpen(false);
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const closeTopics = () => {
    setTopicsOpen(false);
    navigationRef.current?.focus({ preventScroll: true });
  };

  return <main id="main-content" tabIndex={-1} className={s.learn}>
    <aside className={s.sidebar}>
      <button ref={navigationRef} className={s.topicToggle} type="button" aria-expanded={topicsOpen} aria-controls="learn-topics" onClick={() => topicsOpen ? closeTopics() : setTopicsOpen(true)} onKeyDown={event => { if (event.key === 'Escape') closeTopics(); }}>AI Foundations / {topicTitle} <span aria-hidden="true">{topicsOpen ? '−' : '+'}</span><span className="sr-only"> — Topic navigation</span></button>
      <div id="learn-topics" className={`${s.topicNavigation} ${topicsOpen ? s.topicsOpen : ''}`} onKeyDown={event => { if (event.key === 'Escape' && topicsOpen) { event.stopPropagation(); closeTopics(); } }}>
        <h2>Learn</h2><p>A structured path from<br/>foundations to real AI systems.</p>
        <div className={s.learningGroup}><b>Learning group 01</b><h3>AI Foundations</h3></div><nav className={s.block} aria-label="Block 01 topics">
          <header><button className={s.blockControl} type="button" aria-expanded={blocksOpen[0]} aria-controls="foundation-topics" onClick={() => setBlocksOpen(v => [!v[0], v[1], v[2]])}><span aria-hidden="true">{blocksOpen[0] ? '−' : '+'}</span><span><b>Block 01</b><span>From Reality to Data</span></span></button></header><div id="foundation-topics" hidden={!blocksOpen[0]}>
          <div className={s.topicGroup}>
            <button className={`${s.topicControl} ${!isPlanned && !isData ? s.currentTopic : ''}`} type="button" aria-expanded={mathematicsOpen} aria-controls="mathematics-steps" onClick={() => setMathematicsOpen(!mathematicsOpen)}><span>01</span><strong>Mathematics</strong><span aria-hidden="true">{mathematicsOpen ? '−' : '+'}</span></button>
            <ol id="mathematics-steps" className={s.stepLinks} hidden={!mathematicsOpen}>{stepLabels.map((label, index) => <li key={label}><Link to={`/learn?topic=mathematics&step=${index + 1}`} aria-current={!isPlanned && !isData && step === index + 1 ? 'step' : undefined} onClick={selectStep}><span aria-hidden="true">{index + 1}</span>{label}</Link></li>)}</ol>
          </div>
          <div className={s.topicGroup}>
            <button className={`${s.topicControl} ${isData ? s.currentTopic : ''}`} type="button" aria-expanded={dataOpen} aria-controls="data-steps" onClick={() => setDataOpen(!dataOpen)}><strong>Data Representation</strong><span aria-hidden="true">{dataOpen ? '−' : '+'}</span></button>
            <ol id="data-steps" className={s.stepLinks} hidden={!dataOpen}>{dataLabels.map((label, index) => <li key={label}><Link to={`/learn?topic=data-representation&step=${index + 1}`} aria-current={isData && step === index + 1 ? 'step' : undefined} onClick={selectStep}><span aria-hidden="true">{index + 1}</span>{label}</Link></li>)}</ol>
          </div></div>
        </nav>
        {['Models and Mistakes', 'Learning and Improvement'].map((title, index) => <section className={s.block} key={title}><header><button className={s.blockControl} type="button" aria-expanded={blocksOpen[index + 1]} aria-controls={`planned-block-${index}`} onClick={() => setBlocksOpen(previous => previous.map((open, i) => i === index + 1 ? !open : open))}><span aria-hidden="true">{blocksOpen[index + 1] ? '-' : '+'}</span><span><b>Block 0{index + 2}</b><span>{title}</span></span></button></header><div className={s.blockPreview}>{(index === 0 ? ['Model', 'Loss'] : ['Gradient', 'Optimization']).map(name => <span className={s.plannedTopic} key={name} aria-disabled="true">{name}</span>)}<p id={`planned-block-${index}`} hidden={!blocksOpen[index + 1]}>These topics are planned.</p></div></section>)}
        <p className={s.laterBlocks}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/></svg> More learning groups later</p>
      </div>
    </aside>
    <article className={s.lesson} data-step={isData ? undefined : step}>
      <div className={s.lessonMeta} aria-label="Lesson context"><p>AI Foundations<span>/</span><b>Block 01</b><span>/</span>{isPlanned ? "Upcoming topic" : topicTitle}</p>{!isPlanned && <div className={s.stepStatus}><span>Step {step} of {activeScreens.length}</span><span className={s.stepDots} aria-hidden="true">{activeScreens.map((_, index) => <i className={index + 1 === step ? s.activeDot : ''} key={index}/>)}</span></div>}</div>
      {isPlanned ? <><h1 ref={headingRef} tabIndex={-1}>This topic is planned.</h1><p>Mathematics for AI is available to explore. More topics are being developed.</p><Link className={s.continueButton} to="/learn?topic=mathematics&step=1">Explore Mathematics for AI <Arrow/></Link></> : <>
        <h1 ref={headingRef} tabIndex={-1} className={!isData && step === 2 ? s.longTitle : ''}>{(isData ? dataTitles : titles)[step - 1]}</h1>
        <Screen/>
        <footer className={s.lessonFooter}>
          <button type="button" className={s.backButton} disabled={!isData && step === 1} onClick={() => goToStep(step - 1)}><span aria-hidden="true">‹</span>Back</button>
          <div className={s.nextThought}><b>Next</b><div>{(isData ? dataNext : nextCopy)[step - 1].slice(0, -1).map(line => <p key={line}>{line}</p>)}<p className={s.nextQuestion}>{(isData ? dataNext : nextCopy)[step - 1].at(-1)}</p></div></div>
          <div className={s.continueWrap}><button type="button" className={s.continueButton} disabled={isData && step === 4} aria-describedby={isData && step === 4 ? 'next-topic-status' : undefined} onClick={() => goToStep(step + 1)}>{!isData && step === 5 ? 'Continue to Data Representation' : isData && step === 4 ? 'Model - Coming soon' : 'Continue'}<Arrow/></button>{isData && step === 4 && <span id="next-topic-status">Next topic planned</span>}</div>
        </footer>
      </>}
    </article>
  </main>;
}
