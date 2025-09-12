import React, { useState, useEffect } from 'react'
import { policyDefinitions, outcomeMetrics, shockScenarios, getStakeholderGroups, calculateCurrentMetrics } from './lib/policyData'
import { TimeSeriesChart, SpiderChart } from './components/Charts'

function App() {
  const [count, setCount] = useState(0)
  
  // State variables for the simulator
  const [selectedPolicies, setSelectedPolicies] = useState([])
  const [policyIntensities, setPolicyIntensities] = useState({})
  const [touchedPolicies, setTouchedPolicies] = useState(new Set())
  const [currentMetrics, setCurrentMetrics] = useState({
    AI_LITERACY: 50,
    COMMUNITY_TRUST: 50,
    INNOVATION_INDEX: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    BUDGET_STRAIN: 50,
    EMPLOYMENT_IMPACT: 50,
    AI_VULNERABILITY_INDEX: 50
  })
  const [activeTab, setActiveTab] = useState('main')
  const [selectedTimeSeriesMetric, setSelectedTimeSeriesMetric] = useState('AI_LITERACY')
  const [shockScenario, setShockScenario] = useState('NONE')
  const [openInfoPopup, setOpenInfoPopup] = useState(null)
  const [openMetricInfoPopup, setOpenMetricInfoPopup] = useState(null)

  const tabs = [
    { id: 'main', name: 'Main Dashboard' },
    { id: 'feedback', name: 'System Feedback' },
    { id: 'insights', name: 'Strategic Insights' },
  ]

  // Event handlers
  const handlePolicyToggle = (policyId) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter(id => id !== policyId))
    } else {
      setSelectedPolicies([...selectedPolicies, policyId])
    }
  }

  const handleReset = () => {
    setSelectedPolicies([])
    setPolicyIntensities({})
    setTouchedPolicies(new Set())
    setActiveTab('main')
  }

  // Policy information for info popups
  const getMetricInfo = (metricId) => {
    const metricInfo = {
      AI_LITERACY: {
        whatItIs: "Comprehensive measurement of students' abilities to understand, interact with, create with, and critically evaluate AI systems across cognitive, technical, ethical, and practical dimensions. The UNESCO AI Competency Framework for Students outlines 12 competencies across four dimensions, while Digital Promise research framework distinguish between three ways to engage with AI in educational contexts: Interact, Create and Apply.",
        whyImportant: "Clear guidelines are needed on what students are expected to learn about AI in K–12, with research highlighting the need for a competency framework to guide didactic proposals. Many education systems struggle to address the growing digital skills gap, crucial for students' employability and ethical tech use. Bridging this gap is imperative to cultivate an AI-ready workforce. Students require AI literacy for digital citizenship, future career readiness, and protection against AI-related harms.",
        resources: "UNESCO AI Competency Framework for Students"
      },
      COMMUNITY_TRUST: {
        whatItIs: "Measurement of stakeholder confidence in AI educational systems and policies through surveys, behavioral indicators, and engagement metrics assessing perceived reliability, transparency, fairness, and institutional competence in AI implementation. Evidence from various domains underlines the key role that human factors, and especially trust, play in the adoption of technology by practitioners, with research examining teachers' trust in AI-based educational technology and global studies showing three out of five people (61%) are either ambivalent or unwilling to trust AI.",
        whyImportant: "Trust and acceptance depend on the AI application, with clear patterns showing stark differences across countries in people's trust, attitudes and reported use of AI. Community trust directly affects adoption rates, policy sustainability, and the social license needed for AI educational innovation. Building this trust requires transparent communication about AI capabilities and limitations, meaningful stakeholder engagement, and demonstrated positive outcomes that align with community values and educational goals.",
        resources: "Trust Artificial Intelligence Global Study"
      },
      INNOVATION_INDEX: {
        whatItIs: "Composite measurement of educational AI innovation through metrics including speed of adoption, employee participation in innovation, novel solution development, and systematic implementation of cutting-edge educational practices. The OECD report on Measuring Innovation in Education explores the association between school innovation and different measures related to educational objectives, comparing innovation in education to innovation in other sectors.",
        whyImportant: "Innovation is happening in ed tech, new school launches, within school redesign, and in many individual classrooms throughout the world. Innovative solutions sit at the intersection of feasibility, desirability, benefit, and viability. Educational innovation drives continuous improvement, competitive advantage, and adaptation to changing technological and social contexts.",
        resources: "Measuring Innovation in Education (OECD)"
      },
      TEACHER_SATISFACTION: {
        whatItIs: "Measurement of educator satisfaction with AI integration through job satisfaction surveys, retention rates, workload impact assessments, professional autonomy indicators, and technology acceptance measures. Research shows that AI can streamline administrative tasks, free more time for teachers to build relationships and social and emotional skills of students, tailor students' learning experiences, and improve accessibility, with research examining teacher support in AI-assisted systems showing effects on demotivation, anxiety management, and learning experience.",
        whyImportant: "The application of AI technology in education is increasingly recognized as a key driver of educational innovation, but extensive literature exists on AI integration while less emphasis has been placed on the critical role of teachers and their professional development needs. Pre-service teachers' attitudes towards educational technology that utilizes AI have a potential impact on the learning outcomes of their future students. Teacher satisfaction directly affects retention, effectiveness, and successful AI adoption.",
        resources: "Teacher support in AI-assisted exams study"
      },
      DIGITAL_EQUITY: {
        whatItIs: "Comprehensive measurement of fairness in AI educational systems through bias detection metrics, differential impact analysis across demographic groups, access equality indicators, and outcome gap assessments. Addressing inequity in AI requires understanding how bias manifests itself both technically and socially, with research investigating bias in AI algorithms used for monitoring student progress, specifically focusing on bias related to age, disability, and gender.",
        whyImportant: "AI fairness in the educational context refers to ensuring that AI systems do not lead to unfair or biased outcomes for students, with studies showing that biased algorithms used in educational settings can perpetuate prejudice against specific demographics, especially in human-centered applications like education. Research shows how AI is deepening the digital divide, with some AI algorithms baked in bias, from facial recognition that may not recognize Black students to falsely flagging essays written by non-native English speakers as AI-generated.",
        resources: "Does AI have a bias problem?"
      },
      BUDGET_STRAIN: {
        whatItIs: "Financial allocation and expenditure measurement including AI implementation costs, infrastructure investments, professional development expenses, cost-per-student impacts, and return-on-investment metrics for AI educational initiatives. The global EdTech budget for AI is predicted to shoot up to about $6 billion by 2025, with the state of Nevada using AI to help guide school funding decisions through tools that indicate likelihood of student graduation.",
        whyImportant: "Educational institutions and EdTech leaders must understand the cost associated with AI before they can invest in the technology, with AI implementation requiring careful attention to cost components, distinguishing between AI-specific and traditional expenses like hardware and training. Simple generative AI systems that teachers can use in lesson planning can cost as little as $25 a month, but larger adaptive learning systems can run in the tens of thousands of dollars, with implementing these larger systems being very expensive and beyond the budgets of many schools.",
        resources: "Using AI to guide school funding: 4 takeaways (Education Week)"
      },
      EMPLOYMENT_IMPACT: {
        whatItIs: "Measurement of student preparation for AI-influenced workforce through skills assessments, career readiness indicators, job placement rates, employer satisfaction surveys, and alignment with evolving labor market demands. As AI transforms the job market by automating routine tasks, these measurements increasingly focus on students' development of both uniquely human skills such as communication, critical thinking, and problem-solving abilities, as well as technical AI-ready competencies including data literacy, prompt engineering, AI tool utilization, and human-AI collaboration skills that are essential for securing family-sustaining employment in an AI-integrated economy.",
        whyImportant: "AI and GenAI are already changing the set of skills employers are demanding from the workforce, with analytical skills becoming more important in jobs with more exposure to AI, including critical thinking, writing, science and mathematics. AI presents an avenue through which students can improve digital literacy, critical thinking, problem-solving and creativity, preparing learners for future job demands. Students need preparation for an AI-augmented workforce where human-AI collaboration is increasingly common.",
        resources: "Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness"
      },
      AI_VULNERABILITY_INDEX: {
        whatItIs: "Assessment of security risks, data protection weaknesses, system reliability issues, privacy vulnerabilities, and susceptibility to AI-related threats in educational environments. The rapid adoption of online learning has resulted in significant cybersecurity challenges, with AI models vulnerable to carefully crafted malicious inputs and data privacy risks requiring security assessments and robust policies.",
        whyImportant: "AI models can be tricked by carefully crafted malicious inputs that lead to incorrect or harmful decisions, with data privacy risks requiring protection of student data and compliance with relevant laws and regulations like FERPA. Educational institutions must protect vulnerable student populations from AI-related security threats while maintaining system functionality.",
        resources: "Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD)"
      }
    }
    return metricInfo[metricId] || {
      whatItIs: "Information not available",
      whyImportant: "Information not available", 
      resources: "Information not available"
    }
  }

  const getPolicyInfo = (policyId) => {
    const policyInfo = {
      // District Administrator policies
      INNOV_INCENT: {
        whatItIs: "Framework of rewards, funding opportunities, and supportive policies encouraging EdTech companies to develop cutting-edge AI educational solutions. Additionally, this comprises funding research and development at every stage of AI integration to help educators and staff make informed, research-based decisions. This includes grants, pilot program partnerships, procurement preferences for innovative tools, and regulatory flexibility for breakthrough technologies.",
        whyImportant: "Strategic incentives drive continuous improvement in educational AI, ensuring tools evolve to meet emerging needs. Well-designed incentives attract quality vendors, encourage research and development, and foster competition that benefits students through better, more effective learning technologies.",
        resources: "Learning Lab's AI FAST Challenge: Funding for Accelerated Study and Transformation | Ed. Startups Get Money, Advice From Federal Program (EdWeek)"
      },
      PROTECT_STD: {
        whatItIs: "Comprehensive framework encompassing data governance, privacy compliance, transparency requirements, explainability standards, and protections against algorithmic bias. Establishes clear guidelines for how AI systems handle student data, make decisions, and ensure fair treatment across all demographics. OECD and other guidelines stress transparency as essential for trust: high-stakes AI must allow 'verification of accuracy of performance for all sub-groups' and clear explanation of decision factors.",
        whyImportant: "Protects student privacy and trust in AI tools. AI systems often require large datasets (e.g. learning profiles, video from classrooms), so clear standards prevent misuse or breaches. NASBE notes that generative AI raises concerns about violating privacy laws like COPPA and FERPA, underscoring why schools need strict data rules. These standards build trust and ensure AI serves students' best interests. They protect vulnerable populations from discrimination, maintain privacy rights, enable understanding of AI decisions affecting students, and create accountability mechanisms essential for ethical AI deployment in education.",
        resources: "Effective AI Requires Effective Data Governance (Brookings) | Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD)"
      },
      PD_FUNDS: {
        whatItIs: "Dedicated funding streams to train educators (pre-service and in-service) on AI concepts, tools, and pedagogy. This includes workshops, courses or certifications in AI literacy, as well as training on how to integrate AI tools ethically into teaching. The White House Executive Order on AI Education emphasizes that 'Professional development programs focused on AI education will empower educators to confidently guide students'.",
        whyImportant: "Teachers are the linchpin of classroom AI use; without proper knowledge, AI tools can be misunderstood or misused. PD ensures that educators know how to select, implement and critique AI tools safely and effectively. It also helps teachers master new AI-integrated curricula and updated assessment methods. Well-funded PD reduces tech anxiety and inequality (so that all teachers, not just tech-savvy ones, can benefit). In short, it turns policy goals into classroom reality by building capacity.",
        resources: "AI competency framework for teachers (UNESCO) | Education Policy Outlook 2024 (OECD)"
      },

      // Educational Institution Leader policies  
      EDUC_AUTONOMY: {
        whatItIs: "Policies that respect and preserve teachers' professional judgment in using AI. This means giving teachers flexibility to decide if, when and how to use AI tools in their classrooms or assignments. For example, Lake Highland Prep's AI policy explicitly 'grant[ed] teacher's autonomy to determine if and how the technology fits into the needs of their students and curriculum'.",
        whyImportant: "Teachers best understand their students' needs and can adapt AI use accordingly. Autonomy encourages experimentation and innovation at the classroom level and can increase buy-in (teachers are more willing to use AI if not forced). It acknowledges teachers as professionals, which is crucial in a field historically characterized by top-down mandates. Autonomy can also lead to more creative and context-sensitive uses of AI that rigid policies might overlook.",
        resources: "MAINTAIN TEACHER AUTONOMY WHILE ADOPTING AI SCHOOLWIDE | Empowering ELA Teachers: Recommendations for Teacher Education in the AI Era"
      },
      AI_CAREER_PATH: {
        whatItIs: "Initiatives that create clear educational-to-career routes in AI and related fields. Examples include specialized high school programs (like AI magnet schools), partnerships with industry for internships, and guidance counseling that highlights AI-related careers. These programs might integrate AI into career-technical education or offer certifications (e.g. AI foundations certificates).",
        whyImportant: "As AI transforms the workforce, schools must prepare students with the skills employers need. Career pathways signal to students that AI literacy has real-world value and can motivate learning. They also address equity: by building accessible pathways (through community colleges, alternative credentials, etc.), all students can share in AI opportunities.",
        resources: "Riding the AI Wave: What's Happening in K-12 Education? | Career education evolves to meet emerging technology demands"
      },
      DIGITAL_CITIZEN: {
        whatItIs: "Implementation of a comprehensive curriculum addressing responsible AI use, including ethical decision-making, privacy awareness, critical evaluation of AI-generated content, understanding of AI bias, and skills for safe, effective participation in an AI-augmented digital world. UNESCO's AI Competency Framework for Students (2024) defines four core competencies: human-centered mindset, AI ethics, AI techniques, and AI system design.",
        whyImportant: "Digital citizenship prepares students to navigate AI's complexities throughout life. It develops critical thinking about AI claims, protects against manipulation and misinformation, promotes ethical technology use, and empowers students as informed digital participants rather than passive consumers.",
        resources: "What you need to know about UNESCO's new AI competency frameworks for students and teachers | Digital Citizenship in Education (ISTE)"
      },

      // Community Representative policies
      COMM_INPUT: {
        whatItIs: "Formal mechanisms to involve parents, students, teachers and other stakeholders in AI policy. This can include surveys, advisory boards or public forums soliciting feedback before adopting new AI tools or policies. For example, guidance from Wyoming's education department explicitly asks: 'Is there a plan for community input on AI policy and implementation, including feedback from students, parents, teachers, and other stakeholders?'.",
        whyImportant: "Community input ensures that AI initiatives reflect local values and needs, not just top-down decisions. Involving stakeholders can reveal concerns (e.g. privacy fears from parents, ethical considerations from teachers) that might otherwise be overlooked. It also builds legitimacy: when families and educators feel heard, they are more likely to support AI integration. Importantly, students' perspectives can highlight usability issues – after all, they are the users.",
        resources: "Bringing Communities In, Achieving AI for All | How to Develop an Effective AI Policy for K–12 Schools"
      },
      // EdTech Industry Representative policies  
      INFRA_INVEST: {
        whatItIs: "Allocating funds and resources to build and upgrade the physical and network infrastructure (broadband internet, school servers, devices, cloud services, etc.) needed to support AI tools in schools. This includes extending high-speed Internet access, providing modern computers or tablets for students and teachers, and deploying secure servers for AI applications. OECD emphasizes that 'connectivity and digital devices are necessary' to realize the full potential of digital learning.",
        whyImportant: "Robust infrastructure is the foundation for any AI-enabled education. High-bandwidth, low-latency networks are critical: AI-driven applications like real-time tutoring or virtual labs require 'more agile (i.e., smaller latency) communications' (OECD). Without reliable networks and hardware, students and teachers cannot access AI services (cloud-based or on-premise). Infrastructure investment also promotes equity by closing the digital divide, ensuring all schools, both urban and rural, can use AI to improve learning.",
        resources: "Hardware: the provision of connectivity and digital devices (OECD) | Navigating the future of AI in education and education in AI (EY)"
      },

      // Research & Ethics Advisor policies
      INNOV_SANDBOX: {
        whatItIs: "Controlled environments for safely testing experimental AI technologies and policies before full implementation. Allows temporary regulatory flexibility, provides risk mitigation protocols, enables iterative development with real users, and generates evidence for broader policy decisions. OECD describes regulatory sandboxes as a way to allow flexible testing of innovations outside normal constraints.",
        whyImportant: "Sandboxes encourage innovation by letting schools try promising AI applications (adaptive learning, new assessment systems, administrative tools) without full risk. They help uncover practical issues (e.g. student privacy, technical glitches) before widescale rollout. Engaging stakeholders in sandboxes can also generate evidence and best practices. As the OECD notes, sandboxes 'promote flexible application or enforcement of policies' for emerging tech.",
        resources: "The role of sandboxes in promoting flexibility and innovation in the digital age (OECD) | Artificial intelligence act and regulatory sandboxes"
      },
      MODEL_EVAL_STD: {
        whatItIs: "Comprehensive criteria for assessing AI educational tools across dimensions of transparency, explainability, privacy protection, bias detection, effectiveness, and safety. Includes testing protocols, performance benchmarks, ongoing monitoring requirements, and certification processes informed by latest AI safety research. It also covers requirements for evidence before adopting an AI tool. For instance, the NEA task force advises that 'AI technology must only be adopted once data is supporting its appropriateness and efficacy' – either independent research or industry research adhering to rigorous methods.",
        whyImportant: "Such standards are crucial to ensure AI tools are reliable and do not inadvertently harm learning or equity. They hold Edtechs accountable and mandate ongoing evaluation: after deployment, tools should be 'reassessed regularly… to ensure [they] continue to enhance, rather than detract from, students' educational experiences'. This guards against biases (e.g., if an AI grading system favors certain demographics) and unintended side effects. The OECD also highlights that transparent evaluation (with clear metrics and subgroup testing) is key for high-stakes uses. Overall, standards build trust by requiring that AI actually benefits teaching and learning.",
        resources: "Report of the NEA Task Force on Artificial Intelligence in Education | AI TEST, EVALUATION, VALIDATION AND VERIFICATION (NIST)"
      },
      STATE_FED_PART: {
        whatItIs: "Strategic acquisition and management of research and implementation funding from state, federal, and private philanthropic sources to support AI education initiatives. This includes federal grants (like NSF, DOE, and NIH education programs), state education technology funds, and private foundation support from organizations focused on educational innovation. These funding streams enable pilot programs, research studies, infrastructure development, and professional development initiatives that individual districts couldn't afford independently.",
        whyImportant: "External funding provides critical resources to bridge the gap between AI education aspirations and fiscal realities. It enables districts to experiment with innovative approaches without risking core budgets, supports evidence-based research to guide policy decisions, and helps ensure equitable access to AI education across communities with varying local resources. Strategic use of external funding can accelerate AI adoption, support rigorous evaluation of outcomes, and create sustainable models that can be replicated across districts.",
        resources: "NSF 23-596: Discovery Research PreK-12 (DRK-12) | Research-Practice Partnerships in Education: The State of the Field | FROM SEED FUNDING TO SCALE"
      },

      // Missing EdTech Industry Representative policies
      INTEROP_STD: {
        whatItIs: "Common technical specifications that enable different educational software and AI tools to share and reuse data seamlessly. In practice, this means agreeing on data formats, APIs and metadata so that student information systems, learning platforms, and AI tutors can talk to each other. OECD notes that interoperability is 'the capacity to combine and use data from disparate digital tools with ease', and CoSN similarly defines it as the 'seamless, secure, and controlled exchange of data between applications'.",
        whyImportant: "Interoperability allows educators and systems to integrate AI-driven analytics and learning tools without burdensome manual data entry or one-off workarounds. It increases efficiency by reducing the need of ad-hoc processing to re-input, re-format or transform data, thus making education technology more scalable and cost-effective. In an AI context, standards ensure that data from different sources (e.g. test results, attendance, online activity) can feed AI models accurately and securely, supporting better decision-making and personalized learning.",
        resources: "Interoperability: unifying and maximising data reuse within digital education ecosystems (OECD) | Interoperability is Finally Getting the Spotlight it Deserves (COSN)"
      },
      ACCESS_STD: {
        whatItIs: "Comprehensive requirements ensuring AI tools serve all learners, including translation capabilities for multilingual students, voice-to-text/text-to-voice features for students with disabilities, and executive functioning support tools. Standards mandate the application of universal design principles in AI educational technology. Section 508 standards are harmonized with WCAG 2.0 Level AA for federally funded institutions.",
        whyImportant: "As AI becomes increasingly embedded into educational settings and practices, it offers both opportunities and challenges. Accessibility standards ensure AI reduces rather than amplifies educational inequities. By requiring inclusive design, these standards help multilingual learners, students with disabilities, and those with diverse learning needs fully participate in AI-enhanced education, promoting truly equitable outcomes. The European Accessibility Act requires private sector compliance by June 2025.",
        resources: "European Accessibility Act | AI & Accessibility in Education (COSN) | Where AI meets Accessibility (Every Learner Everywhere)"
      },

      // Missing Community Representative policy
      IMPACT_REP_STD: {
        whatItIs: "A systematic and transparent approach to evaluating AI's educational impact is essential for building trust among educators, students, families, and policymakers. This includes regularly collecting data on academic outcomes, equity effects, tool usage, and cost-benefit analyses. Findings should be communicated clearly and accessibly through multiple channels such as reports and community updates.",
        whyImportant: "Transparent reporting builds community trust and enables informed decision-making. It holds districts accountable for AI investments, reveals whether tools deliver promised benefits, highlights equity gaps requiring attention, and empowers stakeholders to advocate for effective policies. Transparent reporting also enables educational leaders and communities to understand better how AI models function, anticipate their limitations and risks, and ensure that these technologies align with shared goals for high-quality, equitable learning.",
        resources: "AI in Education: Impact Report 23-24 | The State of AI in Education 2025 (Carnegie Learning) | OET: Artificial Intelligence and the Future of Teaching and Learning"
      },
      LOCAL_JOB_ALIGN: {
        whatItIs: "Strategic coordination between AI curriculum and regional workforce needs. Includes employer partnerships, skills gap analysis, internship programs, industry-recognized certifications, and regular curriculum updates based on evolving job market demands in AI and related fields. The White House executive order and analysis by Jobs for the Future (JFF) emphasize the importance of embedding AI skills in curricula, aligning education with labor market needs, and supporting apprenticeship and work-based learning models.",
        whyImportant: "Alignment ensures students develop marketable AI skills leading to local employment opportunities. This creates economic mobility pathways, addresses regional talent needs, justifies community investment in AI education, and builds public support by demonstrating tangible career benefits. Ensuring this alignment also helps close the AI literacy divide, so that all regions and populations can participate in—and benefit from—the economic growth and innovation driven by artificial intelligence.",
        resources: "White House AI Education Plan Aligns With JFF's Vision, but Resources Are Lacking | Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness"
      }
    }
    return policyInfo[policyId] || {
      whatItIs: "Information not available",
      whyImportant: "Information not available", 
      resources: "Information not available"
    }
  }

  // Helper functions re-enabled - these are now safe as they're outside render cycle
  // Helper function to determine health color (moved outside render to prevent re-creation)
  const getHealthColor = (metricName, metricValue) => {
    const isReverse = metricName === 'BUDGET_STRAIN' || metricName === 'AI_VULNERABILITY_INDEX';
    
    if (isReverse) {
      // For Budget Strain and AI Vulnerability (lower is better)
      if (metricValue < 40) return { start: '#10b981', end: '#059669' }; // Green
      if (metricValue < 70) return { start: '#f59e0b', end: '#d97706' }; // Yellow
      return { start: '#ef4444', end: '#dc2626' }; // Red
    } else {
      // For other metrics (higher is better)
      if (metricValue > 70) return { start: '#10b981', end: '#059669' }; // Green
      if (metricValue > 40) return { start: '#f59e0b', end: '#d97706' }; // Yellow
      return { start: '#ef4444', end: '#dc2626' }; // Red
    }
  }

  // Helper function to format metric names (moved outside render to prevent re-creation)
  const formatMetricName = (metric) => {
    return outcomeMetrics[metric]?.name || metric.replace(/_/g, ' ').split(' ').map(word => 
      word.toLowerCase() === 'ai' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  // Helper function to get policy units (moved outside render to prevent re-creation)
  const getPolicyUnits = (policyId, value) => {
    switch(policyId) {
      case 'INNOV_INCENT':
        return `$${Math.round(value * 0.5)}M`; // $0-$50M
      case 'PROTECT_STD':
        return `${value}`; // 0-100 strictness
      case 'PD_FUNDS':
        return `${Math.round(value * 0.8)} hrs`; // 0-80 hours
      case 'EDUC_AUTONOMY':
        return `${value}%`; // 0-100%
      case 'AI_CAREER_PATH':
        return `${Math.round(value * 0.6)} programs`; // 0-60 programs
      case 'DIGITAL_CITIZEN':
        return `${Math.round(value * 0.4)} hrs`; // 0-40 hours
      case 'COMM_INPUT':
        return `${Math.round(value * 0.12)} meetings`; // 0-12 meetings
      case 'IMPACT_REP_STD':
        return `${value}%`; // 0-100%
      case 'LOCAL_JOB_ALIGN':
        return `${Math.round(value * 0.8)} partnerships`; // 0-80 partnerships
      case 'INTEROP_STD':
        return `${value}%`; // 0-100%
      case 'INFRA_INVEST':
        return `$${Math.round(value * 2)}M`; // $0-$200M
      case 'ACCESS_STD':
        return `${value}%`; // 0-100%
      case 'STATE_FED_PART':
        return `$${Math.round(value * 1)}M`; // $0-$100M
      case 'INNOV_SANDBOX':
        return `${Math.round(value * 0.05)} pilots`; // 0-5 pilots
      case 'MODEL_EVAL_STD':
        return `${value}%`; // 0-100%
      default:
        return value;
    }
  }

  // Helper function to get policy subtitles (moved outside render to prevent re-creation)
  const getSubtitle = (policyId) => {
    switch(policyId) {
      case 'INNOV_INCENT':
        return 'Annual Funding Pool ($0 - $50M)';
      case 'PROTECT_STD':
        return 'Compliance Level (0 - 100)';
      case 'PD_FUNDS':
        return 'Training Hours (0 - 80 hrs)';
      case 'EDUC_AUTONOMY':
        return 'Autonomy Level (0 - 100%)';
      case 'AI_CAREER_PATH':
        return 'Career Programs (0 - 60 programs)';
      case 'DIGITAL_CITIZEN':
        return 'Training Hours (0 - 40 hrs)';
      case 'COMM_INPUT':
        return 'Community Meetings (0 - 12 meetings)';
      case 'IMPACT_REP_STD':
        return 'Reporting Standards (0 - 100%)';
      case 'LOCAL_JOB_ALIGN':
        return 'Industry Partnerships (0 - 80 partnerships)';
      case 'INTEROP_STD':
        return 'Standards Compliance (0 - 100%)';
      case 'INFRA_INVEST':
        return 'Infrastructure Investment ($0 - $200M)';
      case 'ACCESS_STD':
        return 'Accessibility Standards (0 - 100%)';
      case 'STATE_FED_PART':
        return 'External Funding ($0 - $100M)';
      case 'INNOV_SANDBOX':
        return 'Innovation Pilots (0 - 5 pilots)';
      case 'MODEL_EVAL_STD':
        return 'Evaluation Standards (0 - 100%)';
      default:
        return 'Policy Level (0 - 100)';
    }
  }

  // Helper function to render resource links (moved outside render to prevent re-creation)
  const renderResourceLinks = (resourceString) => {
    return resourceString.split(' | ').map((resource, index) => {
      const urlMap = {
        // ... (URL mapping would go here, but for now just return the resource text)
      }
      
      return (
        <span key={index}>
          {index > 0 && ' | '}
          <span className="text-blue-600 hover:text-blue-800 underline cursor-pointer">
            {resource.trim()}
          </span>
        </span>
      )
    })
  }

  // Re-enabled with careful dependency management
  useEffect(() => {
    let newMetrics
    if (selectedPolicies.length === 0) {
      newMetrics = {
        AI_LITERACY: 50,
        COMMUNITY_TRUST: 50,
        INNOVATION_INDEX: 50,
        TEACHER_SATISFACTION: 50,
        DIGITAL_EQUITY: 50,
        BUDGET_STRAIN: 50,
        EMPLOYMENT_IMPACT: 50,
        AI_VULNERABILITY_INDEX: 50
      }
    } else {
      newMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities)
    }
    
    // Only update if there's an actual change
    setCurrentMetrics(prev => {
      const keys = Object.keys(newMetrics)
      const hasChanged = keys.some(key => prev[key] !== newMetrics[key])
      return hasChanged ? newMetrics : prev
    })
  }, [selectedPolicies, policyIntensities])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">AI Education Policy Simulator</h1>
                <p className="text-sm text-slate-600">Interactive Policy Impact Analysis & System Dynamics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={shockScenario}
                onChange={(e) => setShockScenario(e.target.value)}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="NONE">No Shock</option>
                <option value="TECHNOLOGY_BREAKTHROUGH">Technology Breakthrough</option>
                <option value="ECONOMIC_DOWNTURN">Economic Downturn</option>
                <option value="REGULATORY_CHANGE">Regulatory Change</option>
              </select>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <button className="px-6 py-3 text-sm font-semibold rounded-t-xl bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl">
              Main Dashboard (Debug Mode)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'main' && (
            <div className="h-full p-6">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">🎉 Debugging Progress</h2>
                <div className="space-y-2">
                  <p className="text-green-600">✅ Basic React structure: Working</p>
                  <p className="text-green-600">✅ Helper functions: Re-enabled</p>
                  <p className="text-green-600">✅ useEffect: Re-enabled</p>
                  <p className="text-green-600">✅ Outcome metrics: Re-enabled</p>
                  <p className="text-blue-600">🔄 Page reloading: <strong>STOPPED</strong></p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-slate-700 mb-3">Current Metrics (Live Data)</h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(currentMetrics).map(([metric, value]) => (
                    <div key={metric} className="bg-slate-50 rounded p-3 text-center">
                      <div className="text-sm text-slate-600 mb-1">{metric.replace(/_/g, ' ')}</div>
                      <div className="text-lg font-bold text-slate-800">{Math.round(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Feedback Loops</h2>
              <p className="text-gray-600">System feedback analysis coming soon...</p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Insights</h2>
              <p className="text-gray-600">Strategic insights coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Popups temporarily disabled */}
    </div>
  )
}

export default App
                <div className="col-span-6">
                  <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-100 shadow-sm h-full">
                    <h3 className="text-sm font-medium mb-2 text-slate-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                      Time Series Analysis
                    </h3>
                    <div className="mb-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Select Metric:
                      </label>
                      <select
                        value={selectedTimeSeriesMetric}
                        onChange={(e) => setSelectedTimeSeriesMetric(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400 bg-white/90 backdrop-blur-sm"
                      >
                        <option value="AI_LITERACY">AI Literacy</option>
                        <option value="COMMUNITY_TRUST">Community Trust</option>
                        <option value="INNOVATION_INDEX">Innovation Index</option>
                        <option value="TEACHER_SATISFACTION">Teacher Satisfaction</option>
                        <option value="DIGITAL_EQUITY">Digital Equity</option>
                        <option value="BUDGET_STRAIN">Budget Strain</option>
                        <option value="EMPLOYMENT_IMPACT">Employment Impact</option>
                        <option value="AI_VULNERABILITY_INDEX">AI Vulnerability Index</option>
                      </select>
                    </div>
                    <div className="h-56 flex items-center justify-center">
                      <div className="text-gray-500">Chart temporarily disabled for debugging</div>
                      {/* <TimeSeriesChart 
                        metricId={selectedTimeSeriesMetric}
                        selectedPolicies={selectedPolicies}
                        policyIntensities={policyIntensities}
                        shockScenario="NONE"
                      /> */}
                    </div>
                  </div>
                </div>

                {/* Spider Chart */}
                <div className="col-span-6">
                  <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg border border-slate-100 shadow-sm h-full">
                    <h3 className="text-sm font-medium mb-2 text-slate-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-2"></div>
                      Spider Chart
                    </h3>
                    <div className="flex justify-center items-center h-56">
                      <div className="text-gray-500">Chart temporarily disabled for debugging</div>
                      {/* <SpiderChart 
                        selectedPolicies={selectedPolicies}
                        policyIntensities={policyIntensities}
                        shockScenario="NONE"
                        size={380}
                      /> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Metrics Row */}
              <div>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-3">
                  <div className="flex justify-between items-end gap-2">
                    {Object.entries(currentMetrics).map(([metric, value]) => {
                      
                      const colors = getHealthColor(metric, Math.round(value));
                      const gradientId = `gradient-${metric}`;
                      
                      return (
                        <div key={metric} className="text-center p-2 bg-slate-50/50 rounded border-0 relative flex-1 flex flex-col items-center">
                          <button
                            onClick={() => setOpenMetricInfoPopup(openMetricInfoPopup === metric ? null : metric)}
                            className="absolute top-1 right-1 w-3 h-3 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-60 hover:opacity-100"
                            title="More information"
                          >
                            i
                          </button>
                          <div className="text-xs font-medium text-slate-600 leading-tight pr-3 mb-1 min-h-[1rem] flex items-center justify-center">
                            {formatMetricName(metric)}
                          </div>
                          <div className="relative w-14 h-14 flex-shrink-0">
                            <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 56 56">
                              {/* Background circle */}
                              <circle
                                cx="28"
                                cy="28"
                                r="20"
                                stroke="#e2e8f0"
                                strokeWidth="4"
                                fill="none"
                              />
                              {/* Progress circle */}
                              <circle
                                cx="28"
                                cy="28"
                                r="20"
                                stroke={`url(#${gradientId})`}
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 20}`}
                                strokeDashoffset={`${2 * Math.PI * 20 * (1 - Math.round(value) / 100)}`}
                                className="transition-all duration-500"
                              />
                              <defs>
                                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor={colors.start} />
                                  <stop offset="100%" stopColor={colors.end} />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-slate-900">{Math.round(value)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Policy Levers */}
              <div className="h-[50%] overflow-y-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-4">
                  <div className="text-center text-gray-500 py-8">
                    Policy levers temporarily disabled for debugging
                  </div>
                  {/* <div className="grid grid-cols-5 gap-4">
                    {/* Column 1 - District Administrator */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-blue-100">District Admin</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INNOV_INCENT', 'PROTECT_STD', 'PD_FUNDS'].includes(policy.id)
                      ).map((policy) => {
                        
                        const getSubtitle = (policyId) => {
                          switch(policyId) {
                            case 'INNOV_INCENT':
                              return 'Annual Funding Pool ($0 - $50M)';
                            case 'PROTECT_STD':
                              return 'Strictness Level (0-100)';
                            case 'PD_FUNDS':
                              return 'Hours per Teacher per Year (0-80)';
                            default:
                              return '';
                          }
                        };
                        
                        return (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative" data-policy-container>
                            <button
                              onClick={() => setOpenInfoPopup(openInfoPopup === policy.id ? null : policy.id)}
                              className="absolute top-2 right-2 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-60 hover:opacity-100"
                              title="More information"
                            >
                              i
                            </button>
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                            </div>
                            

                            
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={policyIntensities[policy.id] || 50}
                                  onChange={(e) => {
                                    const newValue = parseInt(e.target.value);
                                    setPolicyIntensities(prev => ({
                                      ...prev,
                                      [policy.id]: newValue
                                    }));
                                    // Only mark as touched if value is not 50 (middle)
                                    if (newValue !== 50) {
                                      setTouchedPolicies(prev => new Set([...prev, policy.id]));
                                    } else {
                                      // Remove from touched if back to middle
                                      setTouchedPolicies(prev => {
                                        const newSet = new Set([...prev]);
                                        newSet.delete(policy.id);
                                        return newSet;
                                      });
                                    }
                                  }}
                                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                                  style={
                                    policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                      background: policyIntensities[policy.id] > 50 
                                        ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #2563eb 50%, #2563eb ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                        : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #2563eb ${policyIntensities[policy.id]}%, #2563eb 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                    } : {
                                      background: '#e2e8f0'
                                    }
                                  }
                                />
                                {/* Center indicator */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{policy.id === 'INNOV_INCENT' ? '$0M' : policy.id === 'PD_FUNDS' ? '0' : '0'}</span>
                                  <span>{policy.id === 'INNOV_INCENT' ? '$50M' : policy.id === 'PD_FUNDS' ? '80' : '100'}</span>
                                </div>
                                <div 
                                  className="absolute top-0 transform -translate-x-1/2"
                                  style={{
                                    left: `${(policyIntensities[policy.id] || 50)}%`
                                  }}
                                >
                                  <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                    {getPolicyUnits(policy.id, policyIntensities[policy.id] || 50)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Column 2 - Educational Institution Leader */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-green-100">Institution Leader</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['EDUC_AUTONOMY', 'AI_CAREER_PATH', 'DIGITAL_CITIZEN'].includes(policy.id)
                      ).map((policy) => {
                        const getPolicyUnits = (policyId, value) => {
                          switch(policyId) {
                            case 'EDUC_AUTONOMY':
                              return `${value}%`; // 0-100% decision freedom
                            case 'AI_CAREER_PATH':
                              return `${Math.round(value * 0.1)} hrs/wk`; // 0-10 hours/week
                            case 'DIGITAL_CITIZEN':
                              return `${Math.round(value * 0.5)}%`; // 0-50% curriculum integration
                            default:
                              return value;
                          }
                        };
                        
                        const getSubtitle = (policyId) => {
                          switch(policyId) {
                            case 'EDUC_AUTONOMY':
                              return 'Decision Freedom (0-100%)';
                            case 'AI_CAREER_PATH':
                              return 'Program Intensity (0-10 hours/week)';
                            case 'DIGITAL_CITIZEN':
                              return 'Curriculum Integration (0-50%)';
                            default:
                              return '';
                          }
                        };
                        
                        return (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative" data-policy-container>
                            <button
                              onClick={() => setOpenInfoPopup(openInfoPopup === policy.id ? null : policy.id)}
                              className="absolute top-2 right-2 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-60 hover:opacity-100"
                              title="More information"
                            >
                              i
                            </button>
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                            </div>
                            

                            
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] || 50}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  setPolicyIntensities(prev => ({
                                    ...prev,
                                    [policy.id]: newValue
                                  }));
                                  // Only mark as touched if value is not 50 (middle)
                                  if (newValue !== 50) {
                                    setTouchedPolicies(prev => new Set([...prev, policy.id]));
                                  } else {
                                    // Remove from touched if back to middle
                                    setTouchedPolicies(prev => {
                                      const newSet = new Set([...prev]);
                                      newSet.delete(policy.id);
                                      return newSet;
                                    });
                                  }
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-green"
                                style={
                                  policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                    background: policyIntensities[policy.id] > 50 
                                      ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #16a34a 50%, #16a34a ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #16a34a ${policyIntensities[policy.id]}%, #16a34a 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                                                              />
                                {/* Center indicator */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{policy.id === 'EDUC_AUTONOMY' ? '0%' : policy.id === 'AI_CAREER_PATH' ? '0' : '0%'}</span>
                                  <span>{policy.id === 'EDUC_AUTONOMY' ? '100%' : policy.id === 'AI_CAREER_PATH' ? '10' : '50%'}</span>
                                </div>
                                <div 
                                  className="absolute top-0 transform -translate-x-1/2"
                                  style={{
                                    left: `${(policyIntensities[policy.id] || 50)}%`
                                  }}
                                >
                                  <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                    {getPolicyUnits(policy.id, policyIntensities[policy.id] || 50)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Column 3 - Community Representative */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-purple-100">Community Rep</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['COMM_INPUT', 'IMPACT_REP_STD', 'LOCAL_JOB_ALIGN'].includes(policy.id)
                      ).map((policy) => {
                        const getPolicyUnits = (policyId, value) => {
                          switch(policyId) {
                            case 'COMM_INPUT':
                              return `${Math.round(value * 0.08)} meetings/mo`; // 0-8 meetings/month
                            case 'IMPACT_REP_STD':
                              return `${value}`; // 0-100 transparency level
                            case 'LOCAL_JOB_ALIGN':
                              return `${Math.round(value * 2)} hrs/yr`; // 0-200 hours/year
                            default:
                              return value;
                          }
                        };
                        
                        const getSubtitle = (policyId) => {
                          switch(policyId) {
                            case 'COMM_INPUT':
                              return 'Engagement Frequency (0-8 meetings/month)';
                            case 'IMPACT_REP_STD':
                              return 'Transparency Level (0-100)';
                            case 'LOCAL_JOB_ALIGN':
                              return 'Employer Partnership Hours (0-200/year)';
                            default:
                              return '';
                          }
                        };
                        
                        return (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative" data-policy-container>
                            <button
                              onClick={() => setOpenInfoPopup(openInfoPopup === policy.id ? null : policy.id)}
                              className="absolute top-2 right-2 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-60 hover:opacity-100"
                              title="More information"
                            >
                              i
                            </button>
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                            </div>
                            

                            
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] || 50}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  setPolicyIntensities(prev => ({
                                    ...prev,
                                    [policy.id]: newValue
                                  }));
                                  // Only mark as touched if value is not 50 (middle)
                                  if (newValue !== 50) {
                                    setTouchedPolicies(prev => new Set([...prev, policy.id]));
                                  } else {
                                    // Remove from touched if back to middle
                                    setTouchedPolicies(prev => {
                                      const newSet = new Set([...prev]);
                                      newSet.delete(policy.id);
                                      return newSet;
                                    });
                                  }
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-purple"
                                style={
                                  policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                    background: policyIntensities[policy.id] > 50 
                                      ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #9333ea 50%, #9333ea ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #9333ea ${policyIntensities[policy.id]}%, #9333ea 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                                                              />
                                {/* Center indicator */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{policy.id === 'COMM_INPUT' ? '0' : policy.id === 'LOCAL_JOB_ALIGN' ? '0' : '0'}</span>
                                  <span>{policy.id === 'COMM_INPUT' ? '8' : policy.id === 'LOCAL_JOB_ALIGN' ? '200' : '100'}</span>
                                </div>
                                <div 
                                  className="absolute top-0 transform -translate-x-1/2"
                                  style={{
                                    left: `${(policyIntensities[policy.id] || 50)}%`
                                  }}
                                >
                                  <span className="font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                    {getPolicyUnits(policy.id, policyIntensities[policy.id] || 50)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Column 4 - EdTech Industry Representative */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-orange-100">EdTech Industry</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INTEROP_STD', 'INFRA_INVEST', 'ACCESS_STD'].includes(policy.id)
                      ).map((policy) => {
                        const getPolicyUnits = (policyId, value) => {
                          switch(policyId) {
                            case 'INTEROP_STD':
                              return `${value}`; // 0-100 compliance requirements
                            case 'INFRA_INVEST':
                              return `${Math.round(value * 0.5)}%`; // 0-50% industry co-investment
                            case 'ACCESS_STD':
                              return `${50 + Math.round(value * 0.5)}%`; // 50-100% compliance level
                            default:
                              return value;
                          }
                        };
                        
                        const getSubtitle = (policyId) => {
                          switch(policyId) {
                            case 'INTEROP_STD':
                              return 'Compliance Requirements (0-100)';
                            case 'INFRA_INVEST':
                              return 'Industry Co-Investment (0-50%)';
                            case 'ACCESS_STD':
                              return 'Compliance Level Required (50-100%)';
                            default:
                              return '';
                          }
                        };
                        
                        return (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative" data-policy-container>
      <button 
                              onClick={() => setOpenInfoPopup(openInfoPopup === policy.id ? null : policy.id)}
                              className="absolute top-2 right-2 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-60 hover:opacity-100"
                              title="More information"
                            >
                              i
                            </button>
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                            </div>
                            

                            
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] || 50}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  setPolicyIntensities(prev => ({
                                    ...prev,
                                    [policy.id]: newValue
                                  }));
                                  // Only mark as touched if value is not 50 (middle)
                                  if (newValue !== 50) {
                                    setTouchedPolicies(prev => new Set([...prev, policy.id]));
                                  } else {
                                    // Remove from touched if back to middle
                                    setTouchedPolicies(prev => {
                                      const newSet = new Set([...prev]);
                                      newSet.delete(policy.id);
                                      return newSet;
                                    });
                                  }
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-orange"
                                style={
                                  policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                    background: policyIntensities[policy.id] > 50 
                                      ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #ea580c 50%, #ea580c ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #ea580c ${policyIntensities[policy.id]}%, #ea580c 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                                                              />
                                {/* Center indicator */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{policy.id === 'INFRA_INVEST' ? '0%' : policy.id === 'ACCESS_STD' ? '50%' : '0'}</span>
                                  <span>{policy.id === 'INFRA_INVEST' ? '50%' : policy.id === 'ACCESS_STD' ? '100%' : '100'}</span>
                                </div>
                                <div 
                                  className="absolute top-0 transform -translate-x-1/2"
        style={{ 
                                    left: `${(policyIntensities[policy.id] || 50)}%`
                                  }}
                                >
                                  <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                    {getPolicyUnits(policy.id, policyIntensities[policy.id] || 50)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Column 5 - Research & Ethics Advisor */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-2 border-b border-red-100">Research & Ethics</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['STATE_FED_PART', 'INNOV_SANDBOX', 'MODEL_EVAL_STD'].includes(policy.id)
                      ).map((policy) => {
                        const getPolicyUnits = (policyId, value) => {
                          switch(policyId) {
                            case 'STATE_FED_PART':
                              return `$${Math.round(value * 1)}M`; // $0-$100M joint funding level
                            case 'INNOV_SANDBOX':
                              return `${value}`; // 0-100 risk tolerance
                            case 'MODEL_EVAL_STD':
                              return `${value}`; // 0-100 evaluation rigor
                            default:
                              return value;
                          }
                        };
                        
                        const getSubtitle = (policyId) => {
                          switch(policyId) {
                            case 'STATE_FED_PART':
                              return 'Joint Funding Level ($0-$100M)';
                            case 'INNOV_SANDBOX':
                              return 'Risk Tolerance (0-100)';
                            case 'MODEL_EVAL_STD':
                              return 'Evaluation Rigor (0-100)';
                            default:
                              return '';
                          }
                        };
                        
                        return (
                          <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm relative" data-policy-container>
                            <button
                              onClick={() => setOpenInfoPopup(openInfoPopup === policy.id ? null : policy.id)}
                              className="absolute top-2 right-2 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs transition-colors opacity-60 hover:opacity-100"
                              title="More information"
                            >
                              i
                            </button>
                            <div className="mb-3">
                              <div className="text-xs font-semibold text-slate-800 text-center leading-tight pr-6">{policy.name}</div>
                            </div>

                            
                            <div className="space-y-2">
                              <div className="relative">
                                <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] || 50}
                                onChange={(e) => {
                                  const newValue = parseInt(e.target.value);
                                  setPolicyIntensities(prev => ({
                                    ...prev,
                                    [policy.id]: newValue
                                  }));
                                  // Only mark as touched if value is not 50 (middle)
                                  if (newValue !== 50) {
                                    setTouchedPolicies(prev => new Set([...prev, policy.id]));
                                  } else {
                                    // Remove from touched if back to middle
                                    setTouchedPolicies(prev => {
                                      const newSet = new Set([...prev]);
                                      newSet.delete(policy.id);
                                      return newSet;
                                    });
                                  }
                                }}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-red"
                                style={
                                  policyIntensities[policy.id] !== undefined && policyIntensities[policy.id] !== 50 ? {
                                    background: policyIntensities[policy.id] > 50 
                                      ? `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 50%, #dc2626 50%, #dc2626 ${policyIntensities[policy.id]}%, #e2e8f0 ${policyIntensities[policy.id]}%, #e2e8f0 100%)`
                                      : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${policyIntensities[policy.id]}%, #dc2626 ${policyIntensities[policy.id]}%, #dc2626 50%, #e2e8f0 50%, #e2e8f0 100%)`
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                                                              />
                                {/* Center indicator */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"></div>
                              </div>
                              <div className="relative">
                                <div className="flex justify-between text-xs text-slate-500">
                                  <span>{policy.id === 'STATE_FED_PART' ? '$0M' : '0'}</span>
                                  <span>{policy.id === 'STATE_FED_PART' ? '$100M' : '100'}</span>
                                </div>
                                <div 
                                  className="absolute top-0 transform -translate-x-1/2"
                                  style={{
                                    left: `${(policyIntensities[policy.id] || 50)}%`
                                  }}
                                >
                                  <span className="font-bold text-red-600 bg-red-50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                    {getPolicyUnits(policy.id, policyIntensities[policy.id] || 50)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Feedback Loops</h2>
              <p className="text-gray-600">System feedback analysis coming soon...</p>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Strategic Insights</h2>
              <p className="text-gray-600">Strategic insights coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Global Info Popup - Centered on Screen */}
      {false && openInfoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center rounded-t-lg">
              <h3 className="text-lg font-bold text-slate-800">{policyDefinitions[openInfoPopup]?.name}</h3>
              <button
                onClick={() => setOpenInfoPopup(null)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                title="Close"
              >
                ×
      </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-blue-600 mb-2">What it is:</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{getPolicyInfo(openInfoPopup).whatItIs}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-green-600 mb-2">Why it's important:</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{getPolicyInfo(openInfoPopup).whyImportant}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-purple-600 mb-2">Resources:</h4>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {renderResourceLinks(getPolicyInfo(openInfoPopup).resources).map((resourceElement, index) => {
                    // Extract link text and URL if it contains parentheses
                    const linkMatch = resource.match(/^(.*?)\s*\((.*?)\)$/);
                    if (linkMatch) {
                      const [, linkText, linkSource] = linkMatch;
                      // Create a comprehensive URL mapping with exact URLs from facilitator guide
                      const urlMap = {
                        // Innovation Incentives
                        'Learning Lab\'s AI FAST Challenge: Funding for Accelerated Study and Transformation': 'https://calearninglab.org/wp-content/uploads/2024/04/AI-FAST-Challenge-RFP-Final-1.pdf',
                        'Ed. Startups Get Money, Advice From Federal Program (EdWeek)': 'https://www.edweek.org/policy-politics/ed-startups-get-money-advice-from-federal-program/2014/10',
                        'Ed. Startups Get Money, Advice From Federal Program': 'https://www.edweek.org/policy-politics/ed-startups-get-money-advice-from-federal-program/2014/10',
                        
                        // Student Protection Standards
                        'Effective AI Requires Effective Data Governance (Brookings)': 'https://edtechmagazine.com/higher/article/2025/05/effective-ai-requires-effective-data-governance#:~:text=Data%20governance%20starts%20with%20developing,Forrester%20Principal%20Analyst%20Michele%20Goetz',
                        'Effective AI Requires Effective Data Governance': 'https://edtechmagazine.com/higher/article/2025/05/effective-ai-requires-effective-data-governance#:~:text=Data%20governance%20starts%20with%20developing,Forrester%20Principal%20Analyst%20Michele%20Goetz',
                        'Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD)': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency',
                        'Opportunities, guidelines and guardrails for effective and equitable use of AI in education': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency',
                        
                        // Professional Development Funding
                        'AI competency framework for teachers (UNESCO)': 'https://unesdoc.unesco.org/ark:/48223/pf0000391104',
                        'AI competency framework for teachers': 'https://unesdoc.unesco.org/ark:/48223/pf0000391104',
                        'Education Policy Outlook 2024 (OECD)': 'https://www.oecd.org/en/publications/education-policy-outlook-2024_dd5140e4-en.html#section-d1e573-8c0c67ffad',
                        'Education Policy Outlook 2024': 'https://www.oecd.org/en/publications/education-policy-outlook-2024_dd5140e4-en.html#section-d1e573-8c0c67ffad',
                        
                        // Digital Citizenship Education
                        'What you need to know about UNESCO\'s new AI competency frameworks for students and teachers': 'https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers',
                        'Digital Citizenship in Education (ISTE)': 'https://iste.org/digital-citizenship',
                        'Digital Citizenship in Education': 'https://iste.org/digital-citizenship',
                        
                        // Educational Autonomy
                        'MAINTAIN TEACHER AUTONOMY WHILE ADOPTING AI SCHOOLWIDE': 'https://sais.org/resource/maintain-teacher-autonomy-while-adopting-ai-schoolwide/',
                        'Empowering ELA Teachers: Recommendations for Teacher Education in the AI Era': 'https://citejournal.org/volume-25/issue-1-25/english-language-arts/empowering-ela-teachers-recommendations-for-teacher-education-in-the-ai-era',
                        
                        // Community Input
                        'Bringing Communities In, Achieving AI for All': 'https://issues.org/artificial-intelligence-social-equity-parthasarathy-katzman/#:~:text=And%20regulation%2C%20like%20design%2C%20will,of%20facial%20recognition%20in%20schools.',
                        'How to Develop an Effective AI Policy for K–12 Schools': 'https://www.peardeck.com/blog/how-to-develop-an-effective-ai-policy-for-k-12-schools#:~:text=The%20value%20of%20involving%20stakeholders,AI%20experts%20providing%20broader%20context',
                        
                        // Impact Reporting
                        'AI in Education: Impact Report 23-24': 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:972705f9-e7a2-49b7-83e2-60899b3bb952?viewer%21megaVerb=group-discover',
                        'The State of AI in Education 2025 (Carnegie Learning)': 'https://discover.carnegielearning.com/hubfs/PDFs/Whitepaper%20and%20Guide%20PDFs/2025-AI-in-Ed-Report.pdf?hsLang=en',
                        'The State of AI in Education 2025': 'https://discover.carnegielearning.com/hubfs/PDFs/Whitepaper%20and%20Guide%20PDFs/2025-AI-in-Ed-Report.pdf?hsLang=en',
                        'OET: Artificial Intelligence and the Future of Teaching and Learning': 'https://www.ed.gov/sites/ed/files/documents/ai-report/ai-report.pdf',
                        
                        // Local Job Market Alignment
                        'White House AI Education Plan Aligns With JFF\'s Vision, but Resources Are Lacking': 'https://www.linkedin.com/pulse/white-house-ai-education-plan-aligns-jffs-vision-resources-0xjlc/',
                        'Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness': 'https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
                        
                        // Interoperability Standards
                        'Interoperability: unifying and maximising data reuse within digital education ecosystems (OECD)': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/interoperability-unifying-and-maximising-data-reuse-within-digital-education-ecosystems_660f8da1.html#:~:text=Interoperability%20increases%20the%20consistency%20and,requires%20a%20widespread%20adoption%20of',
                        'Interoperability: unifying and maximising data reuse within digital education ecosystems': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/interoperability-unifying-and-maximising-data-reuse-within-digital-education-ecosystems_660f8da1.html#:~:text=Interoperability%20increases%20the%20consistency%20and,requires%20a%20widespread%20adoption%20of',
                        'Interoperability is Finally Getting the Spotlight it Deserves (COSN)': 'https://www.cosn.org/interoperability-is-finally-getting-the-spotlight-it-deserves/#:~:text=Interoperability%20is%20the%20seamless%2C%20secure%2C,understand%20their%20students%20better%20and',
                        'Interoperability is Finally Getting the Spotlight it Deserves': 'https://www.cosn.org/interoperability-is-finally-getting-the-spotlight-it-deserves/#:~:text=Interoperability%20is%20the%20seamless%2C%20secure%2C,understand%20their%20students%20better%20and',
                        
                        // Infrastructure Investment
                        'Hardware: the provision of connectivity and digital devices (OECD)': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/hardware-the-provision-of-connectivity-and-digital-devices_477c756b.html#:~:text=Online%20Open%20Course%20%28MOOC%29%20platforms,wherever%20the%20solution%20is%20hosted',
                        'Hardware: the provision of connectivity and digital devices': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/hardware-the-provision-of-connectivity-and-digital-devices_477c756b.html#:~:text=Online%20Open%20Course%20%28MOOC%29%20platforms,wherever%20the%20solution%20is%20hosted',
                        'Navigating the future of AI in education and education in AI (EY)': 'https://www.ey.com/content/dam/ey-unified-site/ey-com/en-ae/insights/education/documents/ey-education-and-ai-v6-lr.pdf#:~:text=3%20Infrastructure%20investment%20Facilitate%20equitable,development%20partners%20or%20technology%20companies',
                        'Navigating the future of AI in education and education in AI': 'https://www.ey.com/content/dam/ey-unified-site/ey-com/en-ae/insights/education/documents/ey-education-and-ai-v6-lr.pdf#:~:text=3%20Infrastructure%20investment%20Facilitate%20equitable,development%20partners%20or%20technology%20companies',
                        
                        // Accessibility Standards
                        'AI & Accessibility in Education (COSN)': 'https://www.cosn.org/wp-content/uploads/2024/09/Blaschke_Report_2024_lfp.pdf',
                        'AI & Accessibility in Education': 'https://www.cosn.org/wp-content/uploads/2024/09/Blaschke_Report_2024_lfp.pdf',
                        'Where AI meets Accessibility (Every Learner Everywhere)': 'https://www.everylearnereverywhere.org/wp-content/uploads/Where-AI-Meets-Accessibility-Final.pdf',
                        'Where AI meets Accessibility': 'https://www.everylearnereverywhere.org/wp-content/uploads/Where-AI-Meets-Accessibility-Final.pdf',
                        'European Accessibility Act': 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882',
                        
                        // Innovation Sandboxes
                        'The role of sandboxes in promoting flexibility and innovation in the digital age (OECD)': 'https://www.oecd.org/en/publications/the-role-of-sandboxes-in-promoting-flexibility-and-innovation-in-the-digital-age_cdf5ed45-en.html#:~:text=cases%2C%20they%20do%20not%20fit,across%20the%20OECD%20and%20beyond',
                        'The role of sandboxes in promoting flexibility and innovation in the digital age': 'https://www.oecd.org/en/publications/the-role-of-sandboxes-in-promoting-flexibility-and-innovation-in-the-digital-age_cdf5ed45-en.html#:~:text=cases%2C%20they%20do%20not%20fit,across%20the%20OECD%20and%20beyond',
                        'Artificial intelligence act and regulatory sandboxes': 'https://artificialintelligenceact.eu/ai-regulatory-sandbox-approaches-eu-member-state-overview/',
                        
                        // Model Evaluation Standards
                        'Report of the NEA Task Force on Artificial Intelligence in Education': 'https://www.nea.org/sites/default/files/2024-06/report_of_the_nea_task_force_on_artificial_intelligence_in_education_ra_2024.pdf#:~:text=1,adheres%20to%20the%20same%20standards',
                        'AI TEST, EVALUATION, VALIDATION AND VERIFICATION (NIST)': 'https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv',
                        'AI TEST, EVALUATION, VALIDATION AND VERIFICATION': 'https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv',
                        
                        // External Funding
                        'NSF 23-596: Discovery Research PreK-12 (DRK-12)': 'https://www.nsf.gov/funding/opportunities/drk-12-discovery-research-prek-12/nsf23-596/solicitation',
                        'NSF 23-596: Discovery Research PreK-12': 'https://www.nsf.gov/funding/opportunities/drk-12-discovery-research-prek-12/nsf23-596/solicitation',
                        'Research-Practice Partnerships in Education: The State of the Field': 'https://wtgrantfoundation.org/wp-content/uploads/2021/07/RPP_State-of-the-Field_2021.pdf',
                        'FROM SEED FUNDING TO SCALE': 'https://www.study-group.org/_files/ugd/e901ef_8e1b7854d0b44e9d94af3715375ccae6.pdf',
                        
                        // AI Career Pathways
                        'Riding the AI Wave: What\'s Happening in K-12 Education?': 'https://cset.georgetown.edu/article/riding-the-ai-wave-whats-happening-in-k-12-education/',
                        'Career education evolves to meet emerging technology demands': 'https://www.linkedin.com/posts/antonioarochoprincipal_career-education-evolves-to-meet-emerging-activity-7312959748939673600-9ety',

                        // Outcome Metrics Resources
                        'UNESCO AI Competency Framework for Students': 'https://unesdoc.unesco.org/ark:/48223/pf0000391105?posInSet=1&queryId=df597e1b-215f-4221-8ae2-49b534abec94',
                        'Trust Artificial Intelligence Global Study': 'https://ai.uq.edu.au/project/trust-artificial-intelligence-global-study',
                        'Measuring Innovation in Education (OECD)': 'https://www.oecd.org/en/publications/measuring-innovation-in-education-2023_a7167546-en.html',
                        'Teacher support in AI-assisted exams study': 'https://www.researchgate.net/publication/385656248_Teacher_support_in_AI-assisted_exams_an_experimental_study_to_inspect_the_effects_on_demotivation_anxiety_management_in_exams_L2_learning_experience_and_academic_success',
                        'Does AI have a bias problem?': 'https://www.nea.org/nea-today/all-news-articles/does-ai-have-bias-problem#:~:text=Because%20AI%20is%20based%20on,of%20color%2C"%20Freeman%20says.',
                        'Using AI to guide school funding: 4 takeaways (Education Week)': 'https://www.edweek.org/policy-politics/using-ai-to-guide-school-funding-4-takeaways/2024/03#:~:text=According%20to%20Mark%20Lieberman%2C%20at%20least%20one,in%20the%20%22high%22%20and%20%22medium%22%20risk%20categories.'
                      };

                      const getResourceUrl = (source, text) => {
                        // First try exact match
                        if (urlMap[text.trim()]) {
                          return urlMap[text.trim()];
                        }
                        
                        // Try partial matches
                        for (const [key, url] of Object.entries(urlMap)) {
                          if (text.includes(key) || key.includes(text.trim())) {
                            return url;
                          }
                        }
                        
                        // Fallback to organization homepage
                        const orgMap = {
                          'UNESCO': 'https://www.unesco.org/en/digital-education/ai-future-learning',
                          'OECD': 'https://www.oecd.org/education/',
                          'EdWeek': 'https://www.edweek.org/',
                          'Brookings': 'https://www.brookings.edu/',
                          'COSN': 'https://www.cosn.org/',
                          'ISTE': 'https://www.iste.org/',
                          'Carnegie Learning': 'https://www.carnegielearning.com/',
                          'JFF': 'https://www.jff.org/',
                          'IDA': 'https://www.ida.org/',
                          'EY': 'https://www.ey.com/',
                          'Every Learner': 'https://www.everylearnereverywhere.org/',
                          'NSF': 'https://www.nsf.gov/',
                          'NEA': 'https://www.nea.org/',
                          'NIST': 'https://www.nist.gov/',
                          'Digital Promise': 'https://digitalpromise.org/'
                        };
                        
                        for (const [org, url] of Object.entries(orgMap)) {
                          if (source.includes(org)) {
                            return url;
                          }
                        }
                        
                        return null; // Return null instead of # for invalid URLs
                      };
                      
                      return (
                        <span key={index}>
                          {(() => {
                            const url = getResourceUrl(linkSource, linkText);
                            // Only create link if we have a valid URL
                            if (url && url.startsWith('http')) {
                              return (
                                <a 
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                                >
                                  {linkText.trim()}
                                </a>
                              );
                            } else {
                              // Return plain text if no valid URL
                              return <span className="text-slate-700">{linkText.trim()}</span>;
                            }
                          })()}
                          {index < getPolicyInfo(openInfoPopup).resources.split(' | ').length - 1 && ' | '}
                        </span>
                      );
                    } else {
                      // Handle resources without parentheses - match exact titles from facilitator guide
                                        const getGenericUrl = (text) => {
                    // Exact matches from facilitator guide
                    if (text.includes('Learning Lab\'s AI FAST Challenge: Funding for Accelerated Study and Transformation')) return 'https://calearninglab.org/wp-content/uploads/2024/04/AI-FAST-Challenge-RFP-Final-1.pdf';
                    if (text.includes('What you need to know about UNESCO\'s new AI competency frameworks for students and teachers')) return 'https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers';
                    if (text.includes('Bringing Communities In, Achieving AI for All')) return 'https://issues.org/artificial-intelligence-social-equity-parthasarathy-katzman/#:~:text=And%20regulation%2C%20like%20design%2C%20will,of%20facial%20recognition%20in%20schools.';
                    if (text.includes('How to Develop an Effective AI Policy for K–12 Schools')) return 'https://www.peardeck.com/blog/how-to-develop-an-effective-ai-policy-for-k-12-schools#:~:text=The%20value%20of%20involving%20stakeholders,AI%20experts%20providing%20broader%20context';
                    if (text.includes('AI in Education: Impact Report 23-24')) return 'https://acrobat.adobe.com/id/urn:aaid:sc:EU:972705f9-e7a2-49b7-83e2-60899b3bb952?viewer%21megaVerb=group-discover';
                    if (text.includes('White House AI Education Plan Aligns With JFF\'s Vision, but Resources Are Lacking')) return 'https://www.linkedin.com/pulse/white-house-ai-education-plan-aligns-jffs-vision-resources-0xjlc/';
                    if (text.includes('Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness')) return 'https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf';
                    if (text.includes('Research-Practice Partnerships in Education: The State of the Field')) return 'https://wtgrantfoundation.org/wp-content/uploads/2021/07/RPP_State-of-the-Field_2021.pdf';
                    if (text.includes('Report of the NEA Task Force on Artificial Intelligence in Education')) return 'https://www.nea.org/sites/default/files/2024-06/report_of_the_nea_task_force_on_artificial_intelligence_in_education_ra_2024.pdf#:~:text=1,adheres%20to%20the%20same%20standards';
                    if (text.includes('MAINTAIN TEACHER AUTONOMY WHILE ADOPTING AI SCHOOLWIDE')) return 'https://sais.org/resource/maintain-teacher-autonomy-while-adopting-ai-schoolwide/';
                    if (text.includes('Empowering ELA Teachers: Recommendations for Teacher Education in the AI Era')) return 'https://citejournal.org/volume-25/issue-1-25/english-language-arts/empowering-ela-teachers-recommendations-for-teacher-education-in-the-ai-era';
                    if (text.includes('Riding the AI Wave: What\'s Happening in K-12 Education?')) return 'https://cset.georgetown.edu/article/riding-the-ai-wave-whats-happening-in-k-12-education/';
                    if (text.includes('Career education evolves to meet emerging technology demands')) return 'https://www.linkedin.com/posts/antonioarochoprincipal_career-education-evolves-to-meet-emerging-activity-7312959748939673600-9ety';
                    if (text.includes('Artificial intelligence act and regulatory sandboxes')) return 'https://artificialintelligenceact.eu/ai-regulatory-sandbox-approaches-eu-member-state-overview/';
                    if (text.includes('OET: Artificial Intelligence and the Future of Teaching and Learning')) return 'https://www.ed.gov/sites/ed/files/documents/ai-report/ai-report.pdf';
                    if (text.includes('European Accessibility Act')) return 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882';
                        
                        // Additional resources from facilitator guide
                        if (text.includes('NASBE - State Education Policy and the New Artificial Intelligence')) return 'https://www.nasbe.org/state-education-policy-and-the-new-artificial-intelligence/';
                        if (text.includes('Guidance for AI Policy Development')) return 'https://edu.wyoming.gov/wp-content/uploads/2024/06/Guidance-for-AI-Policy-Development.pdf';
                        if (text.includes('Policy Framework for Involving Students in AI Policy')) return 'https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-023-00408-3';
                        if (text.includes('What\'s New in AI-Focused, Skilled Technical Workforce Education')) return 'https://www.newamerica.org/education-policy/edcentral/whats-new-in-ai-focused-skilled-technical-workforce-education/#:~:text=At%20the%20K,disciplines%20relating%20to%20tech%20career';
                        if (text.includes('OECD AI Literacy Framework')) return 'https://ailiteracyframework.org/';
                        
                        // Fallback to generic search if no exact match
                        return null;
                      };
                      
                      return (
                        <span key={index}>
                          {(() => {
                            const url = getGenericUrl(resource);
                            // Only create link if we have a valid URL
                            if (url && url.startsWith('http')) {
                              return (
                                <a 
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                                >
                                  {resource.trim()}
                                </a>
                              );
                            } else {
                              // Return plain text if no valid URL
                              return <span className="text-slate-700">{resource.trim()}</span>;
                            }
                          })()}
                          {index < getPolicyInfo(openInfoPopup).resources.split(' | ').length - 1 && ' | '}
                        </span>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Metric Info Popup - Centered on Screen */}
      {false && openMetricInfoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center rounded-t-lg">
              <h3 className="text-lg font-bold text-slate-800">
                {formatMetricName(openMetricInfoPopup)}
              </h3>
              <button
                onClick={() => setOpenMetricInfoPopup(null)}
                className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-semibold text-sm text-blue-600 mb-2">What it is:</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{getMetricInfo(openMetricInfoPopup).whatItIs}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-green-600 mb-2">Why it's important:</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{getMetricInfo(openMetricInfoPopup).whyImportant}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-purple-600 mb-2">Resources:</h4>
                <div className="text-sm text-slate-700 leading-relaxed">
                  {getMetricInfo(openMetricInfoPopup).resources.split(' | ').map((resource, index) => {
                    // Use the same URL mapping logic as policies
                    const linkMatch = resource.match(/^(.*?)\s*\((.*?)\)$/);
                    if (linkMatch) {
                      const [, linkText, linkSource] = linkMatch;
                      // Use the same urlMap from policy resources
                      const urlMap = {
                        'UNESCO AI Competency Framework for Students': 'https://unesdoc.unesco.org/ark:/48223/pf0000391105?posInSet=1&queryId=df597e1b-215f-4221-8ae2-49b534abec94',
                        'Trust Artificial Intelligence Global Study': 'https://ai.uq.edu.au/project/trust-artificial-intelligence-global-study',
                        'Measuring Innovation in Education (OECD)': 'https://www.oecd.org/en/publications/measuring-innovation-in-education-2023_a7167546-en.html',
                        'Teacher support in AI-assisted exams study': 'https://www.researchgate.net/publication/385656248_Teacher_support_in_AI-assisted_exams_an_experimental_study_to_inspect_the_effects_on_demotivation_anxiety_management_in_exams_L2_learning_experience_and_academic_success',
                        'Does AI have a bias problem?': 'https://www.nea.org/nea-today/all-news-articles/does-ai-have-bias-problem#:~:text=Because%20AI%20is%20based%20on,of%20color%2C"%20Freeman%20says.',
                        'Using AI to guide school funding: 4 takeaways (Education Week)': 'https://www.edweek.org/policy-politics/using-ai-to-guide-school-funding-4-takeaways/2024/03#:~:text=According%20to%20Mark%20Lieberman%2C%20at%20least%20one,in%20the%20%22high%22%20and%20%22medium%22%20risk%20categories.',
                        'Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness': 'https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
                        'Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD)': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency'
                      };

                      const url = urlMap[linkText.trim()] || urlMap[resource.trim()];
                      
                      return (
                        <span key={index}>
                          {url && url.startsWith('http') ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                            >
                              {linkText.trim()}
                            </a>
                          ) : (
                            <span className="text-slate-700">{linkText.trim()}</span>
                          )}
                          {index < getMetricInfo(openMetricInfoPopup).resources.split(' | ').length - 1 && ' | '}
                        </span>
                      );
                    } else {
                      // Handle resources without parentheses
                      const url = {
                        'UNESCO AI Competency Framework for Students': 'https://unesdoc.unesco.org/ark:/48223/pf0000391105?posInSet=1&queryId=df597e1b-215f-4221-8ae2-49b534abec94',
                        'Trust Artificial Intelligence Global Study': 'https://ai.uq.edu.au/project/trust-artificial-intelligence-global-study',
                        'Measuring Innovation in Education (OECD)': 'https://www.oecd.org/en/publications/measuring-innovation-in-education-2023_a7167546-en.html',
                        'Teacher support in AI-assisted exams study': 'https://www.researchgate.net/publication/385656248_Teacher_support_in_AI-assisted_exams_an_experimental_study_to_inspect_the_effects_on_demotivation_anxiety_management_in_exams_L2_learning_experience_and_academic_success',
                        'Does AI have a bias problem?': 'https://www.nea.org/nea-today/all-news-articles/does-ai-have-bias-problem#:~:text=Because%20AI%20is%20based%20on,of%20color%2C"%20Freeman%20says.',
                        'Using AI to guide school funding: 4 takeaways (Education Week)': 'https://www.edweek.org/policy-politics/using-ai-to-guide-school-funding-4-takeaways/2024/03#:~:text=According%20to%20Mark%20Lieberman%2C%20at%20least%20one,in%20the%20%22high%22%20and%20%22medium%22%20risk%20categories.',
                        'Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness': 'https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
                        'Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD)': 'https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency'
                      }[resource.trim()];

                      return (
                        <span key={index}>
                          {url && url.startsWith('http') ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                            >
                              {resource.trim()}
                            </a>
                          ) : (
                            <span className="text-slate-700">{resource.trim()}</span>
                          )}
                          {index < getMetricInfo(openMetricInfoPopup).resources.split(' | ').length - 1 && ' | '}
                        </span>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

