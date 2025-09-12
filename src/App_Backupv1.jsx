import React, { useState, useEffect, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { policyDefinitions, outcomeMetrics, calculateCurrentMetrics, generateTimeSeriesData } from './lib/policyData'

// Time Series Chart Component
function TimeSeriesChart({ metricId, selectedPolicies, policyIntensities }) {
  const data = useMemo(() => {
    try {
      const years = Array.from({ length: 16 }, (_, i) => 2025 + i)
      const baseData = generateTimeSeriesData(metricId, selectedPolicies, policyIntensities)
      return years.map((year, index) => ({
        year: year,
        current: baseData[index]?.current || 50,
        baseline: baseData[index]?.baseline || 50
      }))
    } catch (error) {
      console.error('Error generating time series data:', error)
      return []
    }
  }, [metricId, selectedPolicies, policyIntensities])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 25, left: 10, bottom: 15 }}>
          <XAxis dataKey="year" type="number" domain={['dataMin', 'dataMax']} ticks={[2025, 2028, 2031, 2034, 2037, 2040]} tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} interval={0} ticks={[0, 20, 40, 60, 80, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={3} />
          <Line type="monotone" dataKey="baseline" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Spider Chart Component
function SpiderChart({ selectedPolicies, policyIntensities }) {
  const data = useMemo(() => {
    try {
      const currentMetrics = calculateCurrentMetrics(selectedPolicies, policyIntensities)
      return Object.entries(outcomeMetrics).map(([metricId, metric]) => ({
        metric: metric.name,
        value: currentMetrics[metricId] || 50
      }))
    } catch (error) {
      console.error('Error calculating spider chart data:', error)
      return []
    }
  }, [selectedPolicies, policyIntensities])

  return (
    <div style={{ width: 400, height: 400 }}>
      <RadarChart width={400} height={400} data={data} margin={{ top: 50, right: 50, bottom: 50, left: 50 }}>
        <PolarGrid />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, 100]} />
        <Radar name="Current" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
      </RadarChart>
    </div>
  )
}

