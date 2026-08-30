import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Briefcase,
  Check,
  CheckCircle,
  ClipboardText,
  Clock,
  Copy,
  FileText,
  GraduationCap,
  Handshake,
  Headset,
  House,
  List,
  ListChecks,
  Phone,
  Receipt,
  ShieldCheck,
  Storefront,
  UserFocus,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  bilingualItems,
  glossary,
  learningTopics,
  riskQuestionBank,
} from "./legalContent";

const iconByTopic = {
  fraud: ShieldCheck,
  compliance: Receipt,
  rights: UserFocus,
  labor: Briefcase,
};

const helpChannels = [
  { number: "12348", label: "公共法律服务", note: "法律咨询与法律援助", icon: Handshake },
  { number: "12315", label: "市场监管投诉", note: "消费纠纷与经营秩序", icon: Storefront },
  { number: "12333", label: "人社服务热线", note: "劳动关系与社会保险", icon: Briefcase },
  { number: "96110", label: "反诈预警咨询", note: "涉诈预警与咨询", icon: ShieldCheck },
  { number: "110", label: "紧急报警", note: "现实人身或财产危险", icon: Phone },
  { number: "12345", label: "政务服务便民", note: "查找属地主管部门", icon: Headset },
];

const emptyRiskAnswers = {
  fraud: [],
  compliance: [],
  rights: [],
  labor: [],
};

const readerTabs = [
  { key: "overview", label: "法条与情景" },
  { key: "knowledge", label: "核心知识" },
  { key: "steps", label: "行动步骤" },
  { key: "myths", label: "常见误区" },
];