// Modal component for policy information
const PolicyModal = ({ isOpen, onClose, policyName, description, importance, resources }) => {
  if (!isOpen) return null

  const handleLinkClick = (url) => {
    window.open(url, '_blank')
  }

  const formatResources = (resourcesText) => {
    const lines = resourcesText.split('\n')
    return lines.map((line, index) => {
      if (line.startsWith('•')) {
        // Handle different link formats
        const lineContent = line.substring(1).trim() // Remove the bullet point
        
        // Check for URLs in parentheses at the end (highest priority)
        const urlInParens = lineContent.match(/^(.+?)\s*\(([^)]*https?:\/\/[^)]+)\)$/)
        if (urlInParens) {
          const title = urlInParens[1].trim()
          const url = urlInParens[2].trim()
          return (
            <div key={index} className="mb-2">
              <span className="text-slate-600">• </span>
              <button
                onClick={() => handleLinkClick(url)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                {title}
              </button>
            </div>
          )
        }
        
        // Check for "Title (Organization): URL" format
        const parenMatch = lineContent.match(/^(.+?)\s*\(([^)]+)\):\s*(https?:\/\/.+)$/)
        if (parenMatch) {
          const title = parenMatch[1].trim()
          const organization = parenMatch[2].trim()
          const url = parenMatch[3].trim()
          return (
            <div key={index} className="mb-2">
              <span className="text-slate-600">• </span>
              <button
                onClick={() => handleLinkClick(url)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                {title} ({organization})
              </button>
            </div>
          )
        }
        
        // Check for "Title: URL" format (look for the last colon before a URL)
        const urlMatch = lineContent.match(/^(.*?):\s*(https?:\/\/.+)$/)
        if (urlMatch) {
          const title = urlMatch[1].trim()
          const url = urlMatch[2].trim()
          return (
            <div key={index} className="mb-2">
              <span className="text-slate-600">• </span>
              <button
                onClick={() => handleLinkClick(url)}
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                {title}
              </button>
            </div>
          )
        }
        
        // If no URL pattern is found, just display as text
        return (
          <div key={index} className="mb-2">
            <span className="text-slate-600">• </span>
            <span className="text-sm text-slate-600">{lineContent}</span>
          </div>
        )
      }
      return <div key={index} className="text-sm text-slate-600 mb-1">{line}</div>
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-slate-800">{policyName}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">What it is:</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Why it's important:</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{importance}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Research & Resources:</h3>
              <div className="text-sm">
                {formatResources(resources)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [selectedPolicies, setSelectedPolicies] = useState([])
  const [policyIntensities, setPolicyIntensities] = useState({})
  const [selectedTimeSeriesMetric, setSelectedTimeSeriesMetric] = useState('AI_LITERACY')
  const [activeTab, setActiveTab] = useState('main')

  // State initialization
  const [modalState, setModalState] = useState({
    isOpen: false,
    policyName: '',
    description: '',
    importance: '',
    resources: ''
  })
  const [metricModalState, setMetricModalState] = useState({
    isOpen: false,
    metricName: '',
    description: '',
    importance: '',
    resources: ''
  })
  const defaultMetrics = {
    AI_LITERACY: 50,
    COMMUNITY_TRUST: 50,
    INNOVATION_INDEX: 50,
    TEACHER_SATISFACTION: 50,
    DIGITAL_EQUITY: 50,
    BUDGET_STRAIN: 50,
    EMPLOYMENT_IMPACT: 50,
    AI_VULNERABILITY_INDEX: 50
  };

  const [currentMetrics, setCurrentMetrics] = useState(defaultMetrics)

  const tabs = [
    { id: 'main', name: 'Main Dashboard' },
    { id: 'feedback', name: 'System Feedback' },
    { id: 'insights', name: 'Strategic Insights' }
  ]

  // Update metrics when policies or intensities change
  useEffect(() => {
    try {
      const activePolicies = selectedPolicies.filter(policyId => 
        policyIntensities[policyId] !== undefined
      );
      
      if (activePolicies.length === 0) {
        setCurrentMetrics(defaultMetrics);
      } else {
        const metrics = calculateCurrentMetrics(activePolicies, policyIntensities);
        setCurrentMetrics(metrics);
      }
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setCurrentMetrics(defaultMetrics);
    }
  }, [selectedPolicies, policyIntensities]);

  // Handle policy intensity changes
  const handlePolicyIntensityChange = (policyId, newValue) => {
    const newIntensities = { ...policyIntensities, [policyId]: newValue };
    setPolicyIntensities(newIntensities);

    // Ensure policy is selected
    if (!selectedPolicies.includes(policyId)) {
      const newSelectedPolicies = [...selectedPolicies, policyId];
      setSelectedPolicies(newSelectedPolicies);
    }
  };



  // Helper functions - moved outside render cycle to prevent re-creation
  const getHealthColor = (metricName, metricValue) => {
    const isReverse = metricName === 'BUDGET_STRAIN' || metricName === 'AI_VULNERABILITY_INDEX';
    
    if (isReverse) {
      // For Budget Strain and AI Vulnerability (lower is better)
      if (metricValue < 40) return { start: '#10b981', end: '#059669' }; // Green
      if (metricValue < 70) return { start: '#f59e0b', end: '#d97706' }; // Amber
      return { start: '#ef4444', end: '#dc2626' }; // Red
    } else {
      // For other metrics (higher is better)
      if (metricValue < 40) return { start: '#ef4444', end: '#dc2626' }; // Red
      if (metricValue < 70) return { start: '#f59e0b', end: '#d97706' }; // Amber
      return { start: '#10b981', end: '#059669' }; // Green
    }
  }

  const formatMetricName = (metric) => {
    return outcomeMetrics[metric]?.name || metric.replace(/_/g, ' ')
  }

  // Policy toggle handler with default intensity setting
  const handlePolicyToggle = (policyId) => {
    if (selectedPolicies.includes(policyId)) {
      setSelectedPolicies(selectedPolicies.filter(id => id !== policyId))
    } else {
      setSelectedPolicies([...selectedPolicies, policyId])
      // Set default intensity if not already set
      if (!policyIntensities[policyId]) {
        setPolicyIntensities(prev => ({
          ...prev,
          [policyId]: 50
        }))
      }
    }
  }

  // Modal handler functions
  const openPolicyModal = (policyId) => {
    const policy = policyDefinitions[policyId]
    setModalState({
      isOpen: true,
      policyName: policy.name,
      description: getPolicyDescription(policyId),
      importance: getPolicyImportance(policyId),
      resources: getPolicyResources(policyId)
    })
  }

  const closePolicyModal = () => {
    setModalState({
      isOpen: false,
      policyName: '',
      description: '',
      importance: '',
      resources: ''
    })
  }

  // Metric modal handler functions
  const openMetricModal = (metricId) => {
    const metric = outcomeMetrics[metricId]
    setMetricModalState({
      isOpen: true,
      metricName: metric.name,
      description: getMetricDescription(metricId),
      importance: getMetricImportance(metricId),
      resources: getMetricResources(metricId)
    })
  }

  const closeMetricModal = () => {
    setMetricModalState({
      isOpen: false,
      metricName: '',
      description: '',
      importance: '',
      resources: ''
    })
  }

  // Reset function to restore default values based on research averages
  const handleReset = () => {
    setPolicyIntensities({
      // District Administrator - based on research averages
      INNOV_INCENT: 7, // $3.5M (average of $2-5M range)
      PROTECT_STD: 72, // 70-75 average
      PD_FUNDS: 31, // 25-30 hours average
      
      // Educational Institution Leader
      EDUC_AUTONOMY: 50, // 45-55% average
      AI_CAREER_PATH: 15, // 1-2 hours/week average
      DIGITAL_CITIZEN: 35, // 15-20% average
      
      // Community Representative
      COMM_INPUT: 50, // 10-12 meetings/year average
      IMPACT_REP_STD: 70, // 65-75 average
      LOCAL_JOB_ALIGN: 45, // 90-120 hours/year average
      
      // EdTech Industry
      INTEROP_STD: 47, // 40-55 average
      INFRA_INVEST: 20, // 15-25% average
      ACCESS_STD: 77, // 75-80% average
      
      // Research & Ethics Advisor
      STATE_FED_PART: 10, // $10M (average of $5-15M range)
      INNOV_SANDBOX: 45, // 40-50 average
      MODEL_EVAL_STD: 65 // 60-70 average
    })
    setSelectedPolicies([])
    setSelectedTimeSeriesMetric('AI_LITERACY')
    setCurrentMetrics({
        AI_LITERACY: 50,
        COMMUNITY_TRUST: 50,
        INNOVATION_INDEX: 50,
        TEACHER_SATISFACTION: 50,
        DIGITAL_EQUITY: 50,
        BUDGET_STRAIN: 50,
        EMPLOYMENT_IMPACT: 50,
        AI_VULNERABILITY_INDEX: 50
    })
  }

  // Helper function to get policy description
  const getPolicyDescription = (policyId) => {
    const descriptions = {
      'INTEROP_STD': 'Common technical specifications that enable different educational software and AI tools to share and reuse data seamlessly. In practice, this means agreeing on data formats, APIs and metadata so that student information systems, learning platforms, and AI tutors can talk to each other. OECD notes that interoperability is "the capacity to combine and use data from disparate digital tools with ease", and CoSN similarly defines it as the "seamless, secure, and controlled exchange of data between applications". Interoperability standards function most effectively with strong technical infrastructure, enabling seamless data transfer across systems while creating a level playing field that encourages innovation by reducing market barriers for smaller companies. These standards expand rather than limit teacher autonomy by ensuring diverse AI tools work together harmoniously, allowing educators to select optimal tools without compatibility concerns, while simultaneously supporting student protection through enforced shared data schemas and consistent security protocols across all integrated AI systems.',
      'INFRA_INVEST': 'Allocating funds and resources to build and upgrade the physical and network infrastructure (broadband internet, school servers, devices, cloud services, etc.) needed to support AI tools in schools. This includes extending high-speed Internet access, providing modern computers or tablets for students and teachers, and deploying secure servers for AI applications. OECD emphasizes that "connectivity and digital devices are necessary" to realize the full potential of digital learning. Infrastructure investment provides the technological foundation for secure student data protection and comprehensive monitoring systems, while enabling reliable access to AI tools necessary for digital citizenship education and hands-on learning. Strong infrastructure supports both local job market alignment and AI career pathways by providing students access to industry-standard tools and training environments. It creates the essential technical foundation for innovation sandboxes to conduct secure, controlled AI experimentation.',
      'ACCESS_STD': 'Comprehensive requirements ensuring AI tools serve all learners, including translation capabilities for multilingual students, voice-to-text/text-to-voice features for students with disabilities, and executive functioning support tools. Standards mandate the application of universal design principles in AI educational technology. Section 508 standards are harmonized with WCAG 2.0 Level AA for federally funded institutions. Accessibility standards synergize with innovation incentives by expanding market opportunities and driving inclusive technology development, while infrastructure investment provides the foundation for implementing accessibility features effectively. Community input ensures standards reflect local needs, accessibility enhances digital citizenship education through inclusive design principles, and supports local job market alignment by helping develop skills for all.',
      'INNOV_INCENT': 'Framework of rewards, funding opportunities, and supportive policies encouraging EdTech companies to develop cutting-edge AI educational solutions. Additionally, this comprises funding research and development at every stage of AI integration to help educators and staff make informed, research-based decisions. This includes grants, pilot program partnerships, procurement preferences for innovative tools, and regulatory flexibility for breakthrough technologies. For example, the Education Innovation and Research (EIR) Program, by the U.S. Department of Education. Innovation incentives drive infrastructure investment through R&D funding for cost-effective technology solutions and risk-reducing pilot partnerships, while prioritizing funding for breakthrough student protection technologies that ensure compliance through research-backed security innovations. These incentives support development of AI career pathway programs aligned with emerging job markets and fund localized solutions for regional workforce preparation, while driving creation of cutting-edge digital citizenship education tools through dedicated grants for responsible AI use and digital ethics instruction.',
      'PROTECT_STD': 'Comprehensive framework encompassing data governance, privacy compliance, transparency requirements, explainability standards, and protections against algorithmic bias. Establishes clear guidelines for how AI systems handle student data, make decisions, and ensure fair treatment across all demographics. OECD and other guidelines stress transparency as essential for trust: high-stakes AI must allow "verification of accuracy of performance for all sub-groups" and clear explanation of decision factors. Student protection standards synergize with community input by addressing stakeholder privacy concerns, while impact reporting provides transparent documentation of protection effectiveness. These standards align with accessibility requirements to protect vulnerable populations and work with model evaluation standards to establish comprehensive safety frameworks assessing both technical performance and student welfare.',
      'PD_FUNDS': 'Dedicated funding streams to train educators (pre-service and in-service) on AI concepts, tools, and pedagogy. This includes workshops, courses or certifications in AI literacy, as well as training on how to integrate AI tools ethically into teaching. The White House Executive Order on AI Education emphasizes that "Professional development programs focused on AI education will empower educators to confidently guide students". Similarly, policy experts recommend supporting educators in integrating AI with funded PD so teachers understand AI\'s capabilities and limitations. Professional development funding supports innovation sandboxes by training educators for innovative AI curricula, aligns with career pathways through specialized training that creates advancement opportunities, enhances student protection by teaching privacy-compliant practices, and enables effective digital citizenship education through educator preparation for responsible AI instruction.',
      'STATE_FED_PART': 'Coordinated research initiatives and resource sharing between local districts and state/federal agencies to address specific educational challenges. Includes collaborative research projects, shared funding mechanisms, best practice dissemination, and policy alignment across governance levels. These partnerships leverage federal research capacity and funding while ensuring local implementation needs and community contexts are integrated into broader educational policy development. Government collaboration enhances innovation incentives by connecting local initiatives with federal funding and regulatory flexibility, while providing essential resources and expertise for innovation sandboxes to conduct sophisticated experimental programs. These partnerships strengthen model evaluation standards through access to federal AI frameworks and comparative data, and enable robust impact reporting through standardized metrics and accountability frameworks that enhance transparency and stakeholder confidence.',
      'INNOV_SANDBOX': 'Controlled environments for safely testing experimental AI technologies and policies before full implementation. Allows temporary regulatory flexibility, provides risk mitigation protocols, enables iterative development with real users, and generates evidence for broader policy decisions. OECD describes regulatory sandboxes as a way to allow flexible testing of innovations outside normal constraints. Innovation sandboxes validate infrastructure requirements and configurations before large-scale investment, while providing controlled environments to test and refine AI evaluation frameworks for broader implementation. These experimental settings pilot innovative digital citizenship curricula for responsible AI use and test new career preparation programs, demonstrating effectiveness before system-wide pathway implementation.',
      'MODEL_EVAL_STD': 'Comprehensive criteria for assessing AI educational tools across dimensions of transparency, explainability, privacy protection, bias detection, effectiveness, and safety. Includes testing protocols, performance benchmarks, ongoing monitoring requirements, and certification processes informed by latest AI safety research. It also covers requirements for evidence before adopting an AI tool. For instance, the NEA task force advises that "AI technology must only be adopted once data is supporting its appropriateness and efficacy" – either independent research or industry research adhering to rigorous methods. Model evaluation standards inform professional development by identifying AI competencies educators need for effective implementation, while validating infrastructure investments by ensuring AI tools perform effectively and identifying technical requirements. These standards provide evidence-based metrics for transparent impact reporting that builds community trust, and ensure AI tools meet safety and privacy requirements by incorporating student protection criteria as core evaluation components.',
      'IMPACT_REP_STD': 'A systematic and transparent approach to evaluating AI\'s educational impact is essential for building trust among educators, students, families, and policymakers. This includes regularly collecting data on academic outcomes, equity effects, tool usage, and cost-benefit analyses. Findings should be communicated clearly and accessibly through multiple channels such as reports and community updates. The U.S. Department of Education highlights that transparency and open communication about AI\'s role, limitations, and outcomes are critical for responsible and effective implementation (OET). Impact reporting enables informed community input through transparent data while demonstrating student protection compliance to address welfare concerns. This reporting validates professional development funding effectiveness by showing training outcomes and identifying support needs, while documenting innovation sandbox results to build community support for continued experimental programs.',
      'LOCAL_JOB_ALIGN': 'Strategic coordination between AI curriculum and regional workforce needs. Includes employer partnerships, skills gap analysis, internship programs, industry-recognized certifications, and regular curriculum updates based on evolving job market demands in AI and related fields. The White House executive order and analysis by Jobs for the Future (JFF) emphasize the importance of embedding AI skills in curricula, aligning education with labor market needs, and supporting apprenticeship and work-based learning models. Local job market alignment ensures career pathways connect to actual regional employment opportunities, with employers informing AI educational track design. This alignment guides infrastructure investment by identifying necessary AI tools for employment readiness and attracts innovation funding focused on regional workforce preparation. Additionally, local employers provide essential community input on workforce needs that guide AI education planning and curriculum development.',
      'COMM_INPUT': 'Formal mechanisms to involve parents, students, teachers and other stakeholders in AI policy. This can include surveys, advisory boards or public forums soliciting feedback before adopting new AI tools or policies. For example, guidance from Wyoming\'s education department explicitly asks: "Is there a plan for community input on AI policy and implementation, including feedback from students, parents, teachers, and other stakeholders?". At a higher level, one study\'s policy framework urges that "students should play an active role in drafting and implementing [AI] policy". Community input informs student protection standards by incorporating parent privacy and safety concerns into policy development, while ensuring digital citizenship education reflects local cultural values about responsible AI use. This input provides workforce insights from local employers that guide AI education planning for regional opportunities, and identifies AI competencies that parents and employers expect teachers to develop, determining professional development funding priorities.',
      'EDUC_AUTONOMY': 'Policies that respect and preserve teachers\' professional judgment in using AI. This means giving teachers flexibility to decide if, when and how to use AI tools in their classrooms or assignments. For example, Lake Highland Prep\'s AI policy explicitly "grant[ed] teacher\'s autonomy to determine if and how the technology fits into the needs of their students and curriculum". Under such autonomy, administrators set guidelines (like the school\'s "Red/Yellow/Green" system), but individual teachers choose usage levels per assignment. Teacher autonomy enables educators to identify relevant AI training that matches their professional development needs while providing feedback on training effectiveness. This autonomy allows meaningful participation in innovation sandboxes by adapting experimental tools to pedagogical approaches, and enables customization of AI instruction based on students\' career interests and local employment opportunities.',
      'AI_CAREER_PATH': 'Initiatives that create clear educational-to-career routes in AI and related fields. Examples include specialized high school programs (like AI magnet schools), partnerships with industry for internships, and guidance counseling that highlights AI-related careers. These programs might integrate AI into career-technical education or offer certifications (e.g. AI foundations certificates). The goal is to ensure students, especially from underrepresented groups, can smoothly transition into AI jobs or further STEM education. Career pathways require professional development funding to train teachers in AI industry standards, while connecting to local job market alignment through regional employment opportunities and employer partnerships. These pathways benefit from innovation sandboxes that pilot new workforce development approaches and require infrastructure investment in industry-standard AI tools that provide authentic workplace preparation environments.',
      'DIGITAL_CITIZEN': 'Implementation of a comprehensive curriculum addressing responsible AI use, including ethical decision-making, privacy awareness, critical evaluation of AI-generated content, understanding of AI bias, and skills for safe, effective participation in an AI-augmented digital world. UNESCO\'s AI Competency Framework for Students (2024) defines four core competencies: human-centered mindset, AI ethics, AI techniques, and AI system design. The OECD AI Literacy Framework (2025) emphasizes responsible AI engagement through four domains: Engaging with AI, Creating with AI, Learning about AI, and AI in Society. Digital citizenship education requires professional development funding to train teachers in responsible AI instruction and digital ethics pedagogy. This education incorporates community input by reflecting local cultural values and parent expectations about responsible technology use, while providing the ethical foundation for students to participate safely in innovation sandboxes through informed consent and responsible use principles.'
    }
    return descriptions[policyId] || 'Description not available.'
  }

  // Helper function to get policy importance
  const getPolicyImportance = (policyId) => {
    const importance = {
      'INTEROP_STD': 'Interoperability allows educators and systems to integrate AI-driven analytics and learning tools without burdensome manual data entry or one-off workarounds. It increases efficiency by reducing the need of ad-hoc processing to re-input, re-format or transform data, thus making education technology more scalable and cost-effective. In an AI context, standards ensure that data from different sources (e.g. test results, attendance, online activity) can feed AI models accurately and securely, supporting better decision-making and personalized learning.',
      'INFRA_INVEST': 'Robust infrastructure is the foundation for any AI-enabled education. High-bandwidth, low-latency networks are critical: AI-driven applications like real-time tutoring or virtual labs require "more agile (i.e., smaller latency) communications" (OECD). Without reliable networks and hardware, students and teachers cannot access AI services (cloud-based or on-premise). Infrastructure investment also promotes equity by closing the digital divide, ensuring all schools, both urban and rural, can use AI to improve learning.',
      'ACCESS_STD': 'As AI becomes increasingly embedded into educational settings and practices, it offers both opportunities and challenges. Accessibility standards ensure AI reduces rather than amplifies educational inequities. By requiring inclusive design, these standards help multilingual learners, students with disabilities, and those with diverse learning needs fully participate in AI-enhanced education, promoting truly equitable outcomes. The European Accessibility Act requires private sector compliance by June 2025.',
      'INNOV_INCENT': 'Strategic incentives drive continuous improvement in educational AI, ensuring tools evolve to meet emerging needs. Well-designed incentives attract quality vendors, encourage research and development, and foster competition that benefits students through better, more effective learning technologies.',
      'PROTECT_STD': 'Protects student privacy and trust in AI tools. AI systems often require large datasets (e.g. learning profiles, video from classrooms), so clear standards prevent misuse or breaches. NASBE notes that generative AI raises concerns about violating privacy laws like COPPA and FERPA, underscoring why schools need strict data rules. These standards build trust and ensure AI serves students\' best interests. They protect vulnerable populations from discrimination, maintain privacy rights, enable understanding of AI decisions affecting students, and create accountability mechanisms essential for ethical AI deployment in education.',
      'PD_FUNDS': 'Teachers are the linchpin of classroom AI use; without proper knowledge, AI tools can be misunderstood or misused. PD ensures that educators know how to select, implement and critique AI tools safely and effectively. It also helps teachers master new AI-integrated curricula and updated assessment methods. Well-funded PD reduces tech anxiety and inequality (so that all teachers, not just tech-savvy ones, can benefit). In short, it turns policy goals into classroom reality by building capacity. Research and reports stress that PD programs can help staff understand AI, its limitations and ethical considerations.',
      'STATE_FED_PART': 'Partnerships leverage collective resources and expertise to solve complex problems individual districts cannot tackle alone. They enable evidence-based policy making, reduce duplication of efforts, accelerate innovation adoption, and ensure local implementations align with broader educational goals.',
      'INNOV_SANDBOX': 'Sandboxes encourage innovation by letting schools try promising AI applications (adaptive learning, new assessment systems, administrative tools) without full risk. They help uncover practical issues (e.g. student privacy, technical glitches) before widescale roll-out. Engaging stakeholders in sandboxes can also generate evidence and best practices. As the OECD notes, sandboxes "promote flexible application or enforcement of policies" for emerging tech. For example, a sandbox might allow a school to test a new AI grading tool with volunteer teachers and students, collecting data to refine both the tool and the policies around it.',
      'MODEL_EVAL_STD': 'Such standards are crucial to ensure AI tools are reliable and do not inadvertently harm learning or equity. They hold Edtechs accountable and mandate ongoing evaluation: after deployment, tools should be "reassessed regularly… to ensure [they] continue to enhance, rather than detract from, students\' educational experiences". This guards against biases (e.g., if an AI grading system favors certain demographics) and unintended side effects. The OECD also highlights that transparent evaluation (with clear metrics and subgroup testing) is key for high-stakes uses. Overall, standards build trust by requiring that AI actually benefits teaching and learning.',
      'IMPACT_REP_STD': 'Transparent reporting builds community trust and enables informed decision-making. It holds districts accountable for AI investments, reveals whether tools deliver promised benefits, highlights equity gaps requiring attention, and empowers stakeholders to advocate for effective policies. Transparent reporting also enables educational leaders and communities to understand better how AI models function, anticipate their limitations and risks, and ensure that these technologies align with shared goals for high-quality, equitable learning.',
      'LOCAL_JOB_ALIGN': 'Alignment ensures students develop marketable AI skills leading to local employment opportunities. This creates economic mobility pathways, addresses regional talent needs, justifies community investment in AI education, and builds public support by demonstrating tangible career benefits. Ensuring this alignment also helps close the AI literacy divide, so that all regions and populations can participate in—and benefit from—the economic growth and innovation driven by artificial intelligence.',
      'COMM_INPUT': 'Community input ensures that AI initiatives reflect local values and needs, not just top-down decisions. Involving stakeholders can reveal concerns (e.g. privacy fears from parents, ethical considerations from teachers) that might otherwise be overlooked. It also builds legitimacy: when families and educators feel heard, they are more likely to support AI integration. Importantly, students\' perspectives can highlight usability issues – after all, they are the users. This democratic approach aligns with equity goals (e.g. giving voice to underrepresented groups) and can help identify unintended consequences early.',
      'EDUC_AUTONOMY': 'Teachers best understand their students\' needs and can adapt AI use accordingly. Autonomy encourages experimentation and innovation at the classroom level and can increase buy-in (teachers are more willing to use AI if not forced). It acknowledges teachers as professionals, which is crucial in a field historically characterized by top-down mandates. Autonomy can also lead to more creative and context-sensitive uses of AI that rigid policies might overlook. Additionally, it complements efforts to involve teachers in decision-making.',
      'AI_CAREER_PATH': 'As AI transforms the workforce, schools must prepare students with the skills employers need. Career pathways signal to students that AI literacy has real-world value and can motivate learning. They also address equity: by building accessible pathways (through community colleges, alternative credentials, etc.), all students can share in AI opportunities. Policy efforts are already underway – for instance, a consortium of U.S. colleges is developing national AI standards to "better align career and technical education with core academic disciplines relating to tech career pathways". This lever bridges K-12 learning with higher-ed and industry needs.',
      'DIGITAL_CITIZEN': 'Digital citizenship prepares students to navigate AI\'s complexities throughout life. It develops critical thinking about AI claims, protects against manipulation and misinformation, promotes ethical technology use, and empowers students as informed digital participants rather than passive consumers.'
    }
    return importance[policyId] || 'Information not available.'
  }

  // Helper function to get metric description
  const getMetricDescription = (metricId) => {
    const descriptions = {
      'AI_LITERACY': 'Comprehensive measurement of students\' abilities to understand, interact with, create with, and critically evaluate AI systems across cognitive, technical, ethical, and practical dimensions. The UNESCO AI Competency Framework for Students outlines 12 competencies across four dimensions, while Digital Promise research framework distinguish between three ways to engage with AI in educational contexts: Interact, Create and Apply.',
      'COMMUNITY_TRUST': 'Measurement of stakeholder confidence in AI educational systems and policies through surveys, behavioral indicators, and engagement metrics assessing perceived reliability, transparency, fairness, and institutional competence in AI implementation. Evidence from various domains underlines the key role that human factors, and especially trust, play in the adoption of technology by practitioners, with research examining teachers\' trust in AI-based educational technology and global studies showing three out of five people (61%) are either ambivalent or unwilling to trust AI.',
      'INNOVATION_INDEX': 'Composite measurement of educational AI innovation through metrics including speed of adoption, employee participation in innovation, novel solution development, and systematic implementation of cutting-edge educational practices. The OECD report on Measuring Innovation in Education explores the association between school innovation and different measures related to educational objectives, comparing innovation in education to innovation in other sectors.',
      'TEACHER_SATISFACTION': 'Measurement of educator satisfaction with AI integration through job satisfaction surveys, retention rates, workload impact assessments, professional autonomy indicators, and technology acceptance measures. Research shows that AI can streamline administrative tasks, free more time for teachers to build relationships and social and emotional skills of students, tailor students\' learning experiences, and improve accessibility, with research examining teacher support in AI-assisted systems showing effects on demotivation, anxiety management, and learning experience.',
      'DIGITAL_EQUITY': 'Comprehensive measurement of fairness in AI educational systems through bias detection metrics, differential impact analysis across demographic groups, access equality indicators, and outcome gap assessments. Addressing inequity in AI requires understanding how bias manifests itself both technically and socially, with research investigating bias in AI algorithms used for monitoring student progress, specifically focusing on bias related to age, disability, and gender.',
      'BUDGET_STRAIN': 'Financial allocation and expenditure measurement including AI implementation costs, infrastructure investments, professional development expenses, cost-per-student impacts, and return-on-investment metrics for AI educational initiatives. The global EdTech budget for AI is predicted to shoot up to about $6 billion by 2025, with the state of Nevada using AI to help guide school funding decisions through tools that indicate likelihood of student graduation.',
      'EMPLOYMENT_IMPACT': 'Measurement of student preparation for AI-influenced workforce through skills assessments, career readiness indicators, job placement rates, employer satisfaction surveys, and alignment with evolving labor market demands. As AI transforms the job market by automating routine tasks, these measurements increasingly focus on students\' development of both uniquely human skills such as communication, critical thinking, and problem-solving abilities, as well as technical AI-ready competencies including data literacy, prompt engineering, AI tool utilization, and human-AI collaboration skills that are essential for securing family-sustaining employment in an AI-integrated economy.',
      'AI_VULNERABILITY_INDEX': 'Assessment of security risks, data protection weaknesses, system reliability issues, privacy vulnerabilities, and susceptibility to AI-related threats in educational environments. The rapid adoption of online learning has resulted in significant cybersecurity challenges, with AI models vulnerable to carefully crafted malicious inputs and data privacy risks requiring security assessments and robust policies.'
    }
    return descriptions[metricId] || 'Description not available.'
  }

  // Helper function to get metric importance
  const getMetricImportance = (metricId) => {
    const importance = {
      'AI_LITERACY': 'Clear guidelines are needed on what students are expected to learn about AI in K–12, with research highlighting the need for a competency framework to guide didactic proposals. Many education systems struggle to address the growing digital skills gap, crucial for students\' employability and ethical tech use. Bridging this gap is imperative to cultivate an AI-ready workforce. Students require AI literacy for digital citizenship, future career readiness, and protection against AI-related harms.',
      'COMMUNITY_TRUST': 'Trust and acceptance depend on the AI application, with clear patterns showing stark differences across countries in people\'s trust, attitudes and reported use of AI. Community trust directly affects adoption rates, policy sustainability, and the social license needed for AI educational innovation. Building this trust requires transparent communication about AI capabilities and limitations, meaningful stakeholder engagement, and demonstrated positive outcomes that align with community values and educational goals',
      'INNOVATION_INDEX': 'Innovation is happening in ed tech, new school launches, within school redesign, and in many individual classrooms throughout the world. Innovative solutions sit at the intersection of feasibility, desirability, benefit, and viability. Educational innovation drives continuous improvement, competitive advantage, and adaptation to changing technological and social contexts.',
      'TEACHER_SATISFACTION': 'The application of AI technology in education is increasingly recognized as a key driver of educational innovation, but extensive literature exists on AI integration while less emphasis has been placed on the critical role of teachers and their professional development needs. Pre-service teachers\' attitudes towards educational technology that utilizes AI have a potential impact on the learning outcomes of their future students. Teacher satisfaction directly affects retention, effectiveness, and successful AI adoption.',
      'DIGITAL_EQUITY': 'AI fairness in the educational context refers to ensuring that AI systems do not lead to unfair or biased outcomes for students, with studies showing that biased algorithms used in educational settings can perpetuate prejudice against specific demographics, especially in human-centered applications like education. Research shows how AI is deepening the digital divide, with some AI algorithms baked in bias, from facial recognition that may not recognize Black students to falsely flagging essays written by non-native English speakers as AI-generated.',
      'BUDGET_STRAIN': 'Educational institutions and EdTech leaders must understand the cost associated with AI before they can invest in the technology, with AI implementation requiring careful attention to cost components, distinguishing between AI-specific and traditional expenses like hardware and training. Simple generative AI systems that teachers can use in lesson planning can cost as little as $25 a month, but larger adaptive learning systems can run in the tens of thousands of dollars, with implementing these larger systems being very expensive and beyond the budgets of many schools.',
      'EMPLOYMENT_IMPACT': 'AI and GenAI are already changing the set of skills employers are demanding from the workforce, with analytical skills becoming more important in jobs with more exposure to AI, including critical thinking, writing, science and mathematics. AI presents an avenue through which students can improve digital literacy, critical thinking, problem-solving and creativity, preparing learners for future job demands. Students need preparation for an AI-augmented workforce where human-AI collaboration is increasingly common.',
      'AI_VULNERABILITY_INDEX': 'AI models can be tricked by carefully crafted malicious inputs that lead to incorrect or harmful decisions, with data privacy risks requiring protection of student data and compliance with relevant laws and regulations like FERPA. Educational institutions must protect vulnerable student populations from AI-related security threats while maintaining system functionality.'
    }
    return importance[metricId] || 'Information not available.'
  }

  // Helper function to get metric resources
  const getMetricResources = (metricId) => {
    const resources = {
      'AI_LITERACY': '• UNESCO AI Competency Framework for Students: https://unesdoc.unesco.org/ark:/48223/pf0000391105?posInSet=1&queryId=df597e1b-215f-4221-8ae2-49b534abec94',
      'COMMUNITY_TRUST': '• Trust Artificial Intelligence Global Study: https://ai.uq.edu.au/project/trust-artificial-intelligence-global-study',
      'INNOVATION_INDEX': '• Measuring Innovation in Education (OECD): https://www.oecd.org/en/publications/measuring-innovation-in-education-2023_a7167546-en.html',
      'TEACHER_SATISFACTION': '• Teacher support in AI-assisted exams study: https://www.researchgate.net/publication/385656248_Teacher_support_in_AI-assisted_exams_an_experimental_study_to_inspect_the_effects_on_demotivation_anxiety_management_in_exams_L2_learning_experience_and_academic_success',
      'DIGITAL_EQUITY': '• Does AI have a bias problem?: https://www.nea.org/nea-today/all-news-articles/does-ai-have-bias-problem#:~:text=Because%20AI%20is%20based%20on,of%20color%2C"%20Freeman%20says.',
      'BUDGET_STRAIN': '• Using AI to guide school funding: 4 takeaways (Education Week): https://www.edweek.org/policy-politics/using-ai-to-guide-school-funding-4-takeaways/2024/03#:~:text=According%20to%20Mark%20Lieberman%2C%20at%20least%20one,in%20the%20%22high%22%20and%20%22medium%22%20risk%20categories.',
      'EMPLOYMENT_IMPACT': '• Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness: https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
      'AI_VULNERABILITY_INDEX': '• Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency'
    }
    return resources[metricId] || 'Resources not available.'
  }

  // Helper function to get policy resources
  const getPolicyResources = (policyId) => {
    const resources = {
      'INTEROP_STD': '• Interoperability: unifying and maximising data reuse within digital education ecosystems (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/interoperability-unifying-and-maximising-data-reuse-within-digital-education-ecosystems_660f8da1.html#:~:text=Interoperability%20increases%20the%20consistency%20and,requires%20a%20widespread%20adoption%20of\n• Interoperability is Finally Getting the Spotlight it Deserves (COSN): https://www.cosn.org/interoperability-is-finally-getting-the-spotlight-it-deserves/#:~:text=Interoperability%20is%20the%20seamless%2C%20secure%2C,understand%20their%20students%20better%20and',
      'INFRA_INVEST': '• Hardware: the provision of connectivity and digital devices (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/hardware-the-provision-of-connectivity-and-digital-devices_477c756b.html#:~:text=Online%20Open%20Course%20%28MOOC%29%20platforms,wherever%20the%20solution%20is%20hosted\n• Navigating the future of AI in education and education in AI (EY): https://www.ey.com/content/dam/ey-unified-site/ey-com/en-ae/insights/education/documents/ey-education-and-ai-v6-lr.pdf#:~:text=3%20Infrastructure%20investment%20Facilitate%20equitable,development%20partners%20or%20technology%20companies',
      'ACCESS_STD': '• AI & Accessibility in Education (COSN): https://www.cosn.org/wp-content/uploads/2024/09/Blaschke_Report_2024_lfp.pdf\n• Where AI meets Accessibility (Every Learner Everywhere): https://www.everylearnereverywhere.org/wp-content/uploads/Where-AI-Meets-Accessibility-Final.pdf\n• European Accessibility Act: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882',
      'INNOV_INCENT': '• Learning Lab\'s AI FAST Challenge: Funding for Accelerated Study and Transformation: https://calearninglab.org/wp-content/uploads/2024/04/AI-FAST-Challenge-RFP-Final-1.pdf\n• Ed. Startups Get Money, Advice From Federal Program (EdWeek): https://www.edweek.org/policy-politics/ed-startups-get-money-advice-from-federal-program/2014/10\n• From Seed Funding to Scale (ED/IES SBIR Program Impact Analysis): https://www.study-group.org/_files/ugd/e901ef_8e1b7854d0b44e9d94af3715375ccae6.pdf',
      'PROTECT_STD': '• Effective AI Requires Effective Data Governance: https://edtechmagazine.com/higher/article/2025/05/effective-ai-requires-effective-data-governance#:~:text=Data%20governance%20starts%20with%20developing,Forrester%20Principal%20Analyst%20Michele%20Goetz\n• Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency\n• State Education Policy and the New Artificial Intelligence (NASBE): https://www.nasbe.org/state-education-policy-and-the-new-artificial-intelligence/',
      'PD_FUNDS': '• AI competency framework for teachers (UNESCO): https://unesdoc.unesco.org/ark:/48223/pf0000391104\n• Education Policy Outlook 2024 (OECD): https://www.oecd.org/en/publications/education-policy-outlook-2024_dd5140e4-en.html#section-d1e573-8c0c67ffad',
      'STATE_FED_PART': '• NSF 23-596: Discovery Research PreK-12 (DRK-12): https://www.nsf.gov/funding/opportunities/drk-12-discovery-research-prek-12/nsf23-596/solicitation\n• Research-Practice Partnerships in Education: The State of the Field: https://wtgrantfoundation.org/wp-content/uploads/2021/07/RPP_State-of-the-Field_2021.pdf\n• From Seed Funding to Scale (ED/IES SBIR Program Impact Analysis): https://www.study-group.org/_files/ugd/e901ef_8e1b7854d0b44e9d94af3715375ccae6.pdf',
      'INNOV_SANDBOX': '• The role of sandboxes in promoting flexibility and innovation in the digital age (OECD): https://www.oecd.org/en/publications/the-role-of-sandboxes-in-promoting-flexibility-and-innovation-in-the-digital-age_cdf5ed45-en.html#:~:text=cases%2C%20they%20do%20not%20fit,across%20the%20OECD%20and%20beyond\n• Artificial intelligence act and regulatory sandboxes: https://www.europarl.europa.eu/thinktank/en/document/EPRS_BRI(2022)733544',
      'MODEL_EVAL_STD': '• Report of the NEA Task Force on Artificial Intelligence in Education: https://www.nea.org/sites/default/files/2024-06/report_of_the_nea_task_force_on_artificial_intelligence_in_education_ra_2024.pdf#:~:text=1,adheres%20to%20the%20same%20standards\n• AI TEST, EVALUATION, VALIDATION AND VERIFICATION (NIST): https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv\n• Opportunities, guidelines and guardrails for effective and equitable use of AI in education (OECD): https://www.oecd.org/en/publications/oecd-digital-education-outlook-2023_c74f03de-en/full-report/opportunities-guidelines-and-guardrails-for-effective-and-equitable-use-of-ai-in-education_2f0862dc.html#chapter-d1e54017-91f2cf6ac9%23:~:text=Transparency%2520is%2520essential%2520for%2520uses,against%2520their%2520explainability%2520or%2520transparency',
      'IMPACT_REP_STD': '• AI in Education: Impact Report 23-24: https://acrobat.adobe.com/id/urn:aaid:sc:EU:972705f9-e7a2-49b7-83e2-60899b3bb952?viewer%21megaVerb=group-discover\n• The State of AI in Education 2025 (Carnegie Learning): https://discover.carnegielearning.com/hubfs/PDFs/Whitepaper%20and%20Guide%20PDFs/2025-AI-in-Ed-Report.pdf?hsLang=en',
      'LOCAL_JOB_ALIGN': '• White House AI Education Plan Aligns With JFF\'s Vision, but Resources Are Lacking: https://www.linkedin.com/pulse/white-house-ai-education-plan-aligns-jffs-vision-resources-0xjlc/\n• Artificial Intelligence: Education Pipeline & Workforce Alignment for National Competitiveness (IEEEUSA): https://ieeeusa.org/assets/public-policy/positions/ai/AI_Education_Pipeline_Workforce_Alignment_1124.pdf',
      'COMM_INPUT': '• Bringing Communities In, Achieving AI for All: https://issues.org/artificial-intelligence-social-equity-parthasarathy-katzman/#:~:text=And%20regulation%2C%20like%20design%2C%20will,of%20facial%20recognition%20in%20schools.\n• How to Develop an Effective AI Policy for K–12 Schools: https://www.peardeck.com/blog/how-to-develop-an-effective-ai-policy-for-k-12-schools#:~:text=The%20value%20of%20involving%20stakeholders,AI%20experts%20providing%20broader%20context\n• Wyoming DoE guidance: https://edu.wyoming.gov/wp-content/uploads/2024/06/Guidance-for-AI-Policy-Development.pdf\n• Policy framework: Students as policy drafters: https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-023-00408-3',
      'EDUC_AUTONOMY': '• MAINTAIN TEACHER AUTONOMY WHILE ADOPTING AI SCHOOLWIDE: https://sais.org/resource/maintain-teacher-autonomy-while-adopting-ai-schoolwide/#:~:text=and%20choice,course%20of%20the%20academic%20year\n• Empowering ELA Teachers: Recommendations for Teacher Education in the AI Era: https://citejournal.org/volume-25/issue-1-25/english-language-arts/empowering-ela-teachers-recommendations-for-teacher-education-in-the-ai-era/',
      'AI_CAREER_PATH': '• Riding the AI Wave: What\'s Happening in K-12 Education?: https://cset.georgetown.edu/article/riding-the-ai-wave-whats-happening-in-k-12-education/#:~:text=There%20are%20four%20classes%20in,and%20test%20AI%2Dpowered%20solutions.\n• Career education evolves to meet emerging technology demands: https://www.k12dive.com/news/career-education-evolves-emerging-technology-demands/743593/',
      'DIGITAL_CITIZEN': '• What you need to know about UNESCO\'s new AI competency frameworks for students and teachers: https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers\n• Digital Citizenship in Education (ISTE): https://iste.org/digital-citizenship\n• OECD AI Literacy Framework: https://ailiteracyframework.org/'
    }
    return resources[policyId] || 'Resources not available.'
  }

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
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-semibold rounded-t-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white shadow-xl'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-3 h-[calc(100vh-120px)]">
        <div className="flex-1 overflow-hidden">
          {activeTab === 'main' && (
            <div className="h-full p-2 space-y-1">
              {/* Top Section - Charts */}
              <div className="grid grid-cols-12 gap-4 h-[48%]">
                {/* Time Series Chart */}
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
                      <TimeSeriesChart 
                        metricId={selectedTimeSeriesMetric}
                        selectedPolicies={selectedPolicies}
                        policyIntensities={policyIntensities}
                        shockScenario="NONE"
                      />
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
                      <SpiderChart 
                        selectedPolicies={selectedPolicies}
                        policyIntensities={policyIntensities}
                        shockScenario="NONE"
                        size={380}
                      />
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
                            onClick={() => openMetricModal(metric)}
                            className="absolute top-1 right-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors z-10"
                          >
                            <span className="text-xs font-bold">i</span>
                          </button>
                          <div className="text-xs font-medium text-slate-600 leading-tight mb-1 min-h-[1rem] flex items-center justify-center">
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
              <div className="h-[40%] overflow-y-auto">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg border border-slate-100 shadow-sm p-2">
                  <div className="grid grid-cols-5 gap-2">
                    {/* Column 1 - District Administrator */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-blue-100">District Admin</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INNOV_INCENT', 'PROTECT_STD', 'PD_FUNDS'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                       policy.id === 'INNOV_INCENT' ? 7 : 
                                       policy.id === 'PROTECT_STD' ? 72 : 
                                       policy.id === 'PD_FUNDS' ? 31 : 50}
                                onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-blue"
                                style={
                                  policyIntensities[policy.id] !== undefined ? {
                                    background: (() => {
                                      const value = policyIntensities[policy.id];
                                      const center = policy.id === 'INNOV_INCENT' ? 7 : 
                                                   policy.id === 'PROTECT_STD' ? 72 : 
                                                   policy.id === 'PD_FUNDS' ? 31 : 50;
                                      if (value > center) {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #2563eb ${center}%, #2563eb ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                      } else {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #2563eb ${value}%, #2563eb ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                      }
                                    })()
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                style={{
                                  left: `${policy.id === 'INNOV_INCENT' ? 7 : 
                                         policy.id === 'PROTECT_STD' ? 72 : 
                                         policy.id === 'PD_FUNDS' ? 31 : 50}%`
                                }}
                              ></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'INNOV_INCENT' ? '$0M' : policy.id === 'PD_FUNDS' ? '0' : '0'}</span>
                                <span>{policy.id === 'INNOV_INCENT' ? '$50M' : policy.id === 'PD_FUNDS' ? '100' : '100'}</span>
                              </div>
                              <div className="flex justify-center mt-1">
                                <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'INNOV_INCENT' ? `$${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 7) * 0.5)}M` :
                                   policy.id === 'PROTECT_STD' ? `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 72}` :
                                   policy.id === 'PD_FUNDS' ? `${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 31) * 1)} hrs` :
                                   `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 2 - Educational Institution Leader */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-green-100">Institution Leader</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['EDUC_AUTONOMY', 'AI_CAREER_PATH', 'DIGITAL_CITIZEN'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                       policy.id === 'EDUC_AUTONOMY' ? 50 : 
                                       policy.id === 'AI_CAREER_PATH' ? 15 : 
                                       policy.id === 'DIGITAL_CITIZEN' ? 35 : 50}
                                onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-green"
                                style={
                                  policyIntensities[policy.id] !== undefined ? {
                                    background: (() => {
                                      const value = policyIntensities[policy.id];
                                      const center = policy.id === 'EDUC_AUTONOMY' ? 50 : 
                                                   policy.id === 'AI_CAREER_PATH' ? 15 : 
                                                   policy.id === 'DIGITAL_CITIZEN' ? 35 : 50;
                                      if (value > center) {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #16a34a ${center}%, #16a34a ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                      } else {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #16a34a ${value}%, #16a34a ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                      }
                                    })()
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                style={{
                                  left: `${policy.id === 'EDUC_AUTONOMY' ? 50 : 
                                         policy.id === 'AI_CAREER_PATH' ? 15 : 
                                         policy.id === 'DIGITAL_CITIZEN' ? 35 : 50}%`
                                }}
                              ></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'EDUC_AUTONOMY' ? '0%' : policy.id === 'AI_CAREER_PATH' ? '0' : '0%'}</span>
                                <span>{policy.id === 'EDUC_AUTONOMY' ? '100%' : policy.id === 'AI_CAREER_PATH' ? '10' : '50%'}</span>
                              </div>
                              <div className="flex justify-center mt-1">
                                <span className="font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'EDUC_AUTONOMY' ? `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}%` :
                                   policy.id === 'AI_CAREER_PATH' ? `${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 15) * 0.1)} hrs/wk` :
                                   policy.id === 'DIGITAL_CITIZEN' ? `${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 35) * 0.5)}%` :
                                   `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 3 - Community Representative */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-purple-100">Community Rep</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['COMM_INPUT', 'IMPACT_REP_STD', 'LOCAL_JOB_ALIGN'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                       policy.id === 'COMM_INPUT' ? 50 : 
                                       policy.id === 'IMPACT_REP_STD' ? 70 : 
                                       policy.id === 'LOCAL_JOB_ALIGN' ? 45 : 50}
                                onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-purple"
                                style={
                                  policyIntensities[policy.id] !== undefined ? {
                                    background: (() => {
                                      const value = policyIntensities[policy.id];
                                      const center = policy.id === 'COMM_INPUT' ? 50 : 
                                                   policy.id === 'IMPACT_REP_STD' ? 70 : 
                                                   policy.id === 'LOCAL_JOB_ALIGN' ? 45 : 50;
                                      if (value > center) {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #9333ea ${center}%, #9333ea ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                      } else {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #9333ea ${value}%, #9333ea ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                      }
                                    })()
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                style={{
                                  left: `${policy.id === 'COMM_INPUT' ? 50 : 
                                         policy.id === 'IMPACT_REP_STD' ? 70 : 
                                         policy.id === 'LOCAL_JOB_ALIGN' ? 45 : 50}%`
                                }}
                              ></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'COMM_INPUT' ? '0' : policy.id === 'LOCAL_JOB_ALIGN' ? '0' : '0'}</span>
                                <span>{policy.id === 'COMM_INPUT' ? '24' : policy.id === 'LOCAL_JOB_ALIGN' ? '200' : '100'}</span>
                              </div>
                              <div className="flex justify-center mt-1">
                                <span className="font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'COMM_INPUT' ? `${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50) * 0.24)} meetings/yr` :
                                   policy.id === 'IMPACT_REP_STD' ? `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 70}` :
                                   policy.id === 'LOCAL_JOB_ALIGN' ? `${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 45) * 2)} hrs/yr` :
                                   `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 4 - EdTech Industry Representative */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-orange-100">EdTech Industry</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['INTEROP_STD', 'INFRA_INVEST', 'ACCESS_STD'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                       policy.id === 'INTEROP_STD' ? 47 : 
                                       policy.id === 'INFRA_INVEST' ? 20 : 
                                       policy.id === 'ACCESS_STD' ? 77 : 50}
                                onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-orange"
                                style={
                                  policyIntensities[policy.id] !== undefined ? {
                                    background: (() => {
                                      const value = policyIntensities[policy.id];
                                      const center = policy.id === 'INTEROP_STD' ? 47 : 
                                                   policy.id === 'INFRA_INVEST' ? 20 : 
                                                   policy.id === 'ACCESS_STD' ? 77 : 50;
                                      if (value > center) {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #ea580c ${center}%, #ea580c ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                      } else {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #ea580c ${value}%, #ea580c ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                      }
                                    })()
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                style={{
                                  left: `${policy.id === 'INTEROP_STD' ? 47 : 
                                         policy.id === 'INFRA_INVEST' ? 20 : 
                                         policy.id === 'ACCESS_STD' ? 77 : 50}%`
                                }}
                              ></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'INFRA_INVEST' ? '0%' : policy.id === 'ACCESS_STD' ? '50%' : '0'}</span>
                                <span>{policy.id === 'INFRA_INVEST' ? '50%' : policy.id === 'ACCESS_STD' ? '100%' : '100'}</span>
                              </div>
                              <div className="flex justify-center mt-1">
                                <span className="font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'INTEROP_STD' ? `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 47}` :
                                   policy.id === 'INFRA_INVEST' ? `${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 20) * 0.5)}%` :
                                   policy.id === 'ACCESS_STD' ? `${50 + Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 77) * 0.5)}%` :
                                   `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column 5 - Research & Ethics Advisor */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide text-center pb-0.5 border-b border-red-100">Research & Ethics</h3>
                      {Object.values(policyDefinitions).filter(policy => 
                        ['STATE_FED_PART', 'INNOV_SANDBOX', 'MODEL_EVAL_STD'].includes(policy.id)
                      ).map((policy) => (
                        <div key={policy.id} className="bg-white rounded-lg border border-slate-200 p-1.5 shadow-sm relative">
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-xs font-semibold text-slate-800 text-center leading-tight flex-1">{policy.name}</div>
                            <button
                              onClick={() => openPolicyModal(policy.id)}
                              className="ml-1 w-4 h-4 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <span className="text-xs font-bold">i</span>
                            </button>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="relative">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 
                                       policy.id === 'STATE_FED_PART' ? 10 : 
                                       policy.id === 'INNOV_SANDBOX' ? 45 : 
                                       policy.id === 'MODEL_EVAL_STD' ? 65 : 50}
                                onChange={(e) => handlePolicyIntensityChange(policy.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-red"
                                style={
                                  policyIntensities[policy.id] !== undefined ? {
                                    background: (() => {
                                      const value = policyIntensities[policy.id];
                                      const center = policy.id === 'STATE_FED_PART' ? 10 : 
                                                   policy.id === 'INNOV_SANDBOX' ? 45 : 
                                                   policy.id === 'MODEL_EVAL_STD' ? 65 : 50;
                                      if (value > center) {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${center}%, #dc2626 ${center}%, #dc2626 ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
                                      } else {
                                        return `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${value}%, #dc2626 ${value}%, #dc2626 ${center}%, #e2e8f0 ${center}%, #e2e8f0 100%)`;
                                      }
                                    })()
                                  } : {
                                    background: '#e2e8f0'
                                  }
                                }
                              />
                              {/* Center indicator */}
                              <div 
                                className="absolute top-1/2 transform -translate-y-1/2 w-0.5 h-4 bg-slate-400 pointer-events-none"
                                style={{
                                  left: `${policy.id === 'STATE_FED_PART' ? 10 : 
                                         policy.id === 'INNOV_SANDBOX' ? 45 : 
                                         policy.id === 'MODEL_EVAL_STD' ? 65 : 50}%`
                                }}
                              ></div>
                            </div>
                            <div className="relative">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{policy.id === 'STATE_FED_PART' ? '$0M' : '0'}</span>
                                <span>{policy.id === 'STATE_FED_PART' ? '$100M' : '100'}</span>
                              </div>
                              <div className="flex justify-center mt-1">
                                <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded text-xs whitespace-nowrap">
                                  {policy.id === 'STATE_FED_PART' ? `$${Math.round((policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 10) * 1)}M` :
                                   policy.id === 'INNOV_SANDBOX' ? `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 45}` :
                                   policy.id === 'MODEL_EVAL_STD' ? `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 65}` :
                                   `${policyIntensities[policy.id] !== undefined ? policyIntensities[policy.id] : 50}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
      
      {/* Policy Information Modal */}
      <PolicyModal
        isOpen={modalState.isOpen}
        onClose={closePolicyModal}
        policyName={modalState.policyName}
        description={modalState.description}
        importance={modalState.importance}
        resources={modalState.resources}
      />
      
      {/* Metric Information Modal */}
      <PolicyModal
        isOpen={metricModalState.isOpen}
        onClose={closeMetricModal}
        policyName={metricModalState.metricName}
        description={metricModalState.description}
        importance={metricModalState.importance}
        resources={metricModalState.resources}
      />
    </div>
  )
}

export default App