export function App() {
  const [view, setView] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState("fraud");
  const [activeLessonId, setActiveLessonId] = useState("fraud-1");
  const [readerTab, setReaderTab] = useState("overview");
  const [completedLessons, setCompletedLessons] = useState([]);
  const [riskCategory, setRiskCategory] = useState("fraud");
  const [riskAnswers, setRiskAnswers] = useState(emptyRiskAnswers);
  const [language, setLanguage] = useState("zh");
  const [copied, setCopied] = useState("");

  const selectedTopic = learningTopics.find((topic) => topic.key === activeTopic) ?? learningTopics[0];
  const selectedLessonIndex = Math.max(
    0,
    selectedTopic.lessons.findIndex((lesson) => lesson.id === activeLessonId),
  );
  const selectedLesson = selectedTopic.lessons[selectedLessonIndex];
  const currentRiskQuestions = riskQuestionBank[riskCategory];
  const currentRiskAnswers = riskAnswers[riskCategory];
  const isRiskFinished = currentRiskAnswers.length === currentRiskQuestions.length;
  const riskScore = useMemo(
    () => currentRiskAnswers.reduce((total, answer) => total + (answer ? 1 : 0), 0),
    [currentRiskAnswers],
  );
  const triggeredRisks = currentRiskQuestions.filter((_, index) => currentRiskAnswers[index]);
  const learnedCount = completedLessons.length;
  const totalLessons = learningTopics.reduce((total, topic) => total + topic.lessons.length, 0);

  const openView = (nextView) => {
    setView(nextView);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseTopic = (key) => {
    const topic = learningTopics.find((item) => item.key === key) ?? learningTopics[0];
    setActiveTopic(key);
    setActiveLessonId(topic.lessons[0].id);
    setReaderTab("overview");
  };

  const openLearning = (key = activeTopic, lessonId) => {
    const topic = learningTopics.find((item) => item.key === key) ?? learningTopics[0];
    setActiveTopic(topic.key);
    setActiveLessonId(lessonId ?? topic.lessons[0].id);
    setReaderTab("overview");
    openView("learn");
  };

  const openRiskCheck = (key = activeTopic) => {
    setRiskCategory(key);
    openView("risk");
  };

  const chooseLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setReaderTab("overview");
  };

  const moveLesson = (direction) => {
    const nextIndex = selectedLessonIndex + direction;
    if (nextIndex >= 0 && nextIndex < selectedTopic.lessons.length) {
      chooseLesson(selectedTopic.lessons[nextIndex].id);
    }
  };

  const toggleLessonComplete = () => {
    setCompletedLessons((current) => (
      current.includes(selectedLesson.id)
        ? current.filter((id) => id !== selectedLesson.id)
        : [...current, selectedLesson.id]
    ));
  };

  const answerQuestion = (answer) => {
    if (isRiskFinished) return;
    setRiskAnswers((current) => ({
      ...current,
      [riskCategory]: [...current[riskCategory], answer],
    }));
  };

  const previousRiskQuestion = () => {
    setRiskAnswers((current) => ({
      ...current,
      [riskCategory]: current[riskCategory].slice(0, -1),
    }));
  };

  const resetRiskCategory = () => {
    setRiskAnswers((current) => ({ ...current, [riskCategory]: [] }));
  };

  const copyNumber = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      window.setTimeout(() => setCopied(""), 1600);
    } catch {
      window.location.href = `tel:${number}`;
    }
  };

  const navItems = [
    { key: "home", label: "首页" },
    { key: "learn", label: "系统学法" },
    { key: "risk", label: "风险自查" },
    { key: "resources", label: "双语资源" },
    { key: "help", label: "求助渠道" },
  ];

  return (
    <main className={`site-shell view-${view}`}>
      <div className="edge-index" aria-hidden="true">
        <span>{view === "home" ? "01" : "02"}</span>
        <span>知法</span>
        <span>用法</span>
        <span>06</span>
      </div>

      <header className={view === "home" ? "topbar" : "topbar is-inner"}>
        <button className="brand" type="button" onClick={() => openView("home")} aria-label="返回首页">
          法润北疆
          <span className="brand-dot" />
        </button>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="主导航">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={view === item.key ? "is-active" : ""}
              onClick={() => openView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "关闭导航" : "打开导航"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} /> : <List size={24} />}
        </button>
      </header>

      {view === "home" && (
        <HomeView
          openLearning={openLearning}
          openRiskCheck={openRiskCheck}
          openView={openView}
        />
      )}

      {view === "learn" && (
        <LearningView
          selectedTopic={selectedTopic}
          selectedLesson={selectedLesson}
          selectedLessonIndex={selectedLessonIndex}
          activeTopic={activeTopic}
          readerTab={readerTab}
          setReaderTab={setReaderTab}
          chooseTopic={chooseTopic}
          chooseLesson={chooseLesson}
          moveLesson={moveLesson}
          completedLessons={completedLessons}
          toggleLessonComplete={toggleLessonComplete}
          learnedCount={learnedCount}
          totalLessons={totalLessons}
          openRiskCheck={openRiskCheck}
          openView={openView}
        />
      )}

      {view === "risk" && (
        <RiskView
          riskCategory={riskCategory}
          setRiskCategory={setRiskCategory}
          currentRiskAnswers={currentRiskAnswers}
          currentRiskQuestions={currentRiskQuestions}
          isRiskFinished={isRiskFinished}
          riskScore={riskScore}
          triggeredRisks={triggeredRisks}
          answerQuestion={answerQuestion}
          previousRiskQuestion={previousRiskQuestion}
          resetRiskCategory={resetRiskCategory}
          openLearning={openLearning}
          openView={openView}
        />
      )}

      {view === "resources" && (
        <ResourcesView
          language={language}
          setLanguage={setLanguage}
          openLearning={openLearning}
          openView={openView}
        />
      )}

      {view === "help" && (
        <HelpView
          copied={copied}
          copyNumber={copyNumber}
          openView={openView}
        />
      )}
    </main>
  );
}

function HomeView({ openLearning, openRiskCheck, openView }) {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="crop-mark" aria-hidden="true" />
          <div className="eyebrow"><span>01</span> YOUTH RULE OF LAW / 青春普法</div>
          <h1>法润北疆</h1>
          <p className="hero-slogan">法律，就在身边</p>
          <p className="hero-summary">专题学习 · 风险自查 · 权威指引</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => openLearning("fraud")}>
              开始学法 <ArrowRight size={22} weight="bold" />
            </button>
            <button className="text-button" type="button" onClick={() => openRiskCheck("fraud")}>
              风险自查 <ArrowRight size={19} />
            </button>
          </div>
          <div className="topic-shortcuts" aria-label="普法专题快捷入口">
            {learningTopics.map(({ key, short }) => {
              const Icon = iconByTopic[key];
              return (
                <button key={key} type="button" onClick={() => openLearning(key)}>
                  <Icon size={28} weight="duotone" />
                  <span>{short}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hero-visual" aria-label="法律手册、法条与安全盾牌视觉">
          <img src="/assets/legal-hero.png" alt="蓝色法律手册、法条文件与安全盾牌" />
          <div className="visual-label">
            <span>LEGAL LEARNING</span>
            <strong>普法学习册</strong>
          </div>
          <div className="legal-note note-one">
            <small>学习 01</small>
            先懂规则<br />再做判断
          </div>
          <div className="legal-note note-two">
            <small>行动 02</small>
            留存证据<br />找对渠道
          </div>
          <div className="guide-seal">
            <span>知法</span>
            <strong>法</strong>
            <span>用法</span>
          </div>
        </div>
      </section>

      <section className="home-paths">
        <div className="minimal-heading">
          <span>02 / LEGAL INDEX</span>
          <div>
            <h2>四个专题</h2>
            <p>选一个，从今天开始。</p>
          </div>
        </div>
        <div className="path-grid">
          {learningTopics.map((topic) => {
            const Icon = iconByTopic[topic.key];
            return (
              <button key={topic.key} type="button" onClick={() => openLearning(topic.key)}>
                <span className="path-number">{topic.number}</span>
                <Icon size={34} weight="duotone" />
                <strong>{topic.title}</strong>
                <small>{topic.lessons.length}节课程 · {riskQuestionBank[topic.key].length}题自查</small>
                <ArrowRight className="path-arrow" size={19} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="home-method">
        <div className="method-title">
          <span>03</span>
          <p>学法，不必从厚重开始。</p>
        </div>
        <div className="learning-map">
          <div className="map-heading">
            <span>LEARNING MAP</span>
            <strong>法律知识图谱</strong>
          </div>
          <div className="map-canvas">
            {learningTopics.map((topic) => {
              const Icon = iconByTopic[topic.key];
              return (
                <button
                  key={topic.key}
                  type="button"
                  onClick={() => openLearning(topic.key)}
                  aria-label={`进入${topic.title}`}
                >
                  <Icon size={21} weight="duotone" />
                  <span>{topic.short}</span>
                  <ArrowRight size={14} />
                </button>
              );
            })}
            <div className="map-core" aria-hidden="true">
              <BookOpenText size={22} weight="bold" />
              <span>问题</span>
            </div>
          </div>
        </div>
        <div className="method-steps">
          <div><b>01</b><strong>选专题</strong><span>找到当前问题</span></div>
          <div><b>02</b><strong>读要点</strong><span>一节只讲一件事</span></div>
          <div><b>03</b><strong>做自查</strong><span>把知识变成行动</span></div>
        </div>
      </section>

      <section className="home-links">
        <button type="button" onClick={() => openView("resources")}>
          <span>中俄双语</span>
          <strong>普法随身册</strong>
          <ArrowRight size={20} />
        </button>
        <button type="button" onClick={() => openView("help")}>
          <span>官方渠道</span>
          <strong>遇事找得到</strong>
          <ArrowRight size={20} />
        </button>
      </section>

      <Footer openView={openView} />
    </>
  );
}

function PageIntro({ index, label, title, note, openView }) {
  return (
    <div className="page-intro">
      <button type="button" onClick={() => openView("home")}>
        <ArrowLeft size={18} /> 返回首页
      </button>
      <div className="page-kicker">{index} / {label}</div>
      <h1>{title}</h1>
      <p>{note}</p>
    </div>
  );
}

function LearningView({
  selectedTopic,
  selectedLesson,
  selectedLessonIndex,
  activeTopic,
  readerTab,
  setReaderTab,
  chooseTopic,
  chooseLesson,
  moveLesson,
  completedLessons,
  toggleLessonComplete,
  learnedCount,
  totalLessons,
  openRiskCheck,
  openView,
}) {
  const topicCompleted = selectedTopic.lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;

  return (
    <div className="inner-page learning-page">
      <PageIntro
        index="02"
        label="SYSTEMATIC LEARNING"
        title="系统学法"
        note="一条路径，一次只学一个知识点。"
        openView={openView}
      />

      <div className="learning-shell">
        <aside className="topic-rail" aria-label="选择学习专题">
          <div className="rail-progress">
            <GraduationCap size={24} weight="duotone" />
            <span>总进度</span>
            <strong>{learnedCount}<small>/{totalLessons}</small></strong>
          </div>
          {learningTopics.map((topic) => {
            const Icon = iconByTopic[topic.key];
            const count = topic.lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
            return (
              <button
                key={topic.key}
                type="button"
                className={activeTopic === topic.key ? "is-active" : ""}
                onClick={() => chooseTopic(topic.key)}
              >
                <Icon size={22} weight="duotone" />
                <span><strong>{topic.title}</strong><small>{count}/{topic.lessons.length}</small></span>
              </button>
            );
          })}
          <button className="rail-risk" type="button" onClick={() => openRiskCheck(activeTopic)}>
            <ListChecks size={20} /> 做本专题自查
          </button>
        </aside>

        <section className="course-panel" aria-label={`${selectedTopic.title}课程目录`}>
          <div className="course-panel-head">
            <span>{selectedTopic.number} / {selectedTopic.short}</span>
            <h2>{selectedTopic.title}</h2>
            <p>{selectedTopic.outcome}</p>
            <div><i style={{ width: `${(topicCompleted / selectedTopic.lessons.length) * 100}%` }} /></div>
          </div>
          <div className="lesson-list">
            {selectedTopic.lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                type="button"
                className={selectedLesson.id === lesson.id ? "is-active" : ""}
                onClick={() => chooseLesson(lesson.id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{lesson.title}</strong>
                  <small><Clock size={13} /> {lesson.duration}</small>
                </div>
                {completedLessons.includes(lesson.id)
                  ? <CheckCircle size={18} weight="fill" />
                  : <ArrowRight size={16} />}
              </button>
            ))}
          </div>
        </section>

        <article className="lesson-reader" aria-live="polite">
          <div className="reader-meta">
            <span>{selectedTopic.title} / 第{selectedLessonIndex + 1}节</span>
            <a href={selectedLesson.source.url} target="_blank" rel="noreferrer">
              权威原文 <ArrowRight size={14} />
            </a>
          </div>
          <h2>{selectedLesson.title}</h2>
          <p className="reader-intro">{selectedLesson.intro}</p>

          <div className="reader-tabs" role="tablist" aria-label="课程内容分层">
            {readerTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={readerTab === tab.key ? "is-active" : ""}
                onClick={() => setReaderTab(tab.key)}
                role="tab"
                aria-selected={readerTab === tab.key}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="reader-stage">
            {readerTab === "overview" && (
              <div className="overview-grid">
                <section className="law-card">
                  <span><BookOpenText size={22} weight="duotone" /> 法律依据</span>
                  <strong>{selectedLesson.lawName}</strong>
                  <p>{selectedLesson.lawPoint}</p>
                </section>
                <section className="scenario-card">
                  <span><FileText size={21} weight="duotone" /> 情景代入</span>
                  <p>{selectedLesson.scenario}</p>
                </section>
              </div>
            )}

            {readerTab === "knowledge" && (
              <section className="knowledge-stage">
                <span className="stage-label">KNOW / 记住这三点</span>
                {selectedLesson.knowledge.map((item, index) => (
                  <div key={item}><b>{String(index + 1).padStart(2, "0")}</b><p>{item}</p></div>
                ))}
              </section>
            )}

            {readerTab === "steps" && (
              <section className="steps-stage">
                <span className="stage-label">ACT / 按顺序行动</span>
                <div className="action-route">
                  {selectedLesson.steps.map((item, index) => (
                    <div className="action-step" key={item}>
                      <div>
                        <b>{String(index + 1).padStart(2, "0")}</b>
                        <small>ACTION</small>
                      </div>
                      <strong>{item}</strong>
                      {index < selectedLesson.steps.length - 1 && (
                        <ArrowRight className="route-arrow" size={18} aria-hidden="true" />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {readerTab === "myths" && (
              <section className="myths-stage">
                <span className="stage-label">CHECK / 破除误区</span>
                {selectedLesson.myths.map(([myth, truth]) => (
                  <article className="myth-card" key={myth}>
                    <div className="myth-wrong">
                      <span><WarningCircle size={17} weight="fill" /> 常见误区</span>
                      <strong>{myth}</strong>
                    </div>
                    <div className="myth-truth">
                      <span><CheckCircle size={17} weight="fill" /> 正确理解</span>
                      <p>{truth}</p>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </div>

          <div className="reader-actions">
            <button type="button" onClick={() => moveLesson(-1)} disabled={selectedLessonIndex === 0}>
              <ArrowLeft size={17} /> 上一节
            </button>
            <button
              className={completedLessons.includes(selectedLesson.id) ? "is-complete" : ""}
              type="button"
              onClick={toggleLessonComplete}
            >
              <CheckCircle size={18} weight={completedLessons.includes(selectedLesson.id) ? "fill" : "regular"} />
              {completedLessons.includes(selectedLesson.id) ? "已完成" : "标记完成"}
            </button>
            <button
              type="button"
              onClick={() => moveLesson(1)}
              disabled={selectedLessonIndex === selectedTopic.lessons.length - 1}
            >
              下一节 <ArrowRight size={17} />
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}

function RiskView({
  riskCategory,
  setRiskCategory,
  currentRiskAnswers,
  currentRiskQuestions,
  isRiskFinished,
  riskScore,
  triggeredRisks,
  answerQuestion,
  previousRiskQuestion,
  resetRiskCategory,
  openLearning,
  openView,
}) {
  const topic = learningTopics.find((item) => item.key === riskCategory) ?? learningTopics[0];
  const Icon = iconByTopic[riskCategory];
  const questionIndex = currentRiskAnswers.length;

  return (
    <div className="inner-page risk-page">
      <PageIntro
        index="03"
        label="RISK CHECK"
        title="风险自查"
        note="选择专题，逐题判断。结果只作普法提示。"
        openView={openView}
      />

      <div className="risk-shell">
        <aside className="risk-categories" aria-label="选择风险自查专题">
          <span>选择专题</span>
          {learningTopics.map((item) => {
            const TopicIcon = iconByTopic[item.key];
            return (
              <button
                key={item.key}
                type="button"
                className={riskCategory === item.key ? "is-active" : ""}
                onClick={() => setRiskCategory(item.key)}
              >
                <TopicIcon size={23} weight="duotone" />
                <strong>{item.title}</strong>
                <small>{riskQuestionBank[item.key].length}题</small>
              </button>
            );
          })}
          <div className="risk-disclaimer">
            <WarningCircle size={21} weight="duotone" />
            <p>不代替执法认定或个案法律意见。</p>
          </div>
        </aside>

        <section className="question-stage">
          {!isRiskFinished ? (
            <>
              <div className="question-topline">
                <span><Icon size={22} weight="duotone" /> {topic.title}</span>
                <strong>{String(questionIndex + 1).padStart(2, "0")}<small> / 08</small></strong>
              </div>
              <div className="question-progress">
                <i style={{ width: `${((questionIndex + 1) / currentRiskQuestions.length) * 100}%` }} />
              </div>
              <span className="question-label">请根据实际情况判断</span>
              <h2>{currentRiskQuestions[questionIndex].title}</h2>
              <p>{currentRiskQuestions[questionIndex].hint}</p>
              <div className="answer-actions">
                <button type="button" onClick={() => answerQuestion(true)}>
                  是，存在 <ArrowRight size={18} />
                </button>
                <button type="button" onClick={() => answerQuestion(false)}>
                  否，不存在 <ArrowRight size={18} />
                </button>
              </div>
              <button
                className="previous-question"
                type="button"
                onClick={previousRiskQuestion}
                disabled={questionIndex === 0}
              >
                <ArrowLeft size={15} /> 上一题
              </button>
            </>
          ) : (
            <div className="risk-result" aria-live="polite">
              <div className="result-seal"><ShieldCheck size={44} weight="duotone" /></div>
              <span>{topic.title} · 自查完成</span>
              <h2>
                {riskScore === 0
                  ? "暂未发现明显风险"
                  : riskScore < 3
                    ? "建议补齐关键环节"
                    : riskScore < 6
                      ? "存在多项风险"
                      : "建议立即核验求助"}
              </h2>
              <p>{riskScore} 项风险提示，请优先处理并保留完整记录。</p>
              {triggeredRisks.length > 0 && (
                <div className="result-list">
                  {triggeredRisks.slice(0, 4).map((item, index) => (
                    <div key={item.title}>
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      <p><strong>{item.hint}</strong><span>{item.action}</span></p>
                    </div>
                  ))}
                </div>
              )}
              <div className="result-actions">
                <button type="button" onClick={() => openLearning(riskCategory)}>学习对应课程</button>
                <button type="button" onClick={resetRiskCategory}>重新自查</button>
                <button type="button" onClick={() => openView("help")}>查看求助渠道</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ResourcesView({ language, setLanguage, openLearning, openView }) {
  return (
    <div className="inner-page resources-page">
      <PageIntro
        index="04"
        label="BILINGUAL GUIDE"
        title="双语资源"
        note="核心普法词汇与主题提示，中俄双语对照。"
        openView={openView}
      />

      <div className="resource-shell">
        <aside className="book-cover">
          <span>LEGAL NOTES / 2026</span>
          <h2>普法<br />随身册</h2>
          <p>知法 · 懂法 · 用法</p>
          <strong>法</strong>
        </aside>
        <section className="resource-content">
          <div className="language-switch" role="group" aria-label="语言切换">
            <button className={language === "zh" ? "is-active" : ""} type="button" onClick={() => setLanguage("zh")}>中文</button>
            <button className={language === "ru" ? "is-active" : ""} type="button" onClick={() => setLanguage("ru")}>РУС</button>
          </div>
          <div className="resource-grid">
            {bilingualItems.map((item, index) => (
              <button
                key={item.zh}
                type="button"
                onClick={() => openLearning(learningTopics[index].key)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{language === "zh" ? item.zh : item.ru}</strong>
                <p>{language === "zh" ? item.bodyZh : item.bodyRu}</p>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="glossary-section">
        <div>
          <span>05 / СЛОВАРЬ</span>
          <h2>常用词汇</h2>
        </div>
        <dl>
          {glossary.map(([zh, ru]) => (
            <div key={zh}><dt>{zh}</dt><dd>{ru}</dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function HelpView({ copied, copyNumber, openView }) {
  const evidence = ["合同、订单与票据", "聊天、邮件与通知", "付款、工资与银行流水", "照片、视频与考勤"];

  return (
    <div className="inner-page help-page">
      <PageIntro
        index="05"
        label="OFFICIAL HELP"
        title="求助渠道"
        note="先分清问题，再带着证据咨询。"
        openView={openView}
      />

      <div className="help-shell">
        <section className="help-grid">
          {helpChannels.map(({ number, label, note, icon: Icon }) => (
            <article key={number}>
              <Icon size={27} weight="duotone" />
              <span>{label}</span>
              <strong>{number}</strong>
              <p>{note}</p>
              <button type="button" onClick={() => copyNumber(number)}>
                {copied === number ? <><Check size={17} /> 已复制</> : <><Copy size={17} /> 复制号码</>}
              </button>
            </article>
          ))}
        </section>
        <aside className="evidence-card">
          <span>咨询前准备</span>
          <h2>四类证据</h2>
          {evidence.map((item, index) => (
            <div key={item}><b>{String(index + 1).padStart(2, "0")}</b><p>{item}</p></div>
          ))}
          <p className="boundary">
            <ClipboardText size={20} />
            本平台提供一般性普法与风险提示，不构成针对个案的正式法律意见。
          </p>
        </aside>
      </div>
    </div>
  );
}

function Footer({ openView }) {
  return (
    <footer className="footer">
      <div>
        <strong>法润北疆</strong>
        <span>让法律听得懂，让权益看得见</span>
      </div>
      <button type="button" onClick={() => openView("help")}>
        <House size={18} /> 官方求助
      </button>
      <p>青春普法 · 公益指引 · 内容更新至2026年7月</p>
    </footer>
  );
}